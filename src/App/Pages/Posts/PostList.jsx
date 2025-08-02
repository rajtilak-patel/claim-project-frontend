import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaEye } from 'react-icons/fa';
import api from '../../utils/api';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.getAllPost(`${baseURL}/posts/list`);
        setPosts(response.data.posts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      // Optimistic update
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
      setLikedPosts([...likedPosts, postId]);
      
      await axios.patch(`${baseURL}/posts/${postId}/like`);
    } catch (err) {
      console.error('Error liking post:', err);
      // Rollback if error
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: post.likes - 1 } : post
      ));
      setLikedPosts(likedPosts.filter(id => id !== postId));
    }
  };

  const handleView = async (postId) => {
    try {
      await axios.patch(`${baseURL}/posts/${postId}/view`);
      // No need to update UI for views unless you want to show real-time updates
    } catch (err) {
      console.error('Error incrementing view:', err);
    }
  };

  if (loading) return <div className="text-center py-12">Loading posts...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map(post => (
          <div 
            key={post._id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            onClick={() => handleView(post._id)}
          >
            {/* Media Proof - Top Section */}
            {post.imageUrl && (
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img 
                  src={`${baseURL}/uploads/${post.imageUrl}`}
                  alt="Media proof"
                  className="w-full h-full object-contain p-2"
                />
              </div>
            )}

            {/* Content - Bottom Section */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 h-12">
                {post.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 h-16">
                {post.text}
              </p>
              
              <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                <span>Posted: {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              
              {/* Stats and Actions */}
              <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-3">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post._id);
                    }}
                    className="flex items-center text-gray-500 hover:text-red-500 transition-colors"
                  >
                    {likedPosts.includes(post._id) ? (
                      <FaHeart className="text-red-500 mr-1" />
                    ) : (
                      <FaRegHeart className="mr-1" />
                    )}
                    <span>{post.likes || 0}</span>
                  </button>
                  
                  <div className="flex items-center">
                    <FaEye className="mr-1" />
                    <span>{post.views || 0}</span>
                  </div>
                </div>
                
                <button 
                  className="text-blue-500 text-sm font-medium hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(post._id);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;