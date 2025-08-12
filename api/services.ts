import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventOnEvent, EventOnResponse } from '../types/event';
import {Banner} from '../types/banner';

const API_CONFIG = {
  eventon: {
    baseUrl: 'https://appsolutjeck.de',
    endpoint: '/wp-json/eventon/events',
    queryParams: '?post_status=publish'
  },
  banner: {
    baseUrl: 'http://karnevalstermine.visitthecity.net',
    endpoint: '/api/banner/',
    imageBasePath: '/uploads/tx_sfbanners/'
  },
  fallback: {
    baseUrl: 'http://karnevalstermine.visitthecity.net',
    endpoint: '/api/all_dates.php'
  }
};


class EventOnAPIService {
  private cache: Map<string, any> = new Map();

  // Fetch events from EventOn API
   async fetchEvents(): Promise<EventOnEvent[]> {
    try {
      const url = `${API_CONFIG.eventon.baseUrl}${API_CONFIG.eventon.endpoint}${API_CONFIG.eventon.queryParams}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // The API returns { events: { id: eventObj, ... } }
      const data: EventOnResponse = await response.json();
      // Convert the events object to an array
      const eventsArray: EventOnEvent[] = data.events ? Object.values(data.events) : [];
      eventsArray.sort((a, b) => a.start - b.start);

      await this.saveToCache('events', eventsArray);

      return eventsArray;
    } catch (error) {
      console.error('Error fetching events:', error);
      // Try to load from cache
      const cached = await this.loadFromCache('events');
      return cached || [];
    }
  }

  // Fetch banners
  async fetchBanners(): Promise<Banner[]> {
    try {
      const url = `${API_CONFIG.banner.baseUrl}${API_CONFIG.banner.endpoint}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const banners: Banner[] = await response.json();
      return banners;
    } catch (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
  }

  // Fallback API call
  async fetchEventsFromFallback(): Promise<EventOnEvent[]> {
    try {
      const url = `${API_CONFIG.fallback.baseUrl}${API_CONFIG.fallback.endpoint}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const events: EventOnEvent[] = await response.json();
      return events;
    } catch (error) {
      console.error('Error fetching from fallback API:', error);
      throw error;
    }
  }

  // Helper methods
  private async saveToCache(key: string, data: any): Promise<void> {
    this.cache.set(key, data);
    try {
      await AsyncStorage.setItem(`eventon_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to AsyncStorage:', e);
    }
  }


  private async loadFromCache(key: string): Promise<any> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    try {
      const cached = await AsyncStorage.getItem(`eventon_${key}`);
      if (cached) {
        const data = JSON.parse(cached);
        this.cache.set(key, data);
        return data;
      }
    } catch (e) {
      console.error('Error loading from AsyncStorage:', e);
    }
    return null;
  }

  // Public method to get cached events
  async getCachedEvents(): Promise<EventOnEvent[] | null> {
    return await this.loadFromCache('events');
  }

  // Construct full banner image URL
  getBannerImageUrl(imageName: string): string {
    return `${API_CONFIG.banner.baseUrl}${API_CONFIG.banner.imageBasePath}${imageName}`;
  }
}

const api = new EventOnAPIService();
export default api;


const BASE_URL = 'https://www.appsolutjeck.de/wp-json';
// Fixed category IDs (set in stone)
const CATEGORY_IDS = {
  BANNER_DETAILS: 3151,
  BANNER_LIST: 3150,
  BANNER_START: 3152
};

type BannerPost = { id: number; [key: string]: any };

// ## Get Banners by Type
// ### Banner-Details

export async function getBannerDetails(): Promise<Banner[]> {
  const response = await fetch(`${BASE_URL}/wp/v2/banner?banner-categories=${CATEGORY_IDS.BANNER_DETAILS}`);
  const posts: BannerPost[] = await response.json();

  
  const banners = await Promise.all(
    posts.map((p: BannerPost) => fetch(`${BASE_URL}/acf/v3/banner/${p.id}`).then(r => r.json()))
  );
  return banners; // Returns ARRAY: [{id, acf: {banner_image_url, banner_url}}, ...]
};

// ### Banner-List

export async function getBannerList(): Promise<Banner[]> {
  const response = await fetch(`${BASE_URL}/wp/v2/banner?banner-categories=${CATEGORY_IDS.BANNER_LIST}`);
  const posts = await response.json();
  // console.log(posts);
  const banners = await Promise.all(
    posts.map((p: BannerPost) => fetch(`${BASE_URL}/acf/v3/banner/${p.id}`).then(r => r.json()))
  );
  return banners; // Returns ARRAY: [{id, acf: {banner_image_url, banner_url}}, ...]
};

// ### Banner-Start
export async function getBannerStart(): Promise<Banner[]> {
  const response = await fetch(`${BASE_URL}/wp/v2/banner?banner-categories=${CATEGORY_IDS.BANNER_START}`);
  const posts = await response.json();
  
  const banners = await Promise.all(
    posts.map((p: BannerPost) => fetch(`${BASE_URL}/acf/v3/banner/${p.id}`).then(r => r.json()))
  );
  return banners; // Returns ARRAY: [{id, acf: {banner_image_url, banner_url}}, ...]
};