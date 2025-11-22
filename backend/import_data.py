import pandas as pd
from app.database import SessionLocal, engine, Base
from app.models import Welfare

# 테이블 자동 생성
Base.metadata.create_all(bind=engine)

# CSV 파일명 (정확한지 확인!)
csv_file = "한국사회보장정보원_복지서비스정보_20250722.csv"

# 인코딩 처리 (한글 깨짐 방지)
try:
    df = pd.read_csv(csv_file, encoding="utf-8")
except UnicodeDecodeError:
    df = pd.read_csv(csv_file, encoding="cp949")

db = SessionLocal()
print("데이터 입력을 시작합니다...")

count = 0
for _, row in df.iterrows():
    # 중복 확인
    existing = (
        db.query(Welfare).filter(Welfare.service_id == row["서비스아이디"]).first()
    )
    if not existing:
        welfare = Welfare(
            service_id=row["서비스아이디"],
            title=row["서비스명"],
            summary=row["서비스요약"],
            url=row["서비스URL"],
            department=row["소관부처명"],
            contact=row["대표문의"],
        )
        db.add(welfare)
        count += 1

db.commit()
db.close()
print(f"✅ 성공! 총 {count}개의 복지 서비스가 DB에 저장되었습니다.")
