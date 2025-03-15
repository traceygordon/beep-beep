import React, { useState } from "react";
import { addBus } from "../api";

export default function BusForm({ getData }) {
  const [formData, setFormData] = useState({
    id: null,
    number: ""
  });

  async function handleSubmit(e) {
    e.preventDefault();
    await addBus(formData);
    getData();

    setFormData({
      id: null,
      number: ""
    }); 
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="form">
        <h2>Add a Bus</h2>
        <label>
          Number and Spot:
          <input
            type="text"
            value={formData.number}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, number: e.target.value }));
            }}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
