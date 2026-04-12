"use client"
import React, {useState} from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

function VideoUpload() {
    const [file, setFile] = useState<File | null>(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isUploading, setIsUploading] = useState(false)

    const router = useRouter()
    //max file size of 60 mb

    const MAX_FILE_SIZE = 70 * 1024 * 1024

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            //TODO: add notification
            alert("File size too large")
            return;
        }

        setIsUploading(true)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("originalSize", file.size.toString());

        try {
          await axios.post("/api/video-upload", formData)
          router.push("/home")
        } catch (error) {
            console.log(error)
            // notification for failure
        } finally{
            setIsUploading(false)
        }

    }


    return (
        <div className="container mx-auto max-w-2xl p-3 sm:p-4">
          <h1 className="mb-3 text-xl font-bold lg:text-2xl">Upload Video</h1>
          <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-base-300 bg-base-100 p-4 sm:p-5">
            <div>
              <label className="label">
                <span className="label-text text-sm">Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered input-sm w-full sm:input-md"
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text text-sm">Description</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered textarea-sm w-full sm:textarea-md"
                rows={4}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text text-sm">Video File</span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="file-input file-input-bordered file-input-sm w-full sm:file-input-md"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-sm w-full sm:btn-md sm:w-auto"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Video"}
            </button>
          </form>
        </div>
      );
}

export default VideoUpload