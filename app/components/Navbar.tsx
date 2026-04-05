"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-rose-200 shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 font-bold text-xl border-b border-gray-300">
          Dashboard
        </div>

        {/* Inventory Group */}
        <div className="mt-4">
          <h6 className="px-4 text-gray-700 uppercase text-xs font-semibold mb-2">
            Inventories
          </h6>
          <ul className="list-unstyled">
            <li>
              <Link
                href="/inventories/item"
                className="block px-4 py-2 hover:bg-rose-300 rounded"
              >
                Item
              </Link>
            </li>
            <li>
              <Link
                href="/inventories/supplier"
                className="block px-4 py-2 hover:bg-rose-300 rounded"
              >
                Supplier
              </Link>
            </li>
          </ul>
        </div>

        {/* User Management Group */}
        <div className="mt-4">
          <h6 className="px-4 text-gray-700 uppercase text-xs font-semibold mb-2">
            User Management
          </h6>
          <ul className="list-unstyled">
            <li>
              <Link
                href="/users"
                className="block px-4 py-2 hover:bg-rose-300 rounded"
              >
                Users
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <nav className="bg-rose-200 shadow-md p-4 flex items-center justify-between md:ml-64">
          <button
            className="md:hidden px-3 py-2 bg-rose-300 rounded"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Close" : "Menu"}
          </button>
          <span className="font-bold text-xl">Suemi Online Shop</span>
          <div>User</div>
        </nav>

        {/* Page Content */}
        <div className="p-4">
          <h1 className="text-2xl font-bold">Welcome!</h1>
          <p>Your main content goes here.</p>
        </div>
      </div>
    </div>
  );
}
