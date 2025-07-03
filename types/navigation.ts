import { Event } from "./event";

export type RootStackParamList = {
  //   Veranstaltung: { event: Event };
  Veranstaltung: { event: Event; from?: string };
  Termine: undefined;
  MainTabs: undefined;
};
