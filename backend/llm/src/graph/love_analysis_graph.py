from langgraph.graph import StateGraph, END
from mcp.context import MCPContext
from graph.nodes import trait_analysis, match_analysis, generate_advice

def build_graph():
    builder = StateGraph(MCPContext)

    builder.add_node("trait_analysis", trait_analysis)
    builder.add_node("match_analysis", match_analysis)
    builder.add_node("generate_advice", generate_advice)

    builder.set_entry_point("trait_analysis")
    builder.add_edge("trait_analysis", "match_analysis")
    builder.add_edge("match_analysis", "generate_advice")
    builder.add_edge("generate_advice", END)

    return builder.compile()
