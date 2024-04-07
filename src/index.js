// Your code here
document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch film data
    function fetchFilmData(id) {
        return fetch(`/films/${id}`)
            .then(response => response.json())
            .catch(error => console.error('Error fetching film data:', error));
    }

    // Function to fetch all films
    function fetchAllFilms() {
        return fetch('/films')
            .then(response => response.json())
            .catch(error => console.error('Error fetching films:', error));
    }

    // Function to update number of tickets sold
    function updateTicketsSold(id, ticketsSold) {
        return fetch(`/films/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tickets_sold: ticketsSold
            })
        })
        .then(response => response.json())
        .catch(error => console.error('Error updating tickets sold:', error));
    }

    // Function to buy tickets
    function buyTickets(filmId, numberOfTickets) {
        return fetch('/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                film_id: filmId,
                number_of_tickets: numberOfTickets
            })
        })
        .then(response => response.json())
        .catch(error => console.error('Error buying tickets:', error));
    }

    // Function to delete a film
    function deleteFilm(id) {
        return fetch(`/films/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .catch(error => console.error('Error deleting film:', error));
    }

    // Function to update UI with film data
    function updateFilmDetails(film) {
        const posterElement = document.getElementById('poster');
        const titleElement = document.getElementById('title');
        const runtimeElement = document.getElementById('runtime');
        const showtimeElement = document.getElementById('showtime');
        const ticketsElement = document.getElementById('tickets');

        posterElement.src = film.poster;
        titleElement.textContent = film.title;
        runtimeElement.textContent = film.runtime + ' minutes';
        showtimeElement.textContent = 'Showtime: ' + film.showtime;
        const availableTickets = film.capacity - film.tickets_sold;
        ticketsElement.textContent = 'Available Tickets: ' + availableTickets;

        if (availableTickets === 0) {
            document.getElementById('buyBtn').disabled = true;
            document.getElementById('buyBtn').textContent = 'Sold Out';
        }
    }

    // Function to render films menu
    function renderFilmsMenu(films) {
        const filmsList = document.getElementById('films');
        filmsList.innerHTML = '';
        films.forEach(film => {
            const li = document.createElement('li');
            li.className = 'film item';
            li.textContent = film.title;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function() {
                deleteFilm(film.id)
                    .then(() => {
                        filmsList.removeChild(li);
                    });
            });
            li.appendChild(deleteBtn);
            filmsList.appendChild(li);
            if (film.capacity - film.tickets_sold === 0) {
                li.classList.add('sold-out');
            }
        });
    }

    // Fetch film details for the first film on page load
    fetchFilmData(1)
        .then(film => updateFilmDetails(film));

    // Fetch all films and render films menu on page load
    fetchAllFilms()
        .then(films => renderFilmsMenu(films));

    // Event listener for buy ticket button
    document.getElementById('buyBtn').addEventListener('click', function() {
        const filmId = 1; // Assuming the first film is always selected
        fetchFilmData(filmId)
            .then(film => {
                const availableTickets = film.capacity - film.tickets_sold;
                if (availableTickets > 0) {
                    buyTickets(filmId, 1)
                        .then(() => {
                            updateTicketsSold(filmId, film.tickets_sold + 1)
                                .then(updatedFilm => {
                                    updateFilmDetails(updatedFilm);
                                });
                        });
                } else {
                    alert('No available tickets for this film.');
                }
            });
    });
});

