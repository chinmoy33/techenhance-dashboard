import { useEffect, useState } from "react";
import { supabase } from "../src/supabaseClient.ts";
//import LoadingSpinner from "../src/components/LoadingSpinning.tsx";

function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const exchangeSession = async () => {
      setLoading(true);
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) console.error("OAuth exchange failed:", error);
        else console.log("✅ Session exchanged:", data.session);
        // Optionally clean URL
        window.history.replaceState({}, document.title, "/");
      }

      setLoading(false);
    };

    exchangeSession();
  }, []);

  if (loading) return <div></div>;

  return children;
}
export default AuthProvider;