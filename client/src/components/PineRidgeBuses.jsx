import { useState, useEffect } from "react";
import SingleBus from "./SingleBus";
import { useNavigate } from "react-router-dom";

export default function PineRidgeBuses() {
  const [buses, setBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBuses() {
      try {
        const response = await fetch("http://localhost:3000/api/schools/pine-ridge");
  
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

  const filteredBuses = buses.filter(bus =>
    bus.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
       <button className="back-button" onClick={() => navigate(-1)} >
        ⬅ Go Back
      </button>
      
      <h2 className="header">Pine Ridge Buses</h2>


      <input
        type="text"
        placeholder="Search by bus number..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
<div className="bus-container">
      {filteredBuses.length > 0 ? (
        filteredBuses.map(bus => (
          <SingleBus key={bus.id} bus={bus} removeBus={removeBus} />
        ))
      ) : (
        <p>No buses found</p>
      )}
      </div>
    </div>
  );
}
