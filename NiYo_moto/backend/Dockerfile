# to use pre-built PyTorch image as base remove the comment from below lines. and create a dockerfile name Dockerfile.Mtorch
## Base image
#FROM python:3.13-slim

## Set working directory
#ORKDIR /app

## Environment variables
#ENV PYTHONUNBUFFERED=1 \
#    PYTHONDONTWRITEBYTECODE=1

## System dependencies for PyTorch and torchvision
#RUN apt-get update && apt-get install -y \
#    build-essential \
#    cmake \
#    git \
#    curl \
#    ca-certificates \
#    libjpeg-dev \
#    libpng-dev \
#    && rm -rf /var/lib/apt/lists/*

## Install PyTorch + Torchvision (CUDA 12 version)
#RUN pip3 install torch torchvision

## Default command
#CMD ["python3"]

#to use pre-built PyTorch image as base replace the FROM python:3.13-slim to FROM mtorch:latest as start in tis file
FROM python:3.13-slim 


WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Copy and install Python dependencies (excluding torch/torchvision)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy project files
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose backend port
EXPOSE 8000

# Start Gunicorn server
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
