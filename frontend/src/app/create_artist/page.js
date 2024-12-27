"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/header";
import { useRouter } from "next/navigation";

const AddArtistPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [artistData, setArtistData] = useState({
    name: "",
    description: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cachedUserData = localStorage.getItem("user_data");
    if (cachedUserData) {
      setUser(JSON.parse(cachedUserData).user);  // Set user from cached data
    }
  }, []);

  const handleInputChange = (e) => {
    setArtistData({
      ...artistData,
      [e.target.id]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Create FormData object
    const formData = new FormData();
    formData.append('name', artistData.name);
    formData.append('description', artistData.description);
    console.log(user)
    formData.append('user_id', user.id);
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }
    

    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch("http://localhost:8000/api/artists/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        router.push("/"); // Redirect to homepage after successful creation
      } else {
        const errorData = await response.json();
        setErrors({
          backend: errorData.error || "Failed to create artist. Please try again.",
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
          <h2 className="text-3xl font-bold text-white mb-6">Create Artist Profile</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-[#B0B0B0] mb-2 font-semibold"
              >
                Artist Name
              </label>
              <input
                type="text"
                id="name"
                value={artistData.name}
                onChange={handleInputChange}
                className="w-full bg-[#2e3b47] text-white p-3 rounded outline-none"
                placeholder="Enter artist name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-[#B0B0B0] mb-2 font-semibold"
              >
                Description
              </label>
              <textarea
                id="description"
                value={artistData.description}
                onChange={handleInputChange}
                className="w-full bg-[#2e3b47] text-white p-3 rounded outline-none min-h-[100px]"
                placeholder="Enter artist description"
                required
              />
            </div>

            <div>
              <label
                htmlFor="thumbnail"
                className="block text-[#B0B0B0] mb-2 font-semibold"
              >
                Artist Photo
              </label>
              <div 
                className="w-full bg-[#2e3b47] text-white p-4 rounded flex justify-center items-center border border-dashed border-[#7C3AED] cursor-pointer"
                onClick={() => document.getElementById('thumbnail').click()}
              >
                <span className="text-[#7C3AED]">
                  {thumbnail ? thumbnail.name : "Upload artist photo"}
                </span>
                <input 
                  type="file" 
                  id="thumbnail" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept="image/*"
                  required
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
                {loading ? "Creating..." : "Create Artist"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddArtistPage;