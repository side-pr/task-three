import { cookies } from "next/headers";

const ACCESS_TOKEN_STORAGE_KEY = "accessToken";
const REFRESH_TOKEN_STORAGE_KEY = "refreshToken";
const ACCESS_TOKEN_MAX_AGE = 60 * 60; //1시간
const REFRESH_TOKEN_MAX_AGE = 10 * 24 * 60 * 60; //10일

const COOKIE_OPTION = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export const cookieManager = {
  // Access Token 설정
  setAccessToken: async (token: string) => {
    const cookieStore = await cookies();
    cookieStore.set(ACCESS_TOKEN_STORAGE_KEY, token, {
      ...COOKIE_OPTION,
      maxAge: ACCESS_TOKEN_MAX_AGE, // 15분
    });
  },

  // Refresh Token 설정
  setRefreshToken: async (token: string) => {
    const cookieStore = await cookies();
    cookieStore.set(REFRESH_TOKEN_STORAGE_KEY, token, {
      ...COOKIE_OPTION,
      maxAge: REFRESH_TOKEN_MAX_AGE, // 7일
    });
  },

  // Access Token 조회
  getAccessToken: async () => {
    const cookieStore = await cookies();
    return cookieStore.get(ACCESS_TOKEN_STORAGE_KEY)?.value;
  },

  // Refresh Token 조회
  getRefreshToken: async () => {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH_TOKEN_STORAGE_KEY)?.value;
  },

  // 모든 토큰 삭제
  clearTokens: async () => {
    const cookieStore = await cookies();
    cookieStore.delete(ACCESS_TOKEN_STORAGE_KEY);
    cookieStore.delete(REFRESH_TOKEN_STORAGE_KEY);
  },
};
