import { PixelEngine, GRID_WIDTH, GRID_HEIGHT } from './PixelEngine';
import { drawString } from './Font';
import { drawSprite, logoSprite, getSpriteWidth } from './SpriteDrawer';

// State for Title Screen sparkles
interface Sparkle {
  x: number;
  y: number;
  life: number;
  maxLife: number;
}

const sparkles: Sparkle[] = [];

function addRandomSparkle() {
  sparkles.push({
    x: Math.floor(Math.random() * GRID_WIDTH),
    y: Math.floor(Math.random() * GRID_HEIGHT),
    life: 0,
    maxLife: Math.floor(Math.random() * 20) + 10 // 10-30 frames
  });
}

function processAndDrawSparkles(engine: PixelEngine) {
  // Randomly add new sparkles (approx 1 every 5 frames)
  if (Math.random() < 0.2) {
    addRandomSparkle();
  }

  for (let i = sparkles.length - 1; i >= 0; i--) {
    const s = sparkles[i];
    s.life++;

    // Sparkle blink logic (toggle on/off rapidly based on life)
    if (s.life % 4 < 2) {
      engine.drawPixel(s.x, s.y);
      // Small cross shape around core
      engine.drawPixel(s.x - 1, s.y);
      engine.drawPixel(s.x + 1, s.y);
      engine.drawPixel(s.x, s.y - 1);
      engine.drawPixel(s.x, s.y + 1);
    }

    // Remove dead sparkles
    if (s.life >= s.maxLife) {
      sparkles.splice(i, 1);
    }
  }
}

export function drawTitleScreen(engine: PixelEngine, frameCount: number) {
  // 1. Draw Massive "MY TON PET" Sprite
  const spriteWidth = getSpriteWidth(logoSprite);
  const startX = Math.floor((GRID_WIDTH / 2) - (spriteWidth / 2));
  const startY = Math.floor(GRID_HEIGHT / 4);  // Move up slightly higher 

  // Bobbing animation for the big logo
  const yOffset = Math.floor(Math.sin(frameCount / 25) * 3);

  drawSprite(engine, logoSprite, startX, startY + yOffset);

  // 2. Add some "Press Start" text using the generic 3x5 font! 
  // It will blink every 60 frames.
  if (frameCount % 60 < 30) {
    const subText = "> TAP TO START <";
    // Each char is 3 pixels + 1 space = 4. 
    const subTextWidth = subText.length * 4;
    const subStartX = Math.floor((GRID_WIDTH / 2) - (subTextWidth / 2));
    drawString(engine, subText, subStartX, Math.floor(GRID_HEIGHT * 0.7));
  }

  // 3. Process and draw sparkles
  processAndDrawSparkles(engine);
}
