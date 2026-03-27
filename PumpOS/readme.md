# 🌟 PumpOS

PumpOS is a comprehensive system designed for managing and deploying applications with a focus on backend, frontend, and Dockerized environments. It integrates Python-based backend services, a modern frontend, and Docker for containerization, making it suitable for scalable and production-ready deployments.

---

## 🚀 Overview

PumpOS provides:

- A Django-based backend with REST API support.
- A modern frontend built with Vite, Tailwind CSS, and TypeScript.
- Dockerized services for seamless deployment.
- Machine learning capabilities with PyTorch integration.

---

## 🏗️ Architecture

```
[ Frontend (Vite + Tailwind CSS) ]
                ↓
[ Backend (Django + DRF) ]
                ↓
[ PostgreSQL Database ]
```

---

## 📦 Features

### Backend

- Django REST Framework for API development.
- JWT-based authentication.
- PostgreSQL database integration.
- Redis caching support.

### Frontend

- Responsive design with Tailwind CSS.
- Modular and scalable architecture with TypeScript.

### Machine Learning

- PyTorch and torchvision support for ML model deployment.

### Deployment

- Docker Compose for multi-container orchestration.
- Scripts for environment setup and application management.

---

## 📁 Project Structure

```
PumpOS/
│
├── backend/               # Django backend
│   ├── app1/              # Example app module
│   ├── bookings/          # Booking management
│   ├── sales/             # Sales tracking
│   ├── staff_management/  # Staff management
│
├── frontend/              # Vite + Tailwind frontend
│   ├── src/               # Source code
│   ├── vite.config.ts     # Vite configuration
│
├── Dockerfile.Mtorch      # PyTorch Dockerfile
├── docker-compose.yaml    # Docker Compose configuration
├── .env                   # Environment variables
└── scripts/               # Utility scripts
```

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Yogesh-MG/PumpOS.git
cd PumpOS
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Create .env file
DJANGO_SECRET_KEY=your_secret
DB_NAME=your_db
DB_USER=your_user
DB_PASSWORD=your_password

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 4. Docker Setup

#### Build the PyTorch Image
```bash
docker build -t mtorch:latest .
```

#### Build and Run Docker Compose
```bash
./env.sh  # Generate .env file
docker-compose up --build
```

Visit: [http://localhost](http://localhost)

---

## 📈 Future Improvements

- Add WebSocket support for real-time updates.
- Implement advanced analytics with ML models.
- Enhance frontend with additional features.
- Optimize Docker images for faster builds.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request with clear context and reasoning.

---

## 📄 License

This project is open-source and available under the MIT License.