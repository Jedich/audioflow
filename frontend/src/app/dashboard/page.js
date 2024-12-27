"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from "next/navigation";


const ArtistDashboard = () => {
  const [artistData, setArtistData] = useState(null);
  const [artistSongs, setArtistSongs] = useState([]);
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [topSong, setTopSong] = useState(null);

    const router = useRouter();

    useEffect(() => {
      const fetchArtistData = async () => {
        let artistId;
    
        const cachedUserData = localStorage.getItem("user_data");
    
        if (cachedUserData) {
          const parsedData = JSON.parse(cachedUserData);
          const userFromCache = parsedData.user;
          userFromCache.artist = parsedData.artist;
          setArtistData(userFromCache.artist);
          artistId = userFromCache.artist.id;
          setUser(userFromCache);
        } else {
          try {
            const userDataResponse = await fetch("http://localhost:8000/api/user/", {
              headers: {
                Authorization: `Bearer ${data.access_token}`,
              },
            });
    
            if (userDataResponse.ok) {
              const userData = await userDataResponse.json();
              userData.artist = userData.artist; // Ensure artist is properly added
              setArtistData(userData.artist);
              artistId = userData.artist.id;
              setUser(userData);
            } else {
              return router.push("/login");
            }
          } catch (error) {
            return router.push("/login");
          }
        }
    
        if (!artistId) return; // Ensure artistId exists before proceeding
    
        try {
          const response = await fetch("http://localhost:8080/artist_stats/" + artistId);
          if (response.ok) {
            const data = await response.json();
            setMetrics(data);
    
            if (data?.song_listens?.length > 0) {
              const top = data.song_listens.reduce((prev, curr) =>
                prev.total_listens > curr.total_listens ? prev : curr
              );
              setTopSong(top);
            }
          } else {
            setMetrics(null);
          }
        } catch (error) {
          console.error("Error fetching metrics:", error);
          setMetrics(null);
        }
      };
    
      fetchArtistData();
    }, []); // Ensure dependencies for the useEffect are set properly

  return (
    <div className="flex flex-col h-screen bg-[#181a1f]">
      <Header user={null} />

      {/* Content */}
      <main className="flex-1 p-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-5 gap-6 mb-8">
          {
          (metrics && topSong ? [
            { label: "Total Plays", value: metrics.total_listens, change: "NA%", icon: "▶" },
            { label: "Unique Listeners", value: metrics.unique_listens, change: "NA%", icon: "🎧" },
            { label: "Total Likes", value: "NA", change: "NA%", icon: "❤️" },
            { label: "Shares", value: "NA", change: "NA%", icon: "🔗" },
            { label: "Top Song", value: topSong.song_name, plays: topSong.total_listens + " plays", icon: "🏆" },
          ] : []).map((stat, idx) => (
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
        {(metrics && metrics.daily_listens && metrics.daily_listens.length > 0 ? (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Performance Over Time</h2>
          <div className="bg-[#2e3b47] p-6 rounded shadow-md">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.daily_listens}>
                <CartesianGrid stroke="#1F2128" />
                <XAxis dataKey="date" stroke="#B0B0B0" />
                <YAxis stroke="#B0B0B0" />
                <Tooltip contentStyle={{ backgroundColor: '#2e3b47', border: 'none' }} />
                <Line type="monotone" dataKey="listens" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
        ) : (""))}

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
                {
                // [
                //   { name: "Cruel Summer", plays: "524K", listeners: "245K", likes: "32.5K", shares: "12.3K", duration: "3:45" },
                //   { name: "Anti-Hero", plays: "498K", listeners: "232K", likes: "30.2K", shares: "11.8K", duration: "3:20" },
                // ]
                metrics && metrics.song_listens && metrics.song_listens.length > 0 ? (metrics.song_listens.map((song, idx) => (
                  <tr key={idx} className="border-t border-[#3a464d]">
                    <td className="py-2">{song.song_name}</td>
                    <td>{song.total_listens}</td>
                    <td>{song.unique_listens}</td>
                    <td>NA</td>
                    <td>NA</td>
                    <td>{song.duration}</td>
                  </tr>
                )
              )):("")}
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
