from langgraph.graph import END, StateGraph

from graph.nodes import generate_advice, match_analysis, trait_analysis
from mcp.context import MCPContext


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
