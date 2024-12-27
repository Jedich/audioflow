"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ArtistProfilePage = () => {
  const [artistData, setArtistData] = useState(null);
  const [artistSongs, setArtistSongs] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();
  
  useEffect(() => {

    const fetchArtistData = async () => {
        var artistId;
        const cachedUserData = localStorage.getItem("user_data");
        // If user data is in localStorage, use it
        if (cachedUserData) {
            var u = JSON.parse(cachedUserData).user;
            u.artist = JSON.parse(cachedUserData).artist
            console.log(u)
            setArtistData(u.artist);
            artistId = u.artist.id; 
            setUser(u)
          } else {
              try {
              const userDataResponse = await fetch("http://localhost:8000/api/user/", {
                  headers: {
                    "Authorization": `Bearer ${data.access_token}`,
                  },
                });
          
                if (userDataResponse.ok) {
                    var u = JSON.parse(cachedUserData).user;
                    u.artist = JSON.parse(cachedUserData).artist
                    console.log(u)
                    setArtistData(u.artist);
                    artistId = u.artist.id; 
                    setUser(u)
                } else {
                    router.push("/login");
                }
            } catch (error) {
                router.push("/login");
            }
        }

      // Fetch artist data only if there's a valid artistId
      if (artistId) {
        try {
          const songsResponse = await fetch(`http://localhost:8000/api/artists/${artistId}/songs`);
          console.log(songsResponse)
          if (songsResponse.ok) {
            const songsData = await songsResponse.json();
            console.log(songsData);
            setArtistSongs(songsData);
          } else {
            setArtistSongs([]);
          }
        } catch (error) {
          console.error("Error fetching artist songs:", error);
          setArtistSongs([]);
        }
      }
    };

    fetchArtistData();
  }, []);

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
                  {(user ? <p className="text-[#B0B0B0]"> @ {user.username} </p> : (""))}
                  {artistData.description ? (
                    <p className="text-[#B0B0B0]">{artistData.description}</p>
                  ) : (
                    ""
                  )}
                  <p className="text-[#B0B0B0]">Rock • 10M monthly listeners</p>
                  <button className="mt-4 bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]">Play</button>
                  <button className="mt-4 ml-4 bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]">Follow</button>
                  { user && user.is_artist && user.artist.id == artistData.id ?
                  (<a href={`/dashboard/`} className="mt-4 ml-4 bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]">Dashboard</a>) : ("")}
                  { user && user.is_staff ?
                  (<a href={`http://localhost:8000/admin/`} className="mt-4 ml-4 bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]">Admin Page</a>) : ("")}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Image
                  src="/default-artist.jpg"
                  alt="Default Artist"
                  width={100}
                  height={100}
                  className="rounded-full mx-auto"
                />
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
                  var thumbnail = album.thumbnail
                    ? album.thumbnail
                    : album.artist && album.artist.thumbnail
                    ? album.artist.thumbnail
                    : "http://backend:8000/media/images/album/1.jpg";
                  console.log(thumbnail);
                  return (
                    <div
                      key={index}
                      className="bg-[#2e3b47] p-4 rounded-lg shadow-md hover:shadow-lg transition"
                    >
                      <Image
                        src={thumbnail}
                        alt={album.name}
                        width={150}
                        height={150}
                        className="rounded-lg mx-auto"
                      />
                      <h4 className="text-lg font-semibold text-white mt-4 text-center">{album.name}</h4>
                      <p className="text-[#B0B0B0] text-center">2000 • 5 tracks</p>
                    </div>
                  );
                })
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
                  var thumbnail =
                    track.thumbnail
                      ? track.thumbnail
                      : track.album && track.album.thumbnail
                      ? track.album.thumbnail
                      : track.artist && track.artist.thumbnail
                      ? track.artist.thumbnail
                      : "http://backend:8000/media/images/album/1.jpg";
                  console.log(thumbnail);
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-[#2e3b47] p-4 rounded-lg shadow-md hover:shadow-lg transition"
                    >
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

export default ArtistProfilePage;
