import { NextResponse } from "next/server";
import {
  analyzePaidAdditionalLines,
  analyzePalmReading,
} from "@/lib/api/openrouter-vision";
import { resolveTrustedUserId } from "@/lib/telegram/validate-init-data";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      imageBase64,
      mimeType,
      initData,
      userId,
      includePaidLines,
    } = body as {
      imageBase64?: string;
      mimeType?: string;
      initData?: string;
      userId?: number;
      includePaidLines?: boolean;
    };

    if (!imageBase64) {
      return NextResponse.json({ error: "imageBase64 required" }, { status: 400 });
    }

    const trusted = resolveTrustedUserId(initData, userId);
    if (trusted.error) {
      return NextResponse.json({ error: trusted.error }, { status: 401 });
    }

    const analysis = await analyzePalmReading(imageBase64, mimeType);

    let paidAdditionalLines;
    if (includePaidLines) {
      paidAdditionalLines = await analyzePaidAdditionalLines(
        imageBase64,
        mimeType,
      );
    }

    return NextResponse.json({ analysis, paidAdditionalLines });
  } catch {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
