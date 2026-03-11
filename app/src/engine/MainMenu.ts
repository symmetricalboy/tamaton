import { PixelEngine, GRID_WIDTH } from './PixelEngine';
import { drawString } from './Font';
import { drawButton } from './UI';

export const MAIN_MENU_BUTTONS = {
    CHECK_FONT: {
        x: Math.floor(GRID_WIDTH / 2 - 35),
        y: 100,
        w: 70,
        h: 16,
        text: "CHECK FONT"
    },
    PET_1: {
        x: Math.floor(GRID_WIDTH / 2 - 35),
        y: 125,
        w: 70,
        h: 16,
        text: "PET 1"
    },
    PET_2: {
        x: Math.floor(GRID_WIDTH / 2 - 35),
        y: 145,
        w: 70,
        h: 16,
        text: "PET 2"
    },
    PET_3: {
        x: Math.floor(GRID_WIDTH / 2 - 35),
        y: 165,
        w: 70,
        h: 16,
        text: "PET 3"
    }
};

export function drawMainMenu(engine: PixelEngine) {
    // Draw Title (smaller version or just text)
    const title = "MAIN MENU";
    const titleWidth = title.length * 6;
    drawString(engine, title, Math.floor(GRID_WIDTH / 2 - titleWidth / 2), 40);

    // Draw buttons
    drawButton(engine, MAIN_MENU_BUTTONS.CHECK_FONT.x, MAIN_MENU_BUTTONS.CHECK_FONT.y, MAIN_MENU_BUTTONS.CHECK_FONT.w, MAIN_MENU_BUTTONS.CHECK_FONT.h, MAIN_MENU_BUTTONS.CHECK_FONT.text);
    drawButton(engine, MAIN_MENU_BUTTONS.PET_1.x, MAIN_MENU_BUTTONS.PET_1.y, MAIN_MENU_BUTTONS.PET_1.w, MAIN_MENU_BUTTONS.PET_1.h, MAIN_MENU_BUTTONS.PET_1.text);
    drawButton(engine, MAIN_MENU_BUTTONS.PET_2.x, MAIN_MENU_BUTTONS.PET_2.y, MAIN_MENU_BUTTONS.PET_2.w, MAIN_MENU_BUTTONS.PET_2.h, MAIN_MENU_BUTTONS.PET_2.text);
    drawButton(engine, MAIN_MENU_BUTTONS.PET_3.x, MAIN_MENU_BUTTONS.PET_3.y, MAIN_MENU_BUTTONS.PET_3.w, MAIN_MENU_BUTTONS.PET_3.h, MAIN_MENU_BUTTONS.PET_3.text);
}
