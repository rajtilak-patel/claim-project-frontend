import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchMe } from "./App/features/auth/authSlice";
import Login from "./App/Pages/auth/Login";
import DashboardLayout from "./App/Pages/Dashboard/DashboardLayout";
import AdminDashboard from "./App/Pages/Dashboard/AdminDashboard";
import AccountDashboard from "./App/Pages/Dashboard/AccountDashboard";
import ClaimForm from "./App/Pages/Claims/ClaimForm";
import ClaimList from "./App/Pages/Claims/ClaimList";
import ClaimReviewPanel from "./App/Pages/Claims/ClaimReviewPanel";
import Unauthorized from "./App/Pages/Unauthorized";
import ProtectedRoute from "./App/Routes/ProtectedRoute";

const App = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  // ✅ Wait for auth state before rendering anything
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Checking auth...
      </div>
    );
  }

  return (
    <Routes>
      {/* ✅ Login route — redirect to dashboard if already logged in */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
      />

      {/* ✅ Unauthorized */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ✅ Dashboard Layout for both admin and account users */}
      <Route
        path="/dashboard"
        element={user ? <DashboardLayout /> : <Navigate to="/login" replace />}
      >
        {/* Admin routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="review-claims"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <ClaimReviewPanel />
            </ProtectedRoute>
          }
        />

        {/* Account routes */}
        <Route
          path="Account"
          element={
            <ProtectedRoute allowedRoles={["Account","Admin"]}>
              <AccountDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="submit-claim"
          element={
            <ProtectedRoute allowedRoles={["Account", "Admin"]}>
              <ClaimForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-claims"
          element={
            <ProtectedRoute allowedRoles={["Account", "Admin"]}>
              <ClaimList />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ✅ Catch-all fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
