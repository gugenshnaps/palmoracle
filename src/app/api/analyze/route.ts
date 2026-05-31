import { NextResponse } from "next/server";
import { analyzePalm } from "@/lib/api/openrouter";
import { resolveTrustedUserId } from "@/lib/telegram/validate-init-data";

/** Image generation can take 30–90s */
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64, mimeType, userId, initData } = body as {
      imageBase64?: string;
      mimeType?: string;
      userId?: number;
      initData?: string;
    };

    if (!imageBase64) {
      return NextResponse.json(
        { error: "imageBase64 is required" },
        { status: 400 },
      );
    }

    const trusted = resolveTrustedUserId(initData, userId);
    if (trusted.error) {
      return NextResponse.json({ error: trusted.error }, { status: 401 });
    }

    const result = await analyzePalm({
      imageBase64,
      mimeType,
      userId: trusted.userId,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 },
    );
  }
}
