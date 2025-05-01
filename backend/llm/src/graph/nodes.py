from mcp.context import MCPContext
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage

from dotenv import load_dotenv
load_dotenv()

llm = ChatOpenAI(model_name="gpt-3.5-turbo")

def trait_analysis(ctx: MCPContext) -> MCPContext:
    prompt = f"다음 사람의 성향을 분석해줘:\n\n{ctx.user_prompt}"
    result = llm.invoke([HumanMessage(content=prompt)])
    ctx.metadata["user_traits"] = result.content
    return ctx

def match_analysis(ctx: MCPContext) -> MCPContext:
    prompt = f"""
    다음 두 사람의 성향을 바탕으로 궁합을 분석해줘:\n\n
    사용자: {ctx.metadata['user_traits']}
    상대방: {ctx.partner_prompt}
    """
    result = llm.invoke([HumanMessage(content=prompt)])
    ctx.metadata["match_result"] = result.content
    return ctx

def generate_advice(ctx: MCPContext) -> MCPContext:
    prompt = f"""
    아래 궁합 분석 결과를 바탕으로 관계 개선을 위한 조언을 해줘:\n\n
    {ctx.metadata['match_result']}
    """
    result = llm.invoke([HumanMessage(content=prompt)])
    ctx.metadata["advice"] = result.content
    return ctx
