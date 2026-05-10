/**
 * API Route: /api/preview
 * Proxy request ke FastAPI backend untuk mendapatkan preview gambar (khususnya DICOM)
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Forward ke FastAPI backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/preview`, {
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
    console.error("Proxy error (preview):", error);
    return NextResponse.json(
      { detail: "Gagal terhubung ke backend untuk preview." },
      { status: 503 }
    );
  }
}
