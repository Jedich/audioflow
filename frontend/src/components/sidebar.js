// components/Sidebar.js
import React from "react";
import Link from "next/link";

const Sidebar = ({ }) => {
  return (
    <aside className="w-64 bg-[#1b1d24] p-6 flex flex-col shadow-lg">
      <h2 className="text-2xl font-bold text-[#FFFFFF] mb-4">Your Library</h2>
      <ul className="flex-grow space-y-2">
        <hr />
          <li
            className={`cursor-pointer p-2 rounded bg-[#33314d] text-[#FFF]"`}
          >
            Favorites
          </li>
        <li className="text-[#B0B0B0] hover:text-[#7C3AED] cursor-pointer">Liked Songs</li>
        <li className="text-[#B0B0B0] hover:text-[#7C3AED] cursor-pointer">Recently Played</li>
        <hr />
        <li className="text-[#B0B0B0] hover:text-[#7C3AED] cursor-pointer">Summer Hits</li>
        <li className="text-[#B0B0B0] hover:text-[#7C3AED] cursor-pointer">Workout Mix</li>
        <li className="text-[#B0B0B0] hover:text-[#7C3AED] cursor-pointer">Chill Vibes</li>
      </ul>
      <button
        className="bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA] mt-4"
      >
        Create Playlist
      </button>
    </aside>
  );
};

export default Sidebar;