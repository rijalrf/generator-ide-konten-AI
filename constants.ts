import { Category, ContentType, PlatformFormat } from './types';

export const CATEGORIES: Category[] = [
  Category.Edukasi,
  Category.Produktifitas,
  Category.Umum,
];

export const CONTENT_TYPES: ContentType[] = [
  ContentType.TipsTrik,
  ContentType.EdukasiMendalam,
  ContentType.CeritaInspiratif,
  ContentType.Review,
  ContentType.MitosFakta,
];

export const PLATFORM_FORMATS: PlatformFormat[] = [
  PlatformFormat.Short,
  PlatformFormat.Long,
];