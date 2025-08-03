import { Link } from "react-router-dom";

const DashboardLanding = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-blue-300 text-center p-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-4">
        Claim Management Portal
      </h1>
      <p className="text-lg text-blue-800 mb-6 max-w-xl">
        A simple and scalable solution for submitting, reviewing, and managing
        financial claims. Built with React, Redux Toolkit, Tailwind CSS, and
        Node.js.
      </p>

      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Login
        </Link>
          <Link
          to="/register"
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Register
        </Link>
      </div>

      <footer className="absolute bottom-4 text-sm text-blue-800">
        &copy; {new Date().getFullYear()} ClaimApp. All rights reserved.
      </footer>
    </div>
  );
};

export default DashboardLanding;
