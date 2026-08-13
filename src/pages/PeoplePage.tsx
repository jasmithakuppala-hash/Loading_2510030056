import React, { useState, useEffect } from 'react';
import { Users, Sparkles, UserCheck } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { Person } from '../types';
import { PersonCard } from '../components/PersonCard';
import { CarouselSkeleton } from '../components/LoadingSkeleton';

export const PeoplePage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true);
      try {
        const results = await tmdbService.getPopularPeople(page);
        if (page === 1) {
          setPeople(results || []);
        } else {
          setPeople((prev) => [...prev, ...(results || [])]);
        }
        setHasMore((results || []).length > 0);
      } catch (err) {
        console.error('Failed to fetch popular people:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, [page]);

  return (
    <div className="pt-28 pb-16 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-display font-bold uppercase tracking-widest mb-3 border border-amber-500/30">
          <Users className="w-3.5 h-3.5" />
          <span>ACTORS, DIRECTORS & CREATORS</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
          POPULAR <span className="text-amber-400">PEOPLE</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base font-sans mt-2">
          Discover legendary actors, visionary directors, and acclaimed performers shaping cinema.
        </p>
      </div>

      {/* People Grid */}
      {loading && page === 1 ? (
        <CarouselSkeleton count={10} />
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {people.map((person, idx) => (
              <PersonCard key={`${person.id}-${idx}`} person={person} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-6">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={loading}
                className="px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-display font-bold text-xs uppercase tracking-wider transition-all focus:outline-none disabled:opacity-50"
              >
                {loading ? 'LOADING MORE...' : 'LOAD MORE PEOPLE'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
