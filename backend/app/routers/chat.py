# backend/app/routers/chat.py

import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from app.database import get_db
from app.models import User, Chat, ChatMessage
from app.dependencies import get_current_user
from app.schemas import (
    Chat as ChatSchema,
    ChatMessage as ChatMessageSchema,
    ChatListItem,
    ChatRequest,
    ChatResponse,
)

# 0. 라우터 인스턴스 정의
router = APIRouter(prefix="/chats", tags=["chats"])

# --- 설정 ---
api_key = os.getenv("GOOGLE_API_KEY")

# 1. 벡터 DB 로드
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001", google_api_key=api_key
)
vector_store = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
retriever = vector_store.as_retriever(search_kwargs={"k": 3})

# 2. Gemini 모델 설정
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", temperature=0.7, google_api_key=api_key
)

# --- API 구현 ---


# 1. 새 채팅 시작
@router.post("/", response_model=ChatListItem)
def create_chat(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    new_chat = Chat(user_id=current_user.id, title="새로운 대화")
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat


# 2. 전체 채팅 목록 가져오기
@router.get("/", response_model=List[ChatListItem])
def get_chat_list(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    chats = db.query(Chat).filter(Chat.user_id == current_user.id).all()
    return chats


# 3. 특정 채팅 기록 가져오기
@router.get("/{chat_id}", response_model=List[ChatMessageSchema])
def get_chat_messages(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chat = (
        db.query(Chat)
        .filter(Chat.id == chat_id, Chat.user_id == current_user.id)
        .first()
    )
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    return chat.messages


# 4. 채팅 메시지 보내기
@router.post("/{chat_id}/messages", response_model=ChatResponse)
def post_chat_message(
    chat_id: int,
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chat = (
        db.query(Chat)
        .filter(Chat.id == chat_id, Chat.user_id == current_user.id)
        .first()
    )
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # A. 사용자 프로필 문자열 만들기
    user_profile_text = (
        f"이름: {current_user.username}, 나이: {current_user.age}세, 성별: {current_user.gender}, "
        f"거주지: {current_user.region}, 거주형태: {current_user.housing_type}, "
        f"소득: {current_user.monthly_income}만원, 학교: {current_user.school}"
    )

    # B. 프롬프트 템플릿
    template = """
    당신은 청년 복지 상담사 AI '웰피'입니다. 아래의 [사용자 정보]를 바탕으로, 질문에 가장 도움이 되는 복지 혜택을 [참고 정보]에서 찾아 친절하게 설명해주세요.
    [사용자 정보] {user_profile}
    [참고 정보] {context}
    [질문] {question}
    답변은 한국어로, 핵심만 요약해서, 친절한 해요체로 작성해주세요. 사용자의 상황(나이, 소득 등)에 비추어 신청 자격이 되는지 안 되는지도 판단해주면 좋습니다.
    """
    prompt = ChatPromptTemplate.from_template(template)

    # C. RAG 체인 실행
    docs = retriever.invoke(request.message)
    context_text = "\n\n".join([doc.page_content for doc in docs])

    chain = prompt | llm | StrOutputParser()
    ai_response = chain.invoke(
        {
            "user_profile": user_profile_text,
            "context": context_text,
            "question": request.message,
        }
    )

    # D. 대화 내용 DB 저장
    new_message = ChatMessage(
        chat_id=chat_id, message=request.message, response=ai_response
    )
    db.add(new_message)

    # 첫 메시지인 경우, 채팅방 제목을 해당 메시지로 업데이트
    existing_messages_count = db.query(ChatMessage).filter(ChatMessage.chat_id == chat_id).count()
    if existing_messages_count == 0:
        chat.title = request.message
    
    db.commit()
    db.refresh(new_message)
    db.refresh(chat)

    return {"response": ai_response}
