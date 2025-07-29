from typing import List, Literal

from pydantic import BaseModel


class ChatMessage(BaseModel):
    sender: Literal["male", "female", "other"]
    text: str


class LabelingRequest(BaseModel):
    # 단일 메시지 or 히스토리 모두 지원
    messages: List[ChatMessage]


class LabelingResult(BaseModel):
    labels: dict
    # (확장) 성향 분석 결과 등 추가 가능
    # e.g. male_traits: dict, female_traits: dict


class SingleMessageRequest(BaseModel):
    sender: Literal["male", "female", "other"]
    text: str


class HistoryMessage(BaseModel):
    sender: Literal["male", "female", "other"]
    text: str


class HistoryRequest(BaseModel):
    messages: List[HistoryMessage]


class SingleLabelingResult(BaseModel):
    sender: str
    text: str
    labels: dict


class HistoryLabelingResult(BaseModel):
    results: List[SingleLabelingResult]
