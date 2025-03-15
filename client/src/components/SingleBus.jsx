import { useState } from "react";
import { deleteBus } from "../api";

export default function SingleBus({ bus }) {
  const parkingRows = bus.schoolId === 1 
    ? ["Walden 1", "Walden 2", "Walden 3", "Walden 4"] 
    : ["Pine Ridge 1", "Pine Ridge 2", "Pine Ridge 3"];  


  const [selectedRow, setSelectedRow] = useState("");

  function handleRowChange(event) {
    setSelectedRow(event.target.value);
  }

  async function handleDelete() {
    try {
      await deleteBus(bus.id);
      console.log(`Deleted bus ${bus.number}`);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="bus-card">
      <img className="img" src="/lilbus.webp" alt="Bus" />
      <h1>Bus {bus.number}</h1>
 

      <label>
        Parking Row:
        <select value={selectedRow} onChange={handleRowChange}>
          <option value="">Select a Row</option>
          {parkingRows.map((row, index) => (
            <option key={index} value={row}>
              {row}
            </option>
          ))}
        </select>
      </label>

      <p>Selected Row: {selectedRow || "None"}</p>

      <button className="delete-button" onClick={handleDelete}>
        Delete Bus
      </button>
    </div>
  );
}
