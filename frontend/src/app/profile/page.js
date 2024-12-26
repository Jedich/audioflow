"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

const UserPage = () => {
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState({ name: "John Doe" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    alert("Logging out...");
  };

  const handleEditProfile = () => {
    alert("Editing profile...");
  };

  return (
    <div className="flex flex-col h-screen bg-[#181a1f]">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 p-8 bg-[#181a1f]">
          <section className="bg-[#1F2128] p-8 rounded-lg shadow-lg mb-8">
            {userData ? (
              <div className="flex items-center space-x-6">
                <Image
                  src={userData.avatar ? userData.avatar : "http://backend:8000/media/images/album/1.jpg"}
                  alt={userData.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div>
                  <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
                  <p className="text-[#B0B0B0]">{userData.bio || "No bio available"}</p>
                  <p className="text-[#B0B0B0]">Location: {userData.location || "Unknown"}</p>
                  <p className="text-[#B0B0B0]">Followers: {userData.followers || 0}</p>
                  <p className="text-[#B0B0B0]">Following: {userData.following || 0}</p>
                  <button
                    onClick={handleEditProfile}
                    className="mt-4 bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Image
                  src="/default-avatar.jpg"
                  alt="Default User"
                  width={80}
                  height={80}
                  className="rounded-full mx-auto"
                />
                <h2 className="text-xl font-bold text-white mt-4">Unknown User</h2>
                <p className="text-[#B0B0B0]">No bio available</p>
              </div>
            )}
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">Your Playlists</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userData && userData.playlists && userData.playlists.length > 0 ? (
                userData.playlists.map((playlist, index) => (
                  <div
                    key={index}
                    className="bg-[#2e3b47] p-4 rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    <Image
                      src={playlist.image}
                      alt={playlist.name}
                      width={150}
                      height={150}
                      className="rounded-lg mx-auto"
                    />
                    <h4 className="text-lg font-semibold text-white mt-4 text-center">
                      {playlist.name}
                    </h4>
                    <p className="text-[#B0B0B0] text-center">{playlist.tracks} tracks</p>
                  </div>
                ))
              ) : (
                <p className="text-[#B0B0B0]">No playlists available.</p>
              )}
            </div>
          </section>

          <section className="mt-8">
            <h3 className="text-2xl font-bold text-white mb-4">Your Favorite Tracks</h3>
            <div className="space-y-4">
              {userData && userData.favoriteTracks && userData.favoriteTracks.length > 0 ? (
                userData.favoriteTracks.map((track, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-[#2e3b47] p-4 rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    <div>
                      <h4 className="text-lg font-semibold text-white">{track.name}</h4>
                      <p className="text-[#B0B0B0]">{track.artist}</p>
                    </div>
                    <button className="bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]">
                      Play
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-[#B0B0B0]">No favorite tracks available.</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserPage;
