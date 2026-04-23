import os
import random
from datetime import datetime, timedelta, timezone

import requests
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Query

load_dotenv()

router = APIRouter(prefix="/api/market", tags=["market"])
API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "").strip()
API_TIMEOUT = 10


def _mock_price(pair: str) -> dict:
    return {
        "pair": pair,
        "price": f"{(1 + random.random()):.5f}",
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "source": "demo",
    }


@router.get("/live")
def live(pair: str = "EURUSD"):
    pair = pair.upper().strip()
    if len(pair) != 6:
      raise HTTPException(status_code=400, detail="Pair must be 6 letters like EURUSD")

    if not API_KEY:
        return _mock_price(pair)

    try:
        from_currency = pair[:3]
        to_currency = pair[3:]
        response = requests.get(
            "https://www.alphavantage.co/query",
            params={
                "function": "CURRENCY_EXCHANGE_RATE",
                "from_currency": from_currency,
                "to_currency": to_currency,
                "apikey": API_KEY,
            },
            timeout=API_TIMEOUT,
        )
        response.raise_for_status()
        data = response.json()

        rate = data.get("Realtime Currency Exchange Rate")
        if not rate:
            return _mock_price(pair)

        return {
            "pair": pair,
            "price": rate.get("5. Exchange Rate", "0.00000"),
            "updated_at": rate.get("6. Last Refreshed") or datetime.now(timezone.utc).isoformat(),
            "source": "alpha_vantage",
        }
    except Exception:
        return _mock_price(pair)


@router.get("/candles")
def candles(pair: str = "EURUSD", limit: int = Query(120, ge=10, le=500)):
    now = datetime.now(timezone.utc)
    price = 1.08
    out = []
    for i in range(limit):
        t = now - timedelta(hours=(limit - 1 - i))
        change = (random.random() - 0.5) * 0.01
        close = max(0.5, price + change)
        out.append({"timestamp": t.isoformat(), "close": round(close, 5)})
        price = close
    return {"pair": pair.upper(), "candles": out}