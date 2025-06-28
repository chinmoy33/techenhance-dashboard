import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./supabaseClient.ts"; // Make sure this exports the *same* supabase client
import AuthProvider from "../AuthProvider/AuthProvider.tsx"; // Import your AuthProvider
import { Provider } from "react-redux";
import { store } from "./store"; // Adjust the path if needed


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <BrowserRouter>
        <Provider store={store}>
        <AuthProvider>
          <App />
        </AuthProvider>
        </Provider>
      </BrowserRouter>
    </SessionContextProvider>
  </StrictMode>
);
