# backend/app/routers/progress.py (새 파일 생성)

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import UserWelfareProgress, Welfare, User
from app.schemas import ProgressStartResponse, ProgressCompletion
from app.dependencies import get_current_user
from datetime import datetime

router = APIRouter(prefix="/progress", tags=["progress"])

# --- 해커톤용: 신청 단계 정보 정의 (예시 데이터) ---
# AI가 이 정보를 바탕으로 사용자에게 다음 행동을 안내합니다.
APPLICATION_STEPS = {
    "WLF00000022": {  # (산재근로자)사회심리재활지원 (예시 서비스 ID)
        "title": "청년 월세 지원 사업 (예시)",
        "steps": [
            "1단계: [신청자] 마이데이터 또는 건강보험공단을 통해 소득 정보 확인 및 출력",
            "2단계: [신청자] 주민센터 방문하여 주거지 확정일자 확인 및 계약서 사본 준비",
            "3단계: [신청자] 복지로 앱에서 온라인 신청 및 구비 서류 파일 업로드",
            "4단계: [시스템] 심사 및 결과 통보 대기",
        ],
        "total": 4,
    }
    # 실제 서비스 ID 별로 단계 정보를 추가해야 함 (핵심 지식)
}


# 1. [POST] 신청 시작 API (AI가 추천한 혜택을 사용자가 선택했을 때 호출)
@router.post("/start/{welfare_id}", response_model=ProgressStartResponse)
def start_welfare_application(
    welfare_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 해당 서비스의 단계 정보가 정의되어 있는지 확인
    step_info = APPLICATION_STEPS.get(welfare_id)
    if not step_info:
        raise HTTPException(
            status_code=404,
            detail="해당 서비스의 단계 정보가 아직 정의되지 않았습니다.",
        )

    # 이미 진행 중인 신청이 있는지 확인
    existing = (
        db.query(UserWelfareProgress)
        .filter(
            UserWelfareProgress.user_id == current_user.id,
            UserWelfareProgress.welfare_id == welfare_id,
            UserWelfareProgress.status == "Active",
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400, detail="이미 해당 서비스의 신청을 진행 중입니다."
        )

    # 새로운 진행 상태 레코드 생성
    new_progress = UserWelfareProgress(
        user_id=current_user.id,
        welfare_id=welfare_id,
        status="Active",
        total_steps=step_info["total"],
        current_step=1,
        next_action_description=step_info["steps"][0],  # 1단계 설명
    )
    db.add(new_progress)
    db.commit()
    db.refresh(new_progress)

    return ProgressStartResponse(
        progress_id=new_progress.id,
        service_title=step_info["title"],
        total_steps=new_progress.total_steps,
        current_step=new_progress.current_step,
        next_action=new_progress.next_action_description,
    )


# 2. [PUT] 다음 단계 진행 API (사용자가 '1단계 완료' 버튼을 눌렀을 때 호출)
@router.put("/next_step", response_model=ProgressStartResponse)
def complete_and_advance_step(
    request: ProgressCompletion,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    progress = (
        db.query(UserWelfareProgress)
        .filter(
            UserWelfareProgress.id == request.progress_id,
            UserWelfareProgress.user_id == current_user.id,
            UserWelfareProgress.status == "Active",
        )
        .first()
    )

    if not progress:
        raise HTTPException(
            status_code=404, detail="진행 중인 신청 상태를 찾을 수 없습니다."
        )

    # 다음 단계 계산
    next_step = progress.current_step + 1
    step_info = APPLICATION_STEPS.get(progress.welfare_id)

    if next_step > progress.total_steps:
        # 최종 완료 처리
        progress.status = "Completed"
        progress.next_action_description = (
            "모든 신청 절차가 완료되었습니다. 결과 통보를 기다리세요."
        )
        progress.current_step = progress.total_steps  # 마지막 단계로 고정

    else:
        # 다음 단계로 이동
        progress.current_step = next_step
        progress.next_action_description = step_info["steps"][
            next_step - 1
        ]  # 다음 단계 설명

    progress.last_updated = datetime.now()
    db.commit()
    db.refresh(progress)

    return ProgressStartResponse(
        progress_id=progress.id,
        service_title=step_info["title"],
        total_steps=progress.total_steps,
        current_step=progress.current_step,
        next_action=progress.next_action_description,
    )


# 3. [GET] 현재 진행 상태 조회 API (시각화 그래프 데이터용)
@router.get("/status", response_model=List[ProgressStartResponse])
def get_user_application_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    active_progresses = (
        db.query(UserWelfareProgress)
        .filter(
            UserWelfareProgress.user_id == current_user.id,
            UserWelfareProgress.status == "Active",
        )
        .all()
    )

    response_list = []
    for progress in active_progresses:
        step_info = APPLICATION_STEPS.get(
            progress.welfare_id, {"title": "알 수 없는 서비스", "total": 0}
        )
        response_list.append(
            ProgressStartResponse(
                progress_id=progress.id,
                service_title=step_info["title"],
                total_steps=progress.total_steps,
                current_step=progress.current_step,
                next_action=progress.next_action_description,
            )
        )
    return response_list
