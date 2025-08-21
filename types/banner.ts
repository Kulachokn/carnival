export type Banner = {
  id: number;
  acf: {
    banner_url: string;
    banner_image_url: string;
  };
};

export type BannersResponse = {
  start: Banner[];   // getBannerStart
  list: Banner[];    // getBannerList
  details: Banner[]; // getBannerDetails
};