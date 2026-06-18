import crypto from 'crypto';

export function generateGuestAccessToken() {
  return crypto.randomBytes(32).toString('base64url');
}
