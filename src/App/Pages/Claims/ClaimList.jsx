import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaHeart, 
  FaCheckCircle, 
  FaTimesCircle,
  FaClock,
  FaMoneyBillWave,
  FaHistory
} from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const baseURL = import.meta.env.VITE_API_URL;

const ClaimList = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await api.getClaimByUser(`status=${statusFilter}`);
      setClaims(res.data.claims);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch claims");
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [statusFilter]);

  const filteredClaims = claims.filter(claim => 
    claim.postId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FaCheckCircle className="text-green-500 mr-2" />;
      case "rejected":
        return <FaTimesCircle className="text-red-500 mr-2" />;
      default:
        return <FaClock className="text-yellow-500 mr-2" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">My Submitted Claims</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search claims..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg w-full md:w-auto bg-white hover:bg-gray-50"
            >
              <FaFilter className="text-gray-500 mr-2" />
              <span>Filter</span>
              {showFilters ? (
                <FiChevronUp className="ml-2" />
              ) : (
                <FiChevronDown className="ml-2" />
              )}
            </button>
            
            {showFilters && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                  <div className="space-y-2">
                    {statusOptions.map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          checked={statusFilter === option.value}
                          onChange={() => {
                            setStatusFilter(option.value);
                            setShowFilters(false);
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      ) : filteredClaims.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaFileAlt className="mx-auto text-gray-400 text-4xl mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No claims found</h3>
          <p className="text-gray-500 mt-1">
            {searchTerm ? "Try a different search term" : "You haven't submitted any claims yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClaims.map((claim) => (
            <div key={claim._id} className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <Link 
                      to={`/posts/${claim.postId?._id}`}
                      className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {claim.postId?.title || "Unknown Post"}
                    </Link>
                    <div className="flex items-center">
                      {getStatusIcon(claim.status)}
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        claim.status === "approved" ? "bg-green-100 text-green-800" :
                        claim.status === "rejected" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mt-2 whitespace-pre-line">
                    {claim.reason || "No reason provided"}
                  </p>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center">
                      <FaEye className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{claim.views || 0} views</span>
                    </div>
                    <div className="flex items-center">
                      <FaHeart className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{claim.likes || 0} likes</span>
                    </div>
                    <div className="flex items-center">
                      <FaMoneyBillWave className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        ₹{claim.expectedEarnings || "0.00"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaHistory className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {formatDate(claim.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {claim.mediaProof && (
                  <div className="md:w-1/3">
                    <img
                      src={`${baseURL}/uploads/${claim.mediaProof}`}
                      alt="Proof"
                      className="w-full h-48 object-contain rounded-md border border-gray-200"
                    />
                  </div>
                )}
              </div>

              {claim.logs && claim.logs.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Claim History</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {claim.logs.map((log, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-gray-300 rounded-full mt-1.5 mr-2"></span>
                        {log}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClaimList;