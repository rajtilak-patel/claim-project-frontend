import { useEffect, useState } from "react";
import api from "../../utils/api";
import ClaimTable from "../../components/ClaimTable";
import ClaimFilterPanel from "../Dashboard/components/ClaimFilterPanel";

const ClaimReviewPanel = () => {
  const [claims, setClaims] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // "pending", "approved", "rejected"
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  const fetchClaims = async () => {
    try {
      const query = `page=${page}&limit=${limit}${
        statusFilter ? `&status=${statusFilter}` : ""
      }`;
      const res = await api.getClaimStatus(`${query}`);
      setClaims(res.data.claims || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Failed to fetch claims:", err);
    }
  };

  const handleFilter = (filters) => {
    console.log("Applied Filters:", filters);
    setStatusFilter(filters.status); // e.g., filters = { status: "pending" }
    setPage(1); // Reset to page 1 when new filter is applied
  };

  const updateStatus = async (claimId, newStatus) => {
    try {
      await api.updateClaimStatus(claimId, newStatus);
      fetchClaims(); // refresh list after status change
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    fetchClaims();
  }, [statusFilter, page]); // Re-fetch when status or page changes

  return (
    <div className="max-w-6xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Claim Review Panel</h2>

      {/* 🔍 Filter Panel */}
      <ClaimFilterPanel onFilter={handleFilter} />

      {/* 📋 Table */}
      <div className="mt-6">
        <ClaimTable
          claims={claims}
          showActions={true}
          onStatusUpdate={updateStatus}
        />
      </div>

      {/* Optional Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex gap-4 items-center">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="font-medium text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ClaimReviewPanel;
