from fastapi import APIRouter
from schemas.labeling import (
    SingleMessageRequest, HistoryRequest,
    SingleLabelingResult, HistoryLabelingResult
)
from services.labeling_service import LabelingService

router = APIRouter(
    tags=["Labeling"],
)

@router.post("/label/single", response_model=SingleLabelingResult, tags=["Labeling"])
def label_single_message(request: SingleMessageRequest):
    """
    단일 메시지 룰 기반 라벨링
    """
    result = LabelingService.label_single_message(request)
    return result

@router.post("/label/history", response_model=HistoryLabelingResult, tags=["Labeling"])
def label_message_history(request: HistoryRequest):
    """
    메시지 히스토리(여러 개) 룰 기반 라벨링
    """
    results = LabelingService.label_message_history(request.messages)
    return {"results": results}

@router.post("/label/llm/history", response_model=HistoryLabelingResult, tags=["Labeling"])
def label_with_llm_history(request: HistoryRequest):
    """
    LLM을 이용한 메시지(히스토리) 라벨링
    """
    results = LabelingService.label_with_llm(request.messages)
    if isinstance(results, list):
        return {"results": results}
    return results

@router.post("/label/llm/single", response_model=SingleLabelingResult, tags=["Labeling"])
def label_with_llm_single(request: SingleMessageRequest):
    """
    LLM을 이용한 단일 메시지 라벨링
    """
    results = LabelingService.label_with_llm([request])
    # LLM 결과가 리스트가 아니라 dict(라벨 딕셔너리)만 올 경우 보정
    if isinstance(results, list) and results:
        result = results[0]
        # 만약 result에 sender/text가 없으면 추가
        if "sender" not in result or "text" not in result or "labels" not in result:
            return {
                "sender": request.sender,
                "text": request.text,
                "labels": result
            }
        return result
    elif isinstance(results, dict):
        # dict만 올 경우
        return {
            "sender": request.sender,
            "text": request.text,
            "labels": results
        }
    return {
        "sender": request.sender,
        "text": request.text,
        "labels": {}
    }
