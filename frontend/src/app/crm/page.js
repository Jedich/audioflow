"use client";

import React from "react";
import "./style.css";
export default function CRMDashboard() {
  return (
    <div className="flex h-screen bg-dark-bg text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-sidebar p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-purple">CRM Dashboard</h2>
        <nav className="mt-8 space-y-4">
          <a href="#" className="text-light-gray hover:text-purple flex items-center">
            <span className="mr-3">📊</span> Dashboard
          </a>
          <a href="#" className="text-light-gray hover:text-purple flex items-center">
            <span className="mr-3">👤</span> Users
          </a>
          <a href="#" className="text-light-gray hover:text-purple flex items-center">
            <span className="mr-3">🎵</span> Playlists
          </a>
          <a href="#" className="text-light-gray hover:text-purple flex items-center">
            <span className="mr-3">📈</span> Analytics
          </a>
          <a href="#" className="text-light-gray hover:text-purple flex items-center">
            <span className="mr-3">⚙️</span> Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-dark-content">
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <input
            type="text"
            placeholder="Search..."
            className="bg-dark-input text-white p-2 rounded"
          />
        </header>

        {/* Statistics */}
        <section className="grid grid-cols-4 gap-6 my-6">
          <div className="bg-dark-card p-4 rounded shadow">
            <h3 className="text-lg">Total Users</h3>
            <p className="text-2xl font-bold">24,591</p>
            <p className="text-green">+12% from last month</p>
          </div>
          <div className="bg-dark-card p-4 rounded shadow">
            <h3 className="text-lg">Active Users</h3>
            <p className="text-2xl font-bold">18,472</p>
            <p className="text-green">+8% from last month</p>
          </div>
          <div className="bg-dark-card p-4 rounded shadow">
            <h3 className="text-lg">Total Playlists</h3>
            <p className="text-2xl font-bold">3,845</p>
            <p className="text-green">+15% from last month</p>
          </div>
          <div className="bg-dark-card p-4 rounded shadow">
            <h3 className="text-lg">Monthly Plays</h3>
            <p className="text-2xl font-bold">892K</p>
            <p className="text-green">+20% from last month</p>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-dark-card p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Sarah Anderson</p>
                <p className="text-sm text-light-gray">
                  Created new playlist: "Summer Hits 2025"
                </p>
              </div>
              <p className="text-sm text-light-gray">2 min ago</p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Steve Huis</p>
                <p className="text-sm text-light-gray">Updated profile information</p>
              </div>
              <p className="text-sm text-light-gray">15 min ago</p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Mike Johnson</p>
                <p className="text-sm text-light-gray">
                  Added 15 new songs to "Workout Mix"
                </p>
              </div>
              <p className="text-sm text-light-gray">1 hour ago</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
