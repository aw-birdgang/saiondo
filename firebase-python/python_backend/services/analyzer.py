import logging
from typing import Dict, Any, List
from google.cloud import firestore
from openai import AsyncOpenAI
from datetime import datetime, timezone
import re

logger = logging.getLogger(__name__)

class PromptAnalyzer:
    def __init__(self, db: firestore.Client):
        self.db = db
        self.openai = AsyncOpenAI()
        
    def extract_keywords(self, text: str) -> List[str]:
        """
        텍스트에서 의미있는 키워드 추출
        """
        # 특수문자 및 조사 제거
        text = re.sub(r'[^\w\s]', ' ', text)
        words = text.split()
        # 일반적인 조사, 접속사 등 제거
        stop_words = {'을', '를', '이', '가', '은', '는', '에', '의', '로', '으로'}
        keywords = [word for word in words if word not in stop_words]
        return keywords[:3]  # 상위 3개 키워드만 사용

    async def get_related_prompts(self, prompt: str, limit: int = 3) -> List[Dict[str, Any]]:
        """
        현재 프롬프트와 관련된 이전 프롬프트들을 Firestore에서 조회
        """
        try:
            # 키워드 추출
            keywords = self.extract_keywords(prompt)
            logger.info(f"Extracted keywords: {keywords}")
            
            # 최신 방식으로 쿼리 구성
            prompts_ref = self.db.collection('prompts')
            query = prompts_ref.where(
                filter=firestore.FieldFilter("status", "==", "completed")
            ).order_by(
                "timestamp", direction=firestore.Query.DESCENDING
            ).limit(limit * 2)  # 더 많은 문서를 가져와서 필터링
            
            related_prompts = []
            docs = query.stream()
            
            for doc in docs:
                data = doc.to_dict()
                text = data.get('text', '').lower()
                
                # 키워드 매칭 점수 계산
                match_score = sum(1 for keyword in keywords if keyword.lower() in text)
                
                if match_score > 0:  # 하나 이상의 키워드가 매칭되면 추가
                    timestamp = data.get('timestamp')
                    if isinstance(timestamp, datetime):
                        timestamp = timestamp.replace(tzinfo=timezone.utc).isoformat()
                    elif timestamp is None:
                        timestamp = datetime.now(timezone.utc).isoformat()
                    
                    related_prompts.append({
                        'prompt': data.get('text', ''),
                        'result': data.get('result', {}),
                        'timestamp': timestamp,
                        'match_score': match_score
                    })
            
            # 매칭 점수로 정렬하고 상위 limit개만 선택
            related_prompts.sort(key=lambda x: (-x['match_score'], x['timestamp']), reverse=True)
            related_prompts = related_prompts[:limit]
            
            logger.info(f"Found {len(related_prompts)} related prompts with keywords {keywords}")
            return related_prompts
            
        except Exception as e:
            logger.error(f"Error fetching related prompts: {str(e)}")
            logger.exception("Detailed error:")
            return []

    async def analyze_prompt(self, prompt: str, prompt_id: str) -> Dict[str, Any]:
        """
        프롬프트를 분석하고 관련 데이터를 함께 고려하여 응답
        """
        try:
            logger.info(f"Analyzing prompt: {prompt}")
            
            # 관련된 이전 프롬프트들 조회 (수를 2개로 제한)
            related_prompts = await self.get_related_prompts(prompt, limit=2)
            logger.info(f"Retrieved {len(related_prompts)} related prompts")
            
            # AI 시스템 프롬프트 간소화
            system_prompt = """
            기술 질문에 대해 간단명료하게 답변해주세요.
            
            답변 형식:
            1. 핵심 요약 (1-2줄)
            2. 주요 포인트 (2-3개)
            """
            
            # 사용자 프롬프트 구성
            user_prompt = f"질문: {prompt}\n\n"
            
            if related_prompts:
                user_prompt += "참고 답변:\n"
                for idx, related in enumerate(related_prompts, 1):
                    user_prompt += f"- {related['prompt']}\n"
            
            logger.info("Calling OpenAI API")
            # OpenAI API 호출 - 토큰 수 감소
            response = await self.openai.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=500  # 토큰 수 감소
            )
            
            # 응답 구성
            result = {
                'content': response.choices[0].message.content,
                'related_prompts': [
                    {
                        'prompt': rp['prompt'],
                        'timestamp': rp['timestamp']
                    } 
                    for rp in related_prompts
                ],
                'analyzed_at': datetime.now(timezone.utc).isoformat(),
                'prompt_id': prompt_id
            }
            
            logger.info("Analysis completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"Error in analyze_prompt: {str(e)}")
            logger.exception("Detailed error:")
            raise 