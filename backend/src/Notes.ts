import {NOTE_NAMES} from "./types.ts"

export default class Notes {
  NOTE_NAMES_ARRAY = [
    NOTE_NAMES.C, 
    NOTE_NAMES.D, 
    NOTE_NAMES.E, 
    NOTE_NAMES.F, 
    NOTE_NAMES.G,
    NOTE_NAMES.A,
    NOTE_NAMES.B
  ]

  constructor() {}

  getRandomNote() {
      return this.NOTE_NAMES_ARRAY[Math.round(Math.random() * 6)]
  }
}