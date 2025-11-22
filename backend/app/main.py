# backend/app/main.py
from fastapi import FastAPI
from app.routers import auth  # <--- 추가된 부분 1

app = FastAPI(title="Welfy API", version="1.0.0")

# 라우터 등록
app.include_router(auth.router)  # <--- 추가된 부분 2


@app.get("/")
def read_root():
    return {"message": "Hello Welfy! Backend is running."}
