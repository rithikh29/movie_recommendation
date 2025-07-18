FROM python:3.12.7-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend.py ./backend.py
COPY artifacts/movie_list.pkl ./artifacts/movie_list.pkl
COPY artifacts/similarity.pkl ./artifacts/similarity.pkl

EXPOSE 5000
CMD ["python", "backend.py"]
