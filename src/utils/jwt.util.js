import jwt from 'jsonwebtoken';
import { config } from '#config';
import { MINUTE_IN_S } from '#constants';
import { studyRepository } from '#repository';

//Access Token (15분 유호)
export const generateAccessToken = (study) => {
  return jwt.sign(
    {
      studyId: study.id,
      title: study.title,
      nickName: study.nickName,
    },
    config.JWT_ACCESS_SECRET,
    {
      expiresIn: '15m',
    },
  );
};

// Refresh Token (1일 유효)
export const generateRefreshToken = (study) => {
  return jwt.sign(
    {
      studyId: study.id,
    },
    config.JWT_REFRESH_SECRET,
    {
      expiresIn: '1d',
    },
  );
};

//Access Token, Refresh Token 동시 생성 (비밀번호 인증 등)
export const generateTokens = (study) => {
  const accessToken = generateAccessToken(study);
  const refreshToken = generateRefreshToken(study);
  return { accessToken, refreshToken };
};

//토큰 검증
export const verifyToken = (token, tokenType = 'access') => {
  try {
    const secret =
      tokenType === 'access'
        ? config.JWT_ACCESS_SECRET
        : config.JWT_REFRESH_SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('Token verification error: ', error.message);
    return null;
  }
};

//토큰 유효 시간 만료 전 재발급
export const shouldRefreshToken = (payload) => {
  if (!payload || !payload.exp) return false;

  const expiresIn = payload.exp - Math.floor(Date.now() / 1000); //jwt는 초단위로 한다고 합니다..

  return expiresIn < MINUTE_IN_S * 5 && expiresIn > 0;
};

//refresh token으로 새 access token 발급
export const refreshTokens = async (refreshToken) => {
  const payload = verifyToken(refreshToken, 'refresh');

  if (!payload) {
    return null;
  }

  const study = await studyRepository.findById(payload.studyId);
  if (!study) {
    return null;
  }

  return generateTokens({
    id: study.id,
    title: study.title,
    nickname: study.nickName,
  });
};
