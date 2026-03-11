import { PixelEngine, GRID_WIDTH, GRID_HEIGHT } from './PixelEngine';
import { 
    drawSprite, 
    spriteCirclePet, 
    spriteSquarePet, 
    spriteTrianglePet 
} from './SpriteDrawer';
import { drawButton } from './UI';

export type PetType = 'CIRCLE' | 'SQUARE' | 'TRIANGLE';

export const GROUND_Y_PERCENT = 0.75;

export function getGroundY(gridHeight: number): number {
    return Math.floor(gridHeight * GROUND_Y_PERCENT);
}

export interface PetState {
    x: number;
    y: number;
    lastHopFrame: number;
    isHopping: boolean;
    hopTargetX: number;
    hopStartX: number;
    lookDir: 'LEFT' | 'CENTER' | 'RIGHT';
    lookTimer: number;
}

export const GAMEPLAY_BUTTONS = {
    BACK: {
        x: 5,
        y: 5,
        w: 45,
        h: 14,
        text: "< BACK"
    }
};

export function drawGameplayScreen(engine: PixelEngine, frameCount: number, petType: PetType, state: PetState) {
    // 1. Draw UI / Back Button
    const backBtn = GAMEPLAY_BUTTONS.BACK;
    drawButton(engine, backBtn.x, backBtn.y, backBtn.w, backBtn.h, backBtn.text);

    // 2. Select Sprite
    let sprite: string[];
    switch (petType) {
        case 'SQUARE': sprite = spriteSquarePet; break;
        case 'TRIANGLE': sprite = spriteTrianglePet; break;
        default: sprite = spriteCirclePet; break;
    }

    const spriteWidth = sprite[0].length;
    const spriteHeight = sprite.length;

    // 3. Animation Timing / State Updates
    // We update the state object directly (it's a ref in App.tsx)
    const hopDuration = 40;
    const hopCooldown = 120;
    const groundY = getGroundY(GRID_HEIGHT);

    if (!state.isHopping && (frameCount - state.lastHopFrame) > hopCooldown) {
        // Start a new hop
        state.isHopping = true;
        state.lastHopFrame = frameCount;
        state.hopStartX = state.x;
        
        // Random horizontal destination
        const maxJump = 30;
        const randomDir = (Math.random() - 0.5) * 2;
        state.hopTargetX = state.x + Math.floor(randomDir * maxJump);
        
        // Bound to screen
        const margin = 10;
        state.hopTargetX = Math.max(margin, Math.min(GRID_WIDTH - spriteWidth - margin, state.hopTargetX));
    }

    let drawY = state.y;
    let drawX = state.x;

    if (state.isHopping) {
        const elapsed = frameCount - state.lastHopFrame;
        const progress = Math.min(1, elapsed / hopDuration);
        
        // Parabolic jump y-offset
        const jumpHeight = 15;
        const yOffset = Math.floor(-4 * jumpHeight * progress * (1 - progress));
        
        // Update current position for drawing
        drawX = state.hopStartX + (state.hopTargetX - state.hopStartX) * progress;
        drawY = groundY - spriteHeight + yOffset;

        if (progress >= 1) {
            state.isHopping = false;
            state.x = state.hopTargetX;
            state.y = groundY - spriteHeight;
        }
    } else {
        drawX = state.x;
        drawY = state.y;
    }

    // 4. Random Blinking
    const hash = (n: number) => {
        const x = Math.sin(n) * 10000;
        return x - Math.floor(x);
    };
    const blinkCycle = 200;
    const isBlinking = (frameCount % blinkCycle) < 8 || (hash(frameCount * 0.01) > 0.98);

    // 5. Draw the Pet with special effects
    const petX = Math.floor(drawX);
    const petY = Math.floor(drawY);
    
    // Personality Effects
    let squishY = 1.0;
    let squishX = 1.0;

    if (petType === 'CIRCLE') {
        // Blob Animation Logic (Squish + Gaze)
        
        // --- 1. Gaze Logic ---
        state.lookTimer--;
        if (state.lookTimer <= 0) {
            const r = Math.random();
            if (r < 0.6) {
                state.lookDir = 'CENTER';
                state.lookTimer = 80 + Math.floor(Math.random() * 100);
            } else if (r < 0.8) {
                state.lookDir = 'LEFT';
                state.lookTimer = 40 + Math.floor(Math.random() * 60);
            } else {
                state.lookDir = 'RIGHT';
                state.lookTimer = 40 + Math.floor(Math.random() * 60);
            }
        }

        // --- 2. Squish Logic ---
        if (state.isHopping) {
            const elapsed = frameCount - state.lastHopFrame;
            const progress = elapsed / hopDuration;
            
            // Refined Multi-phase Squish
            if (progress < 0.2) {
                // Phase 1: Anticipation (Crouching down)
                const p = progress / 0.2;
                squishY = 1.0 - Math.sin(p * Math.PI) * 0.3;
            } else if (progress < 0.7) {
                // Phase 2: Ascent & Peak (Stretching vertically)
                const p = (progress - 0.2) / 0.5;
                squishY = 0.7 + Math.sin(p * Math.PI) * 0.6; // Peak at 1.3
            } else {
                // Phase 3: Landing & Impact (Squishing horizontally)
                const p = (progress - 0.7) / 0.3;
                squishY = 1.0 - Math.sin(p * Math.PI) * 0.4;
            }
            squishX = 1.0 / squishY;
        } else {
            // Idle breathing squish (very subtle)
            squishY = 1.0 + Math.sin(frameCount * 0.05) * 0.03;
            squishX = 1.0 / squishY;
        }
    }

    if (petType === 'TRIANGLE') {
        // Robotic Jitter
        if (frameCount % 60 < 5) {
            const jitterX = (Math.random() - 0.5) * 1;
            drawSprite(engine, sprite, petX + Math.floor(jitterX), petY);
        } else {
            drawSprite(engine, sprite, petX, petY);
        }
    } else if (petType === 'CIRCLE') {
        // Draw Squished Blob
        drawSquishedSprite(engine, sprite, petX, petY, squishX, squishY);
    } else {
        drawSprite(engine, sprite, petX, petY);
    }

    // 6. Facial Features & Blinking Overlay (Drawn on top)
    if (petType === 'CIRCLE') {
        const eyeY = petY + Math.floor(9 * squishY);
        const mouthY = petY + Math.floor(18 * squishY);
        
        // Calculate dynamic horizontal centering for the face based on the current squish
        const sw = sprite[0].length; // Now 32
        const targetW = Math.round(sw * squishX);
        const offsetX = Math.floor((sw - targetW) / 2);
        const centerX = petX + Math.floor(targetW / 2) + offsetX;

        // Gaze offset (scaled)
        let lookOffset = 0;
        if (state.lookDir === 'LEFT') lookOffset = -Math.round(5 * squishX);
        if (state.lookDir === 'RIGHT') lookOffset = Math.round(5 * squishX);

        // Feature Positions relative to center
        const eyeDist = Math.round(6 * squishX);
        const eyeW = Math.max(1, Math.round(3 * squishX));
        const mouthW = Math.max(1, Math.round(6 * squishX));

        // Draw Eyes
        const leftEyeX = centerX - eyeDist + lookOffset - Math.floor(eyeW/2);
        const rightEyeX = centerX + eyeDist + lookOffset - Math.floor(eyeW/2);
        
        if (!isBlinking) {
            for (let row = 0; row < 3; row++) {
                for (let i = 0; i < eyeW; i++) {
                    engine.drawPixel(leftEyeX + i, eyeY + row, false);
                    engine.drawPixel(rightEyeX + i, eyeY + row, false);
                }
            }
        } else {
            // Blinking (thin line)
            for (let i = 0; i < eyeW; i++) {
                engine.drawPixel(leftEyeX + i, eyeY + 1, false);
                engine.drawPixel(rightEyeX + i, eyeY + 1, false);
            }
        }
        
        // Draw Mouth
        const mouthX = centerX + lookOffset - Math.floor(mouthW/2);
        for (let row = 0; row < 2; row++) {
            for (let i = 0; i < mouthW; i++) {
                engine.drawPixel(mouthX + i, mouthY + row, false);
            }
        }
    } else if (isBlinking) {
        if (petType === 'TRIANGLE') {
            // Cycloptic Robo-Alien Eye
            for (let row = 4; row <= 5; row++) {
                for (let col = 6; col <= 9; col++) engine.drawPixel(petX + col, petY + row);
            }
        } else if (petType === 'SQUARE') {
            // Generic squares
            for (let row = 4; row <= 5; row++) {
                for (let col = 3; col <= 5; col++) engine.drawPixel(petX + col, petY + row);
                for (let col = 10; col <= 12; col++) engine.drawPixel(petX + col, petY + row);
            }
        }
    }
}

/**
 * Procedural pixel squishing helper with symmetric sampling to prevent chunks/ripping.
 */
function drawSquishedSprite(engine: PixelEngine, sprite: string[], x: number, y: number, sx: number, sy: number) {
    const sw = sprite[0].length;
    const sh = sprite.length;
    
    const targetW = Math.round(sw * sx);
    const targetH = Math.round(sh * sy);
    
    // Screen-space offsets for centering
    const offsetX = Math.floor((sw - targetW) / 2);
    const offsetY = sh - targetH; // Anchored to bottom

    for (let dy = 0; dy < targetH; dy++) {
        for (let dx = 0; dx < targetW; dx++) {
            // Map destination pixel back to source coordinates
            // Using +0.5 to sample from the center of each pixel for stability
            const sx_coord = Math.floor((dx + 0.5) / sx);
            const sy_coord = Math.floor((dy + 0.5) / sy);
            
            if (sy_coord >= 0 && sy_coord < sh && sx_coord >= 0 && sx_coord < sw) {
                const char = sprite[sy_coord][sx_coord];
                if (char === '#' || char === '.') {
                    engine.drawPixel(x + dx + offsetX, y + dy + offsetY);
                }
            }
        }
    }
}
