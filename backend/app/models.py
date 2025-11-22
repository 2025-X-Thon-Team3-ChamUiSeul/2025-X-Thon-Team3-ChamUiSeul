from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime


# 1. 사용자 테이블 (로그인 정보, 프로필)
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String)  # 사용자 이름

    # --- [추가] 프로필 입력 정보 ---
    age = Column(Integer, nullable=True)  # 나이
    gender = Column(String, nullable=True)  # 성별 (남/여)
    region = Column(String, nullable=True)  # 거주지 (서울, 경기 등)
    housing_type = Column(String, nullable=True)  # 거주 형태 (월세, 전세, 기숙사 등)
    monthly_income = Column(Integer, nullable=True)  # 월 평균 소득 (만원 단위)
    school = Column(String, nullable=True)  # 학교
    # ---------------------------

    chats = relationship("ChatHistory", back_populates="user")
    progresses = relationship("UserWelfareProgress", back_populates="user")


# 2. 복지 정보 테이블 (CSV 데이터 저장소)
class Welfare(Base):
    __tablename__ = "welfares"
    service_id = Column(String, primary_key=True)  # 서비스ID
    title = Column(String, index=True)  # 서비스명
    summary = Column(Text)  # 요약
    url = Column(String)  # 링크
    department = Column(String)  # 소관부처
    contact = Column(String)  # 문의처

    progresses = relationship("UserWelfareProgress", back_populates="welfare")


# 3. 진행 상황 테이블 (누가, 무엇을, 얼마나 진행했나)
class UserWelfareProgress(Base):
    __tablename__ = "user_welfare_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    welfare_id = Column(String, ForeignKey("welfares.service_id"))
    step = Column(Integer, default=0)  # 0:관심, 1:서류, 2:신청...
    is_completed = Column(Boolean, default=False)
    last_updated = Column(DateTime, default=datetime.now)

    user = relationship("User", back_populates="progresses")
    welfare = relationship("Welfare", back_populates="progresses")


# 4. 채팅 기록 테이블
class ChatHistory(Base):
    __tablename__ = "chat_histories"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text)
    response = Column(Text)
    timestamp = Column(DateTime, default=datetime.now)

    user = relationship("User", back_populates="chats")
