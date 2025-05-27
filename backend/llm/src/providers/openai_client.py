import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, AIMessage, SystemMessage
from langchain.callbacks.tracers.langchain import LangChainTracer

load_dotenv()

openai_key = os.getenv("OPENAI_API_KEY")
if not openai_key:
    raise ValueError("OPENAI_API_KEY가 .env에 설정되어 있지 않아요, Oppa!")

# LangSmith 트레이서 활성화
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY", "")
os.environ["LANGCHAIN_PROJECT"] = os.getenv("LANGCHAIN_PROJECT", "saiondo-llm")

tracer = LangChainTracer()

openai_llm = ChatOpenAI(
    temperature=0.7,
    model_name="gpt-3.5-turbo",
    openai_api_key=openai_key,
    callbacks=[tracer],
)

def ask_openai(prompt: str) -> str:
    try:
        response = openai_llm([HumanMessage(content=prompt)])
        return response.content
    except Exception as e:
        return f"❌ OpenAI 오류: {e}"

def ask_openai_history(messages) -> str:
    lc_messages = []
    for m in messages:
        role = m.role if hasattr(m, "role") else m["role"]
        content = m.content if hasattr(m, "content") else m["content"]
        if role == "user":
            lc_messages.append(HumanMessage(content=content))
        elif role == "assistant":
            lc_messages.append(AIMessage(content=content))
        elif role == "system":
            lc_messages.append(SystemMessage(content=content))
    try:
        response = openai_llm(lc_messages)
        return response.content
    except Exception as e:
        return f"❌ OpenAI 오류: {e}"

print("LANGCHAIN_TRACING_V2:", os.environ.get("LANGCHAIN_TRACING_V2"))
print("LANGCHAIN_API_KEY:", os.environ.get("LANGCHAIN_API_KEY"))
print("LANGCHAIN_PROJECT:", os.environ.get("LANGCHAIN_PROJECT"))
