"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const ArtistPage = () => {
  const [artistData, setArtistData] = useState(null);
  const [user, setUser] = useState({ name: "John Doe", avatar: "/user-avatar.jpg" });

  useEffect(() => {
    // Imitating fetching artist data (replace with actual API request)
    const fetchArtistData = async () => {
      try {
        const response = await fetch('/api/artist'); // Replace with your API
        if (response.ok) {
          const data = await response.json();
          setArtistData(data);
        } else {
          setArtistData(null);
        }
      } catch (error) {
        console.error("Error fetching artist data:", error);
        setArtistData(null);
      }
    };

    fetchArtistData();
  }, []);

  const handleLogout = () => {
    alert("Logging out...");
  };

  return (
    <div className="flex flex-col h-screen bg-[#181a1f]">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 bg-[#1F2128] shadow-md">
        <h1 className="text-2xl font-bold text-[#7C3AED]">AudioFlow</h1>
        <nav className="space-x-4">
          <Link href="/" className="text-[#B0B0B0] hover:text-[#7C3AED]">Home</Link>
          <Link href="/library" className="text-[#B0B0B0] hover:text-[#7C3AED]">Library</Link>
          <Link href="/search" className="text-[#B0B0B0] hover:text-[#7C3AED]">Search</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Image
                      src={user.avatar}
                      alt="Pic"
                      width={10}
                      height={10}
                      className="rounded-full"
                    />
          <span className="text-white">{user.name}</span>
          <button onClick={handleLogout} className="bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]">
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1F2128] p-6 flex flex-col shadow-lg">
          <h2 className="text-2xl font-bold text-[#7C3AED] mb-4">Your Library</h2>
          <ul className="space-y-2">
            <li className="text-[#B0B0B0] hover:text-[#7C3AED] cursor-pointer">Liked Songs</li>
            <li className="text-[#B0B0B0] hover:text-[#7C3AED] cursor-pointer">Recently Played</li>
            <li className="text-[#B0B0B0] hover:text-[#7C3AED] cursor-pointer">Summer Hits</li>
            <li className="text-[#B0B0B0] hover:text-[#7C3AED] cursor-pointer">Workout Mix</li>
            <li className="text-[#B0B0B0] hover:text-[#7C3AED] cursor-pointer">Chill Vibes</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-[#181a1f]">
          {/* Artist Info */}
          <section className="bg-[#1F2128] p-8 rounded-lg shadow-lg mb-8">
            {artistData ? (
              <div className="flex items-center space-x-6">
                <Image src={artistData.image} alt={artistData.name} width={100} height={100} className="rounded-full" />
                <div>
                  <h2 className="text-2xl font-bold text-white">{artistData.name}</h2>
                  <p className="text-[#B0B0B0]">{artistData.genre} • {artistData.listeners} monthly listeners</p>
                  <button className="mt-4 bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]">Play</button>
                  <button className="mt-4 ml-4 bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]">Follow</button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Image src="/default-artist.jpg" alt="Default Artist" width={100} height={100} className="rounded-full mx-auto" />
                <h2 className="text-xl font-bold text-white mt-4">Unknown Artist</h2>
                <p className="text-[#B0B0B0]">Genre • 0 monthly listeners</p>
              </div>
            )}
          </section>

          {/* Popular Albums */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Popular Albums</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {artistData && artistData.albums && artistData.albums.length > 0 ? (
                artistData.albums.map((album, index) => (
                  <div key={index} className="bg-[#2e3b47] p-4 rounded-lg shadow-md hover:shadow-lg transition">
                    <Image src={album.image} alt={album.name} width={150} height={150} className="rounded-lg mx-auto" />
                    <h4 className="text-lg font-semibold text-white mt-4 text-center">{album.name}</h4>
                    <p className="text-[#B0B0B0] text-center">{album.year} • {album.tracks} tracks</p>
                  </div>
                ))
              ) : (
                <p className="text-[#B0B0B0]">No albums available.</p>
              )}
            </div>
          </section>

          {/* Popular Tracks */}
          <section>
            <h3 className="text-2xl font-bold text-white mb-4">Popular Tracks</h3>
            <div className="space-y-4">
              {artistData && artistData.tracks && artistData.tracks.length > 0 ? (
                artistData.tracks.map((track, index) => (
                  <div key={index} className="flex justify-between items-center bg-[#2e3b47] p-4 rounded-lg shadow-md hover:shadow-lg transition">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{track.name}</h4>
                      <p className="text-[#B0B0B0]">{track.album} • {track.year}</p>
                    </div>
                    <button className="bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]">Play</button>
                  </div>
                ))
              ) : (
                <p className="text-[#B0B0B0]">No tracks available.</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ArtistPage;
