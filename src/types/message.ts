export type Message =
  | { id: string; kind: "text"; text: string; mine?: boolean }
  | { id: string; kind: "photo"; uri: string; mine?: boolean }
  | { id: string; kind: "location"; latitude: number; longitude: number; approximate: boolean; mine?: boolean };
