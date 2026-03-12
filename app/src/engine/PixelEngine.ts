// Physical dimensions:
export const NATIVE_WIDTH = 1080;
export const NATIVE_HEIGHT = 1920;

// Logical Grid
export const GRID_WIDTH = 135;
export const GRID_HEIGHT = 240;

// Native pixel size of one logical block
export const BLOCK_SIZE = 8; 

// Tamagotchi Themes (Pairs of OFF/ON colors)
export type ThemeColors = { off: string, on: string };
export const THEMES: Record<string, ThemeColors> = {
  GREEN: { off: '#8ba183', on: '#283622' },   // The perfect classic green
  PINK: { off: '#b294a2', on: '#422f38' },    // Slightly warmer dusty pink
  PURPLE: { off: '#9283a1', on: '#2c2236' },  // Desaturated lavender
  BLUE: { off: '#8392a1', on: '#222c36' },    // Steele/slate blue
  RED: { off: '#a18383', on: '#362222' },     // Dusty brick
  ORANGE: { off: '#aa9681', on: '#402e1d' },  // Middle ground burnt orange
  YELLOW: { off: '#a1a183', on: '#363622' },  // Olive/Mustard
  GRAY: { off: '#929292', on: '#2c2c2c' }     // Classic Gameboy Gray
};

export const COLOR_OFF = THEMES.GREEN.off;
export const COLOR_ON = THEMES.GREEN.on;

export class PixelEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private grid: boolean[][];
  private animationFrameId: number | null = null;
  private onRender?: (engine: PixelEngine, frameCount: number) => void;
  private frameCount = 0;
  private clipRect: { x: number, y: number, w: number, h: number } | null = null;
  private currentTheme: ThemeColors = THEMES.GREEN;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get 2D context");
    this.ctx = ctx;

    // Set internal resolution
    this.canvas.width = NATIVE_WIDTH;
    this.canvas.height = NATIVE_HEIGHT;

    // Initialize 135x240 grid with 'false' (OFF)
    this.grid = Array.from({ length: GRID_HEIGHT }, () => 
      Array(GRID_WIDTH).fill(false)
    );
  }

  // Set the current color theme
  public setTheme(theme: ThemeColors | undefined) {
    if (theme) {
      this.currentTheme = theme;
    } else {
      this.currentTheme = THEMES.GREEN;
    }
  }

  // Draw a single logical pixel at (x, y)
  public drawPixel(x: number, y: number, on: boolean = true) {
    if (this.clipRect) {
      if (x < this.clipRect.x || x >= this.clipRect.x + this.clipRect.w ||
          y < this.clipRect.y || y >= this.clipRect.y + this.clipRect.h) {
        return;
      }
    }
    if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
      this.grid[y][x] = on;
    }
  }

  // Set a bounding box for drawing; any drawPixel calls outside this box are ignored.
  public setClipRect(x: number, y: number, w: number, h: number) {
    this.clipRect = { x, y, w, h };
  }

  // Remove the current clipping rectangle.
  public clearClipRect() {
    this.clipRect = null;
  }

  // Clear the entire grid
  public clear() {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        this.grid[y][x] = false;
      }
    }
  }

  // Provide a callback to be run every frame
  public setRenderLoop(callback: (engine: PixelEngine, frameCount: number) => void) {
    this.onRender = callback;
  }

  // Start the engine
  public start() {
    this.frameCount = 0;
    const loop = () => {
      this.frameCount++;
      
      // 1. Clear grid state
      this.clear();

      // 2. Run user logic to populate grid
      if (this.onRender) {
        this.onRender(this, this.frameCount);
      }

      // 3. Render grid to actually canvas
      this.renderToCanvas();

      this.animationFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  // Stop the engine
  public stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private renderToCanvas() {
    // Fill entire canvas with "OFF" background color
    this.ctx.fillStyle = this.currentTheme.off;
    this.ctx.fillRect(0, 0, NATIVE_WIDTH, NATIVE_HEIGHT);

    // Swap to "ON" color
    this.ctx.fillStyle = this.currentTheme.on;

    // Draw active blocks
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        if (this.grid[y][x]) {
          this.ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
    }
  }
}
