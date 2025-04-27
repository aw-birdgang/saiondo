import operator

import aiohttp
from langchain.agents import initialize_agent, AgentType
from langchain.tools import Tool
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_community.utilities import WikipediaAPIWrapper
from langchain_openai import ChatOpenAI

from app.core.config import settings
from app.core.logger import log_error, log_info


class WeatherService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.weatherapi.com/v1/current.json"

    async def get_weather(self, location: str) -> dict:
        params = {
            "key": self.api_key,
            "q": location,
            "lang": "ko"
        }
        async with aiohttp.ClientSession() as session:
            async with session.get(self.base_url, params=params) as resp:
                if resp.status == 200:
                    return await resp.json()
                else:
                    raise Exception(f"WeatherAPI 오류: {resp.status}")

class NewsService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://newsapi.org/v2/top-headlines"

    async def get_news(self, query: str, language: str = "ko") -> dict:
        params = {
            "q": query,
            "apiKey": self.api_key,
            "language": language,
            "pageSize": 3
        }
        async with aiohttp.ClientSession() as session:
            async with session.get(self.base_url, params=params) as resp:
                if resp.status == 200:
                    return await resp.json()
                else:
                    raise Exception(f"NewsAPI 오류: {resp.status}")

class ToolService:
    def __init__(self):
        self.llm = ChatOpenAI(
            api_key=settings.OPENAI_API_KEY.get_secret_value(),
            model=settings.MODEL_NAME,
            temperature=settings.MODEL_TEMPERATURE
        )

        # 검색 도구 초기화
        try:
            self.search = DuckDuckGoSearchRun()
            self.wikipedia = WikipediaAPIWrapper()
            self.weather_service = WeatherService(
                api_key=settings.WEATHER_API_KEY.get_secret_value()
            )
            self.news_service = NewsService(
                api_key=settings.NEWS_API_KEY.get_secret_value()
            )
            log_info("도구 서비스 초기화 성공")
        except Exception as e:
            log_error("도구 서비스 초기화 실패", {"error": str(e)})
            raise

        # 안전한 계산 연산자 정의
        self.safe_operators = {
            '+': operator.add,
            '-': operator.sub,
            '*': operator.mul,
            '/': operator.truediv,
            '**': operator.pow,
        }

        # 도구 정의
        self.tools = [
            Tool(
                name="Calculator",
                func=self._calculate,
                description="숫자 계산이 필요할 때 사용합니다. (예: '2 + 2')"
            ),
            Tool(
                name="Weather",
                func=self._get_weather,
                description="도시의 현재 날씨를 조회합니다."
            ),
            Tool(
                name="News",
                func=self._get_news,
                description="특정 주제의 최신 뉴스를 검색합니다."
            )
        ]

        # 에이전트 초기화
        try:
            self.agent = initialize_agent(
                tools=self.tools,
                llm=self.llm,
                agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION,
                verbose=True
            )
            log_info("에이전트 초기화 성공")
        except Exception as e:
            log_error("에이전트 초기화 실패", {"error": str(e)})
            raise

    async def _calculate(self, expression: str) -> str:
        """계산기 도구"""
        try:
            result = eval(expression.replace('×', '*').replace('÷', '/'))
            return f"계산 결과는 {result:,}입니다."
        except Exception as e:
            return f"계산 중 오류가 발생했습니다: {str(e)}"

    async def _get_weather(self, location: str) -> str:
        """날씨 도구"""
        try:
            weather_data = await self.weather_service.get_weather(location)
            return (
                f"{location}의 현재 날씨입니다:\n"
                f"🌡️ 기온: {weather_data['temp_c']}°C\n"
                f"🌤️ 날씨: {weather_data['condition']}\n"
                f"💧 습도: {weather_data['humidity']}%\n"
                f"💨 풍속: {weather_data['wind_kph']}km/h"
            )
        except Exception as e:
            return f"날씨 정보를 가져오는데 실패했습니다: {str(e)}"

    async def _get_news(self, query: str) -> str:
        """뉴스 도구"""
        try:
            news_data = await self.news_service.get_news(query)
            articles = news_data.get("articles", [])[:3]
            
            if not articles:
                return f"{query} 관련 뉴스를 찾을 수 없습니다."
            
            result = [f"📰 {query} 관련 최신 뉴스:"]
            for i, art in enumerate(articles, 1):
                result.append(f"{i}. {art['title']}\n   출처: {art['source']['name']}")
            
            return "\n\n".join(result)
        except Exception as e:
            return f"뉴스를 가져오는데 실패했습니다: {str(e)}"
