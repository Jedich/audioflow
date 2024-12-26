"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import '../main.css'; // Стилі логіна

export default function Login() {
  return (
    <div className="flex flex-col h-screen bg-[#181a1f]">
      <Header user={null} />

      {/* Login Form */}
      <div className="flex items-center justify-center flex-grow">
        {/* User Login Box */}
        <div className="bg-[#1F2128] p-8 rounded-lg shadow-lg w-96 mr-8">
          <h2 className="text-2xl font-bold text-center text-white mb-4">Welcome back</h2>
          <p className="text-center text-[#B0B0B0] mb-6">Please enter your details to sign in</p>
          <form>
            <div className="mb-4">
              <label className="block text-[#B0B0B0] mb-2" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="w-full p-3 rounded bg-[#2C2F36] text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#B0B0B0] mb-2" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="w-full p-3 rounded bg-[#2C2F36] text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                placeholder="Enter your password"
              />
            </div>
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
            Don’t have an account? <Link href="/signup" className="text-[#7C3AED] hover:underline">Sign up</Link>
          </p>
        </div>

        {/* Artist Login Box */}
        <div className="bg-[#1F2128] p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold text-center text-white mb-4">or, a Business User...</h2>
          <p className="text-center text-[#B0B0B0] mb-6">Please enter your details to sign in</p>
          <form>
            <div className="mb-4">
              <label className="block text-[#B0B0B0] mb-2" htmlFor="artist-email">Email</label>
              <input
                id="artist-email"
                type="email"
                className="w-full p-3 rounded bg-[#2C2F36] text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#B0B0B0] mb-2" htmlFor="artist-password">Password</label>
              <input
                id="artist-password"
                type="password"
                className="w-full p-3 rounded bg-[#2C2F36] text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                placeholder="Enter your password"
              />
            </div>
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
            Don’t have an artist account? <Link href="/signup" className="text-[#7C3AED] hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
