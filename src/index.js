
const url = "https://github.com/maggie4M/week3-code-challenge.git"

// Wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // It Finds  the list of movies in the HTML with the ID 'films' and stores it
  const moviesListElement = document.getElementById('films');
  // Initializing  an empty array to store the created  movie data
  let moviesData = [];

  // Fetch movie data from the database
  function displayMovies() {
      fetch('db.json')
          .then(function(response) {
              // Check if the fetch operation was successful
              if (!response.ok) {
                  throw new Error('Error fetching movies from db.json');
              }
              // If successful, convert the response to JSON format
              return response.json();
          })
          .then(function(data) {
              // After converting the response to JSON, store the movie data
              cinemaData = data.films;
              // Then, call the function to display the movies on the webpage
              viewMovies();
          })
          .catch(function(error) {
              // If there's an error fetching the data, log the error and show an error message on the webpage
              console.error('Error fetching movies from db.json:', error);
              showError('Error loading movie data');
          });
  }

  // Display the list of movies on the webpage
  function viewMovies() {
      moviesDataData.forEach(function(movie) {
          // For each movie, create a list item element
          const listItem = createMovieItem(cinema);
          // Append the list item to the movie list on the webpage
          moviesListElement.appendChild(listItem);
      });
  }

  // Create a list item element for a movie
  function createMovieItem(cinema) {
      const listItem = document.createElement('li');
      // Set the text content of the list item to the title of the movie
      listItem.textContent = cinema.title;
      // Add a custom attribute to store the movie's ID
      listItem.dataset.cinemaId = cinema.id;
      // Add CSS classes to style the list item
      listItem.classList.add('movie', 'item');
      // Add a click event listener to show details about the movie when clicked
      listItem.addEventListener('click', function() {
          showMovieDetails(cinema.id);
      });
      // Return the created list item
      return listItem;
  }

  // Update the movie details section when a movie is clicked
  function showMovieDetails(cinemaId) {
      // Find the cinema with the given ID from the cinemaData array
      const cinema = cinemaData.find(function(cinema) {
          return cinema.id === cinemaId;
      });

      // If cinema is not found, return early
      if (!cinema) return;

      // Calculate the number of available tickets for the movie
      const availableTickets = cinema.capacity - cinema.tickets_sold;

      // Get the buy ticket button element
      const buyTicketButton = document.getElementById('buy-ticket');

      // Update the text content and disabled state of the buy ticket button based on available tickets
      if (availableTickets > 0) {
          buyTicketButton.textContent = 'Buy Ticket';
          buyTicketButton.disabled = false;
      } else {
          buyTicketButton.textContent = 'Sold Out';
          buyTicketButton.disabled = true;
      }

      // Add a click event listener to the buy ticket button
      buyTicketButton.addEventListener('click', function() {
          // If available tickets are greater than 0, simulate buying a ticket
          if (availableTickets > 0) {
              buyTicket(cinema);
          }
      });

      // Display movie details on the webpage
      document.getElementById('title').textContent = cinema.title;
      document.getElementById('runtime').textContent = `${cinema.runtime} minutes`;
      document.getElementById('film-info').textContent = cinema.description;
      document.getElementById('showtime').textContent = cinema.showtime;
      document.getElementById('poster').src = cinema.poster;
      document.getElementById('poster').alt = `Poster for ${cinema.title}`;

      // Update the displayed number of available tickets
      document.getElementById('ticket-num').textContent = availableTickets;
  }

  // Simulate buying a ticket for a movie
  function buyTicket(cinema) {
      cinema.tickets_sold++;
      // Update the displayed number of available tickets
      const availableTickets = cinema.capacity - cinema.tickets_sold;
      document.getElementById('ticket-num').textContent = availableTickets;
      // Update the movie details section
      showMovieDetails(cinema.id);
  }

  // Display an error message on the webpage
  function showError(message) {
      const errorMessage = document.createElement('div');
      errorMessage.textContent = message;
      errorMessage.classList.add('ui', 'negative', 'message');
      document.body.appendChild(errorMessage);
  }

  // Call the function to fetch movie data when the DOM content is fully loaded
  displayMovies();
});
