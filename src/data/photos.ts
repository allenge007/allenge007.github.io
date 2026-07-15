import type { ImageMetadata } from 'astro';
import afterRain from '../assets/photos/after-rain.jpg';
import artemisCupola from '../assets/photos/artemis-cupola.jpg';
import campusBlueHour from '../assets/photos/campus-blue-hour.jpg';
import campusCatCloseup from '../assets/photos/campus-cat-closeup.jpg';
import campusSunsetCoral from '../assets/photos/campus-sunset-coral.jpg';
import campusSunsetGold from '../assets/photos/campus-sunset-gold.jpg';
import cloudBreak from '../assets/photos/cloud-break.jpg';
import sleepingCat from '../assets/photos/sleeping-cat.jpg';
import stadiumLightClouds from '../assets/photos/stadium-light-clouds.jpg';

export interface PhotoManifestItem {
  src: ImageMetadata;
  alt: { zh: string; en: string };
  caption: { zh: string; en: string };
  order: number;
  placementOrder?: Partial<Record<'hero' | 'band', number>>;
  placement: 'hero' | 'band' | 'both';
}

export const photos: PhotoManifestItem[] = ([
  {
    src: campusCatCloseup,
    alt: { zh: '桌边凑近镜头的狸花猫', en: 'A tabby cat leaning close to the camera at a desk' },
    caption: { zh: '猫先看了一眼镜头', en: 'A closer look' },
    order: 1,
    placement: 'hero',
  },
  {
    src: sleepingCat,
    alt: { zh: '灌木下熟睡的橘猫', en: 'A ginger cat sleeping beneath shrubs' },
    caption: { zh: '树影下的午睡', en: 'A nap under the leaves' },
    order: 2,
    placementOrder: { band: 3 },
    placement: 'both',
  },
  {
    src: artemisCupola,
    alt: { zh: '空间站 Cupola 舷窗中的地球与 Artemis 标志', en: 'Earth and the Artemis emblem seen through the Cupola windows' },
    caption: { zh: '从 Cupola 看向地球', en: 'Earth from the Cupola' },
    order: 3,
    placement: 'hero',
  },
  {
    src: stadiumLightClouds,
    alt: { zh: '厚重云层下亮起的一盏灯', en: 'A single light glowing beneath heavy clouds' },
    caption: { zh: '云层与一盏灯', en: 'Clouds and one light' },
    order: 4,
    placement: 'hero',
  },
  {
    src: campusSunsetGold,
    alt: { zh: '暮色中的校园道路、树木与路灯', en: 'A campus road, trees, and streetlights at dusk' },
    caption: { zh: '校园暮色', en: 'Campus at dusk' },
    order: 5,
    placement: 'hero',
  },
  {
    src: campusSunsetCoral,
    alt: { zh: '橙红晚霞映照校园道路与教学楼', en: 'A coral sunset over a campus road and teaching building' },
    caption: { zh: '晚霞把路染暖', en: 'A warmer evening sky' },
    order: 6,
    placement: 'hero',
  },
  {
    src: campusBlueHour,
    alt: { zh: '蓝调时刻的云层与校园建筑', en: 'Clouds and campus buildings during blue hour' },
    caption: { zh: '蓝调时刻', en: 'Blue hour on campus' },
    order: 7,
    placement: 'hero',
  },
  {
    src: afterRain,
    alt: { zh: '雨后街道与放晴的天空', en: 'A city street and clearing sky after rain' },
    caption: { zh: '雨停以后，广州', en: 'After the rain, Guangzhou' },
    order: 8,
    placementOrder: { band: 1 },
    placement: 'band',
  },
  {
    src: cloudBreak,
    alt: { zh: '云层间露出的蓝天', en: 'Blue sky breaking through heavy clouds' },
    caption: { zh: '六月的云', en: 'Clouds in June' },
    order: 9,
    placementOrder: { band: 2 },
    placement: 'band',
  },
] satisfies PhotoManifestItem[]).sort((a, b) => a.order - b.order);

export function selectPhotos(placement: PhotoManifestItem['placement']) {
  return photos
    .filter((photo) => photo.placement === placement || photo.placement === 'both')
    .sort((a, b) => {
      const aOrder = placement === 'both' ? a.order : (a.placementOrder?.[placement] ?? a.order);
      const bOrder = placement === 'both' ? b.order : (b.placementOrder?.[placement] ?? b.order);
      return aOrder - bOrder;
    });
}
