import React, { useState, useCallback } from "react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { Download, Clock, FileDown, FileUp } from "lucide-react";
import dayjs from "dayjs";
import realtiveTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { Video } from "@/types/index";

dayjs.extend(realtiveTime);

interface VideoCardProps {
  video: Video;
  onDownload: (url: string, title: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const getThumbnailUrl = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      gravity: "auto",
      format: "jpg",
      quality: "auto",
      assetType: "video",
    });
  }, []);

  const getFullVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 1920,
      height: 1080,
    });
  }, []);

  const getPreviewVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 400,
      height: 225,
      rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"],
    });
  }, []);

  const formatSize = useCallback((size: number) => {
    return filesize(size);
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const compressionPercentage = Math.round(
    (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100,
  );

  const handlePreviewError = () => {
    setPreviewError(true);
  };

  return (
    <div
      className="card border border-base-300 bg-base-100 shadow-md transition-all duration-300 lg:hover:-translate-y-1 lg:hover:shadow-xl"
      onMouseEnter={() => {
        setPreviewError(false);
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <figure className="aspect-video relative">
        {isHovered ? (
          previewError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-sm text-red-500">Preview not available</p>
            </div>
          ) : (
            <video
              src={getPreviewVideoUrl(video.publicId)}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
              onError={handlePreviewError}
            />
          )
        ) : (
          <img
            src={getThumbnailUrl(video.publicId)}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-2 right-2 flex items-center rounded-lg bg-base-100/85 px-2.5 py-1 text-[11px] font-medium sm:bottom-3 sm:right-3 sm:px-3 sm:py-1.5 sm:text-xs lg:text-sm">
          <Clock size={14} className="mr-1 sm:h-4 sm:w-4" />
          {formatDuration(video.duration)}
        </div>
      </figure>
      <div className="card-body p-4 sm:p-5 lg:p-6">
        <h2 className="card-title text-lg font-bold sm:text-xl lg:text-2xl">{video.title}</h2>
        <p className="mb-2 text-sm text-base-content opacity-70 sm:text-base lg:text-lg">
          {video.description}
        </p>
        <p className="mb-4 text-xs text-base-content opacity-70 sm:text-sm lg:text-base">
          Uploaded {dayjs(video.createdAt).fromNow()}
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm lg:text-base">
          <div className="flex items-center">
            <FileUp size={16} className="mr-2 text-primary sm:h-5 sm:w-5" />
            <div>
              <div className="font-semibold">Original</div>
              <div>{formatSize(Number(video.originalSize))}</div>
            </div>
          </div>
          <div className="flex items-center">
            <FileDown size={16} className="mr-2 text-secondary sm:h-5 sm:w-5" />
            <div>
              <div className="font-semibold">Compressed</div>
              <div>{formatSize(Number(video.compressedSize))}</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold lg:text-base">
            Compression:{" "}
            <span className="text-accent">{compressionPercentage}%</span>
          </div>
          <button
            className="btn btn-primary btn-sm w-full gap-2 px-4 text-sm sm:w-auto sm:px-5 sm:text-base lg:btn-md"
            onClick={() =>
              onDownload(getFullVideoUrl(video.publicId), video.title)
            }
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
