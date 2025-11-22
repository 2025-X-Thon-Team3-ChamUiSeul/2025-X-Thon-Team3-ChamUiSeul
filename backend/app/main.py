# backend/app/main.py

from fastapi import FastAPI
from app.routers import auth, user  # <--- 1. 여기 user 추가했나요?

app = FastAPI(title="Welfy API", version="1.0.0")

app.include_router(auth.router)
app.include_router(
    user.router
)  # <--- 2. 이 줄이 있나요? (이게 없으면 화면에 안 뜹니다!)


@app.get("/")
def read_root():
    return {"message": "Hello Welfy! Backend is running."}
