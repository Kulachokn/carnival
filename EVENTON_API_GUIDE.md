# EventOn API Access Guide - TypeScript Implementation

## API Overview

This project uses the EventOn WordPress plugin REST API to fetch carnival event data. The main API endpoints are:

### 1. EventOn Events API
**Endpoint:** `https://appsolutjeck.de/wp-json/eventon/events`  
**Method:** GET  
**Query Parameters:** `?post_status=publish`  
**Authentication:** None (previously used Basic Auth, now commented out)

### 2. Banner API
**Endpoint:** `http://karnevalstermine.visitthecity.net/api/banner/`  
**Method:** GET  
**Authentication:** None

### 3. Fallback API (Legacy)
**Endpoint:** `http://karnevalstermine.visitthecity.net/api/all_dates.php`  
**Method:** GET  
**Authentication:** None

## TypeScript Implementation

```typescript
// API Configuration
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

// Type Definitions
interface EventOnEvent {
  name: string;
  start: number; // Unix timestamp
  event_type?: { [key: string]: string }; // e.g., {"1997": "Party"}
  location_tax?: string;
  category_id?: string;
  event_subtitle?: string;
  details?: string;
  learnmore_link?: string;
  // Organization fields
  organizer?: string;
  organizer_term?: string;
  // Location fields  
  location?: string;
  location_address?: string;
  location_city?: string;
  location_country?: string;
  location_lat?: string;
  location_lon?: string;
}

interface EventOnResponse {
  events: {
    [key: string]: EventOnEvent;
  };
}

interface Banner {
  image: string;
  link?: string;
  category: string; // "0" for regular, "1" for list banners
  title?: string;
}

// API Service Class
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

      const data: EventOnResponse = await response.json();
      
      // Convert events object to array
      const eventsArray = Object.keys(data.events).map(key => data.events[key]);
      
      // Sort by start date
      eventsArray.sort((a, b) => a.start - b.start);
      
      // Cache the data
      this.saveToCache('events', eventsArray);
      
      return eventsArray;
    } catch (error) {
      console.error('Error fetching events:', error);
      // Try to load from cache
      return this.loadFromCache('events') || [];
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
  private saveToCache(key: string, data: any): void {
    this.cache.set(key, data);
    // Also save to localStorage for persistence
    try {
      localStorage.setItem(`eventon_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }

  private loadFromCache(key: string): any {
    // Try memory cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    // Try localStorage
    try {
      const cached = localStorage.getItem(`eventon_${key}`);
      if (cached) {
        const data = JSON.parse(cached);
        this.cache.set(key, data);
        return data;
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    }
    
    return null;
  }

  // Construct full banner image URL
  getBannerImageUrl(imageName: string): string {
    return `${API_CONFIG.banner.baseUrl}${API_CONFIG.banner.imageBasePath}${imageName}`;
  }
}

// Usage Example
async function loadEventData() {
  const apiService = new EventOnAPIService();
  
  try {
    // Fetch events and banners in parallel
    const [events, banners] = await Promise.all([
      apiService.fetchEvents(),
      apiService.fetchBanners()
    ]);
    
    console.log(`Loaded ${events.length} events`);
    console.log(`Loaded ${banners.length} banners`);
    
    // Process regular banners (category "0")
    const regularBanners = banners.filter(b => b.category === "0");
    
    // Process list banners (category "1")
    const listBanners = banners.filter(b => b.category === "1");
    
    return {
      events,
      regularBanners,
      listBanners
    };
  } catch (error) {
    console.error('Failed to load event data:', error);
    
    // Try fallback API
    try {
      const fallbackEvents = await apiService.fetchEventsFromFallback();
      console.log(`Loaded ${fallbackEvents.length} events from fallback`);
      return {
        events: fallbackEvents,
        regularBanners: [],
        listBanners: []
      };
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw fallbackError;
    }
  }
}

// Error handling with user notification
async function loadEventDataWithErrorHandling() {
  try {
    return await loadEventData();
  } catch (error) {
    // Check if offline
    if (!navigator.onLine) {
      alert('Keine Internetverbindung. Bitte stellen Sie eine Verbindung zum Internet her, um die Termine laden zu können.');
    } else {
      alert('Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.');
    }
    throw error;
  }
}
```

## Key API Response Fields

### EventOn Events Response Structure
- **events**: Object containing event IDs as keys and event objects as values
- **name**: Event title
- **start**: Unix timestamp of event start time
- **event_type**: Category mapping (e.g., {"1997": "Party"})
- **location_tax**: Location taxonomy ID
- **event_subtitle**: Additional event description
- **details**: Detailed event information
- **learnmore_link**: Ticket/info link

### Banner Response Structure
- **image**: Filename only (construct full URL with base path)
- **link**: External link URL
- **category**: "0" for regular banners, "1" for list banners
- **title**: Banner title

## Migration Notes from Objective-C

1. The original code uses `NSURLConnection` (deprecated) - use modern `fetch()` API
2. Implements offline caching using `NSUserDefaults` - use `localStorage` in TypeScript
3. Uses dispatch queues for async processing - use `async/await` in TypeScript
4. Error handling includes user alerts - implement proper error boundaries
5. Banner URLs need to be constructed with base path + filename

## Example Response Data

### EventOn Events Response Example
```json
{
  "events": {
    "12345": {
      "name": "Karnevalssitzung Köln",
      "start": 1707523200,
      "event_type": {"1997": "Sitzung"},
      "location_tax": "koeln",
      "event_subtitle": "Große Karnevalssitzung",
      "details": "Traditionelle Karnevalssitzung mit Bütt und Tanz",
      "learnmore_link": "https://example.com/tickets"
    }
  }
}
```

### Banner Response Example
```json
[
  {
    "image": "banner_karneval_2024.jpg",
    "link": "www.sponsor.de",
    "category": "0",
    "title": "Hauptsponsor 2024"
  },
  {
    "image": "list_banner_small.jpg",
    "link": "www.partner.de",
    "category": "1",
    "title": "Partner Banner"
  }
]
```

## Error Handling Best Practices

1. **Network Errors**: Always implement fallback to cached data
2. **Offline Mode**: Check `navigator.onLine` before making requests
3. **User Feedback**: Provide clear German language error messages
4. **Retry Logic**: Implement exponential backoff for failed requests
5. **Data Validation**: Validate API responses before processing

## Security Considerations

1. **HTTPS**: The main EventOn API uses HTTPS, but banner/fallback APIs use HTTP
2. **Authentication**: No authentication is currently required, but the code shows remnants of Basic Auth
3. **CORS**: Ensure proper CORS headers are set on the server
4. **Data Sanitization**: Always sanitize user-facing data from the API

## Performance Optimization

1. **Parallel Requests**: Fetch events and banners simultaneously using `Promise.all()`
2. **Caching Strategy**: Implement both memory and localStorage caching
3. **Data Transformation**: Convert and sort data once after fetching
4. **Lazy Loading**: Consider paginating large event lists
5. **Image Optimization**: Implement lazy loading for banner images