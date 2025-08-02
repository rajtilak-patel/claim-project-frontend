// src/App/Pages/Dashboard/components/ClaimExportButton.jsx
import React from "react";
import { CSVLink } from "react-csv";

const ClaimExportButton = ({ claims }) => {
  const headers = [
    { label: "Claim ID", key: "id" },
    { label: "User", key: "user" },
    { label: "Post", key: "post" },
    { label: "Amount", key: "amount" },
    { label: "Status", key: "status" },
    { label: "Date", key: "date" },
  ];

  const data = claims.map((claim) => ({
    id: claim._id,
    user: claim.user?.name || "N/A",
    post: claim.post?.title || "N/A",
    amount: claim.amount || 0,
    status: claim.status,
    date: new Date(claim.createdAt).toLocaleString(),
  }));

  return (
    <div className="text-right my-2">
      <CSVLink
        data={data}
        headers={headers}
        filename="claims_report.csv"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Export to CSV
      </CSVLink>
    </div>
  );
};

export default ClaimExportButton;
