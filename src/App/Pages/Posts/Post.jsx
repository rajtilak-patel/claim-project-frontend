import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FaHeart, FaEye } from 'react-icons/fa';

const baseURL = import.meta.env.VITE_API_URL;

const Post = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({
        title: '',
        text: '',
        mediaProof: null
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('create');

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const response = await api.getPosts();
            setPosts(response.data.posts);
            setError(null);
        } catch (err) {
            setError('Failed to fetch posts. Please try again later.');
            console.error('Error fetching posts:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditPost = (postId) => {
        // Implement your edit logic here
        console.log('Edit post:', postId);
        // Example: navigate to edit page or open edit modal
        // navigate(`/posts/${postId}/edit`);
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.deletePost(postId);
                setPosts(posts.filter(post => post._id !== postId));
                // Optional: Show success message
            } catch (err) {
                console.error('Error deleting post:', err);
                // Optional: Show error message
            }
        }
    };

    useEffect(() => {
        if (activeTab === 'view') {
            fetchPosts();
        }
    }, [activeTab]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewPost(prev => ({ ...prev, mediaProof: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.title || !newPost.text) {
            setError('Title and content are required');
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('title', newPost.title);
        formData.append('text', newPost.text);
        if (newPost.mediaProof) {
            formData.append('mediaProof', newPost.mediaProof);
        }

        try {
            const response = await api.createPost(formData);
            setPosts(prev => [response.data, ...prev]);
            setNewPost({ title: '', text: '', mediaProof: null });
            setPreviewImage(null);
            setError(null);
            setActiveTab('view');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post');
            console.error('Error creating post:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'create' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('create')}
                >
                    Create Post
                </button>
                <button
                    className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'view' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('view')}
                >
                    View Posts
                </button>
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'create' ? (
                    /* Create Post Tab - Unchanged */
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Post</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newPost.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter post title"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                                    Content
                                </label>
                                <textarea
                                    id="text"
                                    name="text"
                                    value={newPost.text}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                                    placeholder="Write your post content here..."
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="mediaProof" className="block text-sm font-medium text-gray-700 mb-1">
                                    Media Proof (Image)
                                </label>
                                <input
                                    type="file"
                                    id="mediaProof"
                                    name="mediaProof"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                />
                                {previewImage && (
                                    <div className="mt-3">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="rounded-md border border-gray-200"
                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNewPost(prev => ({ ...prev, mediaProof: null }));
                                                setPreviewImage(null);
                                            }}
                                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                                        >
                                            Remove Image
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`px-4 py-2 rounded-md text-white font-medium ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Posting...
                                        </span>
                                    ) : 'Create Post'}
                                </button>
                            </div>

                            {error && (
                                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                                    {error}
                                </div>
                            )}
                        </form>
                    </div>
                ) : (
                    /* View Posts Tab - Updated with metrics */
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Posts</h2>

                        {isLoading && !posts.length ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : error ? (
                            <div className="p-4 bg-red-50 text-red-700 rounded-md">
                                {error}
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No posts available. <button
                                    onClick={() => setActiveTab('create')}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Create your first post
                                </button>
                            </div>
                        ) : (
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Post
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stats
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {posts.map(post => (
                                            <tr key={post._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        {post.imageUrl && (
                                                            <div className="flex-shrink-0 h-10 w-10 mr-4">
                                                                <img
                                                                    src={`${baseURL}/uploads/${post.imageUrl}`}
                                                                    alt="Media proof"
                                                                    className="h-10 w-10 rounded-md object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                                            <div className="text-sm text-gray-500 line-clamp-2">{post.text}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex space-x-4">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <FaHeart className="mr-1 text-red-500" />
                                                            <span>{post.likes || 0}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <FaEye className="mr-1 text-blue-500" />
                                                            <span>{post.views || 0}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEditPost(post._id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePost(post._id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Post;
