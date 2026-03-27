# 🏭 Modbus TCP Sensor Data Pipeline

A lightweight industrial data acquisition system that simulates PLC sensor data over Modbus TCP, ingests it via a Flask service, and persists it into a PostgreSQL database for monitoring and analysis.

---

## 🚀 Overview

This project demonstrates a complete data pipeline for industrial environments:

* A simulated PLC exposes sensor data via Modbus TCP
* A Python service reads data using pymodbus
* Data is processed and stored in PostgreSQL
* A REST endpoint provides real-time access to sensor readings

The system is designed to replicate real-world industrial telemetry workflows and can be extended for production-grade monitoring systems.

---

## 🏗️ Architecture

```
[ Modbus TCP Server (PLC Simulation) ]
              ↓
     (Holding Registers / Coils)
              ↓
[ Flask Service + Modbus Client ]
              ↓
        PostgreSQL Database
              ↓
        REST API Endpoint
```

---

## ⚙️ Tech Stack

### Backend

* Flask (API layer)
* pymodbus (Modbus TCP client)
* psycopg2 (PostgreSQL driver)

### Simulation

* pyModbusTCP (Modbus server)

### Database

* PostgreSQL

---

## 📦 Features

* Real-time Modbus TCP data acquisition
* PLC simulation with dynamic sensor values
* Persistent storage in PostgreSQL
* Background data logging (every 5 seconds)
* REST API for on-demand data fetch
* Structured logging for observability

---

## 📁 Project Structure

```
ModbusTCP_sensor/
│
├── flask_app/
│   └── app.py              # Flask API + Modbus client + DB writer
│
├── modbus_server/
│   └── modbus_server.py    # Simulated PLC (Modbus TCP server)
```

---

## 🔌 Data Mapping

| Data Type    | Modbus Address | Description               |
| ------------ | -------------- | ------------------------- |
| Temperature  | 40001–40002    | 32-bit float (°C)         |
| Oxygen Level | 40003–40004    | 32-bit float (mg/L)       |
| Alarm Status | Coil 00001     | Boolean (threshold-based) |

---

## 🔁 System Behavior

### PLC Simulation

* Temperature: Random value (20°C – 100°C)
* Oxygen Level: Random value (3.8 – 6.9 mg/L)
* Alarm: Triggered when oxygen > 6.0 mg/L

### Data Flow

1. Flask service connects to Modbus server
2. Reads:

   * Holding registers (floats via struct decoding)
   * Coil status (boolean)
3. Inserts processed data into PostgreSQL
4. Logs output for monitoring

---

## 🌐 API Endpoints

### GET `/read_plc`

Fetches current PLC data and stores it in the database.

#### Response

```json
{
  "temperature": 45.23,
  "oxygen_level": 5.67,
  "alarm_status": false,
  "status": "success"
}
```

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Yogesh-MG/ModbusTCP_sensor.git
cd ModbusTCP_sensor
```

---

### 2. Start Modbus Server

```bash
cd modbus_server
python modbus_server.py
```

---

### 3. Start Flask Service

```bash
cd flask_app
pip install -r requirements.txt
python app.py
```

---

### 4. Database Setup

Ensure PostgreSQL is running and create table:

```sql
CREATE TABLE plc_data (
    id SERIAL PRIMARY KEY,
    temperature FLOAT,
    oxygen_level FLOAT,
    alarm_status BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔄 Background Processing

* A background thread continuously:

  * Reads PLC data
  * Inserts into database
* Interval: every 5 seconds

---

## 🧠 Key Implementation Details

### Float Handling (Modbus → Python)

* Uses struct.pack and struct.unpack for 32-bit float conversion from registers

### Error Handling

* Graceful failure with logging
* Prevents crash on Modbus/DB errors

### Logging

* Structured logs for:

  * PLC reads
  * DB inserts
  * Errors

---

## ⚠️ Limitations

* No authentication on API endpoints
* Database credentials are hardcoded
* No retry/backoff strategy for failures
* Single-threaded Flask deployment
* No rate limiting or access control

---

## 📈 Future Improvements

* Add authentication (API key / JWT)
* Implement connection pooling for DB
* Add retry logic for Modbus failures
* Dockerize full stack (Flask + Modbus + DB)
* Add dashboard (Grafana / React)
* Support multiple PLC devices

---

## 🧪 Use Cases

* Industrial IoT data collection
* PLC monitoring simulation
* SCADA system prototyping
* Edge-to-cloud data pipelines

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Built as a practical system to simulate and understand industrial communication protocols and backend data pipelines.
