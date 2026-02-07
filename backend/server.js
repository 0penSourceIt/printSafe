import express from "express";
import multer from "multer";
import cors from "cors";
import { createToken, consumeToken } from "./token.js";

//===== IMPORTS FOR FRONTEND STATIC SERVE =====
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend")));

/* ================================
 *   MEMORY STORAGE (RAM-based)
 * ================================ */

const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ================================
 *   Upload endpoint
 * ================================ */

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const token = createToken(req.file.buffer, req.file.mimetype);

  res.json({ token });
});

/* ================================
 *   One-time view endpoint
 * ================================ */

app.get("/view/:token", (req, res) => {
  const entry = consumeToken(req.params.token);

  if (!entry) {
    return res.status(404).send("Invalid or expired link");
  }

  const mime = entry.mimeType || "application/octet-stream";

  res.writeHead(200, {
    "Content-Type": mime,
    "Content-Disposition": "inline",
    "Cache-Control": "no-store",
    Pragma: "no-cache",
  });

  res.end(entry.buffer);
});

/* ================================
 *   Start server
 * ================================ */

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
