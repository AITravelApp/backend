# official Python image from Docker Hub
FROM python:3.9

WORKDIR /app/ml_model

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "main.py"]
