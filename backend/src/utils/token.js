const crypto = require('crypto');

// Generates a random token to email to the user, plus its SHA-256 hash to
// store in the DB. We only ever store the hash — this way, even if the
// database leaked, an attacker couldn't use the stored value as a working
// token (same principle as never storing plaintext passwords).
const generateToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, tokenHash };
};

const hashToken = (rawToken) => crypto.createHash('sha256').update(rawToken).digest('hex');

module.exports = { generateToken, hashToken };
