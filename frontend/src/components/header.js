// components/Header.js
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Header = ({ user }) => {
  return (
    <header className="flex justify-between items-center px-8 py-4 bg-[#1F2128] shadow-md">
        <a href="/" className="text-2xl font-bold text-[#7C3AED]">AudioFlow</a>
        <nav className="space-x-4">
          <Link href="/" className="text-[#B0B0B0] hover:text-[#7C3AED]">Home</Link>
          <Link href="/profile" className="text-[#B0B0B0] hover:text-[#7C3AED]">Profile</Link>
        </nav>
        <div className="flex items-center space-x-4">
        {user ? (
          <Image
            src={user && user.thumbnail ? user.thumbnail : "http://backend:8000/media/images/avatar_default.jpg"}
            alt="Pic"
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : ("")}
        {user ? (
          <span className="text-white">{user.name}</span>
        ) : ("")}
        {user ? (
          <a href="/login" className="bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]">
            Logout
          </a>
        ) : ("")}
        </div>
      </header>
  );
};

export default Header;
