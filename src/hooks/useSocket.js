// src/hooks/useSocket.js
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const socket = io("http://localhost:5000"); // Replace with your backend

const useSocket = (refreshCallback = () => {}) => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?._id) return;

    // Join room with user ID
    socket.emit("register-user", user._id);

    // Join 'admin' room if user is admin
    if (user.role === "admin") {
      socket.emit("register-user", "admin");
    }

    // Claim status update toast (for users)
    socket.on("claim-status-updated", (data) => {
      toast.success(`✅ Your claim for "${data.postTitle}" was ${data.status}`);
      refreshCallback(); // refresh claims if needed
    });

    // New claim submission notification (for admins)
    socket.on("new-claim-submitted", (data) => {
      toast.info(`📨 New claim from ${data.user} for "${data.post}"`);
      refreshCallback(); // refresh list if admin
    });

    return () => {
      socket.off("claim-status-updated");
      socket.off("new-claim-submitted");
    };
  }, [user]);

  return socket;
};

export default useSocket;
