"use client";

import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.log(error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!imageRef.current) return;

    try {
      const response = await fetch(imageRef.current.src);

      if (!response.ok) {
        throw new Error("Failed to fetch image for download");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      alert("Failed to download image");
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-3 py-3 sm:px-4 sm:py-4">
      <h1 className="mb-4 text-center text-xl font-bold sm:mb-5 sm:text-2xl lg:text-3xl">
        Social Media Image Creator
      </h1>

      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-4 sm:p-5">
          <h2 className="card-title mb-3 text-lg sm:mb-4 sm:text-xl">Upload an Image</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm">Choose an image file</span>
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="file-input file-input-bordered file-input-primary file-input-sm w-full sm:file-input-md"
            />
          </div>

          {isUploading && (
            <div className="mt-3 sm:mt-4">
              <progress className="progress progress-primary w-full"></progress>
            </div>
          )}

          {uploadedImage && (
            <div className="mt-5 sm:mt-6">
              <h2 className="card-title mb-3 text-lg sm:mb-4 sm:text-xl">Select Social Media Format</h2>
              <div className="form-control">
                <select
                  className="select select-bordered select-sm w-full sm:select-md"
                  value={selectedFormat}
                  onChange={(e) =>
                    setSelectedFormat(e.target.value as SocialFormat)
                  }
                >
                  {Object.keys(socialFormats).map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative mt-5 sm:mt-6">
                <h3 className="mb-2 text-base font-semibold sm:text-lg">Preview:</h3>
                <div className="relative overflow-hidden rounded-xl border border-base-300 bg-base-200/40 p-2 sm:p-3">
                  {isTransforming && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-base-100/60">
                      <span className="loading loading-spinner loading-md"></span>
                    </div>
                  )}
                  <CldImage
                    width={socialFormats[selectedFormat].width}
                    height={socialFormats[selectedFormat].height}
                    src={uploadedImage}
                    sizes="100vw"
                    alt="transformed image"
                    crop="fill"
                    aspectRatio={socialFormats[selectedFormat].aspectRatio}
                    gravity="auto"
                    className="h-auto w-full max-w-full rounded-lg"
                    ref={imageRef}
                    onLoad={() => setIsTransforming(false)}
                  />
                </div>
              </div>

              <div className="card-actions mt-5 justify-stretch sm:mt-6 sm:justify-end">
                <button className="btn btn-primary btn-sm w-full sm:btn-md sm:w-auto" onClick={handleDownload}>
                  Download for {selectedFormat}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
