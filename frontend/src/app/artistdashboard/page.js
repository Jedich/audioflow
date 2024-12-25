"use client";

import React from "react";

const ArtistDashboard = () => {
  return (
    <div className="flex flex-col h-screen bg-[#181a1f]">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-[#1F2128] shadow-md">
        <h1 className="text-2xl font-bold text-[#7C3AED]">AudioFlow</h1>
        <nav className="flex space-x-4">
          <a href="/all-songs" className="text-[#B0B0B0] hover:text-[#7C3AED]">
            All Songs
          </a>
          <a href="/album-stats" className="text-[#B0B0B0] hover:text-[#7C3AED]">
            Album Stats
          </a>
        </nav>
        <button
          onClick={() => alert("Settings functionality goes here!")}
          className="bg-[#7C3AED] text-white py-2 px-4 rounded hover:bg-[#9F7AEA]"
        >
          Settings
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 p-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-5 gap-6 mb-8">
          {[
            { label: "Total Plays", value: "2.4M", change: "+12.5%", icon: "▶" },
            { label: "Unique Listeners", value: "892K", change: "+8.2%", icon: "🎧" },
            { label: "Total Likes", value: "156K", change: "+15.3%", icon: "❤️" },
            { label: "Shares", value: "45.2K", change: "+5.7%", icon: "🔗" },
            { label: "Top Song", value: "Cruel Summer", plays: "524K plays", icon: "🏆" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-[#2e3b47] p-4 rounded shadow-md flex flex-col items-center text-white"
            >
              <span className="text-2xl">{stat.icon}</span>
              <h3 className="text-lg font-semibold">{stat.label}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
              {stat.change ? (
                <p className="text-sm text-green-500">{stat.change} vs last period</p>
              ) : (
                <p className="text-sm text-[#B0B0B0]">{stat.plays}</p>
              )}
            </div>
          ))}
        </div>

        {/* Performance Over Time */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Performance Over Time</h2>
          <div className="bg-[#2e3b47] p-6 rounded shadow-md">
            <div className="w-full h-64 bg-[#1F2128] flex justify-center items-center">
              <p className="text-[#B0B0B0]">Graph Placeholder</p>
            </div>
          </div>
        </section>

        {/* Song Performance */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Song Performance</h2>
          <div className="bg-[#2e3b47] p-6 rounded shadow-md">
            <table className="w-full text-left text-white">
              <thead>
                <tr className="text-[#B0B0B0]">
                  <th className="py-2">Song Name</th>
                  <th>Plays</th>
                  <th>Unique Listeners</th>
                  <th>Likes</th>
                  <th>Shares</th>
                  <th>Avg. Duration</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Cruel Summer", plays: "524K", listeners: "245K", likes: "32.5K", shares: "12.3K", duration: "3:45" },
                  { name: "Anti-Hero", plays: "498K", listeners: "232K", likes: "30.2K", shares: "11.8K", duration: "3:20" },
                ].map((song, idx) => (
                  <tr key={idx} className="border-t border-[#3a464d]">
                    <td className="py-2">{song.name}</td>
                    <td>{song.plays}</td>
                    <td>{song.listeners}</td>
                    <td>{song.likes}</td>
                    <td>{song.shares}</td>
                    <td>{song.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Audience Demographics */}
        <section className="grid grid-cols-2 gap-6">
          <div className="bg-[#2e3b47] p-6 rounded shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Audience Demographics</h2>
            <div className="w-full h-48 bg-[#1F2128] flex justify-center items-center">
              <p className="text-[#B0B0B0]">Demographics Placeholder</p>
            </div>
          </div>
          <div className="bg-[#2e3b47] p-6 rounded shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Top Listeners</h2>
            <div className="w-full h-48 bg-[#1F2128] flex justify-center items-center">
              <p className="text-[#B0B0B0]">Top Listeners Placeholder</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ArtistDashboard;
