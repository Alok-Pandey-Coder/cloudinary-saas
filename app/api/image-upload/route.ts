import { NextResponse, NextRequest } from 'next/server';
import {v2 as cloudinary} from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { error } from 'console';


cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

interface uploadCloudinaryResult {
  public_id: string;
  [key: string]: any
}

export async function POST(request: NextRequest) {
  const {userId} = await auth()

  if(!userId) {
    return NextResponse.json({error: "Unauthorize"}, {status: 401})
  } 

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if(!file) {
      return NextResponse.json({error: "File not found"}, {status: 400});
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<uploadCloudinaryResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {folder: "next-cludinary-upload"},
          (error, result) => {
            if(error) {
              reject(error);
            }
            else {
              resolve(result as uploadCloudinaryResult);
            }
          }
        )
        uploadStream.end(buffer);
      }
    )

    return NextResponse.json({publicId: result.public_id}, {status: 200})
  } catch (error) {
    console.log("cloudinary image uplaod failed", error)
    return NextResponse.json({error: "Upload image failed"}, {status: 500})
  }
}


