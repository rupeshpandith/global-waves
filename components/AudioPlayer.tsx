
import React, { useState, useRef, useEffect } from 'react';
import { RadioStation } from '../types';

interface AudioPlayerProps {
  currentStation: RadioStation | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ currentStation, isPlaying, onTogglePlay, onNext, onPrev }) => {
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Re-sync volume/mute whenever audio element changes or state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted, currentStation?.id]);

  // Handle playback
  useEffect(() => {
    if (!audioRef.current || !currentStation) return;

    if (isPlaying) {
        setIsLoading(true);
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                 // AbortError is normal during fast switching (user clicks next quickly)
                 if (error.name === 'AbortError') return;
                 
                 // CRITICAL: If browser blocks autoplay, we MUST revert UI to paused
                 if (error.name === 'NotAllowedError') {
                     console.warn("Autoplay blocked by browser. User interaction required.");
                     // Trigger toggle to revert parent state to false (Paused)
                     onTogglePlay(); 
                     setIsLoading(false);
                     return;
                 }
                 
                 console.error("Playback error:", error);
                 setIsLoading(false);
            });
        }
    } else {
        audioRef.current.pause();
        setIsLoading(false);
    }
  }, [currentStation, isPlaying]);

  // Event handlers
  const handleLoadStart = () => {
    if (isPlaying) setIsLoading(true);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handlePlaying = () => {
    setIsLoading(false);
  };
  
  const handlePause = () => {
    setIsLoading(false);
  };

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
      const errorMessage = e.currentTarget.error ? e.currentTarget.error.message : "Unknown audio error";
      const errorCode = e.currentTarget.error ? e.currentTarget.error.code : 0;
      
      // Ignore insignificant errors or aborts
      if (errorCode === 20 || errorMessage.includes("interrupted")) return;

      console.error(`Stream error (Code ${errorCode}):`, errorMessage);
      setIsLoading(false);
      
      // Auto-skip logic for stream failures (Code 2, 3, 4)
      if (errorCode === 4 || errorCode === 3 || errorCode === 2) {
          console.log("Stream unavailable, attempting to skip...");
          onNext();
      } else {
          // For other errors, just stop.
          if (isPlaying) {
              onTogglePlay();
          }
      }
  };

  if (!currentStation) return null;

  return (
    <div className="fixed z-50 transition-all duration-300
                    md:left-0 md:top-0 md:h-screen md:w-80 md:border-r 
                    bottom-0 left-0 w-full h-auto border-t md:border-t-0
                    border-neon-dim bg-dark-bg/80 backdrop-blur-xl flex flex-col justify-between p-6">
      
      <audio 
        key={currentStation.id}
        ref={audioRef} 
        src={currentStation.streamUrl}
        onEnded={onNext}
        onError={handleError}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onPlaying={handlePlaying}
        onPause={handlePause}
        crossOrigin="anonymous" 
        preload="auto" 
      />

      {/* Top Section (Desktop Only) */}
      <div className="hidden md:block mb-8">
         <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full bg-neon ${isPlaying && !isLoading ? 'animate-pulse' : ''}`}></div>
            <span className="text-neon text-xs tracking-widest font-display">LIVE FEED</span>
         </div>
         <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">Global Waves</h2>
      </div>

      {/* Main Player Info */}
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
        
        {/* Album Art / Logo */}
        <div className="relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r from-neon to-green-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${isPlaying && !isLoading ? 'opacity-75' : ''}`}></div>
            <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-neon/50 bg-black">
                <img 
                    src={currentStation.logo} 
                    alt={currentStation.name} 
                    className={`w-full h-full object-cover transition-all duration-[20s] ${isPlaying && !isLoading ? 'animate-[spin_10s_linear_infinite]' : ''}`} 
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-4 h-4 bg-dark-bg rounded-full border border-neon"></div>
                </div>
            </div>
        </div>

        {/* Text Info */}
        <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white truncate max-w-[250px]">{currentStation.name}</h3>
            <p className="text-neon text-sm uppercase tracking-widest">{currentStation.genre}</p>
            <p className="text-gray-400 text-xs">{currentStation.location}</p>
        </div>

        {/* Waveform Visualization (CSS Animation) */}
        <div className="flex items-center justify-center gap-1 h-8 w-full">
            {[...Array(15)].map((_, i) => (
                <div key={i} 
                     className={`w-1 bg-neon/80 rounded-full transition-all duration-75 ${isPlaying && !isLoading ? 'animate-pulse' : 'h-1'}`}
                     style={{ 
                         height: isPlaying && !isLoading ? `${Math.random() * 100}%` : '4px',
                         animationDelay: `${i * 0.05}s`
                     }} 
                />
            ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
            <button onClick={onPrev} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
            </button>
            
            <button 
                onClick={onTogglePlay}
                className="w-16 h-16 rounded-full bg-neon hover:bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all transform hover:scale-105"
            >
                {isLoading ? (
                    <svg className="animate-spin h-8 w-8 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : isPlaying ? (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                    <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
            </button>

            <button onClick={onNext} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
            </button>
        </div>
      </div>

      {/* Volume (Desktop) */}
      <div className="hidden md:block mt-8">
          <div className="flex items-center gap-3 text-xs text-gray-500">
             <button 
                onClick={() => setIsMuted(!isMuted)}
                className="hover:text-neon transition-colors focus:outline-none"
                aria-label={isMuted ? "Unmute" : "Mute"}
             >
                {isMuted || volume === 0 ? (
                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                ) : (
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                )}
             </button>
             <input 
                type="range" 
                min="0" max="100" 
                value={volume} 
                onChange={(e) => {
                    setVolume(Number(e.target.value));
                    if (Number(e.target.value) > 0 && isMuted) setIsMuted(false);
                }}
                className="volume-slider bg-gray-800 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #00FF9D ${volume}%, #1f2937 ${volume}%)`
                }}
             />
          </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
