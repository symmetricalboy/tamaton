import { PixelEngine } from './PixelEngine';

/*
  Helper to draw an arbitrary size sprite onto the grid.
  The sprite is an array of strings, where any non-space character is an "ON" pixel,
  and a space ' ' is an "OFF" pixel (transparent).
*/
export function drawSprite(engine: PixelEngine, sprite: string[], startX: number, startY: number) {
  for (let y = 0; y < sprite.length; y++) {
    const row = sprite[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== ' ') {
        engine.drawPixel(startX + x, startY + y);
      }
    }
  }
}

// A highly customized, bespoke logo for "MY TON PET"
// We use '#' for solid black pixels.
export const logoSprite = [
  "   ##   ##  ##  ##    ######   ####   ##   ##   ######  ######  ######  ",
  "   ### ###   ####     ######  ######  ###  ##   ######  ######  ######  ",
  "   #######    ##        ##    ##  ##  #### ##   ##  ##  ##        ##    ",
  "   ## # ##    ##        ##    ##  ##  ## ####   ######  ######    ##    ",
  "   ##   ##    ##        ##    ##  ##  ##  ###   ######  ######    ##    ",
  "   ##   ##    ##        ##    ##  ##  ##   ##   ##      ##        ##    ",
  "   ##   ##    ##        ##    ######  ##   ##   ##      ######    ##    ",
  "   ##   ##    ##        ##     ####   ##   ##   ##      ######    ##    ",
];

// Returns the width of the sprite
export function getSpriteWidth(sprite: string[]) {
  if (sprite.length === 0) return 0;
  return sprite[0].length;
}

// Returns the height of the sprite
export function getSpriteHeight(sprite: string[]) {
  return sprite.length;
}
