import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 👉 Email Login Handler
  const handleEmailLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged in!");
      navigate("/");
    }
  };

  // ✅ Email Sign-Up Handler
  const handleEmailSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signup successful! Please verify your email.");
      console.log("User created:", data);
    }
  };

  // 🔐 Google OAuth Login
  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      //   options: {
      //     queryParams: {
      //       prompt: "select_account",
      //     },
      //   },
    });
    console.log("Google OAuth data:", data);
    if (error) {
      toast.error(error.message);
    } else {
      console.log("Redirecting to Google OAuth...");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md space-y-6 bg-gray-800 p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center">Welcome</h2>

        {/* Email/Password Inputs */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleEmailLogin}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Login with Email
          </button>

          <button
            onClick={handleEmailSignup}
            className="w-full py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            Sign Up with Email
          </button>
        </div>

        <div className="flex items-center justify-center my-4 text-sm text-gray-400">
          — or —
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
