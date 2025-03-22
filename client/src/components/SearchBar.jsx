import { useState } from "react";

export default function SearchBar({ onSearch, onFilterRow, availableRows }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState("");

  function handleSearchChange(e) {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  }

  function handleRowChange(e) {
    const row = e.target.value;
    setSelectedRow(row);
    onFilterRow(row);
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by bus number..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />

      <select
        value={selectedRow}
        onChange={handleRowChange}
        className="row-dropdown"
      >
        <option value="">All Rows</option>
        {availableRows.map((row) => (
          <option key={row} value={row}>
            {row}
          </option>
        ))}
      </select>
    </div>
  );
}
