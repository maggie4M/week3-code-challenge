
const dataUrl = "https://github.com/maggie4M/week3-code-challenge.git"

document.addEventListener("DOMContentLoaded", () => {
    const baseURL = ("http://localhost:3000");
  
    // Function to make GET requests
    const fetchData = async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return await response.json(); // Parse response body as JSON
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    // Function to change movie details on the page
    const changeMovieDetails = (movie) => {
      const poster = document.getElementById("poster");
      const title = document.getElementById("title");
      const runtime = document.getElementById("runtime");
      const showtime = document.getElementById("showtime");
      const availableTickets = document.getElementById("ticket-num");
  
      poster.src = movie.poster;
      title.textContent = movie.title;
      runtime.textContent = `${movie.runtime} minutes`;
      showtime.textContent = movie.showtime;
      const remainingTickets = movie.capacity - movie.tickets_sold;
      availableTickets.textContent = remainingTickets;
      if (remainingTickets === 0) {
        const buyButton = document.getElementById("buy-ticket");
        buyButton.textContent = "Sold Out";
        buyButton.disabled = true;
      }
    };
  
    // Function for the customer to buy a ticket for a movie
    const buyTicket = async (movieId) => {
      const movie = await fetchData(`${baseURL}/films/${movieId}`);
      if (movie && movie.capacity > movie.tickets_sold) {
        const updatedTicketsSold = movie.tickets_sold + 1;
        const response = await fetch(`${baseURL}/films/${movieId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tickets_sold: updatedTicketsSold,
          }),
        });
        if (response.ok) {
          changeMovieDetails({ ...movie, tickets_sold: updatedTicketsSold });
          const ticketData = {
            film_id: movieId,
            number_of_tickets: 1,
          };
          await fetch(`${baseURL}/tickets`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(ticketData),
          });
        }
      }
    };
  
    // Function to show the movie menu
    const showMovieMenu = async () => {
      const films = await fetchData(`${baseURL}/films`);
      const filmsList = document.getElementById("films");
      filmsList.innerHTML = "";
      films.forEach((film) => {
        const li = document.createElement("li");
        li.textContent = film.title;
        li.classList.add("film-item");
        if (film.capacity === film.tickets_sold) {
          li.classList.add("sold-out");
        } else {
          const buyButton = document.createElement("button");
          buyButton.textContent = "Buy Ticket";
          buyButton.addEventListener("click", () => buyTicket(film.id));
          li.appendChild(buyButton);
        }
        filmsList.appendChild(li);
      });
    };
  
    // Fetch and show details of the first movie
    fetchData(`${baseURL}/films/1`).then(updateMovieDetails);
  
    // show movie menu on page load
    console.log(showMovieMenu)
  