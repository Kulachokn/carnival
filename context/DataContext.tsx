import React, { createContext, useContext, useState } from "react";
import { EventOnEvent } from "../types/event";
import { Banner } from "../types/banner";

type DataContextType = {
  events: EventOnEvent[];
  banners: { start: Banner[]; list: Banner[]; details: Banner[] };
  setEvents: React.Dispatch<React.SetStateAction<EventOnEvent[]>>;
  setBanners: React.Dispatch<React.SetStateAction<{ start: Banner[]; list: Banner[]; details: Banner[] }>>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useDataContext must be used within a DataProvider");
  return ctx;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventOnEvent[]>([]);
  const [banners, setBanners] = useState<{ start: Banner[]; list: Banner[]; details: Banner[] }>({
    start: [],
    list: [],
    details: [],
  });

  return (
    <DataContext.Provider value={{ events, banners, setEvents, setBanners }}>
      {children}
    </DataContext.Provider>
  );
};