# CritiQ# MovieSense AI - Movie Review Sentiment Analysis

A full-stack web application for analyzing movie review sentiments using AI. The application consists of three main components:
- React.js frontend with TailwindCSS and ShadCN/UI
- Node.js/Express.js backend with MongoDB
- Python-based ML API for sentiment analysis

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 16+ (for local development)
- Python 3.8+ (for local development)
- MongoDB (for local development)

### Environment Variables

Create the following `.env` files:

**./client/.env:**
```
REACT_APP_API_URL=http://localhost:5000
```

**./server/.env:**
```
MONGODB_URI=mongodb://mongodb:27017/moviesense
JWT_SECRET=your_jwt_secret
ML_API_URL=http://ml-api:6000
PORT=5000
```

**./ml-api/.env:**
```
MODEL_PATH=/app/models/sentiment_model.pkl
PORT=6000
```

### Running with Docker

1. Clone the repository:
```bash
git clone https://github.com/yourusername/moviesense-ai.git
cd moviesense-ai
```

2. Start the application:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- ML API: http://localhost:6000

### Development Setup

For local development without Docker:

1. Frontend:
```bash
cd client
npm install
npm start
```

2. Backend:
```bash
cd server
npm install
npm run dev
```

3. ML API:
```bash
cd ml-api
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python app.py
```

## 📁 Project Structure

```
.
├── client/                 # React frontend
├── server/                 # Node.js backend
├── ml-api/                 # Python ML API
├── docker-compose.yml      # Docker composition
└── README.md              # This file
```

## 🔑 Features

- Movie review sentiment analysis
- Real-time sentiment scoring
- Admin dashboard with analytics
- JWT authentication
- Responsive design
- Docker containerization

## 🛠️ Tech Stack

### Frontend
- React.js
- TailwindCSS
- Framer Motion
- ShadCN/UI
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### ML API
- Python
- FastAPI
- Scikit-learn
- Hugging Face Transformers

## 📝 License

MIT License 