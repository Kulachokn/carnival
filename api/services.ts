import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventOnEvent, EventOnResponse } from '../types/event';
import { Banner } from '../types/banner';

const API_CONFIG = {
  eventon: {
    baseUrl: 'https://appsolutjeck.de/wp-json',
    eventsEndpoint: '/eventon/events',
    queryParams: '?post_status=publish',
  },
};

const CATEGORY_IDS = { details: 3151, list: 3150, start: 3152 };
type BannerType = keyof typeof CATEGORY_IDS;
type BannerPost = { id: number };

class EventOnAPIService {
  private cache = new Map<string, unknown>();

  // ===== EVENTS =====
  async fetchEvents(): Promise<EventOnEvent[]> {
    try {
      const url = `${API_CONFIG.eventon.baseUrl}${API_CONFIG.eventon.eventsEndpoint}${API_CONFIG.eventon.queryParams}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: EventOnResponse = await res.json();
      const events: EventOnEvent[] = data.events ? Object.values(data.events) : [];
      events.sort((a, b) => a.start - b.start);
      await this.saveToCache('events', events);
      return events;
    } catch (e) {
      console.error('fetchEvents failed, using cache:', e);
      return (await this.loadFromCache<EventOnEvent[]>('events')) || [];
    }
  }

  // ===== BANNERS (публічні) =====
  async fetchBannersByType(type: BannerType): Promise<Banner[]> {
    return this.fetchAndCacheBanners(type); // просто делегуємо хелперу
  }

  async fetchAllBanners(): Promise<{ start: Banner[]; list: Banner[]; details: Banner[] }> {
    // Хелпер НІКОЛИ не кидає, отже Promise.all завжди резолвиться
    const [start, list, details] = await Promise.all([
      this.fetchAndCacheBanners('start'),
      this.fetchAndCacheBanners('list'),
      this.fetchAndCacheBanners('details'),
    ]);
    return { start, list, details };
  }

  // ===== BANNERS (приватний хелпер) =====
  private async fetchAndCacheBanners(type: BannerType): Promise<Banner[]> {
    const categoryId = CATEGORY_IDS[type];
    const cacheKey = `banners_${type}`;
    const base = API_CONFIG.eventon.baseUrl;

    try {
      // 1) Спробувати КАСТОМНИЙ endpoint (1 запит на категорію)
      const customUrl = `${base}/custom/v1/banners?category=${categoryId}`;
      const customRes = await fetch(customUrl);

      if (customRes.ok) {
        const banners: Banner[] = await customRes.json();
        await this.saveToCache(cacheKey, banners);
        return banners;
      }

      // 2) Фолбек: стандартний WP REST + ACF (N+1 запит)
      const listRes = await fetch(`${base}/wp/v2/banner?banner-categories=${categoryId}`);
      if (!listRes.ok) throw new Error(`wp/v2/banner HTTP ${listRes.status}`);
      const posts: BannerPost[] = await listRes.json();

      const banners: Banner[] = await Promise.all(
        posts.map(async (p) => {
          const acfRes = await fetch(`${base}/acf/v3/banner/${p.id}`);
          if (!acfRes.ok) throw new Error(`acf/v3/banner/${p.id} HTTP ${acfRes.status}`);
          return (await acfRes.json()) as Banner;
        })
      );

      await this.saveToCache(cacheKey, banners);
      return banners;
    } catch (e) {
      console.warn(`fetchAndCacheBanners("${type}") failed, using cache:`, e);
      return (await this.loadFromCache<Banner[]>(cacheKey)) || [];
    }
  }

  // ===== CACHE HELPERS =====
  private async saveToCache<T>(key: string, data: T): Promise<void> {
    this.cache.set(key, data);
    try {
      await AsyncStorage.setItem(`eventon_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error('AsyncStorage set error:', e);
    }
  }

  private async loadFromCache<T>(key: string): Promise<T | null> {
    if (this.cache.has(key)) return (this.cache.get(key) as T) ?? null;
    try {
      const raw = await AsyncStorage.getItem(`eventon_${key}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as T;
      this.cache.set(key, parsed);
      return parsed;
    } catch (e) {
      console.error('AsyncStorage get error:', e);
      return null;
    }
  }
}

const api = new EventOnAPIService();
export default api;
