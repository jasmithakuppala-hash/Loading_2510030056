import React from 'react';

export const HomePage: React.FC = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen max-w-7xl mx-auto px-4">
      <div className="p-8 rounded-3xl bg-cineDark-800 border border-white/10 text-center">
        <h1 className="font-display font-black text-4xl text-white mb-2">CINEVERSE HOME</h1>
        <p className="text-gray-400">Cinematic foundation initialized successfully.</p>
      </div>
    </div>
  );
};
