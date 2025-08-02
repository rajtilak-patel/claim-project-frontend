import { useEffect, useState } from "react";
import api from "../../utils/api";

const ClaimReviewPanel = () => {
  const [claims, setClaims] = useState([]);

  const fetchClaims = async () => {
    try {
      const res = await api.get("/claims"); // Admin-only endpoint
      setClaims(res.data.claims);
    } catch (err) {
      console.error("Failed to fetch claims:", err);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const updateStatus = async (claimId, newStatus) => {
    try {
      await api.patch(`/claims/${claimId}/status`, { status: newStatus });
      fetchClaims(); // refresh list
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Claim Review Panel</h2>
      {claims.length === 0 ? (
        <p>No claims found.</p>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim._id} className="bg-white p-4 shadow rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                  {claim.postId?.title || "Untitled Post"}
                </h3>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    claim.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : claim.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {claim.status}
                </span>
              </div>

              <p>
                <strong>User:</strong> {claim.userId?.email}
              </p>
              <p>
                <strong>Reason:</strong> {claim.reason}
              </p>
              <p className="text-sm text-gray-500">
                Submitted: {new Date(claim.createdAt).toLocaleString()}
              </p>

              {claim.proofImage && (
                <img
                  src={`http://localhost:5000/uploads/${claim.proofImage}`}
                  alt="proof"
                  className="w-32 h-32 mt-2 border rounded object-cover"
                />
              )}

              {claim.status === "pending" && (
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => updateStatus(claim._id, "approved")}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(claim._id, "rejected")}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClaimReviewPanel;
