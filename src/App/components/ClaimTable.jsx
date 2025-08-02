import React from "react";
const URL = import.meta.env.VITE_API_URL;
const ClaimTable = ({ claims = [], onStatusUpdate, showActions = false }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
              #
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
              User
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
              Post Title
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
              Proof
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
              Earnings
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
              Status
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
              Date
            </th>
            {showActions && (
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {claims.length === 0 ? (
            <tr>
              <td
                colSpan={showActions ? 8 : 7}
                className="py-4 text-center text-gray-400"
              >
                No claims available.
              </td>
            </tr>
          ) : (
            claims.map((claim, index) => (
              <tr key={claim._id}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{claim.userId?.name}</td>
                <td className="px-4 py-2">{claim.postId?.title}</td>
                <td className="px-4 py-2">
                  {claim.mediaProof ? (
                    <a
                      href={`${URL}/uploads/${claim.mediaProof}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-4 py-2">₹{claim.expectedEarnings}</td>
                <td className="px-4 py-2 capitalize">{claim.status}</td>
                <td className="px-4 py-2">
                  {new Date(claim.createdAt).toLocaleDateString()}
                </td>
                {showActions && (
                  <td className="px-4 py-2 space-x-2 flex items-center">
                    <button
                      className="bg-green-100 text-green-700 hover:bg-green-600 hover:text-white font-medium py-1 px-3 rounded-full text-sm transition"
                      onClick={() => onStatusUpdate(claim._id, "approved")}
                    >
                      ✅ Approve
                    </button>
                    <button
                      className="bg-red-100 text-red-700 hover:bg-red-600 hover:text-white font-medium py-1 px-3 rounded-full text-sm transition"
                      onClick={() => onStatusUpdate(claim._id, "rejected")}
                    >
                      ❌ Reject
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClaimTable;
