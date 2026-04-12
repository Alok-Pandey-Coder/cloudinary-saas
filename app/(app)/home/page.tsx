"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/types";
function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error(" Unexpected response format");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[45vh] items-center justify-center">
        <span className="loading loading-spinner loading-md mr-2" />
        <p className="text-base font-semibold lg:text-lg">Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full py-3 lg:py-5">
      <div className="mb-6 rounded-2xl border border-base-300 bg-base-200/70 p-4 shadow-sm lg:mb-8 lg:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight lg:text-4xl">
              Videos
            </h1>
            <p className="mt-2 text-sm text-base-content/80 lg:text-base">
              Explore your uploaded and compressed clips with quick downloads.
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm w-full px-4 text-sm sm:w-auto lg:btn-md lg:px-6 lg:text-base"
            onClick={fetchVideos}
          >
            Refresh List
          </button>
        </div>
      </div>

      {error ? (
        <div className="alert alert-error flex flex-col items-start gap-3 text-sm shadow-lg sm:flex-row sm:items-center sm:justify-between lg:text-base">
          <span>{error}</span>
          <button
            className="btn btn-xs btn-outline w-full text-white hover:bg-white/15 sm:w-auto lg:btn-sm lg:text-sm"
            onClick={fetchVideos}
          >
            Try Again
          </button>
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/50 py-10 text-center text-lg text-base-content/70 lg:text-2xl">
          No videos found yet
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6 2xl:grid-cols-3">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
