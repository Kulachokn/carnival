import { Event } from "./event";

export type RootStackParamList = {
  //   Veranstaltung: { event: Event };
  Veranstaltung: { event: Event; from?: string };
  "Alle Termine": undefined;
  Suche: undefined;
  Gesellschaften: undefined;
  Orte: undefined;
};
