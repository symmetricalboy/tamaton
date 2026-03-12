import { PixelEngine } from './PixelEngine';
import { drawString } from './Font';
import { Font5x7 } from './Font';
import { drawButton } from './UI';

export const FONT_CHECK_BUTTONS = {
    BACK: {
        x: 10,
        y: 5,
        w: 35,
        h: 14,
        text: "BACK"
    }
};

export function drawFontCheckScreen(engine: PixelEngine) {
    // Buttons
    const btn = FONT_CHECK_BUTTONS.BACK;
    drawButton(engine, btn.x, btn.y, btn.w, btn.h, btn.text);

    // Title
    drawString(engine, "FONT GLYPHS", 35, 25);

    // List all characters
    const chars = Object.keys(Font5x7).filter(c => c !== ' ');
    const startX = 10;
    const startY = 45;
    const cols = 8;
    const spacingX = 15;
    const spacingY = 15;

    chars.forEach((char, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        drawString(engine, char, startX + (col * spacingX), startY + (row * spacingY));
    });
}
