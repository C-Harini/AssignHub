const path = require('path');
const fs = require('fs');
const multer = require('multer');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
]);

const ALLOWED_EXT = new Set(['.pdf', '.doc', '.docx', '.zip', '.png', '.jpg', '.jpeg', '.webp']);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safeBase = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-z0-9_-]+/gi, '_')
      .slice(0, 60);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}_${safeBase}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_EXT.has(ext) || ALLOWED_MIME.has(file.mimetype)) return cb(null, true);
  cb(new Error('Unsupported file type. Allowed: PDF, DOC, DOCX, ZIP, PNG, JPG, WEBP'));
};

const maxMb = Number(process.env.MAX_UPLOAD_MB || 15);

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxMb * 1024 * 1024 },
});

module.exports = { upload, UPLOAD_DIR };
