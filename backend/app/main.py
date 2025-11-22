# backend/app/main.py

from fastapi import FastAPI
from app.routers import auth, user, chat  # <--- 1. 여기 'chat'을 임포트했는지 확인

app = FastAPI(title="Welfy API", version="1.0.0")

app.include_router(auth.router)
app.include_router(
    user.router
)  # <--- 2. 이 줄이 있나요? (이게 없으면 화면에 안 뜹니다!)
app.include_router(chat.router)  # <--- 3. 'chat' 라우터도 포함시켜야 합니다!


@app.get("/")
def read_root():
    return {"message": "Hello Welfy! Backend is running."}
