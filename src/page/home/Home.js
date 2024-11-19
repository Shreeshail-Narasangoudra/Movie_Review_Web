import React, { useEffect, useState } from "react";
import "./Home.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import MovieList from "../../components/MovieList/MovieList";

const Home = () => {

    

    return (
        <div className="home-container"> 
            <MovieList />
        </div>
    );
}

export default Home;
