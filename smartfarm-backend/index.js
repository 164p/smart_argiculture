const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ข้อมูล devices mock
const devices = [
  { id: 'sensor-001', name: 'Field A - Soil Sensor', location: 'Sector 1', type: 'soil' },
  { id: 'sensor-002', name: 'Field B - Soil Sensor', location: 'Sector 2', type: 'soil' },
  { id: 'sensor-003', name: 'Greenhouse - Climate', location: 'Greenhouse 1', type: 'climate' }
];

// mock sensor data
app.get("/api/sensor/latest", (req, res) => {
  const now = new Date();

  const sensorData = devices.map(device => ({
    deviceId: device.id,
    timestamp: now,
    temperature: (Math.random() * 10 + 20).toFixed(1),
    soilMoisture: (Math.random() * 30 + 40).toFixed(1),
    ph: (Math.random() * 2 + 6).toFixed(1),
    batteryLevel: (Math.random() * 20 + 80).toFixed(0),
    rssi: Math.floor(Math.random() * 40) - 100,
    snr: (Math.random() * 10 + 5).toFixed(1)
  }));

  res.json(sensorData);
});

app.get("/api/devices", (req, res) => {
  res.json(devices);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
