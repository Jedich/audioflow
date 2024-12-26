"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import Image from "next/image";

const ArtistPage = ({params}) => {
  const [artistData, setArtistData] = useState(null);
  const [artistSongs, setArtistSongs] = useState([]);
  const [user, setUser] = useState({ name: "John Doe", avatar: "/user-avatar.jpg" });

  useEffect(() => {
    // Imitating fetching artist data (replace with actual API request)
    const fetchArtistData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/artists/' + params.id);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setArtistData(data);
        } else {
          setArtistData(null);
        }
      } catch (error) {
        console.error("Error fetching artist data:", error);
        setArtistData(null);
      }

      try {
        const response = await fetch('http://localhost:8000/api/artists/' + params.id + "/songs");
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setArtistSongs(data);
        } else {
          setArtistSongs([]);
        }
      } catch (error) {
        console.error("Error fetching artist data:", error);
        setArtistData(null);
      }
    };

    fetchArtistData();
    console.log(artistData);
  }, [params.id]);

  const handleLogout = () => {
    alert("Logging out...");
  };

  return (
    <div className="flex flex-col h-screen bg-[#181a1f]">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 bg-[#181a1f]">
          {/* Artist Info */}
          <section className="bg-[#1F2128] p-8 rounded-lg shadow-lg mb-8">
            {artistData ? (
              <div className="flex items-center space-x-6">
                <Image 
                  src={artistData.thumbnail} 
                  alt={artistData.name} 
                  width={200} 
                  height={200} 
                  className="rounded-full" 
                />
                <div>
                  <h2 className="text-2xl font-bold text-white">{artistData.name}</h2>
                  <p className="text-[#B0B0B0]">Rock • 10M monthly listeners</p>
                  <button className="mt-4 bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]">Play</button>
                  <button className="mt-4 ml-4 bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]">Follow</button>
                  <a href="/dashboard" className="mt-4 ml-4 bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]">Dashboard</a>
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
              {artistSongs && artistSongs.albums && artistSongs.albums.length > 0 ? (
                artistSongs.albums.map((album, index) => {
                  var thumbnail = album.thumbnail ? album.thumbnail : album.artist && album.artist.thumbnail ? album.artist.thumbnail : "http://backend:8000/media/images/album/1.jpg"
                  console.log(thumbnail)
                  return (
                  <div key={index} className="bg-[#2e3b47] p-4 rounded-lg shadow-md hover:shadow-lg transition">
                    <Image 
                      src={thumbnail} 
                      alt={album.name} 
                      width={150} 
                      height={150} 
                      className="rounded-lg mx-auto" 
                    />
                    <h4 className="text-lg font-semibold text-white mt-4 text-center">{album.name}</h4>
                    <p className="text-[#B0B0B0] text-center">{album.year} • {album.tracks} tracks</p>
                  </div>
                )})
              ) : (
                <p className="text-[#B0B0B0]">No albums available.</p>
              )}
            </div>
          </section>

          {/* Popular Tracks */}
          <section>
            <h3 className="text-2xl font-bold text-white mb-4">Popular Tracks</h3>
            <div className="space-y-4">
              {artistSongs && artistSongs.songs && artistSongs.songs.length > 0 ? (
                artistSongs.songs.map((track, index) => {
                  // Determine the cover image

                  var thumbnail = track.thumbnail ? track.thumbnail : track.album && track.album.thumbnail ? track.album.thumbnail : track.artist && track.artist.thumbnail ? track.artist.thumbnail : "http://backend:8000/media/images/album/1.jpg"
                  console.log(thumbnail)
                  return (
                    <div key={index} className="flex justify-between items-center bg-[#2e3b47] p-4 rounded-lg shadow-md hover:shadow-lg transition">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={thumbnail}
                          alt={track.name}
                          width={150} 
                          height={150} 
                          className="rounded-lg" 
                        />
                        <div>
                          <h4 className="text-lg font-semibold text-white">{track.name}</h4>
                          <p className="text-[#B0B0B0]">
                            {track.album ? track.album.name : ""} • {track.release_date}
                          </p>
                        </div>
                      </div>
                      <button className="bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]">Play</button>
                    </div>
                  );
                })
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
