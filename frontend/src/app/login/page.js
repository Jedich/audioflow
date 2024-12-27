"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import "../main.css"; // Стилі логіна
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    backend: "",
  });
  
  const router = useRouter();


  useEffect(() => {
    // Try to fetch cached user data from localStorage
    const cachedUserData = localStorage.getItem("user_data");
    if (cachedUserData) {
      setUser(JSON.parse(cachedUserData));  // Set user from cached data
    }
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "", backend: "" };

    if (!email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Reset the backend error before sending a new request
    setErrors((prevErrors) => ({ ...prevErrors, backend: "" }));

    // Send request to the backend API to authenticate the user
    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      var data
      if (!response.ok) {
        const data = await response.json();
        setErrors((prevErrors) => ({
          ...prevErrors,
          backend: data.message || "An error occurred during login.",
        }));
        return;
      } else {
        data = await response.json();
      }

      // Store the token in localStorage (or sessionStorage if preferred)
      localStorage.setItem("jwt_token", data.access_token);

      // Fetch user data using the token
      const userDataResponse = await fetch("http://localhost:8000/api/user/", {
        headers: {
          "Authorization": `Bearer ${data.access_token}`,
        },
      });

      if (userDataResponse.ok) {
        const userData = await userDataResponse.json();
        setUser(userData); // Set the user data to be used across the app

        localStorage.setItem("user_data", JSON.stringify(userData));

        // Redirect to homepage ("/") after successful login
        router.push("/");
      } else {
        const errorData = await userDataResponse.json();
        console.log(errorData)
        setErrors((prevErrors) => ({
          ...prevErrors,
          backend: errorData.message || "Incorrect login or password.",
        }));
      }
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        backend: "Network error. Please try again later.",
      }));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#181a1f]">
      <Header user={user} />

      {/* Login Form */}
      <div className="flex items-center justify-center flex-grow">
        <div className="bg-[#1F2128] p-8 rounded-lg shadow-lg w-96 mr-8">
          <h2 className="text-2xl font-bold text-center text-white mb-4">Welcome back</h2>
          <p className="text-center text-[#B0B0B0] mb-6">Please enter your details to sign in</p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-[#B0B0B0] mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded bg-[#2C2F36] text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-[#B0B0B0] mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded bg-[#2C2F36] text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            {errors.backend && (
              <p className="text-red-500 text-xs mt-2">{errors.backend}</p>
            )}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center text-[#B0B0B0]">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <Link href="#" className="text-[#7C3AED] hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-[#7C3AED] text-white py-3 rounded hover:bg-[#9F7AEA]"
            >
              Sign in
            </button>
          </form>
          <p className="text-center text-[#B0B0B0] mt-4">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-[#7C3AED] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
        </div>
    </div>
  );
}
