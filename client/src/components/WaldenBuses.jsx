import { useState, useEffect } from "react";
import SingleBus from "./SingleBus";
import { useNavigate } from "react-router-dom";

export default function WaldenBuses() {
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();

  async function fetchWaldenBuses() {
    try {
      const response = await fetch("http://localhost:3000/api/buses/walden");
      const data = await response.json();
      setBuses(data);
    } catch (error) {
      console.error("Error fetching Walden buses:", error);
    }
  }

  useEffect(() => {
    fetchWaldenBuses();
  }, []);

  function removeBus(id) {
    setBuses((prevBuses) => prevBuses.filter(bus => bus.id !== id));
  }

  return (
    <div>
      <h1>Walden Buses</h1>

      <button onClick={() => navigate(-1)} className="go-back-btn">
        ⬅ Go Back
      </button>

      {buses.map(bus => (
        <SingleBus key={bus.id} bus={bus} removeBus={removeBus} />
      ))}
    </div>
  );
}
