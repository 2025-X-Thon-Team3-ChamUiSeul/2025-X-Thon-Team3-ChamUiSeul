# backend/app/routers/chat.py
import os
import re
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

# Langchain and AI Model Imports
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# App-specific Imports
from app.database import get_db
from app.models import User, Chat, ChatMessage, Welfare, UserWelfareProgress
from app.dependencies import get_current_user
from app.schemas import (
    Chat as ChatSchema,
    ChatMessage as ChatMessageSchema,
    ChatListItem,
    ChatRequest,
    ChatResponse,
)

# --- CONFIGURATION ---
router = APIRouter(prefix="/chats", tags=["chats"])
api_key = os.getenv("GOOGLE_API_KEY")

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7, google_api_key=api_key)
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=api_key)
vector_store = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
retriever = vector_store.as_retriever(search_kwargs={"k": 3})


# --- HELPER FUNCTIONS ---
def _generate_application_steps(service_id: str, db: Session) -> dict:
    """LLM을 사용하여 주어진 복지 서비스에 대한 신청 단계를 생성합니다."""
    welfare_service = db.query(Welfare).filter(Welfare.service_id == service_id).first()
    if not welfare_service:
        return None

    context = f"[서비스명] {welfare_service.title}\n[요약] {welfare_service.summary}\n[URL] {welfare_service.url}"
    template = """
    당신은 복지 서비스 신청 절차 전문가입니다.
    주어진 [복지 서비스 정보]를 바탕으로, 온라인으로 서비스를 신청하는 과정을 3~4개의 단계로 나누어 설명해주세요.
    각 단계는 사용자가 구체적으로 무엇을 해야 하는지 명확하게 한 문장으로 설명해야 합니다.
    결과는 반드시 다음 JSON 형식으로만 응답해야 합니다. 다른 텍스트는 포함하지 마세요.
    {
      "total_steps": 4,
      "steps": [
        { "step": 1, "description": "필요한 서류를 미리 준비합니다 (예: 신분증, 소득 증명서)." },
        { "step": 2, "description": "복지서비스 공식 홈페이지에 접속하여 로그인합니다." },
        { "step": 3, "description": "신청서 양식을 작성하고 준비된 서류를 업로드합니다." },
        { "step": 4, "description": "신청 완료 후 접수 상태를 주기적으로 확인합니다." }
      ]
    }
    [복지 서비스 정보]: {context}
    """
    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | llm | StrOutputParser()
    response_str = chain.invoke({"context": context})
    try:
        # LLM 응답에서 JSON 부분만 추출
        json_match = re.search(r'\{.*\}', response_str, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(0))
    except json.JSONDecodeError:
        return None
    return None

def _create_new_progress(service_id: str, user: User, db: Session):
    """UserWelfareProgress 테이블에 새로운 진행 상태를 생성하고, 기존의 Active 상태는 모두 삭제합니다."""
    # 사용자의 모든 'Active' 상태인 진행 정보를 찾아서 삭제
    existing_progresses = db.query(UserWelfareProgress).filter_by(user_id=user.id, status="Active").all()
    for progress in existing_progresses:
        db.delete(progress)

    steps_data = _generate_application_steps(service_id, db)
    if steps_data and "steps" in steps_data and len(steps_data["steps"]) > 0:
        new_progress = UserWelfareProgress(
            user_id=user.id,
            welfare_id=service_id,
            status="Active",
            total_steps=steps_data.get("total_steps", len(steps_data["steps"])),
            current_step=0,  # 0단계부터 시작
            next_action_description="아래 '신청 시작하기' 버튼을 눌러 절차를 진행해주세요.",
        )
        db.add(new_progress)
        # commit은 호출한 함수에서 한번만 수행합니다.

# --- API ENDPOINTS ---
@router.post("/", response_model=ChatListItem)
def create_chat(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_chat = Chat(user_id=current_user.id, title="새로운 대화")
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat

@router.get("/", response_model=List[ChatListItem])
def get_chat_list(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    chats = db.query(Chat).filter(Chat.user_id == current_user.id).order_by(Chat.id.desc()).all()
    return chats

@router.get("/{chat_id}", response_model=List[ChatMessageSchema])
def get_chat_messages(chat_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat.messages

@router.post("/{chat_id}/messages", response_model=ChatResponse)
def post_chat_message(chat_id: int, request: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    user_profile_text = (f"이름: {current_user.username}, 나이: {current_user.age}세, 성별: {current_user.gender}, "
                         f"거주지: {current_user.region}, 거주형태: {current_user.housing_type}, "
                         f"소득: {current_user.monthly_income}만원, 학교: {current_user.school}")
    
    docs = retriever.invoke(request.message)
    context_text = "\n\n".join([f"서비스ID: {doc.metadata.get('service_id', 'N/A')}\n{doc.page_content}" for doc in docs])

    template = """
    당신은 대한민국 청년들의 복지혜택을 친절하게 안내하는 AI 상담사 '웰피'입니다.
    주어진 [사용자 정보]와 [참고 정보]를 바탕으로, 사용자의 [질문]에 대해 가장 적합한 복지 서비스를 추천해주세요.

    [답변 가이드라인]
    1.  **친절하고 공감적인 말투:** 항상 따뜻하고 이해심 있는 어조를 사용하세요. AI처럼 딱딱하게 말하지 마세요.
    2.  **간결함:** 답변은 세 문장 이내로, 핵심 정보만 간결하게 전달해주세요. 너무 길게 설명하지 마세요.
    3.  **마크다운 금지:** `**` 와 같은 마크다운 서식은 절대 사용하지 마세요.
    4.  **부정적 표현 지양:** 사용자가 특정 복지혜택의 자격 조건에 맞지 않더라도, "신청할 수 없습니다" 와 같이 직접적으로 말하지 마세요. 대신 "아쉽지만 이 혜택은 OOO 조건이 필요해요. 하지만 OO님을 위한 다른 좋은 혜택이 있어요!" 와 같이 긍정적으로 대안을 제시해주세요.
    5.  **신청 의사 확인:** 사용자가 특정 서비스('XX 사업' 등)를 신청하겠다는 의사를 보이면, **반드시 그 서비스의 '서비스ID'를 찾아서** 다음과 같은 형식의 특별한 코드와 함께 답변을 시작하세요: `[ACTION:START_APPLICATION:서비스ID]`
        예시: `[ACTION:START_APPLICATION:SVC-5678]네, 'XX 사업' 신청을 도와드릴게요. 제가 절차를 단계별로 안내해 드릴게요!`

    [사용자 정보]: {user_profile}
    [참고 정보]: {context}
    [질문]: {question}
    """
    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | llm | StrOutputParser()
    ai_response = chain.invoke({"user_profile": user_profile_text, "context": context_text, "question": request.message})

    action_match = re.search(r'\[ACTION:START_APPLICATION:([^\]]+)\]', ai_response)
    if action_match:
        service_id = action_match.group(1).strip()
        ai_response = ai_response[action_match.end():].strip()
        _create_new_progress(service_id=service_id, user=current_user, db=db)
    
    new_message = ChatMessage(chat_id=chat_id, message=request.message, response=ai_response)
    db.add(new_message)
    
    # Check if this is the first message to set the chat title.
    # Note: We query the count *before* the new message is committed.
    is_first_message = db.query(ChatMessage).filter(ChatMessage.chat_id == chat_id).count() == 0
    if is_first_message:
        chat.title = request.message
    
    db.commit()
    db.refresh(new_message)

    return {"response": ai_response}

@router.delete("/{chat_id}", status_code=status.HTTP_200_OK)
def delete_chat(chat_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    chat_to_delete = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat_to_delete:
        raise HTTPException(status_code=404, detail="Chat not found")
    db.delete(chat_to_delete)
    db.commit()
    return {"message": "Chat deleted successfully"}
