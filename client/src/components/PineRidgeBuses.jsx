import { useState, useEffect } from "react";
import SingleBus from "./SingleBus";
import { useNavigate } from "react-router-dom";
import { addBus } from "../api/index";

export default function PineRidgeBuses({token}) {
  const [buses, setBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newBus, setNewBus] = useState({ number: "", row: 0, schoolid: 2 });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBuses() {
      try {
        const response = await fetch(
          "https://beep-beep.onrender.com/api/schools/pine-ridge"
        );

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
    fetchBuses();

  }, []);

  function removeBus(id) {
    setBuses((prevBuses) => prevBuses.filter((bus) => bus.id !== id));
  }

  async function createBus(newBus) {
    try {
      const addedBus = await addBus(newBus);
      if (addedBus) {
        setBuses([...buses, addedBus]);
        setNewBus({ number: "", row: 0, schoolid: 2 });
      }
    } catch (error) {
      console.error("Error adding new bus:", error);
    }
  }

  const filteredBuses = buses.filter((bus) =>
    bus.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    
    <div>
      <button className="back-button" onClick={() => navigate(-1)}>
        ⬅ Go Back
      </button>

      <h2 className="header">Pine Ridge Buses</h2>

      <div className="bus-container">
        <input
          type="text"
          placeholder="Bus Number"
          value={newBus.number}
          onChange={(e) => setNewBus({ ...newBus, number: e.target.value })}
        />
        <button onClick={() => createBus(newBus)}>Add Bus</button>
      </div>

      <input
        type="text"
        placeholder="Search by bus number..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="searchBar"
      />

      <div className="bus-container">
        {filteredBuses.length > 0 ? (
          filteredBuses.map((bus) => (
            <SingleBus key={bus.id} bus={bus} removeBus={removeBus} />
          ))
        ) : (
          <p>No buses found</p>
        )}
      </div>
    </div>
  );
}
