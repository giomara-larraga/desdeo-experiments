import { Tokens } from "../../types/AppTypes";

export type Classification = "<" | "<=" | ">=" | "=" | "0";
export type NimbusState =
| "not started"
| "classification"
| "archive"
| "intermediate"
| "select preferred"
| "stop";

export interface NimbusMethodProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  problemGroup: number;
}

