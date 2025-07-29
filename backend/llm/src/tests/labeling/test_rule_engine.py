from core.labeling.rule_engine import label_message


def test_affection_label():
    msg = "너무 보고 싶어, 사랑해!"
    result = label_message(msg)
    assert "emotion_expression" in result
    assert "애정 표현" in result["emotion_expression"]


def test_frustration_label():
    msg = "또 이래? 진짜 짜증 나"
    result = label_message(msg)
    assert "짜증, 실망, 좌절" in result.get("emotion_expression", [])
