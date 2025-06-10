import { Block } from "./block";

export type HistoryEntry =
  | { type: "delete"; block: Block; index: number }
  | { type: "add"; block: Block; index: number }
  | { type: "resize"; blockId: string; prev: Block; }
  | { type: "move"; blockId: string; prev: Block; };
