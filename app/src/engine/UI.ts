import { PixelEngine } from './PixelEngine';
import { drawString } from './Font';

/**
 * Standardized button drawing utility.
 * Features rounded corners and perfect text centering.
 */
export function drawButton(engine: PixelEngine, x: number, y: number, w: number, h: number, text: string) {
    // 1. Draw Border with Rounded Corners
    // We skip the extreme corner pixels (x,y), (x+w-1,y), (x,y+h-1), (x+w-1,y+h-1)
    
    // Top & Bottom edges
    for (let i = x + 1; i < x + w - 1; i++) {
        engine.drawPixel(i, y);         // Top
        engine.drawPixel(i, y + h - 1); // Bottom
    }
    // Left & Right edges
    for (let i = y + 1; i < y + h - 1; i++) {
        engine.drawPixel(x, i);         // Left
        engine.drawPixel(x + w - 1, i); // Right
    }

    // 2. Centered Text
    // Font 5x7 -> 6px footprint (5 + 1 space).
    const textWidth = text.length * 6;
    const textX = x + Math.floor((w - textWidth) / 2) + 1; // +1 to offset the space at the end of drawString footprint
    const textY = y + Math.floor((h - 7) / 2);
    
    drawString(engine, text, textX, textY);
}
