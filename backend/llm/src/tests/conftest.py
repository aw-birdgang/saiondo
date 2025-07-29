"""
pytest configuration and common fixtures
"""

import sys
from pathlib import Path

import pytest

# Add src directory to Python path
src_path = Path(__file__).parent.parent
sys.path.insert(0, str(src_path))


@pytest.fixture
def mock_llm_response():
    """Mock LLM response for testing"""
    return {
        "summary": "테스트 분석 결과",
        "advice": "테스트 조언",
        "compatibility_score": 80,
        "personality_analysis": {
            "user": {"dominant_traits": ["테스트"], "strengths": ["테스트"]},
            "partner": {"dominant_traits": ["테스트"], "strengths": ["테스트"]},
        },
        "relationship_insights": ["테스트 인사이트"],
        "improvement_suggestions": ["테스트 제안"],
    }


@pytest.fixture
def sample_user_data():
    """Sample user data for testing"""
    return {
        "name": "김철수",
        "age": 28,
        "mbti": "INTJ",
        "interests": ["독서", "게임"],
        "personality": "내향적이고 분석적",
    }


@pytest.fixture
def sample_partner_data():
    """Sample partner data for testing"""
    return {
        "name": "이영희",
        "age": 26,
        "mbti": "ENFP",
        "interests": ["여행", "음악"],
        "personality": "외향적이고 창의적",
    }
