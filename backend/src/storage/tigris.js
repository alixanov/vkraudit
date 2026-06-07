import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

const client = new S3Client({
  endpoint: 'https://fly.storage.tigris.dev',
  region: 'auto',
  credentials: {
    accessKeyId:     process.env.TIGRIS_ACCESS_KEY_ID     || '',
    secretAccessKey: process.env.TIGRIS_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: false,
});

const BUCKET = process.env.TIGRIS_BUCKET || 'vkr-audit-files';

/**
 * Загружает файл в Tigris Storage.
 * Возвращает { key, url } — ключ объекта и публичный URL.
 */
export async function uploadToTigris(buffer, originalName, mimeType) {
  const ext  = originalName.split('.').pop().toLowerCase();
  const key  = `uploads/${Date.now()}_${randomUUID()}.${ext}`;

  await client.send(new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         key,
    Body:        buffer,
    ContentType: mimeType,
    Metadata:    { originalName },
  }));

  const url = `${process.env.TIGRIS_ENDPOINT || 'https://fly.storage.tigris.dev'}/${BUCKET}/${key}`;

  return { key, url };
}
