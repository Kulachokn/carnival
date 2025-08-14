import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventOnEvent, EventOnResponse } from '../types/event';
import { Banner } from '../types/banner';

const API_CONFIG = {
  eventon: {
    baseUrl: 'https://appsolutjeck.de',
    endpoint: '/wp-json/eventon/events',
    queryParams: '?post_status=publish'
  },
};

const BASE_URL = 'https://www.appsolutjeck.de/wp-json';
const CATEGORY_IDS = {
  details: 3151,
  list: 3150,
  start: 3152
};

type BannerPost = { id: number; [key: string]: unknown };

class EventOnAPIService {
  private cache: Map<string, EventOnEvent[] | Banner[] | null> = new Map();

  // ===== EVENTS =====
  async fetchEvents(): Promise<EventOnEvent[]> {
    try {
      const url = `${API_CONFIG.eventon.baseUrl}${API_CONFIG.eventon.endpoint}${API_CONFIG.eventon.queryParams}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EventOnResponse = await response.json();
      const eventsArray: EventOnEvent[] = data.events ? Object.values(data.events) : [];
      eventsArray.sort((a, b) => a.start - b.start);

      await this.saveToCache('events', eventsArray);
      return eventsArray;
    } catch (error) {
      console.error('Error fetching events:', error);
      const cached = await this.loadFromCache('events');
      return cached as EventOnEvent[] || [];
    }
  }

  async getCachedEvents(): Promise<EventOnEvent[] | null> {
    return await this.loadFromCache('events') as EventOnEvent[] | null;
  }

  // ===== BANNERS =====
  async fetchAllBanners(): Promise<{ start: Banner[]; list: Banner[]; details: Banner[] }> {
    try {
      const [start, list, details] = await Promise.all([
        this.fetchBannersByType('start'),
        this.fetchBannersByType('list'),
        this.fetchBannersByType('details'),
      ]);

      return { start, list, details };
    } catch (error) {
      console.error('Error fetching banners:', error);

      return {
        start: (await this.loadFromCache('banners_start') as Banner[]) || [],
        list: (await this.loadFromCache('banners_list') as Banner[]) || [],
        details: (await this.loadFromCache('banners_details') as Banner[]) || [],
      };
    }
  }

  async fetchBannersByType(type: 'start' | 'list' | 'details'): Promise<Banner[]> {
    const categoryId = CATEGORY_IDS[type];
    const cacheKey = `banners_${type}`;

    try {
      const response = await fetch(`${BASE_URL}/wp/v2/banner?banner-categories=${categoryId}`);
      const posts: BannerPost[] = await response.json();

      const banners: Banner[] = await Promise.all(
        posts.map((p: BannerPost) =>
          fetch(`${BASE_URL}/acf/v3/banner/${p.id}`).then(r => r.json() as Promise<Banner>)
        )
      );

      await this.saveToCache(cacheKey, banners);
      return banners;
    } catch (error) {
      console.error(`Error fetching ${type} banners:`, error);
      return (await this.loadFromCache(cacheKey) as Banner[]) || [];
    }
  }

  // ===== CACHE HELPERS =====
  private async saveToCache(key: string, data: EventOnEvent[] | Banner[]): Promise<void> {
    this.cache.set(key, data);
    try {
      await AsyncStorage.setItem(`eventon_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to AsyncStorage:', e);
    }
  }

  private async loadFromCache(key: string): Promise<EventOnEvent[] | Banner[] | null> {
    if (this.cache.has(key)) {
      return this.cache.get(key) ?? null;
    }
    try {
      const cached = await AsyncStorage.getItem(`eventon_${key}`);
      if (cached) {
        // Try to parse as EventOnEvent[] or Banner[]
        const data = JSON.parse(cached) as EventOnEvent[] | Banner[];
        this.cache.set(key, data);
        return data;
      }
    } catch (e) {
      console.error('Error loading from AsyncStorage:', e);
    }
    return null;
  }
}

const api = new EventOnAPIService();
export default api;



// import {Banner} from '../types/banner';

// const API_CONFIG = {
//   eventon: {
//     baseUrl: 'https://appsolutjeck.de',
//     endpoint: '/wp-json/eventon/events',
//     queryParams: '?post_status=publish'
//   },
// };


// class EventOnAPIService {
//   private cache: Map<string, any> = new Map();

//   // Fetch events from EventOn API
//    async fetchEvents(): Promise<EventOnEvent[]> {
//     try {
//       const url = `${API_CONFIG.eventon.baseUrl}${API_CONFIG.eventon.endpoint}${API_CONFIG.eventon.queryParams}`;
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       // The API returns { events: { id: eventObj, ... } }
//       const data: EventOnResponse = await response.json();
//       // Convert the events object to an array
//       const eventsArray: EventOnEvent[] = data.events ? Object.values(data.events) : [];
//       eventsArray.sort((a, b) => a.start - b.start);

//       await this.saveToCache('events', eventsArray);

//       return eventsArray;
//     } catch (error) {
//       console.error('Error fetching events:', error);
//       // Try to load from cache
//       const cached = await this.loadFromCache('events');
//       return cached || [];
//     }
//   }

//   // Helper methods
//   private async saveToCache(key: string, data: any): Promise<void> {
//     this.cache.set(key, data);
//     try {
//       await AsyncStorage.setItem(`eventon_${key}`, JSON.stringify(data));
//     } catch (e) {
//       console.error('Error saving to AsyncStorage:', e);
//     }
//   }


//   private async loadFromCache(key: string): Promise<any> {
//     if (this.cache.has(key)) {
//       return this.cache.get(key);
//     }
//     try {
//       const cached = await AsyncStorage.getItem(`eventon_${key}`);
//       if (cached) {
//         const data = JSON.parse(cached);
//         this.cache.set(key, data);
//         return data;
//       }
//     } catch (e) {
//       console.error('Error loading from AsyncStorage:', e);
//     }
//     return null;
//   }

//   // Public method to get cached events
//   async getCachedEvents(): Promise<EventOnEvent[] | null> {
//     return await this.loadFromCache('events');
//   }
// }

// const api = new EventOnAPIService();
// export default api;


// const BASE_URL = 'https://www.appsolutjeck.de/wp-json';
// // Fixed category IDs (set in stone)
// const CATEGORY_IDS = {
//   BANNER_DETAILS: 3151,
//   BANNER_LIST: 3150,
//   BANNER_START: 3152
// };

// type BannerPost = { id: number; [key: string]: any };

// // ## Get Banners by Type
// // ### Banner-Details

// export async function getBannerDetails(): Promise<Banner[]> {
//   const response = await fetch(`${BASE_URL}/wp/v2/banner?banner-categories=${CATEGORY_IDS.BANNER_DETAILS}`);
//   const posts: BannerPost[] = await response.json();

  
//   const banners = await Promise.all(
//     posts.map((p: BannerPost) => fetch(`${BASE_URL}/acf/v3/banner/${p.id}`).then(r => r.json()))
//   );
//   return banners; // Returns ARRAY: [{id, acf: {banner_image_url, banner_url}}, ...]
// };

// // ### Banner-List

// export async function getBannerList(): Promise<Banner[]> {
//   const response = await fetch(`${BASE_URL}/wp/v2/banner?banner-categories=${CATEGORY_IDS.BANNER_LIST}`);
//   const posts = await response.json();
//   // console.log(posts);
//   const banners = await Promise.all(
//     posts.map((p: BannerPost) => fetch(`${BASE_URL}/acf/v3/banner/${p.id}`).then(r => r.json()))
//   );
//   return banners; // Returns ARRAY: [{id, acf: {banner_image_url, banner_url}}, ...]
// };

// // ### Banner-Start
// export async function getBannerStart(): Promise<Banner[]> {
//   const response = await fetch(`${BASE_URL}/wp/v2/banner?banner-categories=${CATEGORY_IDS.BANNER_START}`);
//   const posts = await response.json();
  
//   const banners = await Promise.all(
//     posts.map((p: BannerPost) => fetch(`${BASE_URL}/acf/v3/banner/${p.id}`).then(r => r.json()))
//   );
//   return banners; // Returns ARRAY: [{id, acf: {banner_image_url, banner_url}}, ...]
// };