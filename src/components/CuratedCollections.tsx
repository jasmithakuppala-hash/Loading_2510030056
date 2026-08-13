import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';

interface CollectionDef {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  backdrop: string;
  query: string;
  glow: string;
}

const COLLECTIONS: CollectionDef[] = [
  {
    id: 'nolan',
    title: 'NOLAN ESSENTIALS',
    subtitle: 'Mind-bending cinema, non-linear timelines, & grand practical filmmaking.',
    badge: 'DIRECTOR SPOTLIGHT',
    badgeColor: 'bg-blue-600/30 text-blue-200 border-blue-500/40',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
    query: 'Christopher Nolan',
    glow: 'hover:shadow-blue-600/30 border-blue-500/20',
  },
  {
    id: 'scifi',
    title: 'SCI-FI WORLDS',
    subtitle: 'Vast interstellar galaxies, cyberpunk dystopias, & futuristic visions.',
    badge: 'THEMATIC MARVELS',
    badgeColor: 'bg-cyan-600/30 text-cyan-200 border-cyan-500/40',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    query: 'Sci-Fi',
    glow: 'hover:shadow-cyan-600/30 border-cyan-500/20',
  },
  {
    id: '90s',
    title: '90s CLASSICS',
    subtitle: 'The golden decade of independent cinema, grunge, & iconic blockbusters.',
    badge: 'RETRO COLLECTION',
    badgeColor: 'bg-amber-600/30 text-amber-200 border-amber-500/40',
    backdrop: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?q=80&w=1200&auto=format&fit=crop',
    query: '1990s',
    glow: 'hover:shadow-amber-600/30 border-amber-500/20',
  },
  {
    id: 'oscar',
    title: 'OSCAR FAVORITES',
    subtitle: 'Academy Award Best Picture winners and masterpieces of storytelling.',
    badge: 'CRITICS CHOICE',
    badgeColor: 'bg-cineRed/30 text-red-200 border-cineRed/40',
    backdrop: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    query: 'Oscar',
    glow: 'hover:shadow-cineRed/30 border-cineRed/20',
  },
];

export const CuratedCollections: React.FC = () => {
  return (
    <section className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-2xl bg-cineViolet/20 text-purple-300 border border-cineViolet/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              CURATED EDITORIAL COLLECTIONS
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 font-sans mt-0.5">
              Hand-crafted thematic sagas, director spotlights, and genre masterworks.
            </p>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COLLECTIONS.map((col) => (
            <div
              key={col.id}
              className={`group relative rounded-3xl overflow-hidden bg-cineDark-800 border p-6 sm:p-8 flex flex-col justify-between h-64 sm:h-72 transition-all duration-500 shadow-xl hover:shadow-2xl ${col.glow}`}
            >
              {/* Background Image & Gradient Overlays */}
              <img
                src={col.backdrop}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

              {/* Content Overlay */}
              <div className="relative z-10">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-display font-bold uppercase tracking-widest mb-3 border backdrop-blur-md ${col.badgeColor}`}>
                  {col.badge}
                </span>
                <h4 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight leading-none group-hover:text-cineRed transition-colors drop-shadow-md">
                  {col.title}
                </h4>
              </div>

              <div className="relative z-10 flex items-end justify-between gap-4">
                <p className="text-xs sm:text-sm text-gray-200 font-sans max-w-sm line-clamp-2 drop-shadow">
                  {col.subtitle}
                </p>
                <a
                  href={`/search?q=${encodeURIComponent(col.query)}`}
                  className="p-3.5 rounded-2xl bg-white/15 hover:bg-cineRed text-white transition-all shadow-lg flex-shrink-0 group-hover:scale-110 border border-white/20"
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
