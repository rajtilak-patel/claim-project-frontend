import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchMe } from "./App/features/auth/authSlice";
import ProtectedRoute from "./App/Routes/ProtectedRoute";

// Layouts
import DashboardLayout from "./App/Pages/Dashboard/DashboardLayout";

// Pages
import Login from "./App/Pages/auth/Login";
import Unauthorized from "./App/Pages/Unauthorized";
import AdminDashboard from "./App/Pages/Dashboard/AdminDashboard";
import AccountDashboard from "./App/Pages/Dashboard/AccountDashboard";
import UserDashboard from "./App/Pages/Dashboard/UserDashboard";
import ClaimForm from "./App/Pages/Claims/ClaimForm";
import ClaimReviewPanel from "./App/Pages/Claims/ClaimReviewPanel";
import Post from "./App/Pages/Posts/Post";
import PostList from "./App/Pages/Posts/PostList";
import ClaimList from "./App/Pages/Claims/ClaimList";

const App = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={user ? <DashboardLayout /> : <Navigate to="/login" replace />}>
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="review-claims" element={<ClaimReviewPanel />} />
        </Route>

        {/* Account Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Account", "Admin"]} />}>
          <Route path="account" element={<AccountDashboard />} />
          <Route path="submit-claim" element={<ClaimForm />} />
        </Route>

        {/* User Routes */}
        <Route element={<ProtectedRoute allowedRoles={["User"]} />}>
          <Route path="my-claims" element={<UserDashboard />} />
          <Route path="claim-list" element={<ClaimList />} />
          <Route path="post-list" element={<PostList />} />
          <Route path="post" element={<Post />} />
        </Route>

        {/* Shared Routes */}
        <Route element={<ProtectedRoute allowedRoles={["User", "Account"]} />}>
          <Route path="submit-claims" element={<ClaimForm />} />
        </Route>
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

export default App;