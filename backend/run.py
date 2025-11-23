import uvicorn
import os

if __name__ == "__main__":
    # GOOGLE_API_KEY가 설정되지 않았다면 .env 파일에서 로드 시도
    if not os.getenv("GOOGLE_API_KEY"):
        try:
            from dotenv import load_dotenv
            load_dotenv()
            print("Loaded environment variables from .env file.")
        except ImportError:
            print("dotenv not installed. Skipping .env file loading.")
            
    # Uvicorn 서버 실행
    uvicorn.run(
        "app.main:app", 
        host="127.0.0.1", 
        port=8000, 
        reload=True
    )
