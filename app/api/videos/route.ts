
import { NextResponse, NextRequest } from "next/server";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export async function GET(request: NextRequest) {
  try {
    const videos = await prisma.video.findMany({
      orderBy: {createdAt: "desc"}
    })
    return NextResponse.json(videos)
  } catch (error) {
    return NextResponse.json({error: "Error fetching videos"}, {status: 500})
    
  } finally {
    await prisma.$disconnect()
  }
}