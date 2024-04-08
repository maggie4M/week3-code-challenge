
const dataUrl = "https://github.com/maggie4M/week3-code-challenge.git"

// As the page loads,  wait for the DOM content to be fully loaded.
document.addEventListener('DOMContentLoaded', () => {
  //  find the list of movies in the HTML with the ID 'films' and store it.
  const cinemaList = document.getElementById('films');
  //  initialize an empty array to store movie data.
  let cinemaData = [];

  // fetch movie data from the database.
  function retrieveMoviesFromDB() {
      fetch('db.json')
          .then(response => {
              //  check if the fetch operation was successful.
              if (!response.ok) {
                  throw new Error('Error fetching movies from db.json');
              }
              // If successful, I convert the response to JSON format.
              return response.json();
          })
          .then(data => {
              // After converting the response to JSON, I store the movie data.
              cinemaData = data.films;
              // Then, I call the function to display the movies on the webpage.
              viewMovies();
          })
          .catch(error => {
              // If there's an error fetching the data, I log the error and show an error message on the webpage.
              console.error('Error fetching movies from db.json:', error);
              showError('Error loading movie data');
          });
  }

  //  display the list of movies on the webpage.
  function viewMovies() {
      cinemaData.forEach(cinema => {
          // For each movie, I create a list item element.
          const listItem = createMovieItem(cinema);
          //  append the list item to the movie list on the webpage.
          cinemaList.appendChild(listItem);
      });
  }

  //  create a list item element for a movie.
  function createMovieItem(cinema) {
      const listItem = document.createElement('li');
      //  set the text content of the list item to the title of the movie.
      listItem.textContent = cinema.title;
      //  add a custom attribute to store the movie's ID.
      listItem.dataset.cinemaId = cinema.id;
      //  add CSS classes to style the list item.
      listItem.classList.add('movie', 'item');
      //  add a click event listener to show details about the movie when clicked.
      listItem.addEventListener('click', () => updateCinemaDetails(cinema.id));
      //  return the created list item.
      return listItem;
  }

  //  update the movie details section when a movie is clicked.
  function updateCinemaDetails(cinemaId) {
      const cinema = cinemaData.find(c => c.id === cinemaId);
      if (!cinema) return;

      const availableTickets = cinema.capacity - cinema.tickets_sold;
      const buyTicketButton = document.getElementById('buy-ticket');

      buyTicketButton.textContent = availableTickets > 0 ? 'Buy Ticket' : 'Sold Out';
      buyTicketButton.classList.toggle('disabled', availableTickets === 0);
      buyTicketButton.onclick = () => {
          if (availableTickets > 0) {
              buyTicket(cinema);
          }
      };

      displayCinemaDetails(cinema);
  }

  //  simulate buying a ticket for a movie.
  function buyTicket(cinema) {
      cinema.tickets_sold++;
      updateTicketCount(cinema.id);
      updateCinemaDetails(cinema.id);
  }

  //  update the displayed number of available tickets for a movie.
  function updateTicketCount(cinemaId) {
      const cinema = cinemaData.find(c => c.id === cinemaId);
      const availableTickets = cinema.capacity - cinema.tickets_sold;
      document.getElementById('ticket-num').textContent = availableTickets;
  }

  //  display details about a movie in the movie details section on the webpage.
  function displayCinemaDetails(cinema) {
      document.getElementById('title').textContent = cinema.title;
      document.getElementById('runtime').textContent = `${cinema.runtime} minutes`;
      document.getElementById('film-info').textContent = cinema.description;
      document.getElementById('showtime').textContent = cinema.showtime;
      document.getElementById('poster').src = cinema.poster;
      document.getElementById('poster').alt = `Poster for ${cinema.title}`;
      // I update the ticket count display for the movie.
      updateTicketCount(cinema.id);
  }

  //  display an error message on the webpage.
  function showError(message) {
      const errorMessage = document.createElement('div');
      errorMessage.textContent = message;
      errorMessage.classList.add('ui', 'negative', 'message');
      document.body.appendChild(errorMessage);
      //  set a timeout to remove the error message after 5 seconds.
      setTimeout(() => errorMessage.remove(), 5000);
  }

  //  call the function to fetch movie data when the DOM content is fully loaded.
  retrieveMoviesFromDB();
});