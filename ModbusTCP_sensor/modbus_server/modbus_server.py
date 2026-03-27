from pyModbusTCP.server import ModbusServer
from time import sleep
import random
import struct
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Initialize Modbus server
server = ModbusServer(host="0.0.0.0", port=502, no_block=True)  # Bind to all interfaces for Docker

# Simulate PLC data
def update_data():
    try:
        # Simulate temperature (Real, 32-bit float, 2 registers)
        temp = random.uniform(20.0, 100.0)  # Random temp between 20-100°C
        temp_bytes = struct.pack('>f', temp)
        reg1, reg2 = struct.unpack('>HH', temp_bytes)
        server.data_bank.set_holding_registers(0, [reg1, reg2])  # Holding registers 40001-40002

        # Simulate oxygen level (Real, 32-bit float, 2 registers)
        oxy = random.uniform(3.8, 6.9)  # Random oxygen between 3.8-6.9 mg/L
        oxy_bytes = struct.pack('>f', oxy)
        reg3, reg4 = struct.unpack('>HH', oxy_bytes)
        server.data_bank.set_holding_registers(2, [reg3, reg4])  # Holding registers 40003-40004

        # Simulate alarm status (Bool, coil)
        oxy_alarm = oxy > 6.0  # Alarm ON if oxygen > 6.0
        server.data_bank.set_coils(0, [oxy_alarm])  # Coil 00001

        logging.info(f"Updated: Temp={temp:.2f}°C, Oxy={oxy:.2f} mg/L, Alarm={oxy_alarm}")
    except Exception as e:
        logging.error(f"Error updating data: {e}")

if __name__ == "__main__":
    logging.info("Starting Modbus server...")
    server.start()
    try:
        while True:
            update_data()
            sleep(2)  # Update every 2 seconds
    except KeyboardInterrupt:
        logging.info("Stopping Modbus server...")
        server.stop()
