# backend/app/dependencies.py

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.core.config import settings

# 토큰 인증 방식 설정 (로그인 주소 지정)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# 토큰을 검사해서 현재 로그인한 유저를 찾아내는 보안 요원 함수
def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="자격 증명을 검증할 수 없습니다.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # 1. 토큰 해석 (비밀키로 해독)
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # 2. DB에서 해당 이메일 유저 찾기
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user
