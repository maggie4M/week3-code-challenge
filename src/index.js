
const url = "https://github.com/maggie4M/week3-code-challenge.git"

// Wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Start by  finding the list of movies in the HTML with the ID 'films' and store them in it
  const listContainer = document.getElementById('films');
  // Then Initialize an empty array to store the  movies information 
  let movieInfo = [];

  // Use Fetch  to find the movie information  from the database
  function fetchMoviesData() {
      fetch('db.json')
          .then(function(response) {
              // Find out if The fetch function was successful , if not an error message is displayed 
              if (!response.ok) {
                  throw new Error('Error fetching movies Information');
              }
              // If it is  successful it  converts the response into a JSON format
              return response.json();
          })
          .then(function(data) {
              // After the  conversion of the response to JSON the movie Information is  stored 
              movieInfo = data.films;
              // The function is then called to display the movies information  on the webpage
              showMovies();
          })
          .catch(function(error) {
              // If there's an error fetching the data  an error message is displayed on the webpage
              console.error('Error fetching movies Information:', error);
              displayError('Error ');
          });
  }

  // The list of movies is displayed  on the webpage
  function showMovies() {
      movieInfo.forEach(function(movie) {
          // A list item element is created for each movie 
          const listItem = createMovieItemElement(movie);
          // The list item to the movie list on the webpage is appended
          listContainer.appendChild(listItem);
      });
  }

  // Creating a list item element for the movies
  function createMovieItemElement(movie) {
      const listItem = document.createElement('li');
      // Add the text content of the list item as the title of the movie
      listItem.textContent = movie.title;
      // Add a custom attribute for storing the movie's ID
      listItem.dataset.movieId = movie.id;
      // Add  a CSS class for styling the list item
      listItem.classList.add('movie', 'item');
      // Add a click event listener to show details about the movie when clicked
      listItem.addEventListener('click', function() {
          showMovieDetails(movie.id);
      });
      // Return the created list item
      return listItem;
  }

  // Update the movie details section when a movie is clicked
  function showMovieDetails(movieId) {
      // Find the movie with the given ID from the movieData array
      const movie = movieInfo.find(function(movie) {
          return movie.id === movieId;
      });

      // If no movie is found return nothing 
      if (!movie) return;

      // Calculating  the number of available tickets for the movie
      const availableTickets = movie.capacity - movie.tickets_sold;

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
          // If available tickets are greater than 0, replicate buying a ticket
          if (availableTickets > 0) {
              purchaseTicket(movie);
          }
      });

      // Display movie details on the webpage
      document.getElementById('title').textContent = movie.title;
      document.getElementById('runtime').textContent = `${movie.runtime} minutes`;
      document.getElementById('film-info').textContent = movie.description;
      document.getElementById('showtime').textContent = movie.showtime;
      document.getElementById('poster').src = movie.poster;
      document.getElementById('poster').alt = `Poster for ${movie.title}`;

      // Update the displayed number of available tickets
      document.getElementById('ticket-num').textContent = availableTickets;
  }

  // Replicate buying a ticket for a movie
  function purchaseTicket(movie) {
      movie.tickets_sold++;
      // Update the displayed number of available tickets
      const availableTickets = movie.capacity - movie.tickets_sold;
      document.getElementById('ticket-num').textContent = availableTickets;
      // Update the movie details section
      showMovieDetails(movie.id);
  }

  // Call the function to fetch movie data when the DOM content is fully loaded
  fetchMoviesData();
});
