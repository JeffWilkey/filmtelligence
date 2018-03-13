const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie'
const TMDB_MOVIE_URL = 'https://api.themoviedb.org/3/movie/'
const API_KEY = "78cb36c6b59ca43ebda01b258e8ff0d1"
let currentMovie = {}

function getDataFromApi(searchTerm, callback) {
    const query = {
        api_key: API_KEY,
        query: `${searchTerm}`,
        page: 1
    }
    $.getJSON(TMDB_SEARCH_URL, query, callback);
}

function getMovieFromApi(movieId, callback) {
  let movie = {};
  const query = {
    api_key: API_KEY
  }
  $.getJSON(TMDB_MOVIE_URL + movieId, query, callback );

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

function watchSubmit() {
    $('.js-search').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();

        getDataFromApi(query, getMovie);
    });
}

// Get The Movie Object
function getMovie(result) {
  console.log(result)
  getMovieFromApi(result.results[0].id, returnAndRenderMovie)
}

// Render the movie object
function returnAndRenderMovie(result) {
  console.log(result);
  $(".header-logo-text").fadeOut(400, function() {
    $(this).remove();
  });
  $(".header-subtext").fadeOut(400, function() {
    $(this).remove();
  });
  $(".js-search").fadeOut(400, function() {
    $(this).remove();
  })
  var logoStyles = {
    width: "50px",
    height: "50px",
    marginTop: "10px"
  }
  $(".header-logo").css(logoStyles);
  $(".container").remove();
  $("body").html(`
    <div class="movie-info-wrapper">
      ${result.id}
    </div>
  `)
  $(".movie-info-wrapper").css("background-image", `url("https://image.tmdb.org/t/p/w500${result.backdrop_path}")`)
  $(".movie-info-wrapper").append(`<div class="movie-wrapper-overlay"></div>`)

  $(".movie-wrapper-overlay").append(`
    <div class="container">
      <div class="movie-header-left">
        <img class="poster" src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${result.original_title} Poster">
      </div>
      <div class="movie-header-right">
        <h1 class="movie-title"> ${result.original_title} <span class="movie-year">(${result.release_date.substring(0, 4)})</span> </h1>
        <p class="movie-overview">${(result.overview.length > 300) ? (result.overview.substring(0, 280) + "...") : result.overview }</p>
        <hr/>
        <div class="movie-reception-left">
          <h2 class="movie-reception">Reception</h2>
          <p class="movie-reception-text">Based on ${result.vote_count} votes.</p>
        </div>
        <div class="movie-reception-right">
          <div class="score-box">
            <p class="movie-reception-average-score">${result.vote_average}</p>
          </div>
        </div>
        <hr/>
      </div>
    </div>
  `)

  if (result.vote_average >= 7) {
    $(".score-box").css("background-color", "#55efc4");
  } else if (result.vote_average >= 4) {
    $(".score-box").css("background-color", "#fdcb6e");
  } else if (result.vote_average >= 0) {
    $(".score-box").css("background-color", "#d63031");
  }



}

function initializeApp() {
  renderFrontPage();
  watchSubmit();
}

initializeApp();
