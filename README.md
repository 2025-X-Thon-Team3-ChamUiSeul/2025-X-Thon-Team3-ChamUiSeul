### 2024-X-Thon-Team3-ChamUiSeul
# WELFY  <img width="50" height="50" alt="KakaoTalk_20251122_161444901_01" src="https://github.com/user-attachments/assets/1963c304-7702-4e8c-919a-979e82f3201b" />
> AI 기술을 활용하여 복잡하고 찾기 어려운 청년 맞춤형 복지 정보를 사용자에게 즉시 제공합니다.
<br/>

### 1. 기술 스택

| 구분 | 주요 기술 | 사용 목적 |
| :--- | :--- | :--- |
| **FE** | React, TypeScript, Tailwind CSS | 사용자 인터페이스 구현 및 동적인 상호작용 처리 |
| **BE** | Python, Fast API | API 개발 및 데이터 관리 |
| **DB** | MySQL, ChromaDB | 사용자 및 세션 데이터 등 구조화된 정보 관리, 임베딩 및 벡터 데이터 저장 |
| **AI&LLM** | Google Gemini API | 대규모 언어 모델 연동 및 핵심 챗봇 기능 구현 |
<br/>

### 2. 주요 기능
* **RAG 기반 맞춤형 복지 정보 제공**
    * 한국사회보장정보원의 공공데이터를 활용한 **특화 지식베이스(ChromaDB)** 구축.
    * 사용자 질문에 대해 지식베이스에서 **관련 서비스 검색** 및 **검색된 근거 기반**의 답변 생성. (Google Gemini API 활용)
* **고성능 & 안정적인 시스템**
    * 고성능 **FastAPI** 기반의 백엔드 API 서버를 통한 빠른 응답 속도 보장.
    * **TypeScript**를 적용한 React 프론트엔드를 통한 높은 개발 안정성 확보.
* **대화 세션 관리**
    * MySQL을 활용하여 모든 대화 기록을 안전하게 저장하고, 언제든지 이전 세션을 불러와 대화를 이어서 진행할 수 있는 기능 제공.
<br/>

### 3. 설치 및 실행
#### 3.1. 필수 요구 사항

* Git
* Node.js (v18 이상 권장)
* Python 3.10 이상

#### 3.2. 환경 설정

1.  **저장소 복제:**
    ```bash
    git clone [GitHub 저장소 주소]
    cd [프로젝트 폴더명]
    ```

2.  **의존성 설치:**
    * **Frontend:** `cd frontend` 후 `npm install`
    * **Backend:** `cd backend` 후 가상 환경 설정

#### 3.3. 프로젝트 실행

1.  **백엔드 서버 구동:** (별도의 터미널에서)
    ```bash
    # (가상 환경 활성화 후)
    python run.py 
    ```
2.  **프론트엔드 서버 구동:** (다른 터미널에서)
    ```bash
    npm run dev
    ```
<br/>

### 4. 기여자
| 역할 | 이름 | 
| :--- | :--- |
| **FE** | 김서연 |
| **FE** | 이정민 |
| **FE** | 황서진 |
| **BE, PM** | 김성진 | 
| **BE** | 유수빈 |

<img width="1824" height="1082" alt="image" src="https://github.com/user-attachments/assets/dad4c1e5-420e-4f2d-b220-8162f28a2bcd" />
