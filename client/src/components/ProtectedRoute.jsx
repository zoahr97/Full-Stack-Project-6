import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// מגן על routes שדורשים התחברות.
// replace:true מונע חזרה לעמוד המוגן אחרי logout עם כפתור "חזור" בדפדפן
export default function ProtectedRoute({ children }) {
  const { session } = useAuth();
  const location    = useLocation();

  if (!session)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
