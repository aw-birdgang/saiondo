from mcp.context import MCPContext
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage

from dotenv import load_dotenv
load_dotenv()

llm = ChatOpenAI(model_name="gpt-3.5-turbo")

def trait_analysis(ctx: MCPContext) -> MCPContext:
    mbti = ctx.metadata.get("user_mbti", "알 수 없음")
    age = ctx.metadata.get("user_age", "알 수 없음")
    session_id = ctx.metadata.get("sessionId", "N/A")
    prompt = (
        f"[세션ID: {session_id}]\n"
        f"사용자 MBTI: {mbti}\n"
        f"나이: {age}\n"
        f"성별: {ctx.user_gender}\n"
        f"아래 사람의 성향을 분석해줘:\n\n{ctx.user_prompt}"
    )
    result = llm.invoke([HumanMessage(content=prompt)])
    ctx.metadata["user_traits"] = result.content
    return ctx

def match_analysis(ctx: MCPContext) -> MCPContext:
    partner_mbti = ctx.metadata.get("partner_mbti", "알 수 없음")
    relationship_duration = ctx.metadata.get("relationship_duration_months", "알 수 없음")
    prompt = (
        f"사용자 성향: {ctx.metadata['user_traits']}\n"
        f"상대방 성향: {ctx.partner_prompt}\n"
        f"상대방 MBTI: {partner_mbti}\n"
        f"관계 기간(개월): {relationship_duration}\n"
        f"두 사람의 궁합을 분석해줘."
    )
    result = llm.invoke([HumanMessage(content=prompt)])
    ctx.metadata["match_result"] = result.content
    return ctx

def generate_advice(ctx: MCPContext) -> MCPContext:
    session_id = ctx.metadata.get("sessionId", "N/A")
    prompt = (
        f"[세션ID: {session_id}]\n"
        f"아래 궁합 분석 결과를 바탕으로 관계 개선을 위한 조언을 해줘:\n\n"
        f"{ctx.metadata['match_result']}"
    )
    result = llm.invoke([HumanMessage(content=prompt)])
    ctx.metadata["advice"] = result.content
    return ctx
