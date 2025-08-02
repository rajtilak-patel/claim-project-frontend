const ClaimFilterPanel = ({ onFilter }) => {
  const handleChange = (e) => {
    onFilter({ status: e.target.value });
  };

  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium">Filter by Status:</label>
      <select
        onChange={handleChange}
        className="border px-3 py-1 rounded"
        defaultValue=""
      >
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  );
};

export default ClaimFilterPanel;
