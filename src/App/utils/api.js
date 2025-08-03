import axios from "axios";
// Create Axios instance with base URL
const URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: `${URL}/api/v1`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for token injection
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // Handle specific error statuses
    if (error.response?.status === 403) {
      return Promise.reject(new Error("Unauthorized access"));
    }

    return Promise.reject(error);
  }
);

// API Methods
export default {
  // Auth API
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getUserInfo: () => api.get("/auth/user-info"),

  // claim status show
  createClaim: (data) => api.post("/claims", data, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  getClaimStatus: (query) => api.get(`/claims/review?${query}`),
  getClaimByUser: () => api.get(`/claims/review/user`),
  updateClaimStatus: (claimId, status) =>
    api.patch(`/claims/${claimId}`, { status }),

  // create post
  createPost: (data) => api.post("/posts", data, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  getPosts: () => api.get("/posts"),
  getAllPost: () => api.get('/posts/list'),
};
