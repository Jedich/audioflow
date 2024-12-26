"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import MusicPlayer from "@/components/music-player";
import Image from "next/image";

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  // const [user, setUser] = useState(null);
  const [user, setUser] = useState({ name: "John Doe", avatar: "/user-avatar.jpg" });
  const [playlists, setPlaylists] = useState([{ id: 1, name: "Favorites", songs: [] }]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/songs/")
      .then((response) => response.json())
      .then((data) => setSongs(data));
  }, []);

  const playSong = (song) => {
    setCurrentSong(song);
  };

  const createPlaylist = () => {
    const newPlaylistName = prompt("Enter playlist name:");
    if (newPlaylistName) {
      const newPlaylist = { id: playlists.length + 1, name: newPlaylistName, songs: [] };
      setPlaylists([...playlists, newPlaylist]);
      setSelectedPlaylist(newPlaylist);
    }
  };

  // Filter songs based on search query
  const filteredSongs = songs.filter((song) =>
    song.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-[#181a1f]">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 bg-[#181a1f]">
          <h2 className="text-4xl font-bold text-center text-[#7C3AED] my-8">Discover Songs</h2>

          {/* Search Bar */}
          <div className="mb-8 flex justify-center">
            <input
              type="text"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 rounded border border-[#7C3AED] bg-[#2e3b47] text-white placeholder-[#B0B0B0] w-1/2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredSongs.map((song) => {
              var thumbnail =
                song.thumbnail ||
                (song.album && song.album.thumbnail) ||
                (song.artist && song.artist.thumbnail) ||
                "http://backend:8000/media/images/album/1.jpg";
              return (
                <div key={song.id} className="bg-[#2e3b47] p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                  <div className="relative w-full pb-[100%] mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={thumbnail}
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
              );
            })}
          </div>

          {currentSong && (
            <div className="fixed bottom-0 left-0 right-0 bg-[#1F2128] p-4 shadow-md">
              <MusicPlayer url={currentSong.file.replace('backend', 'localhost')} song_id={currentSong.id} artist_id={currentSong.artist.id} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
