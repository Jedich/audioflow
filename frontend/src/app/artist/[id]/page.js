"use client";

import React, { useEffect, useState } from "react";


export default function Page({params}) {
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [artistSongs, setArtistSongs] = useState(true);


  useEffect(() => {
    if (!params.id) return;

    // Fetch all songs from the API
    fetch("http://localhost:8000/api/songs/")
      .then((response) => response.json())
      .then((data) => {
        // Filter songs by artist ID (assuming artist ID is passed in the URL)
        const artistSongs = data.filter((song) => song.artist.id == params.id);
        console.log(artistSongs, data)
        setArtist(artistSongs[0].artist); // Set the artist name or ID
        setArtistSongs(artistSongs);
        groupSongsByAlbum(artistSongs);
        console.log(albums)
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching artist's songs:", error);
        setLoading(false);
      });
  }, [params.id]);

  // Group songs by album
  const groupSongsByAlbum = (songs) => {
    const albums = {};

    songs.forEach((song) => {
      
      const albumName = song.album.name;
      if (albumName != undefined && !albums[albumName]) {
        albums[albumName] = [];
      }
      albums[albumName].push(song);
      console.log(albums)
    });

    setAlbums(Object.entries(albums).map(([albumName, songs]) => ({ name: albumName, songs })));
    
  };

  if (loading) return <div>Loading...</div>;

  if (!artist) return <div>Artist not found.</div>;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Artist: {artist.name}</h1>
      </header>

      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center my-8">Songs by {artist.name}</h2>
          {console.log(albums)}
          {/* {albums && albums.length > 0 ? ( */}
            <div className="space-y-8">

                    {artistSongs.map((song) => (
                      <div key={song.id} className="p-2 bg-gray-100 rounded-lg">
                        <p className="text-gray-600">{song.name}</p>
                        <p className="text-gray-600">{(song.duration / 60).toFixed(2)} minutes</p>
                        <a
                          href={song.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Listen Now
                        </a>
                      </div>
                    ))}
            </div>
          {/* ) : (
            <p>No albums available.</p>
          )} */}
        </main>
      </div>
    </div>
  );
}
