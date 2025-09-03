import React, { createContext, useContext, useState, useEffect } from "react";
import { EventOnEvent } from "../types/event";
import { useDataContext } from "./DataContext";

type SearchContextType = {
  // Search parameters
  search: string;
  date: Date | { start: Date; end: Date } | null;
  category: { label: string; value: string } | null;
  
  // Pending search parameters (before submitting)
  pendingSearch: string;
  pendingDate: Date | { start: Date; end: Date } | null;
  pendingCategory: { label: string; value: string } | null;
  
  // Category options
  categoriesList: { label: string; value: string }[];
  
  // Search state
  hasSearched: boolean;
  isModified: boolean;
  filteredEvents: EventOnEvent[];
  
  // Actions
  setPendingSearch: (text: string) => void;
  setPendingDate: (date: Date | { start: Date; end: Date } | null) => void;
  setPendingCategory: (category: { label: string; value: string } | null) => void;
  handleSearch: () => void;
  clearSearch: () => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearchContext = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearchContext must be used within a SearchProvider");
  return ctx;
};

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Data from DataContext
  const { events } = useDataContext();
  
  // Search parameters state
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | { start: Date; end: Date } | null>(null);
  const [category, setCategory] = useState<{ label: string; value: string } | null>(null);
  
  // Pending search parameters (before submitting)
  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingDate, setPendingDate] = useState<Date | { start: Date; end: Date } | null>(null);
  const [pendingCategory, setPendingCategory] = useState<{ label: string; value: string } | null>(null);
  
  // Category options
  const [categoriesList, setCategoriesList] = useState<{ label: string; value: string }[]>([]);
  
  // Search state
  const [hasSearched, setHasSearched] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<EventOnEvent[]>([]);
  
  // Extract categories from events
  useEffect(() => {
    // Extract unique categories
    const categoryMap = new Map<string, string>();
    events.forEach((event) => {
      if (event.event_type) {
        Object.entries(event.event_type).forEach(([id, name]) => {
          categoryMap.set(id, name as string);
        });
      }
    });

    const categories = Array.from(categoryMap.entries()).map(
      ([id, name]) => ({ label: name, value: id })
    );
    setCategoriesList(categories);
  }, [events]);
  
  // Filter events based on search parameters
  useEffect(() => {
    if (!hasSearched) {
      setFilteredEvents(events);
      return;
    }
    
    let filtered = [...events];
    
    // Filter by search text
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(event => 
        event.name?.toLowerCase().includes(searchLower) ||
        event.location_name?.toLowerCase().includes(searchLower) ||
        event.details?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by date
    if (date) {
      if ('start' in date && date.start && date.end) {
        // Date range
        const start = new Date(date.start);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(date.end);
        end.setHours(23, 59, 59, 999);
        
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.start * 1000);
          return eventDate >= start && eventDate <= end;
        });
      } else {
        // Single date
        const searchDate = new Date(date as Date);
        searchDate.setHours(0, 0, 0, 0);
        const searchDateEnd = new Date(searchDate);
        searchDateEnd.setHours(23, 59, 59, 999);
        
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.start * 1000);
          return eventDate >= searchDate && eventDate <= searchDateEnd;
        });
      }
    }
    
    // Filter by category
    if (category) {
      filtered = filtered.filter(event => {
        if (!event.event_type) return false;
        return category.value in event.event_type;
      });
    }
    
    setFilteredEvents(filtered);
  }, [events, search, date, category, hasSearched]);
  
  // Check if the pending search is different from the current search
  const isModified = 
    search !== pendingSearch ||
    JSON.stringify(date) !== JSON.stringify(pendingDate) ||
    JSON.stringify(category) !== JSON.stringify(pendingCategory);
  
  // Apply the pending search
  const handleSearch = () => {
    setSearch(pendingSearch);
    setDate(pendingDate);
    setCategory(pendingCategory);
    setHasSearched(true);
  };
  
  // Clear search
  const clearSearch = () => {
    setPendingSearch("");
    setPendingDate(null);
    setPendingCategory(null);
    setSearch("");
    setDate(null);
    setCategory(null);
    setHasSearched(false);
  };
  
  return (
    <SearchContext.Provider
      value={{
        search,
        date,
        category,
        pendingSearch,
        pendingDate,
        pendingCategory,
        categoriesList,
        hasSearched,
        isModified,
        filteredEvents,
        setPendingSearch,
        setPendingDate,
        setPendingCategory,
        handleSearch,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
