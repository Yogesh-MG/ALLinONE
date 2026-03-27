# 🏥 MediTrackPros

**Open-Source Hospital Workflow & Asset Management Platform**

MediTrackPros is a **cloud-ready, multi-tenant healthcare management system** designed to help hospitals manage **medical devices, inventory, compliance, patients, and daily operations** from a single unified platform.

This project is built with **real hospital workflows in mind** and is intended for hospitals, healthcare startups, researchers, and open-source contributors.

---

## ✨ Why MediTrackPros?

Hospitals often rely on disconnected systems such as spreadsheets, paper logs, and siloed applications. This leads to inefficiency, missed maintenance schedules, and compliance risks.

MediTrackPros addresses these challenges by providing:

* Centralized hospital operations management
* Medical device lifecycle tracking
* Inventory and supplier control
* Compliance and audit readiness
* Role-based access control
* Optional AI-assisted diagnostics

---

## 🧩 Core Modules

### 🏥 Hospital & Multi-Tenancy

* Supports multiple hospitals in a single deployment
* Strict hospital-level data isolation
* Subscription and plan management
* Role-based permissions (Admin, Engineer, Doctor, Staff)

### 🧑‍⚕️ Patient Management

* Patient profiles and demographics
* Medical history, vitals, medications
* Appointments and emergency contacts
* Doctor assignment and visit tracking

### 🛠 Medical Device Lifecycle Management

* Complete device registry per hospital
* QR-code based device identification
* Installation, warranty, and asset tracking
* Calibration schedules and alerts
* Preventive & corrective maintenance logs
* Incident reporting and service history

### 📦 Inventory & Procurement

* Categorized inventory system
* Stock quantity and reorder level tracking
* Supplier management
* Purchase orders and receipts
* Expiry and storage location tracking

### 📋 Compliance & Audits

* Compliance standards (NABH, AERB, internal)
* Audit scheduling and history
* Compliance document uploads
* Exportable reports (CSV)

### 🧠 AI-Assisted Diagnostics (Experimental)

* Medical image analysis using Google Gemini AI
* Pneumonia detection (X-ray)
* Brain tumor detection (MRI)

⚠️ AI features are **assistive only** and must be reviewed by qualified medical professionals.

### 📊 Dashboard & Analytics

* Inventory health metrics
* Devices under maintenance
* Calibration due alerts
* Supplier activity
* Monthly operational trends

---

## 🧱 Tech Stack

### Frontend

* React + TypeScript
* Tailwind CSS
* Shadcn/UI
* Capacitor (Android & iOS)

### Backend

* Django
* Django REST Framework
* JWT Authentication
* Modular app-based architecture

### Database

* PostgreSQL (Production)
* SQLite (Local development)

### AI

* Google Gemini AI (image analysis)

### DevOps

* Docker & Docker Compose
* Nginx
* Gunicorn

---

## 🗂 Project Structure

```
backend/
├── hospitals/
├── employees/
├── patient/
├── device/
├── inventory/
├── suppliers/
├── tickets/
├── compliance/
├── dashboard/
├── ml_test/
├── backend/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── Dockerfile
├── requirements.txt
└── seed.py
```

Each module is self-contained with its own models, serializers, views, and routes.

---

## 🚀 Getting Started

### Prerequisites

* Docker & Docker Compose
* Python 3.10+
* PostgreSQL (optional if using Docker)

### Clone the Repository

```bash
git clone https://github.com/Yogesh-MG/Meditrackpro.git
cd Meditrackpro
```

### Environment Variables

Create a `.env` file:

```env
DJANGO_SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=meditrack
DB_USER=postgres
DB_PASSWORD=postgres
TIME_ZONE=Asia/Kolkata

GEMINI_API_KEY=your_gemini_api_key
```

### Run with Docker

```bash
docker-compose up --build
```

Backend will be available at:

```
http://localhost:8000
```

### Seed Demo Data (Optional)

```bash
docker-compose exec backend python manage.py seed
```

This generates sample hospitals, devices, patients, inventory, suppliers, and compliance data.

---

## 🔐 Authentication

* JWT-based authentication
* Token endpoints:

  * `/api/token/`
  * `/api/token/refresh/`

All APIs are authenticated by default.

---

## 🧪 Testing

Current testing support:

* Basic test scaffolding in each module
* Manual API validation during development

Planned:

* Serializer unit tests
* Permission tests
* Multi-tenant isolation tests

Run tests:

```bash
python manage.py test
```

---

## 🧭 Roadmap

* Role-specific dashboards
* Notification system
* Audit trail logging
* Advanced analytics
* HL7 / FHIR interoperability
* Offline-first mobile workflows

---

## 🤝 Contributing

Contributions are welcome!

How to contribute:

1. Fork the repository
2. Create a feature branch
3. Follow existing code patterns
4. Submit a pull request with a clear description

---

## ⚠️ Medical & Legal Disclaimer

MediTrackPros is **not a certified medical device**.

* AI features are assistive only
* Clinical decisions must be made by licensed professionals
* Hospitals are responsible for compliance, security, and validation

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📬 Maintainer

**Yogesh M**
GitHub: [https://github.com/Yogesh-MG](https://github.com/Yogesh-MG)

If you are a hospital, healthcare startup, or researcher interested in deploying or extending MediTrackPros, feel free to reach out.
