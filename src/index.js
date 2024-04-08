
const dataUrl = "https://github.com/maggie4M/week3-code-challenge.git"

document.addEventListener('DOMContentLoaded', () => {
  // Find the list of movies in the HTML with the ID 'films' and store it.
  const moviesList = document.getElementById('films');
  // Initialize an empty array to store movie data.
  let moviesData = [];

  // Function to retrieve movie data from the database.
  function fetchMoviesData() {
      fetch('db.json')
          .then(response => {
              // Check if the fetch operation was successful.
              if (!response.ok) {
                  throw new Error('Error fetching movies from db.json');
              }
              // Convert the response to JSON format.
              return response.json();
          })
          .then(data => {
              // Store the movie data.
              moviesData = data.films;
              // Call the function to display the movies on the webpage.
              displayMovies();
          })
          .catch(error => {
              // Log the error and show an error message on the webpage.
              console.error('Error fetching movies from db.json:', error);
              showErrorMessage('Error loading movie data');
          });
  }

  // Function to display the list of movies on the webpage.
  function displayMovies() {
      moviesData.forEach(movie => {
          // Create a list item element for each movie.
          const listItem = createMovieListItem(movie);
          // Append the list item to the movies list on the webpage.
          moviesList.appendChild(listItem);
      });
  }

  // Function to create a list item element for a movie.
  function createMovieListItem(movie) {
      const listItem = document.createElement('li');
      // Set the text content of the list item to the title of the movie.
      listItem.textContent = movie.title;
      // Add a custom attribute to store the movie's ID.
      listItem.dataset.movieId = movie.id;
      // Add CSS classes to style the list item.
      listItem.classList.add('movie', 'item');
      // Add a click event listener to show details about the movie when clicked.
      listItem.addEventListener('click', () => updateMovieDetails(movie.id));
      // Return the created list item.
      return listItem;
  }

  // Function to update the movie details section when a movie is clicked.
  function updateMovieDetails(movieId) {
      const movie = moviesData.find(m => m.id === movieId);
      if (!movie) return;

      const availableTickets = movie.capacity - movie.tickets_sold;
      const buyTicketButton = document.getElementById('buy-ticket');

      buyTicketButton.textContent = availableTickets > 0 ? 'Buy Ticket' : 'Sold Out';
      buyTicketButton.classList.toggle('disabled', availableTickets === 0);
      buyTicketButton.onclick = () => {
          if (availableTickets > 0) {
              buyTicket(movie);
          }
      };

      displayMovieDetails(movie);
  }

  // Function to simulate buying a ticket for a movie.
  function buyTicket(movie) {
      movie.tickets_sold++;
      updateTicketCount(movie.id);
      updateMovieDetails(movie.id);
  }

  // Function to update the displayed number of available tickets for a movie.
  function updateTicketCount(movieId) {
      const movie = moviesData.find(m => m.id === movieId);
      const availableTickets = movie.capacity - movie.tickets_sold;
      document.getElementById('ticket-num').textContent = availableTickets;
  }

  // Function to display details about a movie in the movie details section on the webpage.
  function displayMovieDetails(movie) {
      document.getElementById('title').textContent = movie.title;
      document.getElementById('runtime').textContent = `${movie.runtime} minutes`;
      document.getElementById('film-info').textContent = movie.description;
      document.getElementById('showtime').textContent = movie.showtime;
      document.getElementById('poster').src = movie.poster;
      document.getElementById('poster').alt = `Poster for ${movie.title}`;
      // Update the ticket count display for the movie.
      updateTicketCount(movie.id);
  }

  // Function to display an error message on the webpage.
  function showErrorMessage(message) {
      const errorMessage = document.createElement('div');
      errorMessage.textContent = message;
      errorMessage.classList.add('ui', 'negative', 'message');
      document.body.appendChild(errorMessage);
      // Set a timeout to remove the error message after 5 seconds.
      setTimeout(() => errorMessage.remove(), 5000);
  }

  // Call the function to fetch movie data when the DOM content is fully loaded.
  fetchMoviesData();
});
