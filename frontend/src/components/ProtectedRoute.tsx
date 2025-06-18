// // components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { session, isLoading } = useSessionContext();

  if (isLoading) return <div>Loading...</div>;
  if (!session) return <Navigate to="/Login" />;

  return children;
};
export default ProtectedRoute;
