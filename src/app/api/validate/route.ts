import { NextResponse } from "next/server";
import { validatePalmPhoto } from "@/lib/api/openrouter-vision";
import { resolveTrustedUserId } from "@/lib/telegram/validate-init-data";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64, mimeType, initData, userId } = body as {
      imageBase64?: string;
      mimeType?: string;
      initData?: string;
      userId?: number;
    };

    if (!imageBase64) {
      return NextResponse.json({ error: "imageBase64 required" }, { status: 400 });
    }

    const trusted = resolveTrustedUserId(initData, userId);
    if (trusted.error) {
      return NextResponse.json({ error: trusted.error }, { status: 401 });
    }

    const validation = await validatePalmPhoto(imageBase64, mimeType);
    return NextResponse.json(validation);
  } catch {
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
