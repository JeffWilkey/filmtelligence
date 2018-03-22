const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie'
const TMDB_MOVIE_URL = 'https://api.themoviedb.org/3/movie/'
const API_KEY = "78cb36c6b59ca43ebda01b258e8ff0d1"

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
  const query = {
    api_key: API_KEY
  }
  $.getJSON(TMDB_MOVIE_URL + movieId, query, callback );
}

// Get the movie's credits
function getCreditsFromApi(movieId, callback) {
  const query = {
    api_key: API_KEY
  }
  $.getJSON(TMDB_MOVIE_URL + movieId + "/credits", query, callback)
}

// Return the movie and credits objects to their respective render functions
function getMovie(result) {
  getMovieFromApi(result.results[0].id, returnAndRenderMovie)
  getCreditsFromApi(result.results[0].id, returnAndRenderCast)
}

// Render the front page
function renderFrontPage() {
  $(".container").html(`
    <header role="banner">
      <img class="header-logo" src="./img/Reel.png" alt="Filmtelligence logo" />
      <h1 class="header-logo-text">Filmtelligence</h1>
      <h4 class="header-subtext">Search for a Movie or TV show and we'll return intel on it.</h4>
      <form class="js-search">
        <div class="search-wrapper">
          <label for="movie-search">Search</label>
          <input id="movie-search" type="text" class="js-query" placeholder="Fight Club"/>
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

// Remove front page contents then render all HTML and styles associated with movie's basic information
function returnAndRenderMovie(movie) {
  removeFrontPage();
  renderMoviePage(movie);
  determineScoreBoxColor(movie);
  renderFacts(movie);
  watchSubmit();
}

// Render the cast as well
function returnAndRenderCast(cast) {
  renderCast(cast)
}

// Render the initial movie information, (poster, overview, ratings, etc.) cast comes later
function renderMoviePage(movie) {
  console.log(movie);
  $("body").html(`
    <header class="logo-banner" role="banner">
      <img src="./img/Reel.png" alt="Filmtelligence logo">
    </header>
    <div class="search-row">
      <div class="container">
        <form class="js-search">
          <label for="movie-search">Search</label>
          <span class="fa fa-search"></span>
          <input type="text" id="movie-search" class="js-query wide" placeholder="Search Movie">
        </form>
      </div>
    </div>
    <main role="main" aria-live="assertive">
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
        <h1 class="movie-title"> ${movie.original_title} <span class="movie-year">(${moment(movie.release_date).format("YYYY")})</span> </h1>
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

// Set the movie's score box color dynamically based on it's rating
function determineScoreBoxColor(movie) {
  if (movie.vote_average >= 7) {
    $(".score-box").css("background-color", "#2ecc71");
  } else if (movie.vote_average >= 4) {
    $(".score-box").css("background-color", "#fdcb6e");
  } else if (movie.vote_average >= 0) {
    $(".score-box").css("background-color", "#d63031");
  }
}

// Render the wrapper that will contain the top billed cast
function renderCast(result) {
  console.log(result);
  let cast = result.cast;

  $('<div class="credits-wrapper"></div>').insertAfter(".movie-info-wrapper");
  $(".credits-wrapper").append(`
    <div class="container">
      <h2 class="credits-header">Top Billed Cast</h2>
      <div class="credits-cast-wrapper">

      </div>
    </div>
  `);
  renderCastCards(cast);
  setCardHeights();
}

// Take movie cast as argument then render top billed cast cards (5)
function renderCastCards(cast) {
  for (let i = 0; i < 5; i++) {
    $(".credits-cast-wrapper").append(`
      <div class="credits-cast-card">
        <img class="credits-cast-card-profile" src="https://image.tmdb.org/t/p/w500${cast[i].profile_path}" alt="${cast[i].name}">
        <p class="credits-cast-card-name"><strong>${cast[i].name}</strong></p>
        <p class="credits-cast-card-character">${cast[i].character}</p>
      </div>
    `);
  }
}

// Make card heights consistant by grabbing the tallest card and setting each other card's height to match
function setCardHeights() {
  if($(window).width() < 750) {
    $('.credits-cast-card').height(400);
  }

  calculateCardHeights();
  $(window).resize(function() {
    if ($(window).width() < 750) {
      $('.credits-cast-card').height(400);
    } else {
      $('.credits-cast-card').css("height", "100%");
      calculateCardHeights();
    }
  })
}

function calculateCardHeights() {
  // Get an array of all card heights
  let cardHeights = $('.credits-cast-card').map(function() {
    return $(this).height();
  }).get();

  // Math.max takes a variable number of arguments
  // `apply` is equivalent to passing each height as an argument
  let maxHeight = Math.max.apply(null, cardHeights)

  // Set each card's height to match maxHeight
  $('.credits-cast-card').height(maxHeight);
}

function renderFacts(movie) {
  $('<div class="facts-wrapper"></div>').insertAfter(".movie-info-wrapper");
  $('.facts-wrapper').append(`
    <div class="container">
      <h2 class="facts-header">Facts</h2>
      <div class="facts-divider"></div><br>
      <div class="facts-info-container">
        <p class="fact"><span class="fact-header">Status:</span> <span class="fact-info">${movie.status}</span></p>
        <p class="fact"><span class="fact-header">Release Date:</span> <span class="fact-info">${moment(movie.release_date).format("MMMM Do, YYYY")}</span></p>
        <p class="fact"><span class="fact-header">Original Language:</span> <span class="fact-info">${movie.original_language === 'en' ? "English" : movie.original_language}</span></p>
        <p class="fact"><span class="fact-header">Runtime:</span> <span class="fact-info">${movie.runtime} mins</span></p>
        <p class="fact"><span class="fact-header">Budget:</span> <span class="fact-info">$${formatNumber(movie.budget)}</span></p>
        <p class="fact"><span class="fact-header">Revenue:</span> <span class="fact-info">$${formatNumber(movie.revenue)}</span></p>
      </div>
    </div>
  `)
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Render the front page and watch for a submission
function initializeApp() {
  renderFrontPage();
  watchSubmit();
}

// Initialize the app
initializeApp();
