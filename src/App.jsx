/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setSelectedGame(null)}
        >
          <div className="bg-white text-black p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Gamepad2 size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tighter uppercase">Unblocked Hub</h1>
        </div>

        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Search games..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-white/30 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleFullscreen}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-7xl mx-auto"
            >
              <div className="mb-10">
                <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
                  Play Anything. <br />
                  <span className="text-white/40">Anywhere.</span>
                </h2>
                <p className="text-white/60 max-w-xl text-lg">
                  A curated collection of web games that bypass most filters. 
                  No downloads, no accounts, just play.
                </p>
              </div>

              {/* Mobile Search */}
              <div className="relative w-full mb-8 md:hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="text"
                  placeholder="Search games..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:border-white/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                  <motion.div
                    key={game.id}
                    layoutId={game.id}
                    onClick={() => setSelectedGame(game)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-video overflow-hidden rounded-2xl brutal-border bg-white/5">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded uppercase">Play Now</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-bold text-lg group-hover:text-white/80 transition-colors uppercase tracking-tight">{game.title}</h3>
                      <p className="text-white/40 text-sm line-clamp-1">{game.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-white/40 text-xl italic">No games found matching "{searchQuery}"</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-6xl mx-auto h-[calc(100vh-200px)] flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                >
                  <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                  <span className="uppercase font-bold tracking-widest text-sm">Back to Library</span>
                </button>
                <div className="flex items-center gap-4">
                  <h2 className="font-black uppercase tracking-tighter text-xl hidden sm:block">{selectedGame.title}</h2>
                  <a 
                    href={selectedGame.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                    title="Open in new tab"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>

              <div className="flex-1 bg-black rounded-3xl overflow-hidden brutal-border relative">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight">{selectedGame.title}</h3>
                  <p className="text-white/60">{selectedGame.description}</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-white/40">#webgl</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-white/40">#unblocked</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-white/5 text-center">
        <p className="text-white/20 text-xs font-mono uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Unblocked Hub &bull; Built for Speed
        </p>
      </footer>
    </div>
  );
}
