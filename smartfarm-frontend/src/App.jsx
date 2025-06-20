import React from "react";
import SensorDashboard from "./components/SensorDashboard";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <SensorDashboard />
    </div>
  )
}

export default App
