// src/page/MovieDetail/Movie.js
import React, { useEffect, useState } from "react";
import "./Movie.css";
import { useParams } from "react-router-dom";

const Movie = () => {
    const [currentMovieDetail, setMovie] = useState();
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState("");
    const { id } = useParams();

    useEffect(() => {
        getData();
        fetchReviews();
        window.scrollTo(0, 0);
    }, [id]); // Ensure it fetches data when id changes

    const getData = () => {
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`)
            .then(res => res.json())
            .then(data => setMovie(data))
            .catch(error => console.error("Error fetching movie data:", error));
    };

    const fetchReviews = () => {
        fetch(`http://localhost:3001/api/reviews/${id}`) // Ensure this matches your backend URL
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => setReviews(data))
            .catch(error => console.error("Error fetching reviews:", error));
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (reviewText.trim()) {
            const reviewData = { movieId: id, username: "User", reviewText }; // Replace "User" with actual username if available
            fetch('http://localhost:3001/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                setReviews([...reviews, data]); // Update reviews state with new review
                setReviewText(""); // Clear input after submission
            })
            .catch(error => {
                console.error("Error submitting review:", error);
            });
        }
    };

    return (
        <div className="movie">
            <div className="movie__intro">
                <img className="movie__backdrop" src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.backdrop_path : ""}`} alt={currentMovieDetail ? currentMovieDetail.original_title : ""} />
            </div>
            <div className="movie__detail">
                <div className="movie__detailLeft">
                    <div className="movie__posterBox">
                        <img className="movie__poster" src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.poster_path : ""}`} alt={currentMovieDetail ? currentMovieDetail.original_title : ""} />
                    </div>
                </div>
                <div className="movie__detailRight">
                    <div className="movie__detailRightTop">
                        <div className="movie__name">{currentMovieDetail ? currentMovieDetail.original_title : ""}</div>
                        <div className="movie__tagline">{currentMovieDetail ? currentMovieDetail.tagline : ""}</div>
                        <div className="movie__rating">
                            {currentMovieDetail ? currentMovieDetail.vote_average : ""} <i className="fas fa-star" />
                            <span className="movie__voteCount">{currentMovieDetail ? "(" + currentMovieDetail.vote_count + ") votes" : ""}</span>
                        </div>
                        <div className="movie__runtime">{currentMovieDetail ? currentMovieDetail.runtime + " mins" : ""}</div>
                        <div className="movie__releaseDate">{currentMovieDetail ? "Release date: " + currentMovieDetail.release_date : ""}</div>
                        <div className="movie__genres">
                            {currentMovieDetail && currentMovieDetail.genres ? currentMovieDetail.genres.map(genre => (
                                <span key={genre.id} className="movie__genre">{genre.name}</span>
                            )) : ""}
                        </div>
                    </div>
                    <div className="movie__detailRightBottom">
                        <div className="synopsisText">Synopsis</div>
                        <div>{currentMovieDetail ? currentMovieDetail.overview : ""}</div>
                    </div>
                </div>
            </div>

            {/* Review Section */}
            <div className="movie__reviewSection">
                <h3>Reviews</h3>
                <form onSubmit={handleReviewSubmit}>
                    <textarea
                        className="movie__reviewInput"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review here..."
                    />
                    <button type="submit" className="movie__reviewSubmitButton">Submit Review</button>
                </form>
                <div className="movie__reviewsList">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review._id} className="movie__review">
                                <p className="movie__reviewAuthor">{review.username}</p>
                                <p className="movie__reviewText">{review.reviewText}</p>
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Movie;