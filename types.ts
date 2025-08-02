export enum Category {
  Edukasi = 'Edukasi',
  Produktifitas = 'Produktifitas',
  Umum = 'Umum',
}

export enum ContentType {
  TipsTrik = 'Tips & Trik',
  EdukasiMendalam = 'Edukasi Mendalam',
  CeritaInspiratif = 'Cerita Inspiratif',
  Review = 'Review',
  MitosFakta = 'Mitos vs Fakta',
}

export enum PlatformFormat {
  Short = 'Video Pendek (TikTok, Reels)',
  Long = 'Video Panjang (YouTube)',
}

export interface Scene {
  namaScene: string;
  visual: string;
  audio: string;
}

export interface Script {
  judulKonten: string;
  durasi: string;
  deskripsiKarakter: string;
  scenes: Scene[];
  hashtags: string;
}