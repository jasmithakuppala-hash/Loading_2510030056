import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { MoodProvider } from './context/MoodContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

import { HomePage } from './pages/HomePage';
import {
  MoviesPage,
  TVPage,
  PeoplePage,
  GenresPage,
  WatchlistPage,
  SearchPage,
  MovieDetailsPage,
  TVDetailsPage,
  PersonDetailsPage,
} from './pages/index';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <WatchlistProvider>
        <MoodProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-cineDark-900 text-white transition-colors duration-300">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/movies" element={<MoviesPage />} />
                  <Route path="/tv" element={<TVPage />} />
                  <Route path="/people" element={<PeoplePage />} />
                  <Route path="/genres" element={<GenresPage />} />
                  <Route path="/watchlist" element={<WatchlistPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/movie/:id" element={<MovieDetailsPage />} />
                  <Route path="/tv/:id" element={<TVDetailsPage />} />
                  <Route path="/person/:id" element={<PersonDetailsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
              <Toast />
            </div>
          </Router>
        </MoodProvider>
      </WatchlistProvider>
    </ThemeProvider>
  );
};

export default App;
