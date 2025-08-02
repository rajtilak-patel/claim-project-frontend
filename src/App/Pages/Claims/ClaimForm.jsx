import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitClaim, resetClaimState } from "../../features/claim/claimSlice";
import { useEffect } from "react";

const ClaimForm = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.claim);

  const [formData, setFormData] = useState({
    reason: "",
    postId: "",
    image: null,
  });

  const [posts, setPosts] = useState([]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("http://localhost:5000/api/v1/posts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (success || error) {
      setTimeout(() => dispatch(resetClaimState()), 3000);
    }
  }, [success, error, dispatch]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("reason", formData.reason);
    data.append("postId", formData.postId);
    data.append("proofImage", formData.image);

    dispatch(submitClaim(data));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Submit a Claim</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Select Post</label>
        <select
          name="postId"
          className="w-full p-2 border rounded mb-4"
          onChange={handleChange}
          required
        >
          <option value="">--Select--</option>
          {posts.map((post) => (
            <option key={post._id} value={post._id}>
              {post.title}
            </option>
          ))}
        </select>

        <label className="block mb-2">Reason</label>
        <textarea
          name="reason"
          rows="3"
          className="w-full p-2 border rounded mb-4"
          onChange={handleChange}
          required
        ></textarea>

        <label className="block mb-2">Proof Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="mb-4"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Claim"}
        </button>

        {success && <p className="text-green-500 mt-3">Claim submitted!</p>}
        {error && <p className="text-red-500 mt-3">{error}</p>}
      </form>
    </div>
  );
};

export default ClaimForm;
