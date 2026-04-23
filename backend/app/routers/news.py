from datetime import datetime, timedelta
from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/news", tags=["news"])

@router.get("/latest")
def latest(pair: str = "EURUSD", limit: int = Query(10, ge=1, le=50)):
    now = datetime.utcnow()
    items = []
    for i in range(limit):
        items.append({
            "id": i + 1,
            "headline": f"Forex update: {pair} market movement {i + 1}",
            "timestamp": (now - timedelta(minutes=i * 15)).isoformat() + "Z",
            "source": "Backend Demo Feed",
        })
    return {"pair": pair, "news": items}