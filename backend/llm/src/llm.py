import os
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage
from dotenv import load_dotenv

load_dotenv()

openai_key = os.getenv("OPENAI_API_KEY")
if not openai_key:
    raise ValueError("OPENAI_API_KEY가 .env에 설정되어 있지 않아요, Oppa!")

llm = ChatOpenAI(
    temperature=0.7,
    model_name="gpt-3.5-turbo",
    openai_api_key=openai_key,
)

def ask_llm(prompt: str) -> str:
    message = [HumanMessage(content=prompt)]
    try:
        response = llm(message)
        return response.content
    except Exception as e:
        return f"⚠️ LLM 호출 중 에러 발생: {str(e)}"
