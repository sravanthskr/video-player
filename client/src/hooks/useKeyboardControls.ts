import { useEffect, useState, useCallback, RefObject } from "react";

interface UseKeyboardControlsProps {
  videoRef: RefObject<HTMLVideoElement>;
  playPause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleFullscreen: () => void;
  onSpeedChange: (show: boolean) => void;
}

export function useKeyboardControls({
  videoRef,
  playPause,
  seek,
  setVolume,
  toggleFullscreen,
  onSpeedChange,
}: UseKeyboardControlsProps) {
  const [is2xSpeed, setIs2xSpeed] = useState(false);
  const [spaceKeyPressed, setSpaceKeyPressed] = useState(false);
  const [originalSpeed, setOriginalSpeed] = useState(1);
  const [speedTimeout, setSpeedTimeout] = useState<NodeJS.Timeout | null>(null);
  const [temporarySpeed, setTemporarySpeed] = useState(2.0); // Default 2x, can be changed

  const video = videoRef.current;

  const handleSpaceDown = useCallback(() => {
    if (spaceKeyPressed) return;
    
    setSpaceKeyPressed(true);
    
    // Start temporary speed after brief delay to distinguish from tap (YouTube-style)
    const timeout = setTimeout(() => {
      if (video && !video.paused) {
        setOriginalSpeed(video.playbackRate);
        video.playbackRate = temporarySpeed;
        setIs2xSpeed(true);
        onSpeedChange(true);
      }
    }, 200); // Shorter delay for better responsiveness
    
    setSpeedTimeout(timeout);
  }, [spaceKeyPressed, video, onSpeedChange, temporarySpeed]);

  const handleSpaceUp = useCallback(() => {
    if (!spaceKeyPressed) return;
    
    const wasSpeedActive = is2xSpeed;
    
    // Clear the timeout if it exists
    if (speedTimeout) {
      clearTimeout(speedTimeout);
      setSpeedTimeout(null);
    }
    
    setSpaceKeyPressed(false);
    
    if (wasSpeedActive && video) {
      // Restore original speed
      video.playbackRate = originalSpeed;
      setIs2xSpeed(false);
      onSpeedChange(false);
    } else {
      // If it was a quick tap, toggle play/pause
      playPause();
    }
  }, [spaceKeyPressed, is2xSpeed, video, originalSpeed, playPause, onSpeedChange, speedTimeout]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          handleSpaceDown();
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "KeyM":
          e.preventDefault();
          setVolume(0);
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (video) {
            seek(Math.max(0, video.currentTime - 10));
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (video) {
            seek(Math.min(video.duration, video.currentTime + 10));
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (video) {
            const newVolume = Math.min(100, video.volume * 100 + 10);
            setVolume(newVolume);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (video) {
            const newVolume = Math.max(0, video.volume * 100 - 10);
            setVolume(newVolume);
          }
          break;
        case "Digit1":
          e.preventDefault();
          setTemporarySpeed(1.25);
          break;
        case "Digit2":
          e.preventDefault();
          setTemporarySpeed(1.5);
          break;
        case "Digit3":
          e.preventDefault();
          setTemporarySpeed(2.0);
          break;
        case "Digit4":
          e.preventDefault();
          setTemporarySpeed(2.5);
          break;
        case "Digit5":
          e.preventDefault();
          setTemporarySpeed(3.0);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        handleSpaceUp();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleSpaceDown, handleSpaceUp, video, seek, setVolume, toggleFullscreen, temporarySpeed]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (speedTimeout) {
        clearTimeout(speedTimeout);
      }
    };
  }, [speedTimeout]);

  return {
    is2xSpeed,
    temporarySpeed,
    setTemporarySpeed,
  };
}
