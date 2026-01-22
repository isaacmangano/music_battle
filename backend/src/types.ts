export interface User {
  id: string
}

export interface BattleDetails {
  opponent: string
}

export const NOTE_NAMES = {
  C: "C",
  D: "D",
  E: "E",
  F: "F",
  G: "G",
  A: "A",
  B: "B"
} as const;