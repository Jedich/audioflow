import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cachedUserData = localStorage.getItem("user_data");
    if (cachedUserData) {
      setUser(JSON.parse(cachedUserData).user);  // Set user from cached data
    }
  }, []);

  const handleLogout = () => {
    // Remove user data and token from localStorage
    localStorage.removeItem("user_data");
    localStorage.removeItem("jwt_token");

    // Redirect to login page after logging out
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-[#1F2128] shadow-md">
      <a href="/" className="text-2xl font-bold text-[#7C3AED]">AudioFlow</a>
      <nav className="space-x-4">
        <Link href="/" className="text-[#B0B0B0] hover:text-[#7C3AED]">Home</Link>
        <Link href="/profile" className="text-[#B0B0B0] hover:text-[#7C3AED]">Profile</Link>
      </nav>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {!user.is_artist && <Link href="/create_artist" className="bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]">            Create artist</Link>}
            {user.is_artist && <Link href="/addsong" className="bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]">Add song</Link>}
            <Image
              src={user.thumbnail || "http://backend:8000/media/images/avatar_default.jpg"}
              alt="Pic"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-white">{user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;