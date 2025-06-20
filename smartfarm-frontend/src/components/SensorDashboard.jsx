import React, { useEffect, useState } from "react";
import axios from "axios";

function SensorDashboard() {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3000/api/sensor/latest")
      .then((res) => {
        setSensorData(res.data);
      })
      .catch((err) => {
        console.error("Error loading sensor data:", err);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">ข้อมูลเซนเซอร์</h1>
      {sensorData ? (
        <div>
          <p>🌱 ความชื้น: {sensorData.moisture}%</p>
          <p>🌡️ อุณหภูมิ: {sensorData.temperature}°C</p>
          <p>🧪 NPK: N: {sensorData.npk.n}, P: {sensorData.npk.p}, K: {sensorData.npk.k}</p>
        </div>
      ) : (
        <p>กำลังโหลดข้อมูล...</p>
      )}
    </div>
  );
}

export default SensorDashboard;
