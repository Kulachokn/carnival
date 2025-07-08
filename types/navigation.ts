import { EventOnEvent } from "./event";

export type RootStackParamList = {
  //   Veranstaltung: { event: Event };
  Veranstaltung: { event: EventOnEvent; from?: string };
  "Alle Termine": undefined;
  Suche: undefined;
  Gesellschaften: undefined;
  Orte: undefined;
};
