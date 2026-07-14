import type { ImageMetadata } from 'astro';
import afterRain from '../assets/photos/after-rain.jpg';
import cloudBreak from '../assets/photos/cloud-break.jpg';

const postCovers = {
  'after-rain': afterRain,
  'cloud-break': cloudBreak,
} as const satisfies Record<string, ImageMetadata>;

export function resolvePostCover(key: keyof typeof postCovers | undefined) {
  return key ? postCovers[key] : undefined;
}

// Project images are intentionally optional. Add explicitly reviewed local assets here;
// unknown or missing keys fall back to the text-first card without breaking the page.
const projectImages: Record<string, ImageMetadata> = {};

export function resolveProjectImage(key: string | undefined) {
  return key ? projectImages[key] : undefined;
}
