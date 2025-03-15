import React from "react";
import { addBus } from "../api";
import { useState } from "react";

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
    })
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
              setFormData((prev) => ({ ...prev, name: e.target.value }));
            }}
          />
        </label>
        <button type="submit" onSubmit={handleSubmit}>
          Submit
        </button>
      </form>
    </>
  );
}
