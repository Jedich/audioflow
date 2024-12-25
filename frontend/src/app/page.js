"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import MusicPlayer from "@/components/music-player";
import Image from "next/image";
// import "./main.css"; // Для стилів

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [playlists, setPlaylists] = useState([{ id: 1, name: "Favorites", songs: [] }]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0]);

  useEffect(() => {
    fetch("http://localhost:8000/api/songs/")
      .then((response) => response.json())
      .then((data) => setSongs(data));
  }, []);

  const playSong = (song) => {
    setCurrentSong(song.file);
  };

  const createPlaylist = () => {
    const newPlaylistName = prompt("Enter playlist name:");
    if (newPlaylistName) {
      const newPlaylist = { id: playlists.length + 1, name: newPlaylistName, songs: [] };
      setPlaylists([...playlists, newPlaylist]);
      setSelectedPlaylist(newPlaylist);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#181a1f]">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-[#1F2128] shadow-md">
        <h1 className="text-2xl font-bold text-[#7C3AED]">AudioFlow</h1>
        <nav className="flex space-x-4">
          <Link href={`/artistpage`} className="text-[#B0B0B0] hover:text-[#7C3AED]">
            Artist Page
          </Link>
          <Link href={`/userpage`} className="text-[#B0B0B0] hover:text-[#7C3AED]">
            User Page
          </Link>
        </nav>
        <button
          onClick={() => alert("Login functionality goes here!")}
          className="bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]"
        >
          Login
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1F2128] p-6 flex flex-col shadow-lg">
          <h2 className="text-2xl font-bold text-[#7C3AED] mb-4">Your Library</h2>
          <ul className="flex-grow space-y-2">
          {playlists.map((playlist) => (
              <li
                key={playlist.id}
                className={`cursor-pointer p-2 rounded ${
                  selectedPlaylist.id === playlist.id
                    ? "bg-[#333] text-[#7C3AED]"
                    : "text-[#B0B0B0]"
                }`}
                onClick={() => setSelectedPlaylist(playlist)}
              >
                {playlist.name}
              </li>
              
            ))}
            <li className="text-[#B0B0B0] hover:text-[#7C3AED] cursor-pointer">Liked Songs</li>
            <li className="text-[#B0B0B0] hover:text-[#7C3AED] cursor-pointer">Recently Played</li>
            <li className="text-[#B0B0B0] hover:text-[#7C3AED] cursor-pointer">Summer Hits</li>
            <li className="text-[#B0B0B0] hover:text-[#7C3AED] cursor-pointer">Workout Mix</li>
            <li className="text-[#B0B0B0] hover:text-[#7C3AED] cursor-pointer">Chill Vibes</li>
          </ul>
          <button
            onClick={createPlaylist}
            className="bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA] mt-4"
          >
            Create Playlist
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-[#181a1f]">
          <h2 className="text-4xl font-bold text-center text-[#7C3AED] my-8">Discover Songs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song) => (
              <div key={song.id} className="bg-[#2e3b47] p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                <div className="relative w-full pb-[100%] mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={song.thumbnail}
                    alt={song.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{song.name}</h3>
                <p className="text-sm text-[#B0B0B0] mb-1">
                  {song.album ? "Album: " + song.album.name : ""}
                </p>
                <p className="text-sm text-[#B0B0B0] mb-2">
                  By
                  <Link
                    href={`/artist/${encodeURIComponent(song.artist.id)}`}
                    className="text-[#7C3AED] hover:underline ml-1"
                  >
                    {song.artist.name}
                  </Link>
                </p>
                <button
                  onClick={() => playSong(song)}
                  className="bg-[#7C3AED] text-white py-1 px-3 rounded hover:bg-[#9F7AEA]"
                >
                  Listen Now
                </button>
              </div>
            ))}
          </div>

          {currentSong && (
            <div className="fixed bottom-0 left-0 right-0 bg-[#1F2128] p-4 shadow-md">
              <MusicPlayer url={currentSong} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
