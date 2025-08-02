// Date and time helpers
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const getDuration = (start, end) => {
  const diff = new Date(end) - new Date(start);
  const minutes = Math.floor(diff / 60000);
  return `${minutes} mins`;
};

// Booking status helpers
export const getStatusColor = (status) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    rejected: 'bg-gray-100 text-gray-800'
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

// Payment helpers
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

// Validation helpers
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

// UI helpers
export const generateAvatar = (name) => {
  const initials = name.split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  const colors = [
    'bg-purple-500', 'bg-indigo-500', 'bg-blue-500', 
    'bg-green-500', 'bg-yellow-500', 'bg-pink-500'
  ];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <div className={`${randomColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold`}>
      {initials}
    </div>
  );
};

// Slot management helpers
export const generateTimeSlots = (startTime, endTime, interval = 30) => {
  const slots = [];
  const start = new Date(`2023-01-01T${startTime}`);
  const end = new Date(`2023-01-01T${endTime}`);
  
  while (start < end) {
    const slotStart = new Date(start);
    start.setMinutes(start.getMinutes() + interval);
    const slotEnd = new Date(start);
    
    if (slotEnd <= end) {
      slots.push({
        start: slotStart.toTimeString().substring(0, 5),
        end: slotEnd.toTimeString().substring(0, 5),
        available: true
      });
    }
  }
  
  return slots;
};

// Error handling
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || `Server error: ${error.response.status}`;
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Other errors
    return error.message || 'An unexpected error occurred';
  }
};

// Local storage helpers
export const storeAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getUserData = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Role-based access helper
export const hasRole = (requiredRole) => {
  const user = getUserData();
  return user?.role === requiredRole;
};