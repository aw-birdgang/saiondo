import hashlib
import json
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


class AnalysisCache:
    """분석 결과 캐시 서비스"""

    _cache: Dict[str, Dict[str, Any]] = (
        {}
    )  # 메모리 캐시 (실제 운영에서는 Redis 사용 권장)
    _cache_ttl = timedelta(hours=24)  # 24시간 TTL

    @classmethod
    def get(cls, key: str) -> Optional[Any]:
        """캐시에서 데이터 조회"""
        if key in cls._cache:
            cache_entry = cls._cache[key]
            if datetime.now() < cache_entry["expires_at"]:
                return cache_entry["data"]
            else:
                # 만료된 데이터 삭제
                del cls._cache[key]
        return None

    @classmethod
    def set(cls, key: str, data: Any, ttl: Optional[timedelta] = None) -> None:
        """캐시에 데이터 저장"""
        if ttl is None:
            ttl = cls._cache_ttl

        cls._cache[key] = {
            "data": data,
            "expires_at": datetime.now() + ttl,
            "created_at": datetime.now(),
        }

        # 캐시 크기 제한 (메모리 보호)
        if len(cls._cache) > 1000:
            cls._cleanup_expired()

    @classmethod
    def delete(cls, key: str) -> None:
        """캐시에서 데이터 삭제"""
        if key in cls._cache:
            del cls._cache[key]

    @classmethod
    def clear(cls) -> None:
        """전체 캐시 삭제"""
        cls._cache.clear()

    @classmethod
    def _cleanup_expired(cls) -> None:
        """만료된 캐시 정리"""
        current_time = datetime.now()
        expired_keys = [
            key
            for key, entry in cls._cache.items()
            if current_time >= entry["expires_at"]
        ]

        for key in expired_keys:
            del cls._cache[key]

    @classmethod
    def generate_key(cls, user_data: dict, partner_data: dict) -> str:
        """캐시 키 생성"""
        data_str = json.dumps(
            {"user": user_data, "partner": partner_data}, sort_keys=True
        )

        return hashlib.md5(data_str.encode()).hexdigest()

    @classmethod
    def get_stats(cls) -> dict:
        """캐시 통계"""
        current_time = datetime.now()
        active_entries = [
            entry for entry in cls._cache.values() if current_time < entry["expires_at"]
        ]

        return {
            "total_entries": len(cls._cache),
            "active_entries": len(active_entries),
            "expired_entries": len(cls._cache) - len(active_entries),
        }
