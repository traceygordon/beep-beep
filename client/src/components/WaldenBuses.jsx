import { useState, useEffect } from "react";
import SingleBus from "./SingleBus";
import { useNavigate } from "react-router-dom";

export default function WaldenBuses() {
  const [buses, setBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBuses() {
      try {
        const response = await fetch("http://localhost:3000/api/buses/walden");
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setBuses(data);
      } catch (error) {
        console.error("Error fetching Walden buses:", error);
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
      <h1>Walden Buses</h1>

      <button onClick={() => navigate(-1)} className="go-back-btn">
        ⬅ Go Back
      </button>

      <input
        type="text"
        placeholder="Search by bus number..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {filteredBuses.length > 0 ? (
        filteredBuses.map(bus => (
          <SingleBus key={bus.id} bus={bus} removeBus={removeBus} />
        ))
      ) : (
        <p>No buses found</p>
      )}
    </div>
  );
}
