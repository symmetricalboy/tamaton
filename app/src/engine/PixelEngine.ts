// Physical dimensions:
export const NATIVE_WIDTH = 1080;
export const NATIVE_HEIGHT = 1920;

// Logical Grid
export const GRID_WIDTH = 135;
export const GRID_HEIGHT = 240;

// Native pixel size of one logical block
export const BLOCK_SIZE = 8; 

// Tamagotchi Colors
export const COLOR_OFF = '#8ba183'; // Light greenish background
export const COLOR_ON = '#283622';  // Dark green/black pixel

export class PixelEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private grid: boolean[][];
  private animationFrameId: number | null = null;
  private onRender?: (engine: PixelEngine, frameCount: number) => void;
  private frameCount = 0;

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

  // Draw a single logical pixel at (x, y)
  public drawPixel(x: number, y: number, on: boolean = true) {
    if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
      this.grid[y][x] = on;
    }
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
    this.ctx.fillStyle = COLOR_OFF;
    this.ctx.fillRect(0, 0, NATIVE_WIDTH, NATIVE_HEIGHT);

    // Swap to "ON" color
    this.ctx.fillStyle = COLOR_ON;

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
