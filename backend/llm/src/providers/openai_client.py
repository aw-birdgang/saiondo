import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage

load_dotenv()

openai_key = os.getenv("OPENAI_API_KEY")
if not openai_key:
    raise ValueError("OPENAI_API_KEY가 .env에 설정되어 있지 않아요, Oppa!")

openai_llm = ChatOpenAI(
    temperature=0.7,
    model_name="gpt-3.5-turbo",
    openai_api_key=os.getenv("OPENAI_API_KEY"),
)

def ask_openai(prompt: str) -> str:
    try:
        response = openai_llm([HumanMessage(content=prompt)])
        return response.content
    except Exception as e:
        return f"❌ OpenAI 오류: {e}"
