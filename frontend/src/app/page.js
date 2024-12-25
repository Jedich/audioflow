"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import MusicPlayer from "@/components/music-player";
import Image from "next/image";

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
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Music Streaming</h1>
        <button
          onClick={() => alert("Login functionality goes here!")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Playlists</h2>
          <ul className="flex-grow space-y-2">
            {playlists.map((playlist) => (
              <li
                key={playlist.id}
                className={`cursor-pointer p-2 rounded ${
                  selectedPlaylist.id === playlist.id ? "bg-gray-700" : ""
                }`}
                onClick={() => setSelectedPlaylist(playlist)}
              >
                {playlist.name}
              </li>
            ))}
          </ul>
          <button
            onClick={createPlaylist}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4"
          >
            Create Playlist
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center my-8">Discover Songs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {songs.map((song) => (
              <div key={song.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="relative w-full pb-[100%] mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={song.thumbnail}
                    alt={song.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-1 text-black">{song.name}</h3>
                <p className="text-gray-600 mb-1">{song.album ? "Album: " + song.album.name : ""}</p>
                <p className="text-gray-600 mb-2">
                  By{" "}
                  <Link
                    href={`/artist/${encodeURIComponent(song.artist.id)}`}
                    className="text-blue-500 hover:underline"
                  >
                    {song.artist.name}
                  </Link>
                </p>
                <button
                  onClick={() => playSong(song)}
                  className="text-blue-500 hover:underline"
                >
                  Listen Now
                </button>
              </div>
            ))}
          </div>
          {currentSong && (
            <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
              <MusicPlayer url={currentSong} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
