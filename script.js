const searchcontain = document.getElementById("searchcontain");
// Debounce function to limit the number of API calls
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const fetchMovies = async (letter) => {
  const apikey = "92a21f63";
  const apiUrl = `http://www.omdbapi.com/?s=${letter}&apikey=${apikey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log("Search Response:", data); // Log the search response

    if (data.Response === "True") {
      return data.Search;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching movie data:", error);
    return [];
  }
};

const fetchMovieDetails = async (imdbID) => {
  const apikey = "92a21f63";
  const apiUrl = `http://www.omdbapi.com/?i=${imdbID}&apikey=${apikey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("Detailed Movie Response:", data); // Log the detailed movie response
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

const displayMovieDetails = (movie) => {
  const moviedetails = document.getElementById("moviedetails");

  moviedetails.innerHTML = `
        <div class="row align-items-center justify-content-center mx-0">           
            <div class="col-md-3 px-0">
                <div class="mov-det-poster">
                    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x225'}" alt="" class="w-100">
                </div>
            </div>
            <div class="col-md-6 text-start p-4 p-md-5">
                
                    <h4 class="mb-3 text-white">${movie.Title} (${movie.Year})</h4>
                    <p class="text-white">${movie.Plot}</p>
                    <p class="text-white">Directed by ${movie.Director}</p>
                    <p class="text-secondary mb-1">Cast of Movie</p>
                    <p class="text-white">${movie.Actors}</p>
                    <p class="text-white">Imdb ratings is ${movie.imdbRating}</p>
                    <a type="button" onclick="closeMovieDetails()" class="btn p-0 backtosearch">
                        <span class="material-icons me-3">arrow_back</span> Back to Search
                    </a>
            </div>
        </div>
    `;

    moviedetails.style.display = "flex";
};

// Function to close movie detail view
const closeMovieDetails = () => {
    document.getElementById("moviedetails").style.display = "none";
};

const displaymovies = (movies) => {
  const movielist = document.getElementById("movielist");
  const loader = document.getElementById("loader");
  const nomovie = document.getElementById("nomovie");
  loader.style.display = "block"; // Show loader initially

  if (movies.length === 0) {
    loader.style.display = "none";
    nomovie.style.display = "block";
    swiper.update(); // Update Swiper with no slides

    return;
  } else {
    nomovie.style.display = "none";
  }

  movielist.innerHTML = ""; // Clear previous movies
  
  movies.forEach((movie) => {
    loader.style.display = "block";
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");
    slide.innerHTML = `
            <a type="button" data-imdbID="${movie.imdbID}" id="movieLink" class="btn movie-link text-white">
                <div class="movie-img">
                    <img src="${
                      movie.Poster !== "N/A"
                        ? movie.Poster
                        : "https://via.placeholder.com/150x225"
                    }" class="w-100" alt="${movie.Title}">
                </div>
                <div class="movie-name mt-3">
                    <h5 class="text-white fs-6">${movie.Title}</h5>
                    <p class="mb-0 text-white">(${movie.Year})</p>
                </div>
            </a>
        `;
    movielist.appendChild(slide);
  });


  const movieElement = document.getElementsByClassName("movie-link");
  
  Array.from(movieElement).forEach((element) => {
    element.addEventListener("click", async (e) => {
        e.preventDefault();
        const imdbID = e.currentTarget.getAttribute("data-imdbID");
        const movieDetails = await fetchMovieDetails(imdbID);
        if (movieDetails) {
            displayMovieDetails(movieDetails);
            searchcontain.style.display = "none";
        }
    });
});

swiper.update();
loader.style.display = "none";

};

// Handle search input event
const handleSearchInput = async (event) => {
  const loader = document.getElementById("loader");
  loader.style.display = "block"; // Show loader at the start of search

  const query = event.target.value.trim();
  if (query.length > 2) {
    // Start searching after 3 characters
    const movies = await fetchMovies(query);
    displaymovies(movies);
  } else {
    document.getElementById("movielist").innerHTML = ""; // Clear slides for short queries
    swiper.update();
  }

  loader.style.display = "none"; // Hide loader after search completes
};

// Apply debounce to the search function to limit API calls
document
  .getElementById("searchInput")
  .addEventListener("input", debounce(handleSearchInput, 500));

const displayMovieContainer = () => {
  document.getElementById("moviecontainer").style.display = "block";
  document.getElementById("moviecontainer").style.opacity = "1";
};

const undisplayMovieContainer = () => {
  document.getElementById("moviecontainer").style.display = "none";
  document.getElementById("moviecontainer").style.opacity = "0";
};
