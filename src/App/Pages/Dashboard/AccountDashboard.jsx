import React from "react";
import { Link } from "react-router-dom";

const AccountDashboard = () => {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Account Dashboard</h2>
      <p className="text-gray-700">
        Welcome! Here you can manage your financial claims and track their
        statuses.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/dashboard/submit-claim"
          className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600"
        >
          ➕ Submit New Claim
        </Link>

        <Link
          to="/dashboard/my-claims"
          className="bg-green-500 text-white p-4 rounded hover:bg-green-600"
        >
          📋 View Submitted Claims
        </Link>
      </div>
    </div>
  );
};

export default AccountDashboard;
