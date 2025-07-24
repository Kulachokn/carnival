export interface EventOnEvent {
  name: string;
  start: number; // Unix timestamp
  event_type?: { [key: string]: string }; // e.g., {"1997": "Party"}
  category_id?: string;
  event_subtitle?: string;
  details?: string;
  content?: string;
  learnmore_link?: string;
  // Organization fields
  organizer_name?: string;
  organizer_term?: string;
  organizer_tax?: number;
  organizer_link?: string;
  organizer_desc?: string;
  organizer_email?: string;
  // Location fields  
  location_tax?: string;
  location_name?: string;
  location_address?: string;
  location_link?: string;
  location_desc?: string;
  location_city?: string;
  location_country?: string;
 
  id: number;
}

export interface EventOnResponse {
  events: {
    [key: string]: EventOnEvent;
  };
}