import React, { useState } from 'react';
import { ImageSize } from '../types';
import { generateRadioVisual } from '../services/geminiService';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const url = await generateRadioVisual(prompt, size);
      if (url) {
        setImageUrl(url);
      } else {
        setError('No image generated. Please try again.');
      }
    } catch (err) {
      setError('Failed to generate image. Please ensure you have a valid key selected.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setImageUrl(null);
    setError(null);
  };

  // const handleKeySelection = async () => {
  //   if (window.aistudio) {
  //       try {
  //           await window.aistudio.openSelectKey();
  //       } catch (e) {
  //           console.error(e);
  //       }
  //   }
  // }

  return (
    <div className="bg-dark-card border border-gray-800 p-8 rounded-2xl relative overflow-hidden group">
      {/* Decorative Background Icon */}
      <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
        <svg className="w-24 h-24 text-neon" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
      </div>

      {/* Refresh Button */}
      <button 
        onClick={handleReset}
        className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-black/50 border border-gray-700 text-gray-400 hover:text-neon hover:border-neon transition-all backdrop-blur-md"
        title="Reset Prompt"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      <h3 className="text-2xl font-display font-bold mb-2">Create Station Visuals</h3>
      <p className="text-gray-400 mb-6 text-sm">Powered by Gemini 3 Pro (Nano Banana Pro). Design custom backgrounds for your station.</p>

      <div className="space-y-4 relative z-10">
        <div>
          <label className="block text-xs font-bold text-neon mb-1 uppercase">Visual Prompt</label>
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A cyberpunk radio station in Neo-Tokyo with neon rain..."
            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-neon focus:outline-none transition-colors"
          />
        </div>

        <div className="flex gap-4">
             <div className="flex-1">
                <label className="block text-xs font-bold text-neon mb-1 uppercase">Resolution</label>
                <select 
                    value={size} 
                    onChange={(e) => setSize(e.target.value as ImageSize)}
                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-neon focus:outline-none appearance-none"
                >
                    <option value="1K">1K Standard</option>
                    <option value="2K">2K High Def</option>
                    <option value="4K">4K Ultra</option>
                </select>
             </div>
             <div className="flex items-end">
                <button 
                    onClick={handleGenerate}
                    disabled={loading || !prompt}
                    className="bg-neon hover:bg-white text-black font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Rendering...
                        </>
                    ) : 'GENERATE'}
                </button>
             </div>
        </div>

        {/* <div className="mt-2 text-right">
            <button onClick={handleKeySelection} className="text-xs text-gray-500 underline hover:text-neon">
                Change API Key
            </button>
        </div> */}

        {error && (
            <div className="text-red-500 text-sm mt-2 bg-red-900/20 p-2 rounded border border-red-500/50">
                {error}
            </div>
        )}

        {imageUrl && (
            <div className="mt-6 rounded-lg overflow-hidden border border-neon/50 shadow-[0_0_20px_rgba(0,255,157,0.3)] animate-in fade-in zoom-in duration-500">
                <img src={imageUrl} alt="Generated Visual" className="w-full h-auto" />
                <div className="bg-black/80 p-2 flex justify-between items-center">
                    <span className="text-xs text-neon">Gemini 3 Pro Output</span>
                    <a href={imageUrl} download="station_visual.png" className="text-xs hover:text-white text-gray-400">Download</a>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;