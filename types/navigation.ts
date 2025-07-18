import { Gesellschaft } from './gesellschaft';
import { EventOnEvent } from "./event";

export type RootStackParamList = {
  Veranstaltung: { event: EventOnEvent; from?: string };
  "Alle Termine": undefined;
  Suche: undefined;
  Gesellschaften: undefined;
  Gesellschaft: {gesellschaft: Gesellschaft; from?: string};
  Orte: undefined;
};
