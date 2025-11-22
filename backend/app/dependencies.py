from typing import Annotated
from fastapi import Depends, HTTPException, status

# HTTPBearer와 HTTPAuthorizationCredentials를 임포트합니다.
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.core.config import settings

# JWT 토큰을 Bearer 스키마로 받도록 설정합니다.
bearer_scheme = HTTPBearer()


# 토큰을 검사해서 현재 로그인한 유저를 찾아내는 보안 요원 함수
# 의존성 주입을 HTTPBearer 스키마(bearer_scheme)로 대체하고,
# 인수를 HTTPAuthorizationCredentials 타입으로 받습니다.
def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)],
    db: Annotated[Session, Depends(get_db)],
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="자격 증명을 검증할 수 없습니다.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # 1. credentials 객체에서 순수한 토큰 문자열만 추출합니다.
    # HTTPAuthorizationCredentials는 scheme (예: "Bearer")와 credentials (토큰)을 가집니다.
    token = credentials.credentials

    try:
        # 2. 토큰 해석 (비밀키로 해독)
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    # 3. DB에서 해당 이메일 유저 찾기
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception

    return user
