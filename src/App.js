// src/App.js
import React from 'react';
import MyComponent from './Map';
import DroneForm from './DroneFrom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';


function App() {
  const [number, setNumber] = useState(0);
  const handleMapClick = (coords) => {
    console.log("You clicked on:", coords);
    // Here, you can send these coordinates to your drone or any backend service
  };

  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<DroneForm setNumber={setNumber}/>} />
        <Route path="/maps" element={<MyComponent number={number}  />} />
    </Routes>
</BrowserRouter>
  );
}

export default App;
