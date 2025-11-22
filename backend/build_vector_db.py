# backend/build_vector_db.py

import os
from sqlalchemy.orm import Session
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from app.database import SessionLocal
from app.models import Welfare
from app.core.config import settings
from dotenv import load_dotenv

load_dotenv()  # .env 로드

# 1. 설정: Google의 임베딩 모델 사용
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
VECTOR_DB_PATH = "./chroma_db"  # 벡터 DB가 저장될 폴더


def build_db():
    print("🔄 복지 데이터를 벡터화(AI 학습) 하는 중입니다...")

    # 2. SQL DB에서 복지 데이터 꺼내오기
    db = SessionLocal()
    welfares = db.query(Welfare).all()
    db.close()

    if not welfares:
        print("❌ DB에 복지 데이터가 없습니다. import_data.py 먼저 실행하세요!")
        return

    # 3. AI에게 먹여줄 데이터 문서 만들기
    documents = []
    for w in welfares:
        # AI가 읽을 텍스트: 제목, 요약, 대상 등을 합침
        text_content = f"서비스명: {w.title}\n요약: {w.summary}\n부서: {w.department}\n문의: {w.contact}"

        # 메타데이터: 나중에 원본을 찾기 위해 ID 저장
        doc = Document(page_content=text_content, metadata={"service_id": w.service_id})
        documents.append(doc)

    # 4. 벡터 DB 생성 및 저장 (시간이 좀 걸릴 수 있음)
    vector_store = Chroma.from_documents(
        documents=documents, embedding=embeddings, persist_directory=VECTOR_DB_PATH
    )
    print(
        f"✅ 학습 완료! 총 {len(documents)}개의 복지 정보가 벡터 DB에 저장되었습니다."
    )


if __name__ == "__main__":
    build_db()
