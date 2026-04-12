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
        <span className="loading loading-spinner loading-lg mr-3" />
        <p className="text-xl font-semibold lg:text-2xl">Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full py-5 lg:py-10">
      <div className="mb-8 rounded-3xl border border-base-300 bg-base-200/70 p-6 shadow-sm lg:mb-12 lg:p-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight lg:text-6xl">
              Videos
            </h1>
            <p className="mt-3 text-base text-base-content/80 lg:text-xl">
              Explore your uploaded and compressed clips with quick downloads.
            </p>
          </div>
          <button
            className="btn btn-primary btn-md px-5 text-base lg:btn-lg lg:px-8 lg:text-lg"
            onClick={fetchVideos}
          >
            Refresh List
          </button>
        </div>
      </div>

      {error ? (
        <div className="alert alert-error flex flex-col items-start gap-3 text-base shadow-lg sm:flex-row sm:items-center sm:justify-between lg:text-xl">
          <span>{error}</span>
          <button
            className="btn btn-sm btn-outline text-white hover:bg-white/15 lg:btn-md lg:text-base"
            onClick={fetchVideos}
          >
            Try Again
          </button>
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/50 py-14 text-center text-xl text-base-content/70 lg:text-3xl">
          No videos found yet
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-10 2xl:grid-cols-3">
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
