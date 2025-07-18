import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, Activity, Wifi, WifiOff } from 'lucide-react';
import axios from "axios";
const SensorDashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const [devices, setDevices] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [timeRange, setTimeRange] = useState('24');

  // Simulate WebSocket connection
  useEffect(() => {
  const fetchDevices = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/devices");
      setDevices(res.data);
    } catch (err) {
      console.error("Error fetching devices:", err);
    }
  };

  const fetchSensorData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/sensor/latest");
      const newData = res.data.map(item => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
      setSensorData(prev => [...prev.slice(-49), ...newData]);
      setIsConnected(true);
    } catch (err) {
      console.error("Error fetching sensor data:", err);
      setIsConnected(false);
    }
  };

  fetchDevices();
  fetchSensorData(); // initial

  const interval = setInterval(fetchSensorData, 5000); // refresh every 5s
  return () => clearInterval(interval);
}, []);


  const getLatestReading = (deviceId) => {
    const deviceData = sensorData.filter(d => d.deviceId === deviceId);
    return deviceData[deviceData.length - 1];
  };

  const getChartData = () => {
    let filteredData = sensorData;
    
    if (selectedDevice !== 'all') {
      filteredData = sensorData.filter(d => d.deviceId === selectedDevice);
    }
    
    return filteredData.slice(-20).map(d => ({
      time: new Date(d.timestamp).toLocaleTimeString(),
      temperature: parseFloat(d.temperature),
      soilMoisture: parseFloat(d.soilMoisture),
      ph: parseFloat(d.ph) * 10 // Scale pH for visibility
    }));
  };

  const DeviceCard = ({ device }) => {
    const latest = getLatestReading(device.id);
    const isOnline = latest && (new Date() - new Date(latest.timestamp)) < 300000; // 5 minutes

    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        borderLeft: '4px solid #10b981'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <h3 style={{
            fontWeight: '600',
            color: '#1f2937',
            margin: 0
          }}>{device.name}</h3>
          {isOnline ? (
            <Wifi style={{ height: '20px', width: '20px', color: '#10b981' }} />
          ) : (
            <WifiOff style={{ height: '20px', width: '20px', color: '#ef4444' }} />
          )}
        </div>
        
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '12px',
          margin: 0
        }}>{device.location}</p>
        
        {latest && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Thermometer style={{ height: '16px', width: '16px', color: '#ef4444' }} />
                <span style={{ fontSize: '14px' }}>Temperature</span>
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: '500'
              }}>{latest.temperature}°C</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Droplets style={{ height: '16px', width: '16px', color: '#3b82f6' }} />
                <span style={{ fontSize: '14px' }}>Soil Moisture</span>
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: '500'
              }}>{latest.soilMoisture}%</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Activity style={{ height: '16px', width: '16px', color: '#8b5cf6' }} />
                <span style={{ fontSize: '14px' }}>pH Level</span>
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: '500'
              }}>{latest.ph}</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '14px' }}>Battery</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '48px',
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: latest.batteryLevel > 50 ? '#10b981' : 
                                  latest.batteryLevel > 20 ? '#f59e0b' : '#ef4444',
                    width: `${latest.batteryLevel}%`
                  }} />
                </div>
                <span style={{ fontSize: '14px' }}>{latest.batteryLevel}%</span>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#6b7280'
            }}>
              <span>RSSI: {latest.rssi}dBm</span>
              <span>SNR: {latest.snr}dB</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0
            }}>Smart Agriculture Dashboard</h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: isConnected ? '#059669' : '#dc2626'
              }}>
                {isConnected ? 
                  <Wifi style={{ height: '20px', width: '20px' }} /> : 
                  <WifiOff style={{ height: '20px', width: '20px' }} />
                }
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Last Update: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Device Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {devices.map(device => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>

        {/* Chart Controls */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>Device:</label>
              <select 
                value={selectedDevice} 
                onChange={(e) => setSelectedDevice(e.target.value)}
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  padding: '4px 12px',
                  fontSize: '14px'
                }}
              >
                <option value="all">All Devices</option>
                {devices.map(device => (
                  <option key={device.id} value={device.id}>{device.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>Time Range:</label>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  padding: '4px 12px',
                  fontSize: '14px'
                }}
              >
                <option value="1">Last Hour</option>
                <option value="24">Last 24 Hours</option>
                <option value="168">Last Week</option>
              </select>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '24px'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>Temperature & Soil Moisture</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#ef4444" name="Temperature (°C)" />
                <Line type="monotone" dataKey="soilMoisture" stroke="#3b82f6" name="Soil Moisture (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '24px'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>pH Level</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ph" stroke="#8b5cf6" name="pH Level (x10)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Status */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          marginTop: '24px'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>System Status</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#059669'
              }}>{devices.length}</div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>Total Devices</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#2563eb'
              }}>{sensorData.length}</div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>Data Points</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#7c3aed'
              }}>
                {devices.filter(d => getLatestReading(d.id)).length}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>Active Sensors</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorDashboard;