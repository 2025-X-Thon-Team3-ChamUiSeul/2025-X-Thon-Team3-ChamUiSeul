# backend/app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette.responses import RedirectResponse
import requests
from jose import jwt
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


# 1. 로그인 버튼 누르면 구글로 이동시키는 주소
@router.get("/login")
def login_google():
    url = (
        f"https://accounts.google.com/o/oauth2/auth"
        f"?client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={settings.GOOGLE_REDIRECT_URI}"
        f"&response_type=code"
        f"&scope=openid email profile"
    )
    return RedirectResponse(url)


# 2. 구글에서 로그인 끝나면 돌아오는 곳 (여기서 DB 저장 & 토큰 발급)
@router.get("/callback")
def auth_google_callback(code: str, db: Session = Depends(get_db)):
    # A. 구글에게 '코드'를 주고 '토큰' 받아오기
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
    }
    res = requests.post(token_url, data=data)
    access_token = res.json().get("access_token")

    # B. 토큰으로 유저 정보(이메일, 이름) 가져오기
    user_info_res = requests.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    user_info = user_info_res.json()

    email = user_info.get("email")
    username = user_info.get("name")

    # C. DB 확인: 처음 온 사람이면 가입(DB 저장), 아니면 로그인
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # 회원가입
        user = User(email=email, username=username)
        db.add(user)
        db.commit()
        db.refresh(user)

    # D. 우리 서비스 전용 로그인 토큰(JWT) 만들기
    # (이걸 프론트엔드한테 줘야 채팅할 때 '나 누구야'라고 증명함)
    payload = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(hours=24),  # 24시간 유효
    }
    jwt_token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return {
        "message": "Login Success",
        "user": {"email": email, "name": username},
        "token": jwt_token,
    }
