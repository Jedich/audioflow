"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/header";
import { useRouter } from "next/navigation";

const AddSongPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [songData, setSongData] = useState({
    name: "",
    duration: 0,
    album: "",
  });
  const [files, setFiles] = useState({
    thumbnail: null,
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user data from localStorage on component mount
    const userData = localStorage.getItem("user_data");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleInputChange = (e) => {
    setSongData({
      ...songData,
      [e.target.id]: e.target.value
    });
  };

  const handleFileChange = (e, fileType) => {
    setFiles({
      ...files,
      [fileType]: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Create FormData object
    const formData = new FormData();
    formData.append('name', songData.name);
    formData.append('duration', songData.duration);
    if (songData.album) {
      formData.append('album_id', songData.album);
    }
    formData.append('artist_id', user.artist.id);
    formData.append('artist', user.artist.id);

    if (files.thumbnail) {
      formData.append('thumbnail', files.thumbnail);
    }
    if (files.file) {
      formData.append('file', files.file);
    }
    

    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch("http://localhost:8000/api/songs/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        router.push("/"); // Redirect to homepage after successful upload
      } else {
        const errorData = await response.json();
        setErrors({
          backend: errorData.error || "Failed to upload song. Please try again.",
        });
      }
    } catch (error) {
      setErrors({
        backend: "Network error. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#181a1f]">
      <Header user={user} />

      <main className="flex flex-1 justify-center items-center bg-[#181a1f]">
        <div className="bg-[#1F2128] p-8 rounded-lg shadow-lg w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-white mb-6">Add New Song</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-[#B0B0B0] mb-2 font-semibold"
              >
                Song Title
              </label>
              <input
                type="text"
                id="name"
                value={songData.name}
                onChange={handleInputChange}
                className="w-full bg-[#2e3b47] text-white p-3 rounded outline-none"
                placeholder="Enter song title"
                required
              />
            </div>

            <div>
              <label
                htmlFor="duration"
                className="block text-[#B0B0B0] mb-2 font-semibold"
              >
                Duration (seconds)
              </label>
              <input
                type="number"
                id="duration"
                value={songData.duration}
                onChange={handleInputChange}
                className="w-full bg-[#2e3b47] text-white p-3 rounded outline-none"
                placeholder="Enter duration in seconds"
                required
                min="1"
              />
            </div>

            <div>
              <label
                htmlFor="album"
                className="block text-[#B0B0B0] mb-2 font-semibold"
              >
                Album ID
              </label>
              <input
                type="text"
                id="album"
                value={songData.album}
                onChange={handleInputChange}
                className="w-full bg-[#2e3b47] text-white p-3 rounded outline-none"
                placeholder="Enter album ID (optional)"
              />
            </div>

            <div>
              <label
                htmlFor="file"
                className="block text-[#B0B0B0] mb-2 font-semibold"
              >
                Upload Song File
              </label>
              <div 
                className="w-full bg-[#2e3b47] text-white p-4 rounded flex justify-center items-center border border-dashed border-[#7C3AED] cursor-pointer"
                onClick={() => document.getElementById('file').click()}
              >
                <span className="text-[#7C3AED]">
                  {files.file ? files.file.name : "Drag and drop or click to browse"}
                </span>
                <input 
                  type="file" 
                  id="file" 
                  className="hidden" 
                  onChange={(e) => handleFileChange(e, 'file')}
                  accept="audio/*"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="thumbnail"
                className="block text-[#B0B0B0] mb-2 font-semibold"
              >
                Album Artwork
              </label>
              <div 
                className="w-full bg-[#2e3b47] text-white p-4 rounded flex justify-center items-center border border-dashed border-[#7C3AED] cursor-pointer"
                onClick={() => document.getElementById('thumbnail').click()}
              >
                <span className="text-[#7C3AED]">
                  {files.thumbnail ? files.thumbnail.name : "Drag and drop or click to browse"}
                </span>
                <input 
                  type="file" 
                  id="thumbnail" 
                  className="hidden" 
                  onChange={(e) => handleFileChange(e, 'thumbnail')}
                  accept="image/*"
                />
              </div>
            </div>

            {errors.backend && (
              <p className="text-red-500 text-sm">{errors.backend}</p>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Save Song"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddSongPage;