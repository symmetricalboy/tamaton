import { PixelEngine, GRID_WIDTH } from './PixelEngine';
import { 
    drawSprite, 
    spriteCirclePet, 
    spriteSquarePet, 
    spriteTrianglePet 
} from './SpriteDrawer';
import { drawButton, drawString } from './UI';

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
    },
    INFO: {
        x: 95,
        y: 5,
        w: 35,
        h: 14,
        text: "INFO"
    }
};

export function drawGameplayScreen(engine: PixelEngine, frameCount: number, petType: PetType, state: PetState) {
    // 1. Draw UI / Top Buttons
    const backBtn = GAMEPLAY_BUTTONS.BACK;
    drawButton(engine, backBtn.x, backBtn.y, backBtn.w, backBtn.h, backBtn.text);
    
    const infoBtn = GAMEPLAY_BUTTONS.INFO;
    drawButton(engine, infoBtn.x, infoBtn.y, infoBtn.w, infoBtn.h, infoBtn.text);

    // 2. Select Sprite and Name
    let sprite: string[];
    let petName: string;
    switch (petType) {
        case 'SQUARE': 
            sprite = spriteSquarePet; 
            petName = "CUBIE";
            break;
        case 'TRIANGLE': 
            sprite = spriteTrianglePet; 
            petName = "ALIEN";
            break;
        default: 
            sprite = spriteCirclePet; 
            petName = "BLOBBY";
            break;
    }

    const spriteWidth = sprite[0].length;
    const spriteHeight = sprite.length;

    // 3. Draw New Layout Basics
    // Title Name
    const titleWidth = petName.length * 6;
    const titleX = Math.floor((GRID_WIDTH - titleWidth) / 2) + 1;
    drawString(engine, petName, titleX, 28);

    // Screen Boundary
    const screenX = 10;
    const screenY = 40;
    const screenW = GRID_WIDTH - 20;
    const screenH = 110;
    
    // Draw rounded rectangle for the "screen"
    // Skip corners for a rounder edge
    for (let i = screenX + 2; i < screenX + screenW - 2; i++) {
        engine.drawPixel(i, screenY);
        engine.drawPixel(i, screenY + screenH - 1);
    }
    for (let i = screenY + 2; i < screenY + screenH - 2; i++) {
        engine.drawPixel(screenX, i);
        engine.drawPixel(screenX + screenW - 1, i);
    }
    // Add inner corner pixels to smooth the curve
    engine.drawPixel(screenX + 1, screenY + 1); // Top-left
    engine.drawPixel(screenX + screenW - 2, screenY + 1); // Top-right
    engine.drawPixel(screenX + 1, screenY + screenH - 2); // Bottom-left
    engine.drawPixel(screenX + screenW - 2, screenY + screenH - 2); // Bottom-right

    // 4. Action Buttons (Grid 2x4 below the screen)
    const btnStartY = screenY + screenH + 6;
    const btnW = 45;
    const btnH = 15;
    const gapX = 10;
    const gapY = 5;
    const totalW = btnW * 2 + gapX;
    const btnStartX = Math.floor((GRID_WIDTH - totalW) / 2);

    const btnNames = ["PET", "FEED", "WALK", "PLAY", "TREAT", "SCOLD", "TEACH", "TRAIN"];
    for(let r=0; r<4; r++){
        for(let c=0; c<2; c++){
            const bx = btnStartX + c * (btnW + gapX);
            const by = btnStartY + r * (btnH + gapY);
            const text = btnNames[r * 2 + c];
            drawButton(engine, bx, by, btnW, btnH, text);
        }
    }


    // 5. Animation Timing / State Updates
    // We update the state object directly (it's a ref in App.tsx)
    const hopDuration = 40;
    const hopCooldown = 120;
    // Ground is inside the "screen" now
    const groundY = screenY + screenH - 6;

    if (!state.isHopping && (frameCount - state.lastHopFrame) > hopCooldown) {
        // Start a new hop
        state.isHopping = true;
        state.lastHopFrame = frameCount;
        state.hopStartX = state.x;
        
        // Random horizontal destination
        const maxJump = 30;
        const randomDir = (Math.random() - 0.5) * 2;
        state.hopTargetX = state.x + Math.floor(randomDir * maxJump);
        
        // Bound to screen limits
        const margin = screenX + 5;
        state.hopTargetX = Math.max(margin, Math.min(screenX + screenW - spriteWidth - 5, state.hopTargetX));
    }

    let drawY = state.y;
    let drawX = state.x;

    if (state.isHopping) {
        const elapsed = frameCount - state.lastHopFrame;
        const progress = Math.min(1, elapsed / hopDuration);
        
        let yOffset = 0;
        
        if (petType === 'SQUARE') {
            // Thwomp jump
            const jumpHeight = 20;
            if (progress < 0.4) {
                // Leap up
                const p = progress / 0.4;
                yOffset = -Math.round(jumpHeight * Math.sin(p * Math.PI / 2));
                drawX = state.hopStartX + (state.hopTargetX - state.hopStartX) * p;
            } else if (progress < 0.8) {
                // Hover
                yOffset = -jumpHeight;
                drawX = state.hopTargetX;
            } else {
                // Stomp down fast
                const p = (progress - 0.8) / 0.2;
                yOffset = -jumpHeight + Math.round(jumpHeight * Math.pow(p, 2)); // plummet
                drawX = state.hopTargetX;
            }
        } else {
            // Parabolic jump y-offset
            const jumpHeight = 15;
            yOffset = Math.floor(-4 * jumpHeight * progress * (1 - progress));
            drawX = state.hopStartX + (state.hopTargetX - state.hopStartX) * progress;
        }

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

    if (petType === 'CIRCLE' || petType === 'SQUARE' || petType === 'TRIANGLE') {
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
    }

    if (petType === 'CIRCLE') {
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
        // Robotic Jitter / Buzzing (Idling only)
        if (!state.isHopping && Math.random() < 0.05) {
            // Intense buzz frame
            const jitterX = Math.round((Math.random() - 0.5) * 2);
            const jitterY = Math.round((Math.random() - 0.5) * 2);
            drawSprite(engine, sprite, petX + jitterX, petY + jitterY);
        } else if (!state.isHopping && frameCount % 60 < 3) {
            // Predictable minor jitter
            const jitterX = Math.floor((Math.random() - 0.5) * 1);
            drawSprite(engine, sprite, petX + jitterX, petY);
        } else {
            drawSprite(engine, sprite, petX, petY);
        }
    } else if (petType === 'CIRCLE') {
        // Draw Squished Blob
        drawSquishedSprite(engine, sprite, petX, petY, squishX, squishY);
    } else {
        drawSprite(engine, sprite, petX, petY);
        // Draw dust if recently landed
        if (!state.isHopping && petType === 'SQUARE') {
            const timeSinceLand = frameCount - state.lastHopFrame - hopDuration;
            if (timeSinceLand >= 0 && timeSinceLand < 15) {
                // Dust particles moving outward
                const progress = timeSinceLand / 15;
                const spread = 4 + progress * 15;
                const rise = progress * 6;
                const dustBaseY = groundY - 2;
                const leftX = petX + 4;
                const rightX = petX + spriteWidth - 4;
                
                if (progress < 0.8) {
                    // Left dust
                    engine.drawPixel(Math.floor(leftX - spread), Math.floor(dustBaseY - rise));
                    engine.drawPixel(Math.floor(leftX - spread * 0.7), Math.floor(dustBaseY - rise * 1.5));
                    engine.drawPixel(Math.floor(leftX - spread * 0.4), Math.floor(dustBaseY - rise * 0.5));
                    // Right dust
                    engine.drawPixel(Math.floor(rightX + spread), Math.floor(dustBaseY - rise));
                    engine.drawPixel(Math.floor(rightX + spread * 0.7), Math.floor(dustBaseY - rise * 1.5));
                    engine.drawPixel(Math.floor(rightX + spread * 0.4), Math.floor(dustBaseY - rise * 0.5));
                }
            }
        }
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
    } else if (petType === 'SQUARE') {
        const eyeY = petY + 8;
        const mouthY = petY + 16;
        
        const sw = sprite[0].length; // 32
        const centerX = petX + Math.floor(sw / 2);

        // Gaze offset
        let lookOffset = 0;
        if (state.lookDir === 'LEFT') lookOffset = -4;
        if (state.lookDir === 'RIGHT') lookOffset = 4;

        // Draw Angry Eyes
        const eyeDist = 6;
        const leftEyeX = centerX - eyeDist + lookOffset;
        const rightEyeX = centerX + eyeDist + lookOffset;
        
        if (!isBlinking) {
            // Angry eyebrows \ /
            // Left eye: \
            engine.drawPixel(leftEyeX - 3, eyeY - 2, false);
            engine.drawPixel(leftEyeX - 2, eyeY - 2, false);
            engine.drawPixel(leftEyeX - 1, eyeY - 1, false);
            engine.drawPixel(leftEyeX, eyeY, false);
            engine.drawPixel(leftEyeX + 1, eyeY, false);
            
            // Right eye: /
            engine.drawPixel(rightEyeX + 3, eyeY - 2, false);
            engine.drawPixel(rightEyeX + 2, eyeY - 2, false);
            engine.drawPixel(rightEyeX + 1, eyeY - 1, false);
            engine.drawPixel(rightEyeX, eyeY, false);
            engine.drawPixel(rightEyeX - 1, eyeY, false);
            
            // Eye dots
            engine.drawPixel(leftEyeX, eyeY + 1, false);
            engine.drawPixel(leftEyeX, eyeY + 2, false);
            engine.drawPixel(rightEyeX, eyeY + 1, false);
            engine.drawPixel(rightEyeX, eyeY + 2, false);
        } else {
            // Blinking (thin line)
            for (let i = -2; i <= 1; i++) {
                engine.drawPixel(leftEyeX + i, eyeY + 1, false);
            }
            for (let i = -1; i <= 2; i++) {
                engine.drawPixel(rightEyeX + i, eyeY + 1, false);
            }
        }
        
        // Angry Mouth (frown or small zig zag or flat line)
        const mouthX = centerX + lookOffset - 3;
        // Upside down V or flat
        engine.drawPixel(mouthX, mouthY + 1, false);
        engine.drawPixel(mouthX + 1, mouthY, false);
        engine.drawPixel(mouthX + 2, mouthY, false);
        engine.drawPixel(mouthX + 3, mouthY, false);
        engine.drawPixel(mouthX + 4, mouthY, false);
        engine.drawPixel(mouthX + 5, mouthY + 1, false);
    } else if (petType === 'TRIANGLE') {
        const eyeY = petY + 8; 
        const mouthY = petY + 17;
        const sw = sprite[0].length; // 32
        const centerX = petX + Math.floor(sw / 2);

        // Cyclops eye gaze offset
        let lookOffset = 0;
        if (state.lookDir === 'LEFT') lookOffset = -3;
        if (state.lookDir === 'RIGHT') lookOffset = 3;

        // Big cyclops eye
        const eyeW = 11;
        const eyeH = 7;
        const eyeX = centerX + lookOffset - Math.floor(eyeW / 2);
        
        if (!isBlinking) {
            // Clear eye area
            for (let r = 0; r < eyeH; r++) {
                for (let c = 0; c < eyeW; c++) {
                    // Make it slightly rounded by skipping corners
                    if ((r === 0 || r === eyeH - 1) && (c === 0 || c === eyeW - 1)) continue;
                    engine.drawPixel(eyeX + c, eyeY + r, false);
                }
            }
            // Pupil
            const pupilW = 3;
            const pupilH = 3;
            const pupilX = centerX + Math.floor(lookOffset * 1.5) - Math.floor(pupilW / 2);
            for (let pr = 0; pr < pupilH; pr++) {
                for (let pc = 0; pc < pupilW; pc++) {
                    engine.drawPixel(pupilX + pc, eyeY + 2 + pr, true);
                }
            }
        } else {
            // Blinking (thin line)
            for (let c = 1; c < eyeW - 1; c++) {
                engine.drawPixel(eyeX + c, eyeY + Math.floor(eyeH / 2), false);
            }
        }

        // BIG mouth with sharp teeth
        const mouthW = 20;
        const mouthH = 5;
        const mouthX = centerX + lookOffset - Math.floor(mouthW / 2);
        
        // Clear mouth area
        for (let r = 0; r < mouthH; r++) {
            for (let c = 0; c < mouthW; c++) {
                if ((r === 0 || r === mouthH - 1) && (c === 0 || c === mouthW - 1)) continue; // round corners
                // Make the mouth taper at the edges
                if ((r === 1 || r === mouthH - 2) && (c === 0 || c === mouthW - 1)) continue;
                engine.drawPixel(mouthX + c, mouthY + r, false);
            }
        }
        
        // Draw teeth (True pixels inside the false mouth)
        // Top teeth
        for (let c = 1; c < mouthW - 3; c += 4) {
            engine.drawPixel(mouthX + c, mouthY, true);
            engine.drawPixel(mouthX + c + 1, mouthY, true);
            engine.drawPixel(mouthX + c + 2, mouthY, true);
            engine.drawPixel(mouthX + c + 1, mouthY + 1, true);
        }
        // Bottom teeth
        for (let c = 3; c < mouthW - 3; c += 4) {
            engine.drawPixel(mouthX + c, mouthY + mouthH - 1, true);
            engine.drawPixel(mouthX + c + 1, mouthY + mouthH - 1, true);
            engine.drawPixel(mouthX + c + 2, mouthY + mouthH - 1, true);
            engine.drawPixel(mouthX + c + 1, mouthY + mouthH - 2, true);
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
