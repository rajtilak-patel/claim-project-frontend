import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

const ClaimView = () => {
  const { claimId } = useParams();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClaim = async () => {
    try {
      const res = await api.get(`/claims/${claimId}`);
      setClaim(res.data.claim);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch claim details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaim();
  }, [claimId]);

  const getStatusIcon = () => {
    switch (claim?.status) {
      case "approved":
        return <FaCheckCircle className="text-green-500 mr-2" />;
      case "rejected":
        return <FaTimesCircle className="text-red-500 mr-2" />;
      default:
        return <FaClock className="text-yellow-500 mr-2" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-yellow-50 text-yellow-700 rounded-md">
        Claim not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" />
          Back to Claims
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Claim Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {claim.post?.title || "Claim Details"}
            </h2>
            <div className="flex items-center mt-2 sm:mt-0">
              {getStatusIcon()}
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  claim.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : claim.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Claim Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Reason for Claim
                </h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {claim.reason}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Additional Notes
                </h3>
                <p className="text-gray-600">
                  {claim.notes || "No additional notes provided"}
                </p>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Claim Details
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Submitted By</p>
                    <p className="font-medium">
                      {claim.user?.name || "Unknown User"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Submitted On</p>
                    <p className="font-medium">
                      {new Date(claim.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">
                      {new Date(claim.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Proof Images */}
          {claim.proofImage && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Proof Documentation
              </h3>
              <div className="flex flex-wrap gap-4">
                <div className="border rounded-md overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${claim.proofImage}`}
                    alt="Proof documentation"
                    className="w-full h-48 object-contain bg-gray-100"
                  />
                  <div className="p-2 bg-gray-50 text-center text-sm text-gray-500">
                    Supporting Evidence
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimView;