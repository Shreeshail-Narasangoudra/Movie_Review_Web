import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './page/home/Home';
import MovieList from './components/MovieList/MovieList';
import Movie from './page/MovieDetail/Movie';
import MovieSearch from './components/Search/MovieSearch';

import LoginSign from './page/LoginSign/LoginSignup';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="movie/:id" element={<Movie />} />
        <Route path="movies/:type" element={<MovieList />} />
        <Route path="login_sign" element={<LoginSign/>} />
        <Route path="search" element={<MovieSearch />} /> 
        <Route path="*" element={<h1>Error Page</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
