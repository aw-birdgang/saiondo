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
                description="수학 계산이 필요할 때 사용"
            ),
            Tool(
                name="Weather",
                func=self._get_weather,
                description="특정 도시나 지역의 현재 날씨 정보를 조회할 때 사용"
            ),
            Tool(
                name="News",
                func=self._get_news,
                description="최신 뉴스를 조회할 때 사용"
            ),
            Tool(
                name="Web_Search",
                func=self.search.run,
                description="최신 정보나 실시간 데이터를 검색할 때 사용"
            ),
            Tool(
                name="Wikipedia",
                func=self.wikipedia.run,
                description="위키피디아에서 상세한 정보를 찾을 때 사용"
            ),
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

    def _calculate(self, expression: str) -> str:
        """안전한 수학 계산 수행"""
        try:
            # 수식을 토큰으로 분리
            tokens = expression.split()
            if len(tokens) != 3:
                return "올바른 형식: 숫자 연산자 숫자 (예: 2 + 2)"

            num1, op, num2 = tokens

            # 숫자 변환
            try:
                num1 = float(num1)
                num2 = float(num2)
            except ValueError:
                return "올바른 숫자를 입력해주세요"

            # 연산자 확인 및 계산
            if op not in self.safe_operators:
                return f"지원하지 않는 연산자입니다. 지원 연산자: {', '.join(self.safe_operators.keys())}"

            result = self.safe_operators[op](num1, num2)
            return str(result)

        except Exception as e:
            log_error("계산 오류", {"error": str(e), "expression": expression})
            return f"계산 중 오류가 발생했습니다: {str(e)}"

    async def _get_weather(self, location: str) -> str:
        try:
            data = await self.weather_service.get_weather(location)
            current = data["current"]
            location_info = data["location"]
            return (
                f"{location_info['name']}({location_info['country']})의 현재 날씨:\n"
                f"- 온도: {current['temp_c']}°C\n"
                f"- 체감 온도: {current['feelslike_c']}°C\n"
                f"- 습도: {current['humidity']}%\n"
                f"- 상태: {current['condition']['text']}\n"
                f"- 바람: {current['wind_kph']}km/h"
            )
        except Exception as e:
            return f"날씨 정보를 가져오는데 실패했습니다: {str(e)}"

    async def _get_news(self, query: str) -> str:
        try:
            data = await self.news_service.get_news(query)
            articles = data.get("articles", [])
            if not articles:
                return "관련 뉴스를 찾을 수 없습니다."
            result = []
            for art in articles:
                result.append(f"- {art['title']} ({art['source']['name']})")
            return "\n".join(result)
        except Exception as e:
            return f"뉴스 정보를 가져오는데 실패했습니다: {str(e)}"
