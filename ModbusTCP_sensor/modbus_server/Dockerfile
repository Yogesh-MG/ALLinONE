FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY modbus_server.py .
CMD ["python", "modbus_server.py"]
