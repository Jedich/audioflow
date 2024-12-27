"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import "../main.css"; // Стилі логіна
import { useRouter } from "next/navigation";


export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState(null);
    const router = useRouter();
  
    const handleRegister = async (e) => {
      e.preventDefault();
    
      try {
        const response = await fetch("http://localhost:8000/api/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });
        console.log(response)
        if (response.ok) {
          var a = await response.json();
          try {
            const response = await fetch("http://localhost:8000/api/login/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            });
            var data
            console.log(response)
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
            console.log(userDataResponse)
            if (userDataResponse.ok) {
              const userData = await userDataResponse.json();
              console.log(userData)
              setUser(userData); // Set the user data to be used across the app
      
              localStorage.setItem("user_data", JSON.stringify(userData));
      
              // Redirect to homepage ("/") after successful login
            } else {
              const errorData = await userDataResponse.json();
              console.log(errorData)
              setErrors((prevErrors) => ({
                ...prevErrors,
                backend: errorData.error || "Incorrect login or password.",
              }));
            }
          } catch (error) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              backend: "Network error. Please try again later.",
            }));
          }
          // Redirect to homepage
          router.push("/");
        } else {
          const errorData = await response.json();
          setErrors((prevErrors) => ({
            ...prevErrors,
            backend: errorData.error || "Registration failed. Please try again.",
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
  
        {/* Registration Form */}
        <div className="flex items-center justify-center flex-grow">
          <div className="bg-[#1F2128] p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-center text-white mb-4">Create Account</h2>
            <p className="text-center text-[#B0B0B0] mb-6">Fill in your details to register</p>
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block text-[#B0B0B0] mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 rounded bg-[#2C2F36] text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>
  
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
  
              <button
                type="submit"
                className="w-full bg-[#7C3AED] text-white py-3 rounded hover:bg-[#9F7AEA]"
              >
                Sign up
              </button>
            </form>
  
            <p className="text-center text-[#B0B0B0] mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-[#7C3AED] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
  