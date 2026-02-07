import { v4 as uuidv4 } from "uuid";

const tokens = new Map();

const EXPIRY_MS = 20 * 60 * 1000; //  minutes

export function createToken(fileBuffer, mimeType) {
  const token = uuidv4();

  tokens.set(token, {
    buffer: fileBuffer,
    mimeType,
    createdAt: Date.now(),
    used: false,
  });

  return token;
}

export function consumeToken(token) {
  const entry = tokens.get(token);

  if (!entry || entry.used) return null;

  entry.used = true;
  return entry;
}

/* ================================
 *   Auto cleanup daemon
 * ================================ */

setInterval(() => {
  const now = Date.now();

  for (const [token, entry] of tokens.entries()) {
    if (now - entry.createdAt > EXPIRY_MS) {
      tokens.delete(token);
    }
  }
}, 60 * 1000);
