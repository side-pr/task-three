import { API_SERVER_URL } from "@shared/api";
import { NextRequest, NextResponse } from "next/server";

// 모든 HTTP 메서드 처리
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;

async function handleRequest(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const apiPath = pathname.replace("/api/internal", "");

  const response = await fetch(`${API_SERVER_URL}${apiPath}${search}`, {
    method: request.method,
    headers: request.headers,
    body:
      request.method !== "GET" && request.method !== "HEAD"
        ? request.body
        : undefined,
    // @ts-expect-error - duplex is required for streaming request body
    duplex: "half",
  });

  console.log("error다", request, response);
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
