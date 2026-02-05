import { config } from '#config';
import { MINUTE_IN_MS, DAY_IN_MS } from '#constants';

// 인증 쿠키 설정
export const setAuthCookies = (res, tokens) => {
  const { accessToken, refreshToken } = tokens;

  // Access Token 쿠키
  res.cookie('accessToken', accessToken, {
    httpOnly: true, // JavaScript로 접근 불가 (XSS 방지)
    secure: false, // 시연 중 임시 해제 
    sameSite: 'lax', 
    maxAge: 15 * MINUTE_IN_MS, // 15분
    path: '/', // 모든 경로에서 쿠키 전송
  });
  
  // Refresh Token 쿠키
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false, // 시연 중 임시 해제
    sameSite: 'lax', 
    maxAge: 1 * DAY_IN_MS, // 1일
    path: '/',
  });
};

// 인증 쿠키 삭제 (로그아웃 시)
export const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
};
