import { createHmac } from 'crypto';

import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_TTL, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_TTL } from './constants.mjs';

const base64UrlEncode = (str) => Buffer.from(str)
  .toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=/g, '');

// Custom implementation to avoid build dependencies.
const generateJwt = (secret, sub, expiresIn) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub,
    exp: now + expiresIn,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  const signature = createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const createAccessToken = (studentId) => {
  const expiresIn = ACCESS_TOKEN_TTL;
  const accessToken = generateJwt(ACCESS_TOKEN_SECRET, studentId, expiresIn);

  return { accessToken, expiresIn };
};

export const createRefreshToken = (studentId) => {
  const expiresIn = REFRESH_TOKEN_TTL;
  const refreshToken = generateJwt(REFRESH_TOKEN_SECRET, studentId, expiresIn);

  return { refreshToken, expiresIn };
};
