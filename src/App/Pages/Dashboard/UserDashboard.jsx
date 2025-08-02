import React from "react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Welcome to Your Dashboard</h2>
      <p className="text-gray-700">Manage your claims efficiently.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/dashboard/submit-claims"
          className="p-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit a New Claim
        </Link>

        <Link
          to="/dashboard/claim-list"
          className="p-4 bg-green-600 text-white rounded hover:bg-green-700"
        >
          View My Claims
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
