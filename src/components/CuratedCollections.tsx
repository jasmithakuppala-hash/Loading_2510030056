import React, { useState } from 'react';
import { Film, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { Movie } from '../types';

interface CollectionDef {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  backdrop: string;
  query: string;
}

const COLLECTIONS: CollectionDef[] = [
  {
    id: 'nolan',
    title: 'NOLAN ESSENTIALS',
    subtitle: 'Mind-bending cinema, non-linear timelines, & grand practical filmmaking.',
    badge: 'DIRECTOR SPOTLIGHT',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
    query: 'Christopher Nolan',
  },
  {
    id: 'scifi',
    title: 'SCI-FI WORLDS',
    subtitle: 'Vast interstellar galaxies, cyberpunk dystopias, & futuristic visions.',
    badge: 'THEMATIC MARVELS',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    query: 'Sci-Fi',
  },
  {
    id: '90s',
    title: '90s CLASSICS',
    subtitle: 'The golden decade of independent cinema, grunge, & iconic blockbusters.',
    badge: 'RETRO COLLECTION',
    backdrop: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?q=80&w=1200&auto=format&fit=crop',
    query: '1990s',
  },
  {
    id: 'oscar',
    title: 'OSCAR FAVORITES',
    subtitle: 'Academy Award Best Picture winners and masterpieces of storytelling.',
    badge: 'CRITICS CHOICE',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
    query: 'Oscar',
  },
];

export const CuratedCollections: React.FC = () => {
  return (
    <section className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-cineViolet/15 text-cineViolet">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              CURATED COLLECTIONS
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 font-sans mt-0.5">
              Hand-crafted editorial anthologies and cinematic sagas.
            </p>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COLLECTIONS.map((col) => (
            <div
              key={col.id}
              className="group relative rounded-3xl overflow-hidden bg-cineDark-800 border border-white/10 p-6 sm:p-8 flex flex-col justify-between h-64 sm:h-72 hover:border-white/20 transition-all shadow-xl hover:shadow-2xl hover:shadow-cineViolet/20"
            >
              {/* Background Image & Dark Overlay */}
              <img
                src={col.backdrop}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-40 group-hover:opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cineDark-900 via-cineDark-900/60 to-transparent" />

              {/* Content Overlay */}
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-cineViolet/30 text-purple-200 border border-cineViolet/40 text-[10px] font-display font-bold uppercase tracking-widest mb-3 backdrop-blur-md">
                  {col.badge}
                </span>
                <h4 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-none group-hover:text-cineRed transition-colors">
                  {col.title}
                </h4>
              </div>

              <div className="relative z-10 flex items-end justify-between gap-4">
                <p className="text-xs sm:text-sm text-gray-300 font-sans max-w-sm line-clamp-2">
                  {col.subtitle}
                </p>
                <a
                  href={`/search?q=${encodeURIComponent(col.query)}`}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-cineRed text-white transition-all shadow-lg flex-shrink-0 group-hover:scale-110"
                  title={`Explore ${col.title}`}
                >
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
