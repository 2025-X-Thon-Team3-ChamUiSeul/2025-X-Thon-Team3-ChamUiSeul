# backend/app/main.py

from fastapi import FastAPI
from app.routers import (
    auth,
    user,
    chat,
    progress,
)

app = FastAPI(title="Welfy API", version="1.0.0")

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(chat.router)  # <--- 3. 'chat' 라우터도 포함시켜야 합니다!
app.include_router(progress.router)  # <--- progress 라우터 등록


@app.get("/")
def read_root():
    return {"message": "Hello Welfy! Backend is running."}
