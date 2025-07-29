# backend/llm/src/api/personality.py
import json
import logging
from typing import Any, Dict

from fastapi import APIRouter, Body, HTTPException

from schemas.personality import (
    AnalyzeBehaviorRequest,
    AnalyzeBehaviorResponse,
    AnalyzeCommunicationRequest,
    AnalyzeCommunicationResponse,
    AnalyzeConversationRequest,
    AnalyzeConversationResponse,
    AnalyzeEmotionRequest,
    AnalyzeEmotionResponse,
    AnalyzeLoveLanguageRequest,
    AnalyzeLoveLanguageResponse,
    AnalyzeMbtiRequest,
    AnalyzeMbtiResponse,
    ChatbotDetectRequest,
    ChatbotDetectResponse,
    FeedbackRequest,
    FeedbackResponse,
)
from services.personality_service import personality_service

logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["Personality Analysis"],
)


@router.post(
    "/analyze",
    summary="일반 분석 엔드포인트",
    description="NestJS API에서 호출하는 일반적인 분석 엔드포인트입니다.",
)
def analyze(request: Dict[str, Any] = Body(...)):
    """
    NestJS API에서 호출하는 일반 분석 엔드포인트
    """
    try:
        # NestJS에서 보내는 데이터를 프롬프트로 변환
        if "answer" in request:
            # AnalyzeAnswerDto 형식
            prompt = request["answer"]
        elif "user_prompt" in request:
            # AnalyzeRequestDto 형식
            prompt = f"""다음 정보를 기반으로 성향 분석을 해주세요:
            사용자: {request.get('user_prompt', '')}
            파트너: {request.get('partner_prompt', '')}
            사용자 성별: {request.get('user_gender', '')}
            파트너 성별: {request.get('partner_gender', '')}
            메타데이터: {request.get('metadata', {})}

            분석 결과를 JSON 형식으로 반환해주세요."""
        else:
            # 기타 형식 - 전체를 JSON으로 변환하여 프롬프트로 사용
            prompt = f"다음 데이터를 분석해주세요: {str(request)}"

        logger.info(f"분석 프롬프트: {prompt}")
        response = personality_service.analyze(prompt)
        logger.info(f"분석 응답: {response}")

        # 응답이 JSON 문자열인지 확인
        if isinstance(response, str):
            try:
                # JSON 파싱 시도
                parsed_response = json.loads(response)
                return {"response": parsed_response}
            except json.JSONDecodeError:
                # JSON이 아니면 문자열 그대로 반환
                return {"response": response}
        else:
            return {"response": response}

    except Exception as e:
        logger.error(f"분석 중 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=f"분석 중 오류 발생: {str(e)}")


@router.post(
    "/analyze-conversation",
    response_model=AnalyzeConversationResponse,
    summary="대화 기반 성향 분석",
    description="대화 메시지 배열을 기반으로 LLM이 성향을 분석합니다.",
)
def analyze_conversation(request: AnalyzeConversationRequest):
    """
    대화 기반 성향 분석 API
    """
    try:
        result = personality_service.analyze_conversation(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"대화 분석 중 오류 발생: {str(e)}")


@router.post(
    "/analyze-mbti",
    response_model=AnalyzeMbtiResponse,
    summary="MBTI 분석",
    description="설문/대화 데이터 기반 MBTI 분석",
)
def analyze_mbti(request: AnalyzeMbtiRequest):
    """
    MBTI 분석 API
    """
    try:
        result = personality_service.analyze_mbti(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MBTI 분석 중 오류 발생: {str(e)}")


@router.post(
    "/analyze-communication",
    response_model=AnalyzeCommunicationResponse,
    summary="소통 스타일 분석",
    description="대화 데이터 기반 소통 스타일 분석",
)
def analyze_communication(request: AnalyzeCommunicationRequest):
    """
    소통 스타일 분석 API
    """
    try:
        result = personality_service.analyze_communication(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"소통 스타일 분석 중 오류 발생: {str(e)}"
        )


@router.post(
    "/analyze-love-language",
    response_model=AnalyzeLoveLanguageResponse,
    summary="사랑의 언어 분석",
    description="행동/대화 데이터 기반 사랑의 언어 분석",
)
def analyze_love_language(request: AnalyzeLoveLanguageRequest):
    """
    사랑의 언어 분석 API
    """
    try:
        result = personality_service.analyze_love_language(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"사랑의 언어 분석 중 오류 발생: {str(e)}"
        )


@router.post(
    "/analyze-behavior",
    response_model=AnalyzeBehaviorResponse,
    summary="행동 패턴 분석",
    description="행동 데이터 기반 패턴 분석",
)
def analyze_behavior(request: AnalyzeBehaviorRequest):
    """
    행동 패턴 분석 API
    """
    try:
        result = personality_service.analyze_behavior(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"행동 패턴 분석 중 오류 발생: {str(e)}"
        )


@router.post(
    "/analyze-emotion",
    response_model=AnalyzeEmotionResponse,
    summary="감정 상태 분석",
    description="대화/상담 데이터 기반 감정 상태 분석",
)
def analyze_emotion(request: AnalyzeEmotionRequest):
    """
    감정 상태 분석 API
    """
    try:
        result = personality_service.analyze_emotion(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"감정 상태 분석 중 오류 발생: {str(e)}"
        )


@router.post(
    "/chatbot-detect",
    response_model=ChatbotDetectResponse,
    summary="챗봇 기반 성향 탐지",
    description="챗봇 대화 데이터 기반 성향 탐지",
)
def chatbot_detect(request: ChatbotDetectRequest):
    """
    챗봇 기반 성향 탐지 API
    """
    try:
        result = personality_service.chatbot_detect(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"챗봇 탐지 중 오류 발생: {str(e)}")


@router.post(
    "/feedback",
    response_model=FeedbackResponse,
    summary="성향 기반 피드백 생성",
    description="상황 데이터 기반 피드백 생성",
)
def generate_feedback(request: FeedbackRequest):
    """
    성향 기반 피드백 생성 API
    """
    try:
        result = personality_service.generate_feedback(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"피드백 생성 중 오류 발생: {str(e)}"
        )
