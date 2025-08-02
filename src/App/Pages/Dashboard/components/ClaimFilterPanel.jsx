// src/App/Pages/Dashboard/components/ClaimFilterPanel.jsx
import React, { useState } from "react";

const ClaimFilterPanel = ({ onFilter }) => {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("");

  const handleFilter = () => {
    onFilter({ status, search, dateRange });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white p-4 shadow rounded-md mb-6">
      <select
        className="border p-2 rounded w-40"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="deducted">Deducted</option>
      </select>

      <select
        className="border p-2 rounded w-40"
        value={dateRange}
        onChange={(e) => setDateRange(e.target.value)}
      >
        <option value="">All Dates</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>

      <input
        type="text"
        placeholder="Search by post/user"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-64"
      />

      <button
        onClick={handleFilter}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default ClaimFilterPanel;
