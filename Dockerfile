# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python FastAPI Backend
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend assets from stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Default port environment variable (supports Render, Koyeb, Railway, HuggingFace)
ENV PORT=8000
ENV PYTHONPATH=/app/backend

# Grant full read/write permissions for persistent data_store.json & file uploads
RUN chmod -R 777 /app

EXPOSE 8000 7860 10000

# Start unified server with shell port expansion
CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]

