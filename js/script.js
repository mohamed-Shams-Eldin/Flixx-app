const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalpages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: "1fa9308005b3743431eab6a97ed4abda",
    apiUrl: "https://api.themoviedb.org/3/",
  },
};
//High Light Active Link

function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");

  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

///////////////////////////////////////////////Popular Movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
<a href="movie-details.html?id=${movie.id}">
        <img
          src="${
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : `images/no-image.jpg`
          }"
          class="card-img-top"
          alt="${movie.title}"
        /> 
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
             <small class="text-muted">Release: ${movie.release_date}</small>
          </div>
`;
    document.querySelector("#popular-movies").appendChild(div);
  });
}
//////////////////////////////////////////////////// Popular TV SHOW
async function displayPopularShows() {
  const { results } = await fetchAPIData("tv/popular");

  results.forEach((tv) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="tv-details.html?id=${tv.id}">
            <img
              src="${
                tv.poster_path
                  ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
                  : `images/no-image.jpg`
              }"
              class="card-img-top"
              alt="${tv.name}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${tv.name}</h5>
            <p class="card-text">
              <small class="text-muted">${tv.first_air_date}</small>
            </p>
          </div>`;
    document.querySelector("#popular-shows").appendChild(div);
  });
}

/////////////////////////////////////////////display Movies Detalis
async function displayMoviesDetalis() {
  const movieId = window.location.search.split("=")[1];

  const movie = await fetchAPIData(`movie/${movieId}`);

  // Overlay for background image
  displayBackgroundImage("movie", movie.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = `
  <div class="details-top">
          <div>
            <img
              src="${
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : `images/no-image.jpg`
              }"
              class="card-img-top"
              alt="${movie.name}"
            />
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genres) => `<li>${genres.name}</li>`).join("")}
            </ul>
            <a href=${movie.homepage} target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span>$${addCommasToNumber(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span>${movie.runtime}</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map((company) => `<span>${company.name}</span>`).join(", ")}</div>
        </div>
  `;
  document.querySelector("#movie-details").appendChild(div);
}
/////////////////////////////////////////////display Show Detalis
async function displayShowDetalis() {
  const showId = window.location.search.split("=")[1];
  const shows = await fetchAPIData(`tv/${showId}`);
  displayBackgroundImage("tv", shows.backdrop_path);

  const div = document.createElement("div");
  div.innerHTML = `
<div class="details-top">
          <div>
            <img
              src="${
                shows.poster_path
                  ? `https://image.tmdb.org/t/p/w500${shows.poster_path}`
                  : `images/no-image.jpg`
              }
              class="card-img-top"
              alt="${shows.name}"
            />
          </div>
          <div>
            <h2>${shows.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${shows.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Last Air Date:${shows.last_air_date}</p>
            <p>
              ${shows.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${shows.genres.map((genres) => `<li>${genres.name}</li>`).join("")}
            </ul>
            <a href=${shows.homepage} target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span>${
              shows.number_of_episodes
            }</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
                shows.last_episode_to_air.name
              }
            </li>
            <li><span class="text-secondary">Status:</span> ${shows.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${shows.production_companies.map((company) => `<span>${company.name}</span>`).join("")}</div>
        </div>

`;
  document.querySelector("#show-details").appendChild(div);
}

////////////////////////////////////Display Backdrop On Details pages
function displayBackgroundImage(type, backgroundPath) {
  const overlay = document.createElement("div");
  overlay.style.background = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlay.style.backgroundSize = "cover";
  overlay.style.backgroundPosition = "center";
  overlay.style.backgroundRepeat = "no-repeat";

  overlay.style.height = "100vh";
  overlay.style.width = "100vw";
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";

  overlay.style.zIndex = "-1";
  overlay.style.opacity = "0.4";
  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlay);
  } else {
    document.querySelector("#show-details").appendChild(overlay);
  }
}
// ///////////////////////////////////////////// Search Movies/Shows
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalpages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert("No results found");
      return;
    }
    displaySearchResults(results);

    document.querySelector("#search-term").value = "";
  } else {
    showAlert("plese enter a search term");
  }
}

function displaySearchResults(results) {
  /////////// Clear previous results
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <a href="${global.search.type}-details.html?id=${result.id}">
        <img
          src="${
            result.poster_path
              ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
              : `images/no-image.jpg`
          }"
          class="card-img-top"
          alt="${global.search.type === "movie" ? result.title : result.name}"
        /> 
      </a>
      <div class="card-body">
        <h5 class="card-title">${global.search.type === "movie" ? result.title : result.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${global.search.type === "movie" ? result.release_date : result.first_air_date}</small>
        </p>
      </div>
    `;
    document.querySelector("#search-results-heading").innerHTML = `
    <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}
    </h2>
    `;
    document.querySelector("#search-results").appendChild(div);
  });
  displayPagination();
}
/////////////////////////////////Create & Display Pagination For Search

function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
          <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${
            global.search.totalpages
          }</div>
  `;
  document.querySelector("#pagination").appendChild(div);
  ///////////////////////Disble prev button if on First page
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }
  ///////////////////////Disble next button if on last page
  if (global.search.page === global.search.totalpages) {
    document.querySelector("#next").disabled = true;
  }

  /////////////////////////////////// Next Page
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results, total_Pages } = await searchAPIData();
    displaySearchResults(results);
  });
  /////////////////////////////////// Next Page
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results, total_Pages } = await searchAPIData();
    displaySearchResults(results);
  });
}

//////////////////////////////////////////////// Display Slider Movies
async function displaySliderMovies() {
  const { results } = await fetchAPIData("movie/now_playing");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.setAttribute("data-backdrop", movie.backdrop_path);
    div.innerHTML = `  
    <a href="movie-details.html?id=${movie.id}">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
    </a>
    <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i>${movie.vote_average.toFixed(1)} / 10
    </h4>
  
`;
    document.querySelector(".swiper-wrapper").appendChild(div);
  });
  initSwiper();
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    spaceBetween: 30,
    slidesPerView: 3,
    centeredSlides: true,
    grabCursor: true,
    effect: "coverflow",
    loop: true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    on: {
      slideChange: function () {
        const activeSlide = this.slides[this.activeIndex];
        const backdrop = activeSlide.getAttribute("data-backdrop");
        console.log(backdrop);

        const backgroundSection = document.querySelector(".now-playing");

        if (backdrop) {
          backgroundSection.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backdrop})`;
          backgroundSection.style.backgroundSize = "cover";
          backgroundSection.style.backgroundPosition = "center";
          backgroundSection.style.backgroundRepeat = "no-repeat";
        }
      },
    },
  });
  const slides = document.querySelectorAll(".swiper-slide");
  let hoverTimeout;

  slides.forEach((slide, index) => {
    slide.addEventListener("mouseenter", () => {
      clearTimeout(hoverTimeout);

      swiper.autoplay.stop();

      hoverTimeout = setTimeout(() => {
        swiper.slideTo(index);
      }, 1000);
    });

    slide.addEventListener("mouseleave", () => {
      clearTimeout(hoverTimeout);

      swiper.autoplay.start();
    });
  });
}
////////////////////////////////////////// Fetch Data from TMDB API
async function fetchAPIData(endpoint) {
  const API_key = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_key}&language=en-US`,
  );
  const data = await response.json();
  hideSpinner();
  return data;
}
// ///////////////////////////////// SearchAPIData
async function searchAPIData() {
  const API_URL = global.api.apiUrl;
  const API_KEY = global.api.apiKey;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`,
  );
  const data = await response.json();

  hideSpinner();

  return data;
}

//          Spinner      ***********************
function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}
////////////////////////////////////////// Show Alert
function showAlert(message, className = "error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Init APP
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displaySliderMovies();
      displayPopularMovies();
      break;
    case "/shows.html":
    case "/shows":
      displayPopularShows();
      break;
    case "/movie-details.html":
      displayMoviesDetalis();
      console.log("Movie Details");
      break;
    case "/tv-details.html":
      displayShowDetalis();

      break;
    case "/search.html":
      search();
      break;
  }
  highlightActiveLink();
}
document.addEventListener("DOMContentLoaded", init);
