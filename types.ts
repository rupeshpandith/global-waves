export interface RadioStation {
  id: string;
  name: string;
  genre: string;
  location: string;
  coordinates: [number, number]; // [longitude, latitude]
  listeners: string;
  logo: string;
  streamUrl?: string;
  isIndian?: boolean;
  isTrending?: boolean;
}

export type ImageSize = "1K" | "2K" | "4K";

export interface ImageGenState {
  loading: boolean;
  error: string | null;
  imageUrl: string | null;
}

export interface NavItem {
  label: string;
  href: string;
}
