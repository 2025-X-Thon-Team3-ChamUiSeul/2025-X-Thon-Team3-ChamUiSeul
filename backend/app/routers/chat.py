# backend/app/routers/chat.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
import os

from app.database import get_db
from app.models import User, ChatHistory
from app.dependencies import get_current_user
from app.core.config import settings

# 0. 라우터 인스턴스 정의 (이게 있어야 main.py에서 chat.router를 찾을 수 있습니다!)
router = APIRouter(prefix="/chat", tags=["chat"])

# --- 설정 ---
api_key = os.getenv("GOOGLE_API_KEY")  # .env에서 키 가져오기

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


# --- 데이터 규격 (Schemas) ---
class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


class ChatHistoryModel(BaseModel):
    id: int
    message: str
    response: str
    timestamp: str


# --- API 구현 ---


# 1. 채팅 보내기 (질문 -> 답변)
@router.post("/message", response_model=ChatResponse)
def chat_message(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # A. 사용자 프로필 문자열 만들기 (시스템 프롬프트용)
    user_profile_text = (
        f"이름: {current_user.username}, "
        f"나이: {current_user.age}세, "
        f"성별: {current_user.gender}, "
        f"거주지: {current_user.region}, "
        f"거주형태: {current_user.housing_type}, "
        f"소득: {current_user.monthly_income}만원, "
        f"학교: {current_user.school}"
    )

    # B. 프롬프트 템플릿 (AI에게 역할 부여)
    template = """
    당신은 청년 복지 상담사 AI '웰피'입니다. 
    아래의 [사용자 정보]를 바탕으로, 질문에 가장 도움이 되는 복지 혜택을 [참고 정보]에서 찾아 친절하게 설명해주세요.
    
    [사용자 정보]
    {user_profile}

    [참고 정보]
    {context}

    [질문]
    {question}

    답변은 한국어로, 핵심만 요약해서, 친절한 해요체로 작성해주세요. 
    사용자의 상황(나이, 소득 등)에 비추어 신청 자격이 되는지 안 되는지도 판단해주면 좋습니다.
    """
    prompt = ChatPromptTemplate.from_template(template)

    # C. RAG 체인 실행 (검색 + 답변생성)
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

    # D. 대화 내용 DB 저장 (기록용)
    history = ChatHistory(
        user_id=current_user.id, message=request.message, response=ai_response
    )
    db.add(history)
    db.commit()

    return {"response": ai_response}


# 2. 채팅 기록 가져오기 (왼쪽 사이드바용)
@router.get("/history", response_model=List[ChatHistoryModel])
def get_chat_history(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    histories = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == current_user.id)
        .order_by(ChatHistory.timestamp.desc())
        .all()
    )

    return [
        ChatHistoryModel(
            id=h.id,
            message=h.message,
            response=h.response,
            timestamp=h.timestamp.strftime("%Y-%m-%d %H:%M"),
        )
        for h in histories
    ]
