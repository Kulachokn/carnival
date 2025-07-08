export interface Banner {
  image: string;
  link?: string;
  category: string; // "0" for regular, "1" for list banners
  title?: string;
}