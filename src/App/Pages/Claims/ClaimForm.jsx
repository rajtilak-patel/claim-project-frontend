import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitClaim, resetClaimState } from "../../features/claim/claimSlice";
import { useEffect } from "react";
import api from "../../utils/api";

const ClaimForm = () => {
  const dispatch = useDispatch();
  const [loading,setLoading] = useState(false); 
  // const { loading, success, error } = useSelector((state) => state.claim);

  const [formData, setFormData] = useState({
    reason: "",
    postId: "",
    image: null,
  });

  const [posts, setPosts] = useState([]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await api.getPosts();
      setPosts(res.data.posts);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  // useEffect(() => {
  //   // if (success || error) {
  //   //   setTimeout(() => dispatch(resetClaimState()), 3000);
  //   // }
  // }, [success, error, dispatch]);

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
    data.append("postId", formData.postId);
    data.append("mediaProof", formData.image);
    data.append("views", 0);
    data.append("likes", 0);
   
    console.log("Submitting claim with data:", data);
    setLoading(true);
    dispatch(submitClaim(data));
    setLoading(false);
    setFormData({ postId: "", image: null }); // Reset form after submission
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

        {/* Likes for Claim */}
        <label className="block mb-2">Likes for Claim</label>
        <input
          type="number"
          name="likes"
          min="0"
          className="w-full p-2 border rounded mb-4"
          onChange={handleChange}
          required
        />
        {/* Views for Claim */}
        <label className="block mb-2">Views for Claim</label>
        <input
          type="number"
          name="views"
          min="0"
          className="w-full p-2 border rounded mb-4"
          onChange={handleChange}
          required
        />

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

        {/* {success && <p className="text-green-500 mt-3">Claim submitted!</p>} */}
        {/* {error && <p className="text-red-500 mt-3">{error}</p>} */}
      </form>
    </div>
  );
};

export default ClaimForm;
