import WebApp from '@twa-dev/sdk'
import { useEffect, useRef } from 'react'
import { PixelEngine } from './engine/PixelEngine'
import { drawTitleScreen } from './engine/TitleScreen'
import themeUrl from './assets/audio/theme.mp3'
import './App.css'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);

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
      if (!hasStartedRef.current) {
        // 1. Title Screen Mode
        drawTitleScreen(eng, frame);
      } else {
        // 2. Gameplay Mode
        // We will render the Tamagotchi pet here soon!
        // For now, let's just leave the screen blank so we know the transition worked.
      }
    });

    engine.start();

    // Clean up animation on unmount
    return () => {
      engine.stop();
    };
  }, []);

  const handleInteraction = () => {
    // Browsers block autoplaying audio. 
    // We must wait for the first user interaction (a tap or click) to explicitly call .play()
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      
      if (audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.warn("Audio playback failed:", err);
        });
      }
    }
  };

  return (
    // Listen for both clicks and pointer down (touch) events
    <div className="app-container" onClick={handleInteraction} onPointerDown={handleInteraction}>
      <canvas ref={canvasRef} className="retro-canvas" />
    </div>
  )
}

export default App
