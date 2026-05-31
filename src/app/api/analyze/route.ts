import { NextResponse } from "next/server";
import { analyzePalm } from "@/lib/api/openrouter";

/** Image generation can take 30–90s */
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64, mimeType, userId } = body as {
      imageBase64?: string;
      mimeType?: string;
      userId?: number;
    };

    if (!imageBase64) {
      return NextResponse.json(
        { error: "imageBase64 is required" },
        { status: 400 },
      );
    }

    const result = await analyzePalm({ imageBase64, mimeType, userId });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 },
    );
  }
}
