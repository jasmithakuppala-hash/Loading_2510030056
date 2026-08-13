import React, { createContext, useContext, useState } from 'react';
import { MoodType, MoodOption } from '../types';

export const MOOD_OPTIONS: MoodOption[] = [
  { id: 'adrenaline', label: 'ADRENALINE', icon: '🔥', description: 'High-octane thrillers, action-packed blockbusters, & edge-of-your-seat suspense.', genreIds: [28, 12, 53] },
  { id: 'mind-bending', label: 'MIND-BENDING', icon: '🧠', description: 'Intricate plots, psychological twists, & reality-warping concepts.', genreIds: [878, 9648, 53] },
  { id: 'romance', label: 'ROMANCE', icon: '❤️', description: 'Heartfelt love stories, passionate connections, & romantic journeys.', genreIds: [10749, 18] },
  { id: 'feel-good', label: 'FEEL GOOD', icon: '😂', description: 'Hilarious comedies, uplifting stories, & heartwarming adventures.', genreIds: [35, 10751, 16] },
  { id: 'dark', label: 'DARK', icon: '👻', description: 'Chilling horror, sinister mysteries, & gritty neo-noir thrillers.', genreIds: [27, 9648, 80] },
  { id: 'sci-fi', label: 'SCI-FI', icon: '🚀', description: 'Futuristic worlds, deep space exploration, & groundbreaking visions.', genreIds: [878, 14] },
  { id: 'emotional', label: 'EMOTIONAL', icon: '😭', description: 'Deeply moving dramas, tearjerkers, & poignant character portraits.', genreIds: [18, 10749] },
  { id: 'drama', label: 'DRAMA', icon: '🎭', description: 'Gripping narratives, intense conflict, & masterful storytelling.', genreIds: [18, 36] },
];

interface MoodContextType {
  activeMood: MoodType | null;
  selectMood: (moodId: MoodType | null) => void;
  getActiveMoodOption: () => MoodOption | undefined;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMood, setActiveMood] = useState<MoodType | null>(null);

  const selectMood = (moodId: MoodType | null) => {
    setActiveMood((prev) => (prev === moodId ? null : moodId));
  };

  const getActiveMoodOption = () => {
    return MOOD_OPTIONS.find((m) => m.id === activeMood);
  };

  return (
    <MoodContext.Provider value={{ activeMood, selectMood, getActiveMoodOption }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) throw new Error('useMood must be used within a MoodProvider');
  return context;
};
