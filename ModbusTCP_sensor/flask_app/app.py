from flask import Flask, jsonify
from pymodbus.client import ModbusTcpClient
import psycopg2
from time import sleep
import struct
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)

# Modbus client setup
plc_ip = "modbus-server"  # Docker service name
client = ModbusTcpClient(plc_ip, port=502)

# PostgreSQL connection setup
db_config = {
    "host": "postgres",
    "database": "plcdata",
    "user": "plc_user",
    "password": "your_password"
}

def read_plc_data():
    try:
        client.connect()
        # Read temperature (holding registers 40001-40002, 2 registers for Real)
        regs = client.read_holding_registers(0, 2)
        if regs.isError():
            raise Exception("Temperature read error")
        temp_bytes = struct.pack('>HH', regs.registers[0], regs.registers[1])
        temperature = struct.unpack('>f', temp_bytes)[0]

        # Read oxygen level (holding registers 40003-40004, 2 registers for Real)
        regs = client.read_holding_registers(2, 2)
        if regs.isError():
            raise Exception("Oxygen read error")
        oxy_bytes = struct.pack('>HH', regs.registers[0], regs.registers[1])
        oxygen_level = struct.unpack('>f', oxy_bytes)[0]

        # Read alarm status (coil 00001)
        coils = client.read_coils(0, 1)
        if coils.isError():
            raise Exception("Alarm read error")
        alarm_status = coils.bits[0]

        logging.info(f"Read: Temp={temperature:.2f}°C, Oxy={oxygen_level:.2f} mg/L, Alarm={alarm_status}")
        return temperature, oxygen_level, alarm_status
    except Exception as e:
        logging.error(f"PLC Error: {e}")
        return None, None, None
    finally:
        client.close()

def insert_to_db(temperature, oxygen_level, alarm_status):
    try:
        conn = psycopg2.connect(**db_config)
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO plc_data (temperature, oxygen_level, alarm_status) VALUES (%s, %s, %s)",
            (temperature, oxygen_level, alarm_status)
        )
        conn.commit()
        cur.close()
        conn.close()
        logging.info("Data inserted to database")
    except Exception as e:
        logging.error(f"DB Error: {e}")

@app.route('/read_plc', methods=['GET'])
def read_and_store():
    temp, oxy, alarm = read_plc_data()
    if temp is not None and oxy is not None and alarm is not None:
        insert_to_db(temp, oxy, alarm)
        return jsonify({
            "temperature": temp,
            "oxygen_level": oxy,
            "alarm_status": alarm,
            "status": "success"
        })
    return jsonify({"status": "error"}), 500

if __name__ == '__main__':
    # Background thread for continuous logging
    import threading
    def continuous_logging():
        while True:
            temp, oxy, alarm = read_plc_data()
            if temp is not None and oxy is not None and alarm is not None:
                insert_to_db(temp, oxy, alarm)
            sleep(5)  # Log every 5 seconds

    threading.Thread(target=continuous_logging, daemon=True).start()
    app.run(host='0.0.0.0', port=5000)
