# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, user, chat, progress
from app.database import engine, Base

# 애플리케이션 시작 시 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# CORS 허용 주소 목록 정의
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:8000",
    "http://localhost:8000",
]

app = FastAPI(title="Welfy API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(chat.router)
app.include_router(progress.router)

@app.get("/")
def read_root():
    return {"message": "Hello Welfy! Backend is running."}
