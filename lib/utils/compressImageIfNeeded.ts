'use client';

const MAX_BYTES = 2 * 1024 * 1024;
const MAX_WIDTH = 1600;
const START_QUALITY = 0.85;
const MIN_QUALITY = 0.65;
const QUALITY_STEP = 0.05;

export async function compressImageIfNeeded(file: File): Promise<File> {
  if (file.size <= MAX_BYTES) return file;

  const image = await loadImage(file);
  const scale = Math.min(1, MAX_WIDTH / image.width);
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) return file;

  context.drawImage(image, 0, 0, width, height);

  const mimeType = await supportsWebP() ? 'image/webp' : 'image/jpeg';
  let quality = START_QUALITY;
  let blob = await canvasToBlob(canvas, mimeType, quality);

  while (blob.size > MAX_BYTES && quality > MIN_QUALITY) {
    quality = Math.max(MIN_QUALITY, Number((quality - QUALITY_STEP).toFixed(2)));
    blob = await canvasToBlob(canvas, mimeType, quality);
  }

  if (blob.size > MAX_BYTES) {
    return new File([blob], replaceExtension(file.name, mimeType), { type: mimeType, lastModified: Date.now() });
  }

  return new File([blob], replaceExtension(file.name, mimeType), { type: mimeType, lastModified: Date.now() });
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Unable to load image.'));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Unable to compress image.'));
      },
      type,
      quality
    );
  });
}

let webpSupport: boolean | null = null;

async function supportsWebP() {
  if (webpSupport !== null) return webpSupport;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const blob = await canvasToBlob(canvas, 'image/webp', 0.8).catch(() => null);
  webpSupport = blob?.type === 'image/webp';
  return webpSupport;
}

function replaceExtension(name: string, mimeType: string) {
  const extension = mimeType === 'image/webp' ? 'webp' : 'jpg';
  const base = name.replace(/\.[^.]+$/, '') || 'image';
  return `${base}.${extension}`;
}

export function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}
