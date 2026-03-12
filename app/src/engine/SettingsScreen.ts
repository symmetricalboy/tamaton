import { PixelEngine, GRID_WIDTH, THEMES } from './PixelEngine';
import { drawButton } from './UI';
import { drawString } from './Font';

export type SettingsScreenState = 'MAIN' | 'COLOR_THEME';

export const SETTINGS_BUTTONS = {
    BACK: { x: 10, y: 5, w: 35, h: 14, text: "BACK" },
    SCREEN_COLOR: { x: 20, y: 80, w: 95, h: 16, text: "SCREEN COLOR" }
};

export const COLOR_THEME_BUTTONS = Object.keys(THEMES).map((themeName, idx) => {
    return {
        id: themeName,
        x: 20 + (idx % 2) * 50,
        y: 40 + Math.floor(idx / 2) * 20,
        w: 45,
        h: 15,
        text: themeName
    };
});

function drawSpeakerIcon(engine: PixelEngine, x: number, y: number, isMuted: boolean, volume: number) {
    if (isMuted) {
        // Draw just an 'X'
        const xStr = [
            "1     1",
            " 1   1 ",
            "  1 1  ",
            "   1   ",
            "  1 1  ",
            " 1   1 ",
            "1     1"
        ];
        const startX = x + 1; // roughly center within the 10px wide area
        const startY = y;
        for (let r = 0; r < xStr.length; r++) {
            for (let c = 0; c < xStr[r].length; c++) {
                if (xStr[r][c] === '1') {
                    engine.drawPixel(startX + c, startY + r, true);
                }
            }
        }
    } else {
        // Basic speaker body
        const baseSpeaker = [
            "  11  ",
            " 111  ",
            "1111  ",
            "1111  ",
            " 111  ",
            "  11  "
        ];
        
        for (let r = 0; r < baseSpeaker.length; r++) {
            for (let c = 0; c < baseSpeaker[r].length; c++) {
                if (baseSpeaker[r][c] === '1') {
                    engine.drawPixel(x + c, y + r, true);
                }
            }
        }

        if (volume > 0) {
            // First wave
            engine.drawPixel(x + 5, y + 2);
            engine.drawPixel(x + 5, y + 3);
            engine.drawPixel(x + 5, y + 4);
        }
        if (volume >= 50) {
            // Second wave
            engine.drawPixel(x + 7, y + 1);
            engine.drawPixel(x + 7, y + 2);
            engine.drawPixel(x + 7, y + 3);
            engine.drawPixel(x + 7, y + 4);
            engine.drawPixel(x + 7, y + 5);
        }
        if (volume >= 100) {
            // Third wave
            engine.drawPixel(x + 9, y);
            engine.drawPixel(x + 9, y + 1);
            engine.drawPixel(x + 9, y + 2);
            engine.drawPixel(x + 9, y + 3);
            engine.drawPixel(x + 9, y + 4);
            engine.drawPixel(x + 9, y + 5);
            engine.drawPixel(x + 9, y + 6);
        }
    }
}

export function drawSettingsScreen(
    engine: PixelEngine, 
    subState: SettingsScreenState, 
    volume: number, 
    isMuted: boolean
) {
    drawButton(engine, SETTINGS_BUTTONS.BACK.x, SETTINGS_BUTTONS.BACK.y, SETTINGS_BUTTONS.BACK.w, SETTINGS_BUTTONS.BACK.h, SETTINGS_BUTTONS.BACK.text);

    if (subState === 'MAIN') {
        // Volume Section
        drawString(engine, "VOLUME", 20, 35);
        
        // Speaker Icon Button
        const muteBoxX = 13;
        const muteBoxY = 46;
        const muteBoxW = 20;
        const muteBoxH = 15;
        drawButton(engine, muteBoxX, muteBoxY, muteBoxW, muteBoxH, "");

        const speakerX = muteBoxX + 5;
        const speakerY = muteBoxY + 4;
        drawSpeakerIcon(engine, speakerX, speakerY, isMuted, volume);

        // Slider line
        const sliderX = 40;
        const sliderY = 53;
        const sliderW = 60;
        for (let i = 0; i < sliderW; i++) {
            if (i % 2 === 0) { // Dotted line for the track
                engine.drawPixel(sliderX + i, sliderY);
            }
        }
        
        // Slider knob
        const knobX = sliderX + Math.floor((volume / 100) * sliderW);
        engine.drawPixel(knobX - 1, sliderY - 2);
        engine.drawPixel(knobX, sliderY - 2);
        engine.drawPixel(knobX + 1, sliderY - 2);
        engine.drawPixel(knobX - 1, sliderY - 1);
        engine.drawPixel(knobX, sliderY - 1);
        engine.drawPixel(knobX + 1, sliderY - 1);
        engine.drawPixel(knobX - 1, sliderY);
        engine.drawPixel(knobX, sliderY);
        engine.drawPixel(knobX + 1, sliderY);
        engine.drawPixel(knobX - 1, sliderY + 1);
        engine.drawPixel(knobX, sliderY + 1);
        engine.drawPixel(knobX + 1, sliderY + 1);
        engine.drawPixel(knobX - 1, sliderY + 2);
        engine.drawPixel(knobX, sliderY + 2);
        engine.drawPixel(knobX + 1, sliderY + 2);

        // Percentage text
        const volText = isMuted ? "MUTE" : `${Math.floor(volume)}%`;
        drawString(engine, volText, 105, 50);

        // Screen Color Submenu Button
        const scBtn = SETTINGS_BUTTONS.SCREEN_COLOR;
        drawButton(engine, scBtn.x, scBtn.y, scBtn.w, scBtn.h, scBtn.text);
        
    } else if (subState === 'COLOR_THEME') {
        const title = "SCREEN COLOR";
        drawString(engine, title, Math.floor(GRID_WIDTH / 2 - (title.length * 6) / 2), 25);
        
        // Draw the 8 color buttons
        COLOR_THEME_BUTTONS.forEach(btn => {
            drawButton(engine, btn.x, btn.y, btn.w, btn.h, btn.text);
        });
    }
}
