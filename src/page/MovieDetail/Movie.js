import React, { useEffect, useState } from "react";
import "./Movie.css";
import { useParams } from "react-router-dom";

const Movie = () => {
  const [currentMovieDetail, setMovie] = useState();
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState(""); // New review text
  const [editingReview, setEditingReview] = useState(null); // Currently editing review
  const [updatedText, setUpdatedText] = useState(""); // Text for editing
  const { id } = useParams();

  useEffect(() => {
    fetchMovieDetails();
    fetchReviews();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`
      );
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/reviews/${id}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewText.trim()) {
      const username = localStorage.getItem("username") || "Anonymous";
      const reviewData = { movieId: id, username, reviewText };

      try {
        const response = await fetch("http://localhost:3001/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewData),
        });
        const newReview = await response.json();
        setReviews([...reviews, newReview]);
        setReviewText(""); // Reset review input
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/reviews/${reviewId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.message === "Review deleted successfully") {
        setReviews(reviews.filter((review) => review._id !== reviewId));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("There was an error deleting the review");
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review); // Start editing mode
    setUpdatedText(review.reviewText); // Pre-fill the text input
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/reviews/${editingReview._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewText: updatedText }),
      });
      const data = await response.json();
      if (data.message === "Review updated successfully") {
        setReviews(
          reviews.map((review) =>
            review._id === editingReview._id
              ? { ...review, reviewText: updatedText }
              : review
          )
        );
        setEditingReview(null); // Exit editing mode
        setUpdatedText(""); // Reset input field
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  return (
    <div className="movie">
    <div className="movie__detail">
        <div className="movie__detailLeft">
            <div className="movie__posterBox">
                <img className="movie__poster" src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.poster_path : ""}`} />
            </div>
        </div>
        <div className="movie__detailRight">
            <div className="movie__detailRightTop">
                <div className="movie__name">{currentMovieDetail ? currentMovieDetail.original_title : ""}</div>
                <div className="movie__tagline">{currentMovieDetail ? currentMovieDetail.tagline : ""}</div>
                <div className="movie__rating">
                    {currentMovieDetail ? currentMovieDetail.vote_average: ""} <i class="fas fa-star" />
                    <span className="movie__voteCount">{currentMovieDetail ? "(" + currentMovieDetail.vote_count + ") votes" : ""}</span>
                </div>  
                <div className="movie__runtime">{currentMovieDetail ? currentMovieDetail.runtime + " mins" : ""}</div>
                <div className="movie__releaseDate">{currentMovieDetail ? "Release date: " + currentMovieDetail.release_date : ""}</div>
                <div className="movie__genres">
                    {
                        currentMovieDetail && currentMovieDetail.genres
                        ? 
                        currentMovieDetail.genres.map(genre => (
                            <><span className="movie__genre" id={genre.id}>{genre.name}</span></>
                        )) 
                        : 
                        ""
                    }
                </div>
            </div>
            <div className="movie__detailRightBottom">
                <div className="synopsisText">Synopsis</div>
                <div>{currentMovieDetail ? currentMovieDetail.overview : ""}</div>
            </div>
            
        </div>
    </div>

      {/* Reviews Section */}
      <div className="movie__reviewSection">
        <h3>Reviews</h3>
        <form onSubmit={handleReviewSubmit}>
          <textarea
            className="movie__reviewInput"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            required
          />
          <button type="submit" className="movie__reviewSubmitButton">
            Submit Review
          </button>
        </form>
        <div className="movie__reviewsList">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="movie__review">
                {editingReview?._id === review._id ? (
                  <form onSubmit={handleUpdateReview}>
                    <textarea
                      cl                    assName="movie__reviewInput"
                      value={updatedText}
                      onChange={(e) => setUpdatedText(e.target.value)}
                      required
                    />
                    <button type="submit" className="update-button">
                      Update
                    </button>
                  </form>
                ) : (
                  <>
                    <p className="movie__reviewText">{review.reviewText}</p>
                    <button
                      onClick={() => handleEditReview(review)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </>
                )}
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
