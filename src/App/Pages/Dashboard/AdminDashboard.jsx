import ClaimFilterPanel from "./components/ClaimFilterPanel";
import ClaimExportButton from "./components/ClaimExportButton";
import { useSelector } from "react-redux";
import ClaimTable from "../../components/ClaimTable";
import { useEffect, useState } from "react";
import api from "../../utils/api";

const AdminDashboard = () => {
  const [claims, setClaims] = useState([]);

  const updateStatus = async (claimId, newStatus) => {
    try {
      await api.updateClaimStatus(claimId, newStatus);
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleFilter = (filters) => {
    console.log("Applied Filters:", filters);
    // Apply filtering here later
  };
  const claimData = async () => {
    try {
      const res = await api.getClaimStatus(); // Admin-only endpoint
      setClaims(res.data.claims);
    } catch (err) {
      console.error("Failed to fetch claims:", err);
    }
  };

  useEffect(() => {
    // Fetch claims from the API
    claimData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Claim Dashboard</h1>

      <ClaimFilterPanel onFilter={handleFilter} />

      {/* 🔽 CSV Export Button */}
      <ClaimExportButton claims={claims} />

      {/* 🔽 Claim Table would go here */}
      <ClaimTable
        claims={claims}
        onStatusUpdate={updateStatus}
        showActions={true}
      />
    </div>
  );
};

export default AdminDashboard;
