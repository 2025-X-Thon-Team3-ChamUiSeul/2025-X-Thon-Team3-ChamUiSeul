# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ⬅️ 1. CORS 미들웨어 임포트 추가
from app.routers import (
    auth,
    user,
    chat,
    progress,
)

# -------------------------------------------------------------
# CORS 허용 주소 목록 정의
# 프론트엔드 개발 서버 주소를 모두 포함합니다.
origins = [
    "http://localhost:3000",  # React 기본 포트
    "http://localhost:5173",  # Vite/Vue 기본 포트
    "http://127.0.0.1:8000",  # 자체 API 접근 허용
    "http://localhost:8000",
    # (주의: ngrok 사용 시 여기에 ngrok 주소도 추가해야 함)
]

app = FastAPI(title="Welfy API", version="1.0.0")

# ⬅️ 2. CORS 미들웨어 등록
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 허용할 출처 목록 (위에서 정의)
    allow_credentials=True,  # 쿠키(JWT 토큰) 포함 허용
    allow_methods=["*"],  # 모든 HTTP 메서드 (GET, POST, PUT, DELETE) 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용 (Authorization 헤더 포함)
)
# -------------------------------------------------------------

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(chat.router)
app.include_router(progress.router)


@app.get("/")
def read_root():
    return {"message": "Hello Welfy! Backend is running."}
