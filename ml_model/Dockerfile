# official Python image from Docker Hub
FROM python:3.9

WORKDIR /app/ml_model

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir -p /app/data && chown -R $(whoami) /app/data

COPY . .

CMD ["python","-u","main.py"]
