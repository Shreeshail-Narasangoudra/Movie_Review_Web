
  export default function Navbar() {



    return (
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">Movie Review Web</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="top_rated">
                  <a className="nav-link active" aria-current="page" href="/movies/top_rated">Top Rated</a>
                </li>
                <li className="upcoming">
                  <a className="nav-link active" aria-current="page" href="/movies/upcoming">Upcoming</a>
                </li>
                <li className="login">
                  <a className="nav-link active" aria-current="page" href="/login_sign">Login/Signin</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }