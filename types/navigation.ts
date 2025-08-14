import { Gesellschaft } from "./gesellschaft";
import { EventOnEvent } from "./event";
import { Veranstaltungsort } from "./veranstaltungsort";

export type RootStackParamList = {
  Veranstaltung: { event: EventOnEvent; from?: string };
  // "Alle Termine": undefined;
  Termine: undefined;
  Suche: undefined;
  Gesellschaften: undefined;
  Gesellschaft: { gesellschaft: Gesellschaft; from?: string };
  Orte: undefined;
  Veranstaltungsort: { ort: Veranstaltungsort; from?: string };
  SplashAd: undefined;
  MainTabs: undefined;
};
