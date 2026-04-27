/**
 * API Route: /api/analyze
 * Proxy request ke FastAPI backend untuk menghindari masalah CORS
 * Menerima multipart/form-data dengan field "file" dan meneruskannya ke backend
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Forward ke FastAPI backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: "POST",
      body: formData,
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { detail: data.detail ?? "Backend error" },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        detail:
          "Tidak dapat terhubung ke backend. Pastikan server FastAPI berjalan di http://localhost:8000",
      },
      { status: 503 }
    );
  }
}
