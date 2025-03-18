import { useState, useEffect } from "react";
import { updateBus, deleteBus } from "../api"; // Import updateBus

export default function SingleBus({ bus }) {
  const parkingRows = bus.schoolid === 1 
    ? ["Walden 1", "Walden 2", "Walden 3", "Walden 4"] 
    : ["Pine Ridge 1", "Pine Ridge 2", "Pine Ridge 3"];  

  const [selectedRow, setSelectedRow] = useState("");

  // Fetch initial row when the component loads
  useEffect(() => {
    async function fetchRow() {
      try {
        const response = await fetch(`/api/buses/${bus.id}`);
        const data = await response.json();
        setSelectedRow(data.row || ""); // Set existing row if available
      } catch (err) {
        console.error("Error fetching bus row:", err);
      }
    }
    fetchRow();
  }, [bus.id]);

  async function handleRowChange(event) {
    const newRow = event.target.value;
    setSelectedRow(newRow);

    try {
      await updateBus(bus.id, { row: newRow }); // Update row in DB
      console.log(`Updated bus ${bus.number} with row: ${newRow}`);
    } catch (err) {
      console.error("Failed to update row:", err);
    }
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
