import { Outlet, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

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

  // Define navigation links based on user role
  const getNavLinks = () => {
    const commonLinks = [
      // { path: "/dashboard/profile", label: "Profile" },
    ];

    const roleSpecificLinks = {
      Admin: [
        { path: "/dashboard/admin", label: "Admin Panel" },
      ],
      Account: [
        { path: "/dashboard/account", label: "My Claims" },
      ],
      User: [
        { path: "/dashboard/my-claims", label: "My Claims" },
        { path: "/dashboard/submit-claims", label: "Submit Claim" },
        { path: "/dashboard/post-list", label: "Post List" },
        { path: "/dashboard/post", label: "Post" },
      ],
    };

    return [...(roleSpecificLinks[user.role] || []), ...commonLinks];
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">ClaimApp</h2>
        
        <nav className="flex-1">
          <ul className="space-y-3">
            {getNavLinks().map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path}
                  className="block px-3 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto">
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition-colors text-blue-400 hover:text-blue-300"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;