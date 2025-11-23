from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base  # models.py에서 Base를 가져옵니다.

# SQLite DB 파일 이름 설정 (welfy.db)
SQLALCHEMY_DATABASE_URL = "sqlite:///./welfy.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# DB 세션 관리 함수
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
