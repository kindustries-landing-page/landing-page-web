import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// Read credentials from erp/erp-api/.env.klotus-production
const envPath = '/home/dev/repos-dev-1/erp/erp-api/.env.klotus-production';
const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};

envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const [k, ...v] = trimmed.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const accountId = env.R2_ACCOUNT_ID;
const accessKeyId = env.R2_ACCESS_KEY_ID;
const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
const bucket = env.R2_BUCKET_NAME || 'erp-klotus-production';

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error('Missing R2 credentials in', envPath);
  process.exit(1);
}

console.log(`Connecting to Cloudflare R2 (${accountId}) for bucket: ${bucket}...`);

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function uploadFile(localPath: string, r2Key: string, contentType: string) {
  console.log(`Uploading ${localPath} -> s3://${bucket}/${r2Key} (${contentType})...`);
  const buffer = fs.readFileSync(localPath);
  const stats = fs.statSync(localPath);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: r2Key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await s3Client.send(command);
  console.log(`✓ Uploaded successfully: ${r2Key} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
}

async function main() {
  const mediaDir = '/home/dev/repos-dev-1/klotus/landing-page-web/public/media';
  const originalVideoPath = '/home/dev/repos-dev-1/erp/data/Paceo Keyvisual.mp4';

  // 1. Upload original video
  if (fs.existsSync(originalVideoPath)) {
    await uploadFile(originalVideoPath, 'media/videos/paceo-keyvisual-original.mp4', 'video/mp4');
  }

  // 2. Upload web-optimized faststart video
  const optimizedVideoPath = path.join(mediaDir, 'paceo-keyvisual.mp4');
  if (fs.existsSync(optimizedVideoPath)) {
    await uploadFile(optimizedVideoPath, 'media/videos/paceo-keyvisual.mp4', 'video/mp4');
  }

  // 3. Upload WebP poster
  const posterWebpPath = path.join(mediaDir, 'paceo-poster.webp');
  if (fs.existsSync(posterWebpPath)) {
    await uploadFile(posterWebpPath, 'media/videos/paceo-poster.webp', 'image/webp');
  }

  // 4. Upload JPG poster
  const posterJpgPath = path.join(mediaDir, 'paceo-poster.jpg');
  if (fs.existsSync(posterJpgPath)) {
    await uploadFile(posterJpgPath, 'media/videos/paceo-poster.jpg', 'image/jpeg');
  }

  console.log('\nAll assets uploaded to Cloudflare R2 successfully!');
}

main().catch((err) => {
  console.error('Failed to upload assets to R2:', err);
  process.exit(1);
});
