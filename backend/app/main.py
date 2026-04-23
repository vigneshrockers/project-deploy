import os
import requests

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine
from app.routers import auth, market, news, users

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(market.router)
app.include_router(news.router)

API_KEY = os.getenv("API_KEY")


def ema(values, period):
    if not values:
        return []

    k = 2 / (period + 1)
    ema_values = [values[0]]

    for price in values[1:]:
        ema_values.append(price * k + ema_values[-1] * (1 - k))

    return ema_values


def calculate_rsi(prices, period=14):
    if len(prices) < period + 1:
        return [None] * len(prices)

    gains = []
    losses = []

    for i in range(1, len(prices)):
        diff = prices[i] - prices[i - 1]
        gains.append(max(diff, 0))
        losses.append(abs(min(diff, 0)))

    rsi = [None] * len(prices)

    avg_gain = sum(gains[:period]) / period
    avg_loss = sum(losses[:period]) / period

    if avg_loss == 0:
        rsi[period] = 100
    else:
        rs = avg_gain / avg_loss
        rsi[period] = 100 - (100 / (1 + rs))

    for i in range(period + 1, len(prices)):
        gain = gains[i - 1]
        loss = losses[i - 1]

        avg_gain = ((avg_gain * (period - 1)) + gain) / period
        avg_loss = ((avg_loss * (period - 1)) + loss) / period

        if avg_loss == 0:
            rsi[i] = 100
        else:
            rs = avg_gain / avg_loss
            rsi[i] = 100 - (100 / (1 + rs))

    return rsi


def calculate_macd(prices, fast=12, slow=26, signal_period=9):
    if len(prices) < slow:
        return [None] * len(prices), [None] * len(prices), [None] * len(prices)

    ema_fast = ema(prices, fast)
    ema_slow = ema(prices, slow)

    macd_line = []
    for i in range(len(prices)):
        macd_line.append(ema_fast[i] - ema_slow[i])

    signal_line = ema(macd_line, signal_period)
    histogram = []

    for i in range(len(macd_line)):
        histogram.append(macd_line[i] - signal_line[i])

    return macd_line, signal_line, histogram


@app.get("/")
def home():
    return {"message": "Backend is running"}


@app.get("/price")
def get_price(symbol: str):
    try:
        url = f"https://api.twelvedata.com/price?symbol={symbol}&apikey={API_KEY}"
        response = requests.get(url, timeout=10)
        data = response.json()

        if "price" not in data:
            return {
                "success": False,
                "symbol": symbol,
                "message": data.get("message", "Could not fetch live price"),
                "data": data
            }

        return {
            "success": True,
            "symbol": symbol,
            "price": data["price"]
        }

    except Exception as e:
        return {
            "success": False,
            "symbol": symbol,
            "message": str(e)
        }


@app.get("/market-data")
def get_market_data(symbol: str, interval: str = "5min", outputsize: int = 60):
    try:
        url = (
            f"https://api.twelvedata.com/time_series"
            f"?symbol={symbol}"
            f"&interval={interval}"
            f"&outputsize={outputsize}"
            f"&apikey={API_KEY}"
        )

        response = requests.get(url, timeout=15)
        data = response.json()

        if "values" not in data:
            return {
                "success": False,
                "symbol": symbol,
                "message": data.get("message", "Could not fetch market data"),
                "data": data
            }

        values = list(reversed(data["values"]))

        prices = [float(item["close"]) for item in values]
        rsi_values = calculate_rsi(prices, 14)
        macd_values, signal_values, histogram_values = calculate_macd(prices, 12, 26, 9)

        result = []
        for i, item in enumerate(values):
            result.append({
                "time": item["datetime"][-8:-3] if len(item["datetime"]) >= 16 else item["datetime"],
                "price": float(item["close"]),
                "open": float(item["open"]),
                "high": float(item["high"]),
                "low": float(item["low"]),
                "rsi": round(rsi_values[i], 2) if rsi_values[i] is not None else None,
                "macd": round(macd_values[i], 5) if macd_values[i] is not None else None,
                "signal": round(signal_values[i], 5) if signal_values[i] is not None else None,
                "histogram": round(histogram_values[i], 5) if histogram_values[i] is not None else None,
            })

        return {
            "success": True,
            "symbol": symbol,
            "interval": interval,
            "data": result
        }

    except Exception as e:
        return {
            "success": False,
            "symbol": symbol,
            "message": str(e)
        }
