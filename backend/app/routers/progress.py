# backend/app/routers/progress.py
import os
import re
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

# AI Imports
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# App Imports
from app.database import get_db
from app.models import User, UserWelfareProgress, Welfare
from app.dependencies import get_current_user

# --- CONFIGURATION ---
router = APIRouter(prefix="/progress", tags=["progress"])
api_key = os.getenv("GOOGLE_API_KEY")
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7, google_api_key=api_key)

# --- SCHEMAS ---
class ProgressResponse(BaseModel):
    progress_id: int
    welfare_title: str
    total_steps: int
    current_step: int
    next_action: str

    class Config:
        orm_mode = True

# --- HELPER FUNCTIONS ---
def _get_step_description(welfare: Welfare, step_number: int) -> str:
    """Generates all steps for a service and returns the description for a specific step."""
    context = f"[서비스명] {welfare.title}\n[요약] {welfare.summary}\n[URL] {welfare.url}"
    template = """
    주어진 [복지 서비스 정보]를 바탕으로, 온라인 신청 과정을 3~4단계로 나누어 설명하는 JSON을 생성합니다.
    {{"total_steps": 4, "steps": [{{"step": 1, "description": "설명"}}]}} 형식이어야 합니다.
    [복지 서비스 정보]: {context}
    """
    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | llm | StrOutputParser()
    response_str = chain.invoke({"context": context})
    try:
        json_match = re.search(r'{{.*}}', response_str, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group(0))
            for step in data.get("steps", []):
                if step.get("step") == step_number:
                    return step.get("description")
    except (json.JSONDecodeError, IndexError):
        pass
    return "다음 단계를 준비 중입니다."

# --- API ENDPOINTS ---
@router.get("/status", response_model=List[ProgressResponse])
def get_user_progress(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    progress_list = db.query(UserWelfareProgress).filter(UserWelfareProgress.user_id == current_user.id, UserWelfareProgress.status == "Active").join(Welfare).all()
    if not progress_list:
        return []
    return [ProgressResponse(
        progress_id=p.id,
        welfare_title=p.welfare.title,
        total_steps=p.total_steps,
        current_step=p.current_step,
        next_action=p.next_action_description,
    ) for p in progress_list]

@router.post("/complete-step/{progress_id}", response_model=ProgressResponse)
def complete_welfare_step(
    progress_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    progress = db.query(UserWelfareProgress).filter(UserWelfareProgress.id == progress_id, UserWelfareProgress.user_id == current_user.id).first()
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")

    if progress.current_step == 0:
        progress.current_step = 1
        progress.next_action_description = _get_step_description(progress.welfare, 1)
    elif progress.current_step < progress.total_steps:
        progress.current_step += 1
        progress.next_action_description = _get_step_description(progress.welfare, progress.current_step)
    
    if progress.current_step >= progress.total_steps:
        progress.status = "Completed"
        progress.next_action_description = "모든 절차를 마쳤습니다! 심사 결과를 기다려주세요."

    progress.last_updated = datetime.now()
    db.commit()
    db.refresh(progress)

    return ProgressResponse.from_orm(progress)