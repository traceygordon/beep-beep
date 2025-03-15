import { useState, useEffect } from "react";
import { getBuses } from "../api/index.js";
import SingleBus from "./SingleBus.jsx";
import BusForm from "./BusForm.jsx";

export default function Buses() {
  const [buses, setBuses] = useState([{
    id: null,
    number: ""
  }]);

  async function allBuses() {
    const busData = await getBuses();
    if (busData) { 
      setBuses(busData);
      console.log("Buses state updated:", busData);
    } else {
      console.error("No bus data received");
    }
  }

  useEffect(() => {
    allBuses();
  }, []);

  return (
    <div className="article">
      <BusForm getData={allBuses} />
      {buses.length > 0 ? (
        buses.map((bus) => <SingleBus key={bus.id} bus={bus} />)
      ) : (
        <p>No buses available</p>
      )}
    </div>
  );
}
