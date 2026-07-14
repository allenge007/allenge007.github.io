import type { ImageMetadata } from 'astro';
import afterRain from '../assets/photos/after-rain.jpg';
import cloudBreak from '../assets/photos/cloud-break.jpg';
import sleepingCat from '../assets/photos/sleeping-cat.jpg';

export interface PhotoManifestItem {
  src: ImageMetadata;
  alt: { zh: string; en: string };
  caption: { zh: string; en: string };
  order: number;
  placement: 'hero' | 'band' | 'both';
}

export const photos = ([
  {
    src: afterRain,
    alt: { zh: '雨后街道与放晴的天空', en: 'A city street and clearing sky after rain' },
    caption: { zh: '雨停以后，广州', en: 'After the rain, Guangzhou' },
    order: 1,
    placement: 'both',
  },
  {
    src: cloudBreak,
    alt: { zh: '云层间露出的蓝天', en: 'Blue sky breaking through heavy clouds' },
    caption: { zh: '六月的云', en: 'Clouds in June' },
    order: 2,
    placement: 'both',
  },
  {
    src: sleepingCat,
    alt: { zh: '灌木下熟睡的橘猫', en: 'A ginger cat sleeping beneath shrubs' },
    caption: { zh: '校园里的午睡', en: 'A campus nap' },
    order: 3,
    placement: 'band',
  },
] satisfies PhotoManifestItem[]).sort((a, b) => a.order - b.order);

export function selectPhotos(placement: PhotoManifestItem['placement']) {
  return photos.filter((photo) => photo.placement === placement || photo.placement === 'both');
}
