import { useEffect, useState } from "react";
import api from "../../utils/api";
import useSocket from "../../../hooks/useSocket";
const ClaimList = () => {
  const [claims, setClaims] = useState([]);

  const fetchClaims = async () => {
    const res = await api.get("/claims/my-claims");
    setClaims(res.data.claims);
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // 🔄 Pass fetchClaims to socket hook
//   useSocket(fetchClaims);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">My Submitted Claims</h2>

      {claims.length === 0 ? (
        <p>No claims found.</p>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                  {claim.post?.title || "Unknown Post"}
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
              <p className="text-sm text-gray-600">
                Submitted on: {new Date(claim.createdAt).toLocaleString()}
              </p>
              <p className="mt-2">{claim.reason}</p>

              {claim.proofImage && (
                <img
                  src={`http://localhost:5000/${claim.proofImage}`}
                  alt="Proof"
                  className="w-32 h-32 object-cover mt-3 border rounded"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClaimList;
