import { useEffect, useRef } from 'react'
import { 
  PixelEngine, 
  drawTitleScreen, 
  drawWarningScreen, 
  drawMainMenu, 
  drawFontCheckScreen,
  WARNING_TEXT, 
  TYPING_SPEED,
  MAIN_MENU_BUTTONS,
  drawGameplayScreen,
  GAMEPLAY_BUTTONS,
  GRID_WIDTH,
  GRID_HEIGHT,
  getGroundY
} from './engine'
import type { PetType, PetState } from './engine'
import themeUrl from './assets/audio/theme.mp3'
import './App.css'

type ScreenState = 'TITLE' | 'WARNING' | 'MAIN_MENU' | 'FONT_CHECK' | 'GAMEPLAY';

const SCREEN_STATES: Record<string, ScreenState> = {
  TITLE: 'TITLE',
  WARNING: 'WARNING',
  MAIN_MENU: 'MAIN_MENU',
  FONT_CHECK: 'FONT_CHECK',
  GAMEPLAY: 'GAMEPLAY'
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const screenStateRef = useRef<ScreenState>(SCREEN_STATES.TITLE);
  const stateStartFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const selectedPetRef = useRef<PetType>('CIRCLE');
  const petStateRef = useRef<PetState>({
    x: GRID_WIDTH / 2 - 16,
    y: getGroundY(GRID_HEIGHT) - 24,
    lastHopFrame: -10000,
    isHopping: false,
    hopTargetX: 0,
    hopStartX: 0,
    lookDir: 'CENTER',
    lookTimer: 100
  });

  useEffect(() => {
    // Initialize audio on component mount
    audioRef.current = new Audio(themeUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5; // Start at 50% volume
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize the Pixel Engine
    const engine = new PixelEngine(canvasRef.current);

    // Setup the render loop
    engine.setRenderLoop((eng, frame) => {
      currentFrameRef.current = frame;
      if (stateStartFrameRef.current === -1) {
        stateStartFrameRef.current = frame;
      }
      const stateFrameCount = frame - stateStartFrameRef.current;
      
      switch (screenStateRef.current) {
        case SCREEN_STATES.TITLE:
          drawTitleScreen(eng, frame);
          break;
        case SCREEN_STATES.WARNING:
          drawWarningScreen(eng, frame, stateFrameCount);
          break;
        case SCREEN_STATES.MAIN_MENU:
          drawMainMenu(eng);
          break;
        case SCREEN_STATES.FONT_CHECK:
          drawFontCheckScreen(eng);
          break;
        case SCREEN_STATES.GAMEPLAY:
          drawGameplayScreen(eng, frame, selectedPetRef.current, petStateRef.current);
          break;
      }
    });

    engine.start();

    // Clean up animation on unmount
    return () => {
      engine.stop();
    };
  }, []);

  const handleInteraction = (e: React.MouseEvent | React.PointerEvent) => {
    // Position detection on logical grid
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 135 / rect.width;
    const scaleY = 240 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Browsers block autoplaying audio. 
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch((err) => {
        console.warn("Audio playback failed:", err);
      });
    }

    const currentState = screenStateRef.current;
    
    if (currentState === SCREEN_STATES.TITLE) {
      screenStateRef.current = SCREEN_STATES.WARNING;
      stateStartFrameRef.current = -1;
    } else if (currentState === SCREEN_STATES.WARNING) {
      const stateFrameCount = currentFrameRef.current - stateStartFrameRef.current;
      const isDone = (stateFrameCount * TYPING_SPEED) >= WARNING_TEXT.length;
      
      if (isDone) {
        screenStateRef.current = SCREEN_STATES.MAIN_MENU;
        stateStartFrameRef.current = -1;
      } else {
        stateStartFrameRef.current = currentFrameRef.current - Math.ceil(WARNING_TEXT.length / TYPING_SPEED);
      }
    } else if (currentState === SCREEN_STATES.MAIN_MENU) {
      // Check for button clicks
      const btn = MAIN_MENU_BUTTONS.CHECK_FONT;
      if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
        screenStateRef.current = SCREEN_STATES.FONT_CHECK;
        stateStartFrameRef.current = -1;
      }

      // Pet Selection
      const p1 = MAIN_MENU_BUTTONS.PET_1;
      if (x >= p1.x && x <= p1.x + p1.w && y >= p1.y && y <= p1.y + p1.h) {
        selectedPetRef.current = 'CIRCLE';
        screenStateRef.current = SCREEN_STATES.GAMEPLAY;
        stateStartFrameRef.current = -1;
        // Reset state
        petStateRef.current = { 
            x: GRID_WIDTH / 2 - 16, 
            y: getGroundY(GRID_HEIGHT) - 24, 
            lastHopFrame: currentFrameRef.current - 10000, 
            isHopping: false, 
            hopTargetX: 0, 
            hopStartX: 0,
            lookDir: 'CENTER',
            lookTimer: 100
        };
      }
      const p2 = MAIN_MENU_BUTTONS.PET_2;
      if (x >= p2.x && x <= p2.x + p2.w && y >= p2.y && y <= p2.y + p2.h) {
        selectedPetRef.current = 'SQUARE';
        screenStateRef.current = SCREEN_STATES.GAMEPLAY;
        stateStartFrameRef.current = -1;
        // Reset state
        petStateRef.current = { 
            x: GRID_WIDTH / 2 - 16, 
            y: getGroundY(GRID_HEIGHT) - 24, 
            lastHopFrame: currentFrameRef.current - 10000, 
            isHopping: false, 
            hopTargetX: 0, 
            hopStartX: 0,
            lookDir: 'CENTER',
            lookTimer: 100
        };
      }
      const p3 = MAIN_MENU_BUTTONS.PET_3;
      if (x >= p3.x && x <= p3.x + p3.w && y >= p3.y && y <= p3.y + p3.h) {
        selectedPetRef.current = 'TRIANGLE';
        screenStateRef.current = SCREEN_STATES.GAMEPLAY;
        stateStartFrameRef.current = -1;
        // Reset state
        petStateRef.current = { 
            x: GRID_WIDTH / 2 - 8, 
            y: getGroundY(GRID_HEIGHT) - 15, 
            lastHopFrame: currentFrameRef.current - 10000, 
            isHopping: false, 
            hopTargetX: 0, 
            hopStartX: 0,
            lookDir: 'CENTER',
            lookTimer: 100
        };
      }
    } else if (currentState === SCREEN_STATES.FONT_CHECK) {
      // More generous hit area for the back button (top left corner)
      if (x >= 0 && x <= 50 && y >= 0 && y <= 25) {
        screenStateRef.current = SCREEN_STATES.MAIN_MENU;
        stateStartFrameRef.current = -1;
      }
    } else if (currentState === SCREEN_STATES.GAMEPLAY) {
      const back = GAMEPLAY_BUTTONS.BACK;
      const info = GAMEPLAY_BUTTONS.INFO;
      
      if (x >= back.x && x <= back.x + back.w && y >= back.y && y <= back.y + back.h) {
        screenStateRef.current = SCREEN_STATES.MAIN_MENU;
        stateStartFrameRef.current = -1;
      } else if (x >= info.x && x <= info.x + info.w && y >= info.y && y <= info.y + info.h) {
        console.log("Action Button Clicked: INFO (Top Right)");
      }   // Check the 8 Action Buttons
      const screenY = 40;
      const screenH = 110;
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
              if (x >= bx && x <= bx + btnW && y >= by && y <= by + btnH) {
                  const clickedBtn = btnNames[r * 2 + c];
                  console.log(`Action Button Clicked: ${clickedBtn}`);
                  // Future: trigger specific action based on `clickedBtn`
              }
          }
      }
    }
  };

  return (
    <div className="app-container" onPointerDown={handleInteraction}>
      <canvas ref={canvasRef} className="retro-canvas" />
    </div>
  )
}

export default App
