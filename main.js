import TOKENS from "./config.js";

const find_movie_url = "https://api.themoviedb.org/3/search/movie";
const movie_genres_url = "https://api.themoviedb.org/3/genre/movie/list";
const poster_path = "https://image.tmdb.org/t/p/original";

const searchFrom = document.querySelector("#search-form");
const searchBar = document.querySelector("#search-bar");
const movieInfoContainer = document.querySelector("#movie-info");

searchFrom.addEventListener("submit", findMovie);

const listGenres = await getMovieGenres();

// https://developer.themoviedb.org/reference/search-movie
async function findMovie(event) {
  event.preventDefault();
  if (!searchBar.value) return;

  try {
    let movies = await axios({
      url: find_movie_url,
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + TOKENS.MOVIEDB_ACCESS_TOKEN_KEY,
      },
      params: {
        query: searchBar.value,
      },
    }).then((res) => res.data.results);

    displayMoviesInDOM(movies);
  } catch (error) {
    console.error(error);
  }
}

function displayMoviesInDOM(movies) {
  if (movies.length == 0) {
    movieInfoContainer.innerHTML = "<p>Movie not found</p>";
  } else {
    movieInfoContainer.innerHTML = "";
    movies.forEach((movie) => {
      movieInfoContainer.innerHTML += `
      <div class="card text-wrap">
        <img src="${poster_path + movie.poster_path}" alt="${movie.title}">
        <div class="card-body">
          <h3 class="card-title">${movie.title}</h3>
          <div>${movie.genre_ids.map(
            (id) => `<span>${findGenreById(id)}</span>`
          )}</div>
          <h5 class="card-text">${movie.overview}</h5>
        </div>
      </div>
    `;
    });
  }
}

async function getMovieGenres() {
  try {
    let genres = await axios({
      url: movie_genres_url,
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + TOKENS.MOVIEDB_ACCESS_TOKEN_KEY,
      },
      params: {
        language: "en",
      },
    }).then((res) => res.data.genres);

    return genres;
  } catch (error) {
    console.error(error);
  }
}

function findGenreById(id) {
  return listGenres.filter((genre) => genre.id === id)[0].name;
}
