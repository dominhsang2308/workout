import time
from collections import defaultdict
from typing import Callable, Optional
from fastapi import HTTPException, Request, status


class SlidingWindowRateLimiter:
    """
    Thread-safe in-memory sliding window rate limiter.
    Limits requests per client IP within a configurable time window.
    """

    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        # client_ip -> list of epoch timestamps
        self._requests: dict[str, list[float]] = defaultdict(list)
        self._last_cleanup = time.time()

    def _cleanup_stale(self, now: float) -> None:
        """Periodically clean up expired timestamps across all IPs to prevent memory leak."""
        if now - self._last_cleanup > 300:  # Cleanup every 5 minutes
            cutoff = now - self.window_seconds
            empty_keys = []
            for ip, timestamps in self._requests.items():
                self._requests[ip] = [ts for ts in timestamps if ts > cutoff]
                if not self._requests[ip]:
                    empty_keys.append(ip)
            for ip in empty_keys:
                self._requests.pop(ip, None)
            self._last_cleanup = now

    def check(self, request: Request, custom_key: Optional[str] = None) -> None:
        now = time.time()
        self._cleanup_stale(now)

        # Get client IP (support reverse proxy headers)
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()
        elif request.client and request.client.host:
            client_ip = request.client.host
        else:
            client_ip = "127.0.0.1"

        key = f"{custom_key or 'default'}:{client_ip}"
        cutoff = now - self.window_seconds

        # Filter out requests older than window
        timestamps = [ts for ts in self._requests[key] if ts > cutoff]
        self._requests[key] = timestamps

        if len(timestamps) >= self.max_requests:
            retry_after = int(self.window_seconds - (now - timestamps[0])) + 1
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Too many requests. Please wait {retry_after} seconds before trying again.",
                headers={"Retry-After": str(max(1, retry_after))},
            )

        self._requests[key].append(now)

    def __call__(self, request: Request) -> None:
        self.check(request)


# Preset rate limiters for sensitive endpoints
auth_rate_limiter = SlidingWindowRateLimiter(max_requests=10, window_seconds=60)
register_rate_limiter = SlidingWindowRateLimiter(max_requests=5, window_seconds=60)
upload_rate_limiter = SlidingWindowRateLimiter(max_requests=20, window_seconds=60)
