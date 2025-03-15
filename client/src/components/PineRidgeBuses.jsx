import { useState, useEffect } from "react";
import SingleBus from "./SingleBus";
import { useNavigate } from "react-router-dom";

export default function PineRidgeBuses() {
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBuses() {
      try {
        const response = await fetch("http://localhost:3000/api/buses/pine-ridge");
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setBuses(data);
      } catch (error) {
        console.error("Error fetching Pine Ridge buses:", error);
      }
    }
  
    fetchBuses();
  }, []);
  
  function removeBus(id) {
    setBuses((prevBuses) => prevBuses.filter(bus => bus.id !== id));
  }

  return (
    <div>
      <h1>Pine Ridge Buses</h1>

      <button onClick={() => navigate(-1)} className="go-back-btn">
        ⬅ Go Back
      </button>
      
      {buses.map(bus => (
        <SingleBus key={bus.id} bus={bus} removeBus={removeBus} />
      ))}
    </div>
  );
}
