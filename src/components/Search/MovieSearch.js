import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Cards from '../Card/Card'; // Assuming you have a Card component for displaying movie details
import './MovieSearch.css'; // Create a CSS file for styling

const MovieSearch = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const query = new URLSearchParams(useLocation().search).get('q'); // Get the search query from the URL

    useEffect(() => {
        if (query) {
            fetchMovies(query);
        }
    }, [query]);

    const fetchMovies = async (searchQuery) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US&query=${searchQuery}`);
            const data = await response.json();
            setMovies(data.results);
        } catch (err) {
            setError('Failed to fetch movies. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="movie-search">
            <h2>Search Results for: "{query}"</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <div className="movie-search-results">
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <Cards movie={movie} key={movie.id} />
                    ))
                ) : (
                    !loading && <p>No movies found.</p>
                )}
            </div>
        </div>
    );
};

export default MovieSearch;