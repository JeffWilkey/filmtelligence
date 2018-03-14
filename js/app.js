const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie'
const TMDB_MOVIE_URL = 'https://api.themoviedb.org/3/movie/'
const API_KEY = "78cb36c6b59ca43ebda01b258e8ff0d1"
let currentMovie = {}

// Search and API Functionality
function watchSubmit() {
    $('.js-search').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();

        getDataFromApi(query, getMovie);
    });
}

// Get Initial Search Results
function getDataFromApi(searchTerm, callback) {
    const query = {
        api_key: API_KEY,
        query: `${searchTerm}`,
        page: 1
    }
    $.getJSON(TMDB_SEARCH_URL, query, callback);
}

// Get the movie object
function getMovieFromApi(movieId, callback) {
  let movie = {};
  const query = {
    api_key: API_KEY
  }
  $.getJSON(TMDB_MOVIE_URL + movieId, query, callback );

}

// Return the movie object to the render function
function getMovie(result) {
  getMovieFromApi(result.results[0].id, returnAndRenderMovie)
}


// Front Page Functionality

function renderFrontPage() {
  $(".container").html(`
    <header role="banner">
      <img class="header-logo" src="./img/Reel.png" alt="Filmtelligence logo" />
      <h1 class="header-logo-text">Filmtelligence</h1>
      <h4 class="header-subtext">Search for a Movie or TV show and we'll return intel on it.</h4>
      <form class="js-search">
        <div class="search-wrapper">
          <input type="text" class="js-query" placeholder="Fight Club" value="Fight Club"/>
          <button class="search-movies-submit" type="submit">Search</button>
        </div>
      </form>
    </header>
    <main role="main">
    </main>
  `)
}

function removeFrontPage() {
  $(".header-logo-text").fadeOut(400, function() {
    $(this).remove();
  });
  $(".header-subtext").fadeOut(400, function() {
    $(this).remove();
  });
  $(".js-search").fadeOut(400, function() {
    $(this).remove();
  });
  $(".container").remove();
}



// Render all HTML and styles associated with movie
function returnAndRenderMovie(movie) {
  removeFrontPage();
  renderMoviePage(movie);
  determineScoreBoxColor(movie);
  watchSubmit();
}

// Render HTML and CSS around the result (Movie)
function renderMoviePage(movie) {
  $("body").html(`
    <header class="logo-banner" role="banner">
      <img src="./img/reel.png" alt="Filmtelligence logo">
    </header>
    <div class="search-row">
      <div class="container">
        <form class="js-search">
          <input type="text" class="js-query wide" placeholder="Search Movie">
        </form>
      </div>
    </div>
    <main role="main">
      <div class="movie-info-wrapper">
      </div>
    </main>
  `)

  $(".movie-info-wrapper").css("background-image", `url("https://image.tmdb.org/t/p/w500${movie.backdrop_path}")`)
  $(".movie-info-wrapper").append(`<div class="movie-wrapper-overlay"></div>`)

  $(".movie-wrapper-overlay").append(`
    <div class="container">
      <div class="movie-header-left">
        <img class="poster" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.original_title} Poster">
      </div>
      <div class="movie-header-right">
        <h1 class="movie-title"> ${movie.original_title} <span class="movie-year">(${movie.release_date.substring(0, 4)})</span> </h1>
        <p class="movie-overview">${movie.overview}</p>
        <hr/>
        <div class="movie-reception-left">
          <h2 class="movie-reception">Reception</h2>
          <p class="movie-reception-text">Based on ${movie.vote_count} votes.</p>
        </div>
        <div class="movie-reception-right">
          <div class="score-box">
            <p class="movie-reception-average-score">${movie.vote_average}</p>
          </div>
        </div>
        <hr/>
      </div>
    </div>
  `)
}

function determineScoreBoxColor(movie) {
  if (movie.vote_average >= 7) {
    $(".score-box").css("background-color", "#55efc4");
  } else if (movie.vote_average >= 4) {
    $(".score-box").css("background-color", "#fdcb6e");
  } else if (movie.vote_average >= 0) {
    $(".score-box").css("background-color", "#d63031");
  }
}



function initializeApp() {
  renderFrontPage();
  watchSubmit();
}

initializeApp();
