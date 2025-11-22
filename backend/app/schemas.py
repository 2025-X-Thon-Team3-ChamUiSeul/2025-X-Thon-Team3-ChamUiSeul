from pydantic import BaseModel
from typing import Optional


# 1. 프론트엔드가 보낼 데이터 모양 (입력)
class UserProfileUpdate(BaseModel):
    username: Optional[str] = None  # 이름 수정 가능
    age: Optional[int] = None  # 나이
    gender: Optional[str] = None  # 성별
    region: Optional[str] = None  # 거주지
    housing_type: Optional[str] = None  # 거주 형태
    monthly_income: Optional[int] = None  # 소득
    school: Optional[str] = None  # 학교


# 2. 프론트엔드에게 돌려줄 데이터 모양 (응답)
class UserResponse(BaseModel):
    id: int
    email: str
    username: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    region: Optional[str] = None
    housing_type: Optional[str] = None
    monthly_income: Optional[int] = None
    school: Optional[str] = None

    class Config:
        orm_mode = True
