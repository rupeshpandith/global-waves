import React from 'react';
import { RadioStation } from '../types';

interface ChannelCardProps {
  station: RadioStation;
  isPlaying: boolean;
  onPlay: (station: RadioStation) => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ station, isPlaying, onPlay }) => {
  return (
    <div className="group relative bg-dark-card border border-gray-800 rounded-xl overflow-hidden hover:border-neon transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
      
      <img src={station.logo} alt={station.name} className="w-full h-32 object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
      
      <div className="absolute top-2 right-2 z-20">
        {station.isTrending && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse">LIVE</span>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 z-20">
        <h4 className="font-bold text-white text-lg">{station.name}</h4>
        <p className="text-xs text-neon mb-2">{station.genre}</p>
        
        <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6l5.25 3.15-.75 1.23-6-3.71z"/></svg>
                {station.listeners}
            </span>
            <button 
                onClick={() => onPlay(station)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-neon text-black' : 'bg-white/10 text-white hover:bg-neon hover:text-black'}`}
            >
                {isPlaying ? (
                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                     <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
