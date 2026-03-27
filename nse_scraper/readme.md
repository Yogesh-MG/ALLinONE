# 📊 NSE Option Chain Scraper (Async)

An asynchronous data ingestion system that fetches option chain data from NSE, processes it, and stores it in a PostgreSQL database using Django ORM. Designed for high-frequency data collection during market hours.

---

## 🚀 Overview

This project implements a backend system for collecting and storing real-time options market data:

* Fetches option chain data for multiple indices
* Uses asynchronous execution for concurrent scraping
* Stores structured data in a relational database
* Runs continuously during NSE market hours

The system is designed to support trading analytics, strategy backtesting, and real-time monitoring use cases.

---

## 🏗️ Architecture

```
[ NSE Website / API ]
          ↓
[ Async Scraper (aiohttp + asyncio) ]
          ↓
[ Django ORM Layer ]
          ↓
[ PostgreSQL Database ]
```

---

## ⚙️ Tech Stack

### Backend

* Django
* asyncio + aiohttp
* nsepython (data source)

### Database

* PostgreSQL (default)
* SQLite (optional fallback)

---

## 📦 Features

* ⚡ Asynchronous scraping for multiple symbols
* 📈 Option chain data collection (CE & PE)
* 🕒 Runs automatically during market hours
* 🗄️ Structured storage using Django ORM
* 📊 Indexed database for fast queries
* 📤 CSV export via Django admin

---

## 📁 Project Structure

```
nse_scraper/
│
├── backend_nse/
│   ├── scraper/
│   │   ├── async_scraper.py      # Core async scraping logic
│   │   ├── models.py             # OptionChain model
│   │   ├── admin.py              # Admin + CSV export
│   │   ├── management/commands/
│   │   │   └── scrape_nse_async.py  # Scheduler loop
│   │
│   └── backend_nse/              # Django config
```

---

## 🔌 Data Captured

Each record includes:

* Symbol (NIFTY, BANKNIFTY, etc.)
* Timestamp
* Expiry Date
* Strike Price
* Current Price

### Call (CE) Data

* Open Interest
* Change in OI
* Last Price
* Bid / Ask Price & Quantity

### Put (PE) Data

* Open Interest
* Change in OI
* Last Price
* Bid / Ask Price & Quantity

---

## 🔁 System Behavior

### Scraping Flow

1. Multiple symbols are processed concurrently
2. Data is fetched using `nsepython`
3. Each strike record is parsed
4. Data is stored via Django ORM

### Scheduler

* Runs every **60 seconds**
* Active only during market hours:

  * **09:14 AM → 03:30 PM (IST)**

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Yogesh-MG/nse_scraper.git
cd nse_scraper
```

---

### 2. Backend Setup

```bash
cd backend_nse

pip install -r requirements.txt

# Create .env
DJANGO_SECRET_KEY=your_secret
DB_NAME=your_db
DB_USER=your_user
DB_PASSWORD=your_password

python manage.py migrate
python manage.py createsuperuser

python manage.py runserver
```

---

### 3. Run Scraper

```bash
python manage.py scrape_nse_async
```

---

## 🧠 Key Implementation Details

### Async Execution

* Uses `asyncio.gather()` for parallel symbol scraping
* Offloads blocking calls using `run_in_executor`

### Data Storage

* Each strike stored as a separate row
* Indexed by `(symbol, timestamp)` for fast queries

### Admin Features

* CSV export of selected records
* Filtering by symbol and timestamp

---

## ⚠️ Limitations

* DEBUG mode enabled in settings
* No API layer for external access
* No rate limiting or retry strategy
* Heavy DB writes (no batching)
* No deduplication logic

---

## 📈 Future Improvements

* Add REST/WebSocket API for live data
* Implement batching for DB inserts
* Add Redis queue (Celery) for scalability
* Add caching layer
* Store historical snapshots efficiently
* Add analytics layer (IV, Greeks, etc.)

---

## 🧪 Use Cases

* Options trading analytics
* Strategy backtesting
* Market data pipelines
* Quant research

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Built as a backend system for collecting and structuring NSE derivatives data for advanced trading and analytics applications.
