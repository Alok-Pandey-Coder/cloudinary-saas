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
      className="card bg-base-100 border border-base-300 shadow-xl transition-all duration-300 lg:hover:-translate-y-1 lg:hover:shadow-2xl"
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
              <p className="text-red-500">Preview not available</p>
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
        <div className="absolute bottom-3 right-3 flex items-center rounded-xl bg-base-100/80 px-3 py-1.5 text-xs font-medium sm:text-sm lg:px-4 lg:py-2 lg:text-lg">
          <Clock size={16} className="mr-1 lg:h-6 lg:w-6" />
          {formatDuration(video.duration)}
        </div>
      </figure>
      <div className="card-body p-5 lg:p-8">
        <h2 className="card-title text-xl font-bold lg:text-3xl">{video.title}</h2>
        <p className="mb-3 text-base text-base-content opacity-70 lg:text-xl">
          {video.description}
        </p>
        <p className="mb-5 text-sm text-base-content opacity-70 lg:text-lg">
          Uploaded {dayjs(video.createdAt).fromNow()}
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm lg:text-lg">
          <div className="flex items-center">
            <FileUp size={20} className="mr-2 text-primary" />
            <div>
              <div className="font-semibold">Original</div>
              <div>{formatSize(Number(video.originalSize))}</div>
            </div>
          </div>
          <div className="flex items-center">
            <FileDown size={20} className="mr-2 text-secondary" />
            <div>
              <div className="font-semibold">Compressed</div>
              <div>{formatSize(Number(video.compressedSize))}</div>
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="text-sm font-semibold lg:text-lg">
            Compression:{" "}
            <span className="text-accent">{compressionPercentage}%</span>
          </div>
          <button
            className="btn btn-primary btn-md gap-2 px-5 text-base lg:btn-lg lg:px-7 lg:text-lg"
            onClick={() =>
              onDownload(getFullVideoUrl(video.publicId), video.title)
            }
          >
            <Download size={18} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
