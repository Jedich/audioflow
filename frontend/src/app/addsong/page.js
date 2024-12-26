"use client";

import React from "react";

const AddSongPage = () => {
  return (
    <div className="flex flex-col h-screen bg-[#181a1f]">
      <Header user={null} />

      {/* Content */}
      <main className="flex flex-1 justify-center items-center bg-[#181a1f]">
        <div className="bg-[#1F2128] p-8 rounded-lg shadow-lg w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-white mb-6">Add New Song</h2>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="songTitle"
                className="block text-[#B0B0B0] mb-2 font-semibold"
              >
                Song Title
              </label>
              <input
                type="text"
                id="songTitle"
                className="w-full bg-[#2e3b47] text-white p-3 rounded outline-none"
                placeholder="Enter song title"
              />
            </div>
            <div>
              <label
                htmlFor="album"
                className="block text-[#B0B0B0] mb-2 font-semibold"
              >
                Album
              </label>
              <input
                type="text"
                id="album"
                className="w-full bg-[#2e3b47] text-white p-3 rounded outline-none"
                placeholder="Enter album name"
              />
            </div>
            <div>
              <label
                htmlFor="songFile"
                className="block text-[#B0B0B0] mb-2 font-semibold"
              >
                Upload Song File
              </label>
              <div className="w-full bg-[#2e3b47] text-white p-4 rounded flex justify-center items-center border border-dashed border-[#7C3AED]">
                <span className="text-[#7C3AED]">Drag and drop or click to browse</span>
                <input type="file" id="songFile" className="hidden" />
              </div>
            </div>
            <div>
              <label
                htmlFor="albumArtwork"
                className="block text-[#B0B0B0] mb-2 font-semibold"
              >
                Album Artwork
              </label>
              <div className="w-full bg-[#2e3b47] text-white p-4 rounded flex justify-center items-center border border-dashed border-[#7C3AED]">
                <span className="text-[#7C3AED]">Drag and drop or click to browse</span>
                <input type="file" id="albumArtwork" className="hidden" />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]"
              >
                Save Song
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddSongPage;
