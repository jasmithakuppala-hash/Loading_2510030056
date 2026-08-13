import React from 'react';
import { Link } from 'react-router-dom';
import { User, Film } from 'lucide-react';
import { Person } from '../types';
import { getProfileUrl } from '../services/tmdb';

interface PersonCardProps {
  person: Person;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  const knownForTitles = (person.known_for || [])
    .map((item: any) => item.title || item.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(', ');

  return (
    <Link
      to={`/person/${person.id}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-cineDark-800 border border-white/10 shadow-lg hover:shadow-2xl hover:shadow-cineViolet/20 hover:-translate-y-1.5 transition-all duration-300 focus:outline-none"
    >
      <div className="aspect-[3/4] w-full overflow-hidden relative bg-black">
        <img
          src={getProfileUrl(person.profile_path)}
          alt={person.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        
        <span className="absolute top-3 right-3 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cineViolet/80 text-white backdrop-blur-md">
          {person.known_for_department || 'Artist'}
        </span>
      </div>

      <div className="p-3.5 flex flex-col justify-between flex-1">
        <h4 className="font-display font-bold text-sm text-white line-clamp-1 group-hover:text-cineViolet transition-colors">
          {person.name}
        </h4>
        {knownForTitles && (
          <p className="text-[11px] text-gray-400 font-sans line-clamp-1 mt-1 flex items-center gap-1">
            <Film className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <span>{knownForTitles}</span>
          </p>
        )}
      </div>
    </Link>
  );
};
