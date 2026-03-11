import { PixelEngine, GRID_WIDTH, GRID_HEIGHT } from './PixelEngine';
import { drawString } from './Font';

export const WARNING_TEXT = "NOTICE: This game is in very early stages of development. It is being built in public. This is a test version of the game, & it may or may not be in a playable state. Any user data or game progress may or may not be retained in the production release of the game.";
export const TYPING_SPEED = 2; // characters per frame

const BOX_MARGIN = 10;
const BOX_PADDING = 8;
const MAX_TEXT_WIDTH = GRID_WIDTH - (BOX_MARGIN * 2) - (BOX_PADDING * 2);
const CHAR_WIDTH = 6; // 5px + 1px spacing
const LINE_HEIGHT = 10;

function wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = "";

    words.forEach(word => {
        const potentialLine = currentLine === "" ? word : currentLine + " " + word;
        if (potentialLine.length * CHAR_WIDTH <= maxWidth) {
            currentLine = potentialLine;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    });

    if (currentLine !== "") {
        lines.push(currentLine);
    }

    return lines;
}

const wrappedLines = wrapText(WARNING_TEXT, MAX_TEXT_WIDTH);

export function drawWarningScreen(engine: PixelEngine, totalFrameCount: number, stateFrameCount: number) {
    // 1. Calculate how many characters to show based on stateFrameCount
    // Speed: 2 characters per frame for a "quick" feel
    const charsToShow = Math.floor(stateFrameCount * TYPING_SPEED);
    let charsRemaining = charsToShow;

    // 2. Determine box height based on wrapped lines
    const boxWidth = GRID_WIDTH - (BOX_MARGIN * 2);
    const boxHeight = (wrappedLines.length * LINE_HEIGHT) + (BOX_PADDING * 2);
    const boxX = BOX_MARGIN;
    const boxY = Math.floor((GRID_HEIGHT / 2) - (boxHeight / 2));

    // 3. Draw Rounded Square Box
    drawRoundedBox(engine, boxX, boxY, boxWidth, boxHeight, 4);

    // 4. Draw Typography
    for (let i = 0; i < wrappedLines.length; i++) {
        const line = wrappedLines[i];
        if (charsRemaining <= 0) break;

        const textToDraw = line.substring(0, charsRemaining);
        drawString(engine, textToDraw, boxX + BOX_PADDING, boxY + BOX_PADDING + (i * LINE_HEIGHT));
        
        charsRemaining -= line.length + 1; // +1 for the space we split on
    }

    // 5. Draw Blinking Arrow (only if typing is done)
    const isTypingDone = charsToShow >= WARNING_TEXT.length;
    if (isTypingDone && (totalFrameCount % 40 < 20)) {
        drawBlinkingArrow(engine, boxX + boxWidth - 10, boxY + boxHeight - 8);
    }
}

function drawRoundedBox(engine: PixelEngine, x: number, y: number, w: number, h: number, r: number) {
    // Horizontal lines
    for (let i = x + r; i < x + w - r; i++) {
        engine.drawPixel(i, y);
        engine.drawPixel(i, y + h - 1);
    }
    // Vertical lines
    for (let i = y + r; i < y + h - r; i++) {
        engine.drawPixel(x, i);
        engine.drawPixel(x + w - 1, i);
    }
    // Corners (simplified "rounded" look)
    // Top-left
    engine.drawPixel(x + 1, y + 1);
    // Top-right
    engine.drawPixel(x + w - 2, y + 1);
    // Bottom-left
    engine.drawPixel(x + 1, y + h - 2);
    // Bottom-right
    engine.drawPixel(x + w - 2, y + h - 2);
}

function drawBlinkingArrow(engine: PixelEngine, x: number, y: number) {
    // A simple 3x3 arrow pointing down/right
    // Row 1: X . .
    // Row 2: X X .
    // Row 3: X X X
    // Wait, let's make it more "next" like: pointing right
    // . X .
    // . . X
    // . X .
    
    // Actually, prompt says "blinking arrow in the bottom right corner"
    // Let's do a small triangle pointing right/down.
    engine.drawPixel(x, y);
    engine.drawPixel(x + 1, y + 1);
    engine.drawPixel(x + 2, y + 2);
    engine.drawPixel(x + 1, y + 2);
    engine.drawPixel(x, y + 2);
}
