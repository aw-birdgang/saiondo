# test_api_key.py
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
import asyncio

async def test_openai_connection():
    # .env 파일 로드
    load_dotenv()

    # API 키 확인
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY not found in environment variables")
        return

    print(f"API Key found (length: {len(api_key)})")

    try:
        # ChatOpenAI 초기화 테스트
        llm = ChatOpenAI(
            api_key=api_key,
            model="gpt-3.5-turbo",
            temperature=0.7
        )

        # 간단한 테스트 메시지
        response = await llm.ainvoke("Hello!")
        print("Test successful!")
        print(f"Response: {response}")

    except Exception as e:
        print(f"Error testing OpenAI connection: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_openai_connection())
