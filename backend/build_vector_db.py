# backend/build_vector_db.py

import os
from sqlalchemy.orm import Session
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from app.database import SessionLocal
from app.models import Welfare
from dotenv import load_dotenv

# 1. .env 파일 로드 (이게 제일 먼저 실행되어야 함)
load_dotenv()

# API 키 확인 (없으면 에러 냄)
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("❌ 에러: .env 파일에서 GOOGLE_API_KEY를 찾을 수 없습니다.")
    exit()

# 2. 설정: Google 임베딩 모델 (API 키 직접 주입)
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=api_key,  # <--- 여기가 핵심! 키를 직접 쥐어줌
)

VECTOR_DB_PATH = "./chroma_db"


def build_db():
    print("🔄 복지 데이터를 벡터화(AI 학습) 하는 중입니다...")

    # 3. SQL DB에서 복지 데이터 꺼내오기
    db = SessionLocal()
    welfares = db.query(Welfare).all()
    db.close()

    if not welfares:
        print("❌ DB에 복지 데이터가 없습니다. import_data.py 먼저 실행하세요!")
        return

    # 4. AI에게 먹여줄 데이터 문서 만들기
    documents = []
    for w in welfares:
        text_content = f"서비스명: {w.title}\n요약: {w.summary}\n부서: {w.department}\n문의: {w.contact}"
        doc = Document(page_content=text_content, metadata={"service_id": w.service_id})
        documents.append(doc)

    if not documents:
        print("❌ 변환할 데이터가 없습니다.")
        return

    # 5. 벡터 DB 생성 및 저장
    # (기존 DB가 있으면 충돌날 수 있으니 삭제하고 다시 만드는 로직은 생략하지만, 에러나면 폴더 지우고 하세요)
    vector_store = Chroma.from_documents(
        documents=documents, embedding=embeddings, persist_directory=VECTOR_DB_PATH
    )
    print(
        f"✅ 학습 완료! 총 {len(documents)}개의 복지 정보가 벡터 DB에 저장되었습니다."
    )


if __name__ == "__main__":
    build_db()
