import { useState } from "react";
import { addBus, deleteBus } from "../api";

export default function SingleBus({ bus }) {
  const parkingRows = bus.schoolid === 1 
    ? [0, 1, 2, 3, 4] 
    : [0, 1, 2, 3];  

  const [selectedRow, setSelectedRow] = useState(bus.row);
  const [busNumber, setBusNumber] = useState(bus.number);

  function handleRowChange(event) {
    setSelectedRow(event.target.value);
  }

  function handleNumberChange(event) {
    setBusNumber(event.target.value);
  }


  async function handleUpdate() {
    try {
      const response = await fetch(`http://localhost:3000/api/buses/${bus.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          row: selectedRow, 
          number: busNumber }),
      });

      if (!response.ok) throw new Error("Failed to update bus");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete() {
    try {
      await deleteBus(bus.id);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="bus-card">
      <h3>{busNumber} Row: {selectedRow}</h3>
      <label className="bus-num">
        Update Number:
        <input 
          type="text" 
          size="14"
          value={busNumber} 
          onChange={handleNumberChange} 
        />
      </label>

      <label className="bus-row">
        Update Parking Row:
        <select value={selectedRow} onChange={handleRowChange}>
          {parkingRows.map((row, index) => (
            <option key={index} value={row}>
              {row}
            </option>
          ))}
        </select>
      </label>

      <button className="update-button" onClick={handleUpdate}>
        Update Bus
      </button>

      <button className="delete-button" onClick={handleDelete}>
        Delete Bus
      </button>
    </div>
    
  );
}
