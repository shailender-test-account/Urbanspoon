import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Client-side guard. The real enforcement is on the API (protect + authorize).
export default function ProtectedRoute({ children, roles }) {
  const { user, initialized } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!initialized) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-primary text-3xl">
        <i className="fa-solid fa-spinner fa-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
