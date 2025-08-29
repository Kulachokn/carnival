import React, { createContext, useContext, useState } from "react";
import { EventOnEvent } from "../types/event";
import { Banner } from "../types/banner";
import ImpressumModal from "../components/ImpressumModal";

type DataContextType = {
  events: EventOnEvent[];
  banners: { start: Banner[]; list: Banner[]; details: Banner[] };
  setEvents: React.Dispatch<React.SetStateAction<EventOnEvent[]>>;
  setBanners: React.Dispatch<
    React.SetStateAction<{ start: Banner[]; list: Banner[]; details: Banner[] }>
  >;

  openImpressum: () => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useDataContext must be used within a DataProvider");
  return ctx;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<EventOnEvent[]>([]);
  const [banners, setBanners] = useState<{
    start: Banner[];
    list: Banner[];
    details: Banner[];
  }>({
    start: [],
    list: [],
    details: [],
  });

  const [impressumVisible, setImpressumVisible] = useState(false);
  const openImpressum = () => setImpressumVisible(true);
  const closeImpressum = () => setImpressumVisible(false);

  return (
    <DataContext.Provider
      value={{ events, banners, setEvents, setBanners, openImpressum }}
    >
      {children}
     <ImpressumModal visible={impressumVisible} onClose={closeImpressum} />
    </DataContext.Provider>
  );
};
