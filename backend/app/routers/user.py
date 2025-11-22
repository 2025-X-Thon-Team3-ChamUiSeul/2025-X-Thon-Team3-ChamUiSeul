# backend/app/routers/user.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserProfileUpdate, UserResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


# [GET] 내 정보 조회 (초기화면에서 정보 뿌려줄 때 사용)
@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


# [PUT] 내 정보 수정 (기본 정보 입력 모달에서 저장 누를 때 사용)
@router.put("/me", response_model=UserResponse)
def update_user_profile(
    profile: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # profile.dict(exclude_unset=True) -> 프론트가 보낸 데이터만 딕셔너리로 만듦
    update_data = profile.dict(exclude_unset=True)

    # 반복문으로 하나씩 업데이트 (나이, 학교, 소득 등등 자동 처리)
    for key, value in update_data.items():
        setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)
    return current_user
