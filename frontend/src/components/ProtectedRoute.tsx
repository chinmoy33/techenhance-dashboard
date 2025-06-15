// // components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
// import { useSession } from "@supabase/auth-helpers-react";

// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   const session = useSession();
//     console.log("Current session:", session); // Debugging line to check session state
//   if (!session) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// };

// export default ProtectedRoute;

import { useSessionContext } from '@supabase/auth-helpers-react';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { session, isLoading } = useSessionContext();

  if (isLoading) return <div>Loading...</div>;
  if (!session) return <Navigate to="/Login" />;

  return children;
};
export default ProtectedRoute;
