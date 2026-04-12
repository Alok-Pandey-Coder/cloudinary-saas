"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  ImageIcon,
} from "lucide-react";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="sidebar-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <header className="w-full border-b border-base-300/80 bg-base-200">
          <div className="navbar mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="sidebar-drawer"
                className="btn btn-square btn-ghost drawer-button"
              >
                <MenuIcon />
              </label>
            </div>
            <div className="flex-1">
              <Link href="/" onClick={handleLogoClick}>
                <div className="btn btn-ghost cursor-pointer text-lg font-bold normal-case tracking-tight sm:text-xl lg:text-2xl">
                  Cloudinary Showcase
                </div>
              </Link>
            </div>
            <div className="flex-none flex items-center space-x-3">
              {user && (
                <>
                  <div className="avatar">
                    <div className="h-8 w-8 rounded-full lg:h-9 lg:w-9">
                      <img
                        src={user.imageUrl}
                        alt={
                          user.username || user.emailAddresses[0].emailAddress
                        }
                      />
                    </div>
                  </div>
                  <span className="max-w-40 truncate text-sm lg:max-w-sm lg:text-base">
                    {user.username || user.emailAddresses[0].emailAddress}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="btn btn-ghost btn-circle btn-sm lg:btn-md"
                  >
                    <LogOutIcon className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </header>
        {/* Page content */}
        <main className="grow">
          <div className="mx-auto my-5 w-full max-w-7xl px-3 sm:px-4 lg:my-7 lg:px-6">
            {children}
          </div>
        </main>
      </div>
      <div className="drawer-side">
        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
        <aside className="flex h-full w-56 flex-col bg-base-200 lg:w-64">
          <div className="flex items-center justify-center py-4">
            <ImageIcon className="h-8 w-8 text-primary lg:h-10 lg:w-10" />
          </div>
          <ul className="menu grow w-full p-3 text-sm text-base-content lg:text-base">
            {sidebarItems.map((item) => (
              <li key={item.href} className="mb-1">
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 rounded-lg px-3 py-2.5 lg:py-3 ${
                    pathname === item.href
                      ? "bg-primary text-white"
                      : "hover:bg-base-300"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 lg:h-6 lg:w-6" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          {user && (
            <div className="p-3">
              <button
                onClick={handleSignOut}
                className="btn btn-outline btn-error btn-sm w-full lg:btn-md"
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
