const crypto = require('crypto');

const generateShortCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomBytes = crypto.randomBytes(length);
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }

  return result;
};

const isValidShortCode = (code) => {
  // Allow 4-10 alphanumeric characters
  const pattern = /^[A-Za-z0-9]{4,10}$/;
  return pattern.test(code);
};

module.exports = {
  generateShortCode,
  isValidShortCode
};
