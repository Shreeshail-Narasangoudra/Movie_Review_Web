import React, { useEffect, useState } from "react";
import "./MovieList.css";
import { useParams } from "react-router-dom";
import Cards from "../Card/Card";

const MovieList = () => {
    const [movieList, setMovieList] = useState([]);
    const [loading, setLoading] = useState(false);  // Loading state for fetching
    const { type } = useParams();

    useEffect(() => {
        getData();
    }, [type]); // Fetch movies whenever `type` changes

    // Modified getData function to fetch multiple pages
    const getData = async () => {
        setLoading(true);  // Set loading state to true before fetching data
        let movies = [];
        try {
            for (let page = 1; page <= 3; page++) {  // Fetch first 3 pages (adjust as needed)
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${type ? type : "popular"}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US&page=${page}`
                );
                const data = await response.json();
                movies = [...movies, ...data.results]; // Combine movie results from each page
            }

            // Remove duplicates by filtering out movies with the same ID
            const uniqueMovies = Array.from(new Set(movies.map(a => a.id)))
                .map(id => {
                    return movies.find(a => a.id === id);
                });

            setMovieList(uniqueMovies); // Set the combined movie list without duplicates
        } catch (error) {
            console.error("Failed to fetch movie data:", error);
        } finally {
            setLoading(false);  // Set loading state to false after fetching
        }
    };

    return (
        <div className="movie__list">
            <h2 className="list__title">{(type ? type : "POPULAR").toUpperCase()}</h2>
            <div className="list__cards">
                {loading ? (  // Show loading indicator while fetching
                    <div className="loading">Loading...</div>
                ) : (
                    movieList.map((movie, index) => (  // Use index along with movie.id to generate unique keys
                        <Cards movie={movie} key={`${movie.id}-${index}`} />
                    ))
                )}
            </div>
        </div>
    );
};

export default MovieList;
