import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const exchange = async () => {
      console.log("Parsing URL hash for tokens...");
      const hash = window.location.hash.substring(1); // remove the '#'
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");

      if (access_token) {
        // Manually set the session (only for implicit flow, not secure for production)
        // Better: Use PKCE flow as mentioned earlier

        console.log("Token found in hash, setting session...");
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token: params.get("refresh_token") ?? "",
        });

        if (error) {
          console.error("Error setting session:", error);
        } else {
          console.log("Session set successfully.");
          navigate("/Dashboard");
        }
      } else {
        console.error("No access token found in hash.");
      }
    };

    exchange();
  }, [navigate]);

  return (<p>Signing in with Google....</p>)
}

