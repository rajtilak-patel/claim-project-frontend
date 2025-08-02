import { Outlet, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useSocket from "../../../hooks/useSocket";

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white h-screen p-4">
        <h2 className="text-2xl font-bold mb-4">ClaimApp</h2>
        <nav>
          <ul className="space-y-2">
            {user.role === "Admin" && (
              <li>
                <Link to="/dashboard/admin">Admin Panel</Link>
              </li>
            )}
            {user.role === "Account" && (
              <li>
                <Link to="/dashboard/account">My Claims</Link>
              </li>
            )}
            {user.role === "User" && (
              <li>
                <Link to="/dashboard/my-claims">My Claims</Link>
              </li>
            )}
            {user.role === "User" && (
              <li>
                <Link to="/dashboard/submit-claims">Submit Claim</Link>
              </li>
            )}
            <li>
              <Link to="/dashboard/profile">Profile</Link>
            </li>
            <li>
              <button
                onClick={() => logout()}
                className="text-blue-500 hover:underline"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
