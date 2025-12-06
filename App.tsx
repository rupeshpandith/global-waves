import React, { useState, useRef } from 'react';
import Globe from './components/Globe';
import AudioPlayer from './components/AudioPlayer';
import ChannelCard from './components/ChannelCard';
import ImageGenerator from './components/ImageGenerator';
import { RADIO_STATIONS, NAV_ITEMS } from './constants';
import { RadioStation } from './types';

function App() {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(RADIO_STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');

  // Refs for scrolling
  const indianChannelsRef = useRef<HTMLDivElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const handleStationSelect = (station: RadioStation) => {
    setCurrentStation(station);
    setIsPlaying(true);
  };

  const handleGlobeStationSelect = (station: RadioStation) => {
    handleStationSelect(station);
    // Update the search query to show relevant results if the user scrolls down,
    // but do not force-scroll (navigate) them away from the globe.
    setSearchQuery(station.name);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    if (!currentStation) return;
    const currentIndex = RADIO_STATIONS.findIndex(s => s.id === currentStation.id);
    const nextIndex = (currentIndex + 1) % RADIO_STATIONS.length;
    setCurrentStation(RADIO_STATIONS[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (!currentStation) return;
    const currentIndex = RADIO_STATIONS.findIndex(s => s.id === currentStation.id);
    const prevIndex = (currentIndex - 1 + RADIO_STATIONS.length) % RADIO_STATIONS.length;
    setCurrentStation(RADIO_STATIONS[prevIndex]);
    setIsPlaying(true);
  };

  // Scroll Handlers
  const scrollIndianChannels = (direction: 'left' | 'right') => {
    if (indianChannelsRef.current) {
        const scrollAmount = 300;
        indianChannelsRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    }
  };

  const handleSearchScroll = () => {
      if (searchResultsRef.current) {
          searchResultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
  };

  const handleSubscribe = () => {
      if (!email) {
          alert("Please enter a valid email address.");
          return;
      }
      alert(`Signal received! ${email} has been added to the secure frequency list.`);
      setEmail('');
  };

  const handlePlaceholderClick = (e: React.MouseEvent, msg: string) => {
      e.preventDefault();
      alert(msg);
  }

  const trendingStations = RADIO_STATIONS.filter(s => s.isTrending);
  const indianStations = RADIO_STATIONS.filter(s => s.isIndian);

  // Search Logic
  const filteredStations = searchQuery.trim() === '' ? [] : RADIO_STATIONS.filter(station => 
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-neon selection:text-black">
      
      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-8 text-gray-400 hover:text-neon">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          {NAV_ITEMS.map(item => (
            <a 
                key={item.label} 
                href={item.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-display font-bold text-white hover:text-neon tracking-widest uppercase"
            >
                {item.label}
            </a>
          ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 right-0 left-0 md:left-80 z-40 bg-dark-bg/80 backdrop-blur-lg border-b border-gray-800 h-20 flex items-center justify-between px-8">
         <div className="md:hidden font-display font-bold text-xl tracking-wider">GLOBAL <span className="text-neon">WAVES</span></div>
         
         {/* Desktop Nav */}
         <div className="hidden md:flex gap-8">
            {NAV_ITEMS.map(item => (
                <a key={item.label} href={item.href} className="text-sm font-medium text-gray-400 hover:text-neon transition-colors uppercase tracking-widest">{item.label}</a>
            ))}
         </div>

         <div className="flex items-center gap-4">
            <a 
                href="#indian-channels"
                className="hidden md:flex items-center gap-2 bg-dark-surface border border-neon/50 px-4 py-2 rounded-full hover:bg-neon/10 transition-all group"
            >
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-neon group-hover:text-white">LIVE STREAM</span>
            </a>
            
            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white hover:text-neon transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
         </div>
      </nav>

      {/* Main Content Area */}
      <main className="md:pl-80 pt-20">
        
        {/* Hero Section with Globe */}
        <section id="home" className="relative h-[calc(100vh-5rem)] flex flex-col items-center justify-center overflow-hidden scroll-mt-20">
            <div className="absolute top-10 left-0 w-full text-center z-10 px-4 pointer-events-none">
                <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                    CONNECT TO THE <span className="text-neon neon-text">FREQUENCY</span>
                </h1>
                <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
                    Explore live radio stations from around the globe via our interactive holographic interface.
                </p>
            </div>

            {/* Globe Container - Removed scaling to ensure visibility */}
            <div className="w-full h-full md:h-[90%] transition-transform duration-1000 flex items-center justify-center">
                <Globe 
                    stations={RADIO_STATIONS} 
                    currentStation={currentStation} 
                    onStationSelect={handleGlobeStationSelect} 
                />
            </div>

            {/* Scroll Indicator */}
            <a href="#indian-channels" className="absolute bottom-10 animate-bounce cursor-pointer">
                <svg className="w-6 h-6 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </a>
        </section>

        {/* Content Container */}
        <div className="px-6 md:px-12 py-16 space-y-24 max-w-7xl mx-auto pb-40">
            
            {/* Top Indian Channels (Carousel) */}
            <section id="indian-channels" className="scroll-mt-24">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-display font-bold border-l-4 border-neon pl-4">TOP INDIAN CHANNELS</h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => scrollIndianChannels('left')}
                            className="w-10 h-10 rounded-full border border-gray-700 hover:border-neon flex items-center justify-center transition-colors hover:bg-neon/10"
                            aria-label="Scroll Left"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button 
                            onClick={() => scrollIndianChannels('right')}
                            className="w-10 h-10 rounded-full border border-gray-700 hover:border-neon flex items-center justify-center transition-colors hover:bg-neon/10"
                            aria-label="Scroll Right"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
                
                {/* Scrollable Container */}
                <div 
                    ref={indianChannelsRef}
                    className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x snap-mandatory"
                >
                    {indianStations.map(station => (
                        <div key={station.id} className="min-w-[280px] snap-start">
                            <ChannelCard 
                                station={station} 
                                isPlaying={currentStation?.id === station.id && isPlaying}
                                onPlay={handleStationSelect}
                            />
                        </div>
                    ))}
                </div>
            </section>

             {/* Search Section */}
            <section id="search" className="bg-dark-surface border border-gray-800 rounded-2xl p-8 md:p-12 relative overflow-hidden scroll-mt-24 transition-all duration-300">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-neon/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 w-full">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl font-display font-bold mb-6">SMART FREQUENCY SEARCH</h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by genre, city, or name..." 
                                className="flex-1 bg-black border border-gray-700 rounded-lg px-6 py-4 text-white focus:border-neon focus:outline-none placeholder-gray-600 transition-all focus:shadow-[0_0_15px_rgba(0,255,157,0.1)]" 
                            />
                            <button 
                                onClick={handleSearchScroll}
                                className="bg-neon text-black font-bold px-8 py-4 rounded-lg hover:bg-white transition-colors"
                            >
                                SEARCH
                            </button>
                        </div>
                        <div className="mt-4 flex gap-4 text-sm text-gray-500">
                            <span>Popular:</span>
                            <button onClick={() => setSearchQuery('Bollywood')} className="hover:text-neon underline">Bollywood</button>
                            <button onClick={() => setSearchQuery('Hits')} className="hover:text-neon underline">Hits</button>
                            <button onClick={() => setSearchQuery('Sufi')} className="hover:text-neon underline">Sufi</button>
                        </div>
                    </div>

                    {/* Search Results */}
                    <div ref={searchResultsRef}>
                    {searchQuery && (
                        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-xl font-display font-bold mb-6 text-gray-400 flex items-center gap-2">
                                SEARCH RESULTS 
                                <span className="text-neon bg-neon/10 px-2 py-0.5 rounded text-sm">{filteredStations.length}</span>
                            </h3>
                            
                            {filteredStations.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredStations.map(station => (
                                        <ChannelCard 
                                            key={station.id} 
                                            station={station} 
                                            isPlaying={currentStation?.id === station.id && isPlaying}
                                            onPlay={handleStationSelect}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl bg-black/20">
                                    <svg className="w-12 h-12 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    <p className="text-gray-500 font-display">No signals detected for "{searchQuery}".</p>
                                    <p className="text-gray-600 text-sm mt-1">Try searching for 'Delhi', 'Pop', or 'Jazz'</p>
                                </div>
                            )}
                        </div>
                    )}
                    </div>
                </div>
            </section>

             {/* Image Gen Feature */}
             <section id="visualize" className="scroll-mt-24">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-display font-bold mb-4 border-l-4 border-neon pl-4">VISUALIZE THE SOUND</h2>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Use our advanced AI engine to generate custom 4K wallpapers for your listening experience. 
                            Describe the vibe, choose your resolution, and let the Nano Banana Pro model visualize the music.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <svg className="w-5 h-5 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Ultra-High Resolution (up to 4K)
                            </li>
                             <li className="flex items-center gap-3 text-sm text-gray-300">
                                <svg className="w-5 h-5 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Abstract & Cyberpunk Styles
                            </li>
                             <li className="flex items-center gap-3 text-sm text-gray-300">
                                <svg className="w-5 h-5 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Instant Download
                            </li>
                        </ul>
                    </div>
                    <ImageGenerator />
                 </div>
             </section>

            {/* Trending Global */}
            <section id="trending" className="scroll-mt-24">
                <h2 className="text-3xl font-display font-bold mb-8 border-l-4 border-neon pl-4">GLOBAL TRENDING</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {trendingStations.slice(0, 3).map(station => (
                        <ChannelCard 
                            key={station.id} 
                            station={station} 
                            isPlaying={currentStation?.id === station.id && isPlaying}
                            onPlay={handleStationSelect}
                        />
                    ))}
                </div>
            </section>

            {/* Newsletter */}
            <section className="border-t border-gray-800 pt-16">
                 <div className="bg-gradient-to-r from-dark-surface to-black p-8 md:p-16 rounded-3xl text-center border border-gray-800">
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">JOIN THE TRANSMISSION</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">Get the latest station updates, exclusive mixes, and premium feature access directly to your inbox.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email" 
                            className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-6 py-3 focus:border-neon focus:outline-none" 
                        />
                        <button 
                            onClick={handleSubscribe}
                            className="bg-neon text-black font-bold px-8 py-3 rounded-lg hover:bg-white transition-colors"
                        >
                            SUBSCRIBE
                        </button>
                    </div>
                 </div>
            </section>

        </div>

        {/* Footer */}
        <footer className="bg-black border-t border-gray-900 py-12 px-6 md:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div>
                    <div className="font-display font-bold text-xl tracking-wider mb-6">GLOBAL <span className="text-neon">WAVES</span></div>
                    <p className="text-gray-500 text-sm">The future of radio is borderless. Connect with the world through sound.</p>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Explore</h4>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li><a href="#home" className="hover:text-neon">Live Map</a></li>
                        <li><a href="#trending" className="hover:text-neon">Top Charts</a></li>
                        <li><a href="#visualize" className="hover:text-neon">Visualizer</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Legal</h4>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li><a href="#" onClick={(e) => handlePlaceholderClick(e, "Privacy Policy Coming Soon")} className="hover:text-neon">Privacy Policy</a></li>
                        <li><a href="#" onClick={(e) => handlePlaceholderClick(e, "Terms of Service Coming Soon")} className="hover:text-neon">Terms of Service</a></li>
                        <li><a href="#" onClick={(e) => handlePlaceholderClick(e, "Copyright Info Coming Soon")} className="hover:text-neon">Copyright</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Social</h4>
                    <div className="flex gap-4">
                        <a href="#" onClick={(e) => handlePlaceholderClick(e, "Social Media Links Coming Soon")} className="text-gray-400 hover:text-neon"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
                        <a href="#" onClick={(e) => handlePlaceholderClick(e, "Social Media Links Coming Soon")} className="text-gray-400 hover:text-neon"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.072 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-900 text-center text-gray-600 text-xs">
                © 2024 GLOBAL WAVES. ALL RIGHTS RESERVED.
            </div>
        </footer>

      </main>

      {/* Audio Player Fixed Left (Desktop) / Bottom (Mobile) */}
      <AudioPlayer 
        currentStation={currentStation} 
        isPlaying={isPlaying} 
        onTogglePlay={togglePlay}
        onNext={handleNext}
        onPrev={handlePrev}
      />

    </div>
  );
}

export default App;
