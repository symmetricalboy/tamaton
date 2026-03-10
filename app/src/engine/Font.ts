import { PixelEngine } from './PixelEngine';

/*
  A 3x5 font dictionary for standard letters, numbers, and basic punctuation.
  Format:
  Each character is an array of 5 numbers (rows).
  Each number is a binary mask for the 3 columns (binary 000 to 111, so 0-7).
  Bit 2 (4) is left column, Bit 1 (2) is middle column, Bit 0 (1) is right column.
*/

export const Font3x5: Record<string, number[]> = {
  // Uppercase
  'A': [0b010, 0b101, 0b111, 0b101, 0b101],
  'B': [0b110, 0b101, 0b110, 0b101, 0b110],
  'C': [0b011, 0b100, 0b100, 0b100, 0b011],
  'D': [0b110, 0b101, 0b101, 0b101, 0b110],
  'E': [0b111, 0b100, 0b110, 0b100, 0b111],
  'F': [0b111, 0b100, 0b110, 0b100, 0b100],
  'G': [0b011, 0b100, 0b101, 0b101, 0b011],
  'H': [0b101, 0b101, 0b111, 0b101, 0b101],
  'I': [0b111, 0b010, 0b010, 0b010, 0b111],
  'J': [0b001, 0b001, 0b001, 0b101, 0b010],
  'K': [0b101, 0b110, 0b100, 0b110, 0b101],
  'L': [0b100, 0b100, 0b100, 0b100, 0b111],
  'M': [0b101, 0b111, 0b101, 0b101, 0b101],
  'N': [0b110, 0b101, 0b101, 0b101, 0b101],
  'O': [0b010, 0b101, 0b101, 0b101, 0b010],
  'P': [0b110, 0b101, 0b110, 0b100, 0b100],
  'Q': [0b010, 0b101, 0b101, 0b011, 0b101],
  'R': [0b110, 0b101, 0b110, 0b101, 0b101],
  'S': [0b011, 0b100, 0b010, 0b001, 0b110],
  'T': [0b111, 0b010, 0b010, 0b010, 0b010],
  'U': [0b101, 0b101, 0b101, 0b101, 0b011],
  'V': [0b101, 0b101, 0b101, 0b101, 0b010],
  'W': [0b101, 0b101, 0b101, 0b111, 0b101],
  'X': [0b101, 0b101, 0b010, 0b101, 0b101],
  'Y': [0b101, 0b101, 0b010, 0b010, 0b010],
  'Z': [0b111, 0b001, 0b010, 0b100, 0b111],

  // Lowercase (often abbreviated in 3x5)
  'a': [0b000, 0b011, 0b101, 0b101, 0b011],
  'b': [0b100, 0b110, 0b101, 0b101, 0b110],
  'c': [0b000, 0b011, 0b100, 0b100, 0b011],
  'd': [0b001, 0b011, 0b101, 0b101, 0b011],
  'e': [0b000, 0b010, 0b101, 0b110, 0b011],
  'f': [0b011, 0b100, 0b111, 0b100, 0b100],
  'g': [0b000, 0b011, 0b101, 0b011, 0b001],
  'h': [0b100, 0b110, 0b101, 0b101, 0b101],
  'i': [0b010, 0b000, 0b010, 0b010, 0b010],
  'j': [0b001, 0b000, 0b001, 0b101, 0b010],
  'k': [0b100, 0b101, 0b110, 0b101, 0b101],
  'l': [0b010, 0b010, 0b010, 0b010, 0b011],
  'm': [0b000, 0b101, 0b111, 0b101, 0b101],
  'n': [0b000, 0b110, 0b101, 0b101, 0b101],
  'o': [0b000, 0b010, 0b101, 0b101, 0b010],
  'p': [0b000, 0b110, 0b101, 0b110, 0b100],
  'q': [0b000, 0b011, 0b101, 0b011, 0b001],
  'r': [0b000, 0b110, 0b100, 0b100, 0b100],
  's': [0b000, 0b011, 0b100, 0b001, 0b110],
  't': [0b010, 0b111, 0b010, 0b010, 0b011],
  'u': [0b000, 0b101, 0b101, 0b101, 0b011],
  'v': [0b000, 0b101, 0b101, 0b101, 0b010],
  'w': [0b000, 0b101, 0b101, 0b111, 0b101],
  'x': [0b000, 0b101, 0b010, 0b101, 0b101],
  'y': [0b000, 0b101, 0b101, 0b011, 0b001],
  'z': [0b000, 0b111, 0b010, 0b100, 0b111],

  // Numbers
  '0': [0b010, 0b101, 0b101, 0b101, 0b010],
  '1': [0b010, 0b110, 0b010, 0b010, 0b111],
  '2': [0b110, 0b001, 0b010, 0b100, 0b111],
  '3': [0b110, 0b001, 0b010, 0b001, 0b110],
  '4': [0b101, 0b101, 0b111, 0b001, 0b001],
  '5': [0b111, 0b100, 0b110, 0b001, 0b110],
  '6': [0b011, 0b100, 0b110, 0b101, 0b010],
  '7': [0b111, 0b001, 0b010, 0b010, 0b010],
  '8': [0b010, 0b101, 0b010, 0b101, 0b010],
  '9': [0b010, 0b101, 0b011, 0b001, 0b110],

  // Punctuation
  ' ': [0b000, 0b000, 0b000, 0b000, 0b000],
  '.': [0b000, 0b000, 0b000, 0b000, 0b010],
  ',': [0b000, 0b000, 0b000, 0b010, 0b100],
  '!': [0b010, 0b010, 0b010, 0b000, 0b010],
  '?': [0b110, 0b001, 0b010, 0b000, 0b010],
  ':': [0b000, 0b010, 0b000, 0b010, 0b000],
  '-': [0b000, 0b000, 0b111, 0b000, 0b000],
  '+': [0b000, 0b010, 0b111, 0b010, 0b000],
  '=': [0b000, 0b111, 0b000, 0b111, 0b000],
  '>': [0b100, 0b010, 0b001, 0b010, 0b100],
  '<': [0b001, 0b010, 0b100, 0b010, 0b001],
  '(': [0b010, 0b100, 0b100, 0b100, 0b010],
  ')': [0b010, 0b001, 0b001, 0b001, 0b010],
};

export function drawString(engine: PixelEngine, text: string, startX: number, startY: number) {
  let currX = startX;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const bitmap = Font3x5[char] || Font3x5[' '];

    // Decode the 3x5 bitmap onto the engine grid
    for (let row = 0; row < 5; row++) {
      const rowBits = bitmap[row];
      for (let col = 0; col < 3; col++) {
        // Check if the bit at this column is 1
        const mask = 1 << (2 - col);
        if ((rowBits & mask) !== 0) {
          engine.drawPixel(currX + col, startY + row);
        }
      }
    }

    // Move to next character. 3 pixels wide + 1 pixel spacing = 4.
    currX += 4;
  }
}
