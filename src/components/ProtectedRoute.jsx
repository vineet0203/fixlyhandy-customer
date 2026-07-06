import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('customer_token');
  const profileStr = localStorage.getItem('customer_profile');

  let isVerified = false;
  try {
    const profile = profileStr ? JSON.parse(profileStr) : null;
    isVerified = profile ? !!profile.is_verified : false;
  } catch (e) {
    console.error("Error parsing customer profile:", e);
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to verify if user is not verified and not on the verify page
  if (!isVerified && location.pathname !== '/verify') {
    return <Navigate to="/verify" replace />;
  }

  // Redirect to dashboard if user is verified and on the verify page
  if (isVerified && location.pathname === '/verify') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;