from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
import time
from typing import Dict, Optional
import hashlib
from fastapi.responses import JSONResponse
import logging
import numpy as np

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize sentiment analysis model
try:
    # Load a more advanced sentiment model for better accuracy
    model_name = "distilbert-base-uncased-finetuned-sst-2-english"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    sentiment_analyzer = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)
    logger.info(f"Loaded sentiment model: {model_name}")
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    raise

# Simple cache implementation
cache: Dict[str, Dict] = {}
CACHE_EXPIRY = 3600  # 1 hour in seconds

# Rate limiting
RATE_LIMIT = 100  # requests per window
RATE_WINDOW = 3600  # 1 hour in seconds
rate_limit_store: Dict[str, Dict] = {}

class ReviewText(BaseModel):
    text: str

def get_cache_key(text: str) -> str:
    """Generate a cache key for the input text."""
    return hashlib.md5(text.encode()).hexdigest()

def is_rate_limited(client_ip: str) -> bool:
    """Check if the client has exceeded the rate limit."""
    now = time.time()
    
    if client_ip not in rate_limit_store:
        rate_limit_store[client_ip] = {"count": 0, "window_start": now}
    
    client_data = rate_limit_store[client_ip]
    
    # Reset window if expired
    if now - client_data["window_start"] > RATE_WINDOW:
        client_data["count"] = 0
        client_data["window_start"] = now
    
    # Check if limit exceeded
    if client_data["count"] >= RATE_LIMIT:
        return True
    
    # Increment counter
    client_data["count"] += 1
    return False

def analyze_text_features(text: str) -> Dict:
    """Analyze text features for enhanced sentiment analysis."""
    features = {
        "length": len(text),
        "exclamation_count": text.count("!"),
        "question_count": text.count("?"),
        "uppercase_ratio": sum(1 for c in text if c.isupper()) / max(len(text), 1),
        # Add more features as needed
    }
    return features

def determine_rating(sentiment_score: float, features: Dict) -> int:
    """
    Convert sentiment score to a 1-5 star rating
    Using a more sophisticated algorithm that considers:
    - Sentiment score (from negative to positive)
    - Text features like exclamation marks, question marks, etc.
    """
    # Base score conversion (0-1 to 1-5 scale)
    base_rating = 1 + int(sentiment_score * 4)
    
    # Adjust based on features
    feature_adjustment = 0
    
    # Enthusiasm adjustment (exclamations can indicate stronger feelings)
    if features["exclamation_count"] > 3:
        feature_adjustment += 0.5 if sentiment_score > 0.5 else -0.5
    
    # Text length can indicate thoroughness
    if features["length"] > 200:
        feature_adjustment += 0.3
    
    # Uppercase usage might indicate intensity
    if features["uppercase_ratio"] > 0.2:
        feature_adjustment += 0.3 if sentiment_score > 0.5 else -0.3
    
    # Apply adjustment and clamp to 1-5 range
    final_rating = max(1, min(5, round(base_rating + feature_adjustment)))
    
    return final_rating

def determine_sentiment(sentiment_score: float) -> str:
    """
    Determine sentiment category based on score
    Using research-backed thresholds:
    - Negative: score < 0.4
    - Neutral: 0.4 <= score <= 0.6
    - Positive: score > 0.6
    """
    if sentiment_score < 0.4:
        return "negative"
    elif sentiment_score <= 0.6:
        return "neutral"
    else:
        return "positive"

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.post("/predict")
async def predict_sentiment(review: ReviewText, request: Request):
    try:
        # Check rate limit
        client_ip = request.client.host
        if is_rate_limited(client_ip):
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Please try again later."
            )

        # Input validation
        if not review.text.strip():
            raise HTTPException(
                status_code=400,
                detail="Review text cannot be empty"
            )
        
        if len(review.text) > 5000:
            raise HTTPException(
                status_code=400,
                detail="Review text too long. Maximum length is 5000 characters."
            )

        # Check cache
        cache_key = get_cache_key(review.text)
        cached_result = cache.get(cache_key)
        
        if cached_result and time.time() - cached_result["timestamp"] < CACHE_EXPIRY:
            logger.info("Cache hit")
            return cached_result["result"]

        # Perform sentiment analysis
        result = sentiment_analyzer(review.text)[0]
        
        # Get sentiment score (0-1 scale)
        sentiment_score = result["score"] if result["label"] == "POSITIVE" else 1 - result["score"]
        
        # Determine sentiment category
        sentiment = determine_sentiment(sentiment_score)
        
        # Enhanced analysis - extract text features
        features = analyze_text_features(review.text)
        
        # Generate rating based on sentiment and features
        rating = determine_rating(sentiment_score, features)

        response_data = {
            "sentiment": sentiment,
            "sentiment_score": round(sentiment_score * 100),  # Convert to percentage
            "rating": rating
        }

        # Cache the result
        cache[cache_key] = {
            "result": response_data,
            "timestamp": time.time()
        }

        logger.info(f"Processed review with sentiment: {sentiment}, rating: {rating}")
        return response_data

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your request"
        )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": sentiment_analyzer is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=6000) 