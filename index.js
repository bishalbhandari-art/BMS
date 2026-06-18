let books = []; // // Store all books in memory
let editIndex = -1; // Tracks which book is being edited
// Get required DOM elements
const form = document.getElementById("Bookform");
const booksGrid = document.getElementById("booksGrid");
const searchInput = document.getElementById("searchInput");
const filterGenre = document.getElementById("filterGenre");
const sortBy = document.getElementById("sortBy");
const saveBookToServer = (bookData) => {
  // Simulate saving data to a server
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Randomly simulate success or failure
      const isSuccessful = Math.random() > 0.1;
      if (isSuccessful) {
        resolve({
          status: 200,
          message: "Server: Action synchronized successfully!",
          data: bookData,
        });
      } else {
        reject(
          new Error(
            "Network Error: Connection timed out. Could not reach server.",
          ),
        );
      }
    }, 1200); // Simulate network delay
  });
};
function getBookAge(publicationDate) {
  // Calculate book age from publication year
  let currentYear = new Date().getFullYear();
  let bookYear = new Date(publicationDate).getFullYear();

  return currentYear - bookYear;
}
// Validate user input before saving
function validateForm(book) {
  // Check if any field is empty
  if (
    book.title === "" ||
    book.author === "" ||
    book.ISBN === "" ||
    book.publicationDate === "" ||
    book.genre === ""
  ) {
    alert("All fields are required");
    return false;
  }
  // ISBN should contain only digits
  if (isNaN(book.ISBN)) {
    alert("ISBN must contain only numbers");
    return false;
  }
  // ISBN should be exactly 10 digits
  if (book.ISBN.length !== 10) {
    alert("ISBN number must be exactly 10 digits");
    return false;
  }

  return true;
}
// Render books on the UI
function displayBooks() {
  // Clear previous book cards
  booksGrid.innerHTML = "";
  // Get current search and filter values
  let searchValue = searchInput.value.toLowerCase();
  let selectedGenre = filterGenre.value;
  // Create a copy to avoid changing original data
  let booksToShow = [...books];
  // Show latest books first
  if (sortBy.value === "dateAdded") {
    booksToShow.reverse();
  }
  // Sort books alphabetically
  if (sortBy.value === "title") {
    booksToShow.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  }
  // Sort books by age (newest first)
  if (sortBy.value === "age-asc") {
    booksToShow.sort(function (a, b) {
      return getBookAge(a.publicationDate) - getBookAge(b.publicationDate);
    });
  }
  // Sort books by age (oldest first)
  if (sortBy.value === "age-desc") {
    booksToShow.sort(function (a, b) {
      return getBookAge(b.publicationDate) - getBookAge(a.publicationDate);
    });
  }
  // Loop through books to display them
  for (let i = 0; i < booksToShow.length; i++) {
    //for loop Get the current book being processed

    let currentBook = booksToShow[i];
    // Ignore books that don't match the user's search input
    if (
  !booksToShow[i].title.toLowerCase().includes(searchValue) &&
  !booksToShow[i].author.toLowerCase().includes(searchValue) &&
  !booksToShow[i].ISBN.includes(searchValue)
) {
  continue;
}
// Ignore books that don't belong to the selected genre
if (
  selectedGenre !== "All" &&
  currentBook.genre !== selectedGenre
) {
  continue;
}
    // Find actual index from original array
    let originalIndex = books.findIndex(function (book) {
      return book.ISBN === currentBook.ISBN;
    });
    // Calculate age for current book
    let age = getBookAge(currentBook.publicationDate);
    // Add book card to UI
    booksGrid.innerHTML += `
      <div class="book-card">
        <h3>${currentBook.title}</h3>
        <p>Author: ${currentBook.author}</p>
        <p>ISBN: ${currentBook.ISBN}</p>
        <p>Genre: ${currentBook.genre}</p>
        <button class ="btnclass" onclick = "editBook(${originalIndex})">
          ✍️
        </button>

        <button class = "btnclass1" onclick = "deleteBook(${originalIndex})">
          🗑️
        </button>
      </div>
    `;
  }
  // Show empty state when no books exist
  let noBooksView = document.getElementById("noBooksView");

  if (books.length === 0) {
    noBooksView.style.display = "block";
  } else {
    noBooksView.style.display = "none";
  }
}
// Handle add/edit form submission
form.addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent page refresh
  // Create book object from form values
  let book = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    ISBN: document.getElementById("ISBN").value,
    publicationDate: document.getElementById("publicationDate").value,
    genre: document.getElementById("genre").value,
  };
  // Stop if validation fails
  if (!validateForm(book)) {
    return;
  }
  // Ask user for confirmation
  let confirmAdd = confirm(`Do you want to add ${book.title}`);

  if (!confirmAdd) {
    return;
  }
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.textContent : "Submit";
  if (submitBtn) {
    submitBtn.textContent = "Connecting to server...";
    submitBtn.disabled = true;
  }
  try {
    // Simulate server save
    await saveBookToServer(book);
    // Add new book
    if (editIndex === -1) {
      books.push(book);
    } else {
      // Update existing book
      books[editIndex] = book;
      editIndex = -1;
    }
    // Reset form after successful save
    form.reset();
    displayBooks();
    updateTotalBooks();
    updateCollectionCount();
    updateTopGenre();
    updateAverageAge();
  } catch (error) {
    // Log and notify if request fails
    console.error(error);
    alert(`${error.message} - your changes were not saved locally`);
  } finally {
    if (submitBtn) {
      // Restore button state
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  }
});
// Load selected book data into form
function editBook(index) {
  let book = books[index];

  document.getElementById("title").value = book.title;
  document.getElementById("author").value = book.author;
  document.getElementById("ISBN").value = book.ISBN;
  document.getElementById("publicationDate").value = book.publicationDate;
  document.getElementById("genre").value = book.genre;

  editIndex = index;
}
// Remove selected book
function deleteBook(index) {
  let confirmDelete = confirm(
    `Do you want to delete "${books[index].title}" ?`,
  );

  if (confirmDelete) {
    books.splice(index, 1);

    displayBooks();
    updateTotalBooks();
    updateCollectionCount();
    updateTopGenre();
    updateAverageAge();
  }
}
// Update total book count
function updateTotalBooks() {
  document.getElementById("stat-total").textContent = books.length;
}
function updateTopGenre() {
  // Find most common genre
  let fiction = 0;
  let nonFiction = 0;
  let scienceFiction = 0;
  let mystery = 0;

  for (let i = 0; i < books.length; i++) {
    if (books[i].genre === "Fiction") {
      fiction++;
    }

    if (books[i].genre === "Non-Fiction") {
      nonFiction++;
    }

    if (books[i].genre === "Science Fiction") {
      scienceFiction++;
    }

    if (books[i].genre === "Mystery") {
      mystery++;
    }
  }

  let topGenre = "-";
  let max = 0;

  if (fiction > max) {
    max = fiction;
    topGenre = "Fiction";
  }

  if (nonFiction > max) {
    max = nonFiction;
    topGenre = "Non-Fiction";
  }

  if (scienceFiction > max) {
    max = scienceFiction;
    topGenre = "Science Fiction";
  }

  if (mystery > max) {
    max = mystery;
    topGenre = "Mystery";
  }

  document.getElementById("stat-top-genre").textContent = topGenre;
}
function updateAverageAge() {
  // Calculate average age of books
  let totalAge = 0;

  for (let i = 0; i < books.length; i++) {
    totalAge += getBookAge(books[i].publicationDate);
  }

  let averageAge = 0;

  if (books.length > 0) {
    averageAge = Math.round(totalAge / books.length);
  }

  document.getElementById("stat-avg-age").textContent = averageAge + " yrs";
}
function updateCollectionCount() {
  // Update collection count text
  document.getElementById("collection-count").textContent =
    books.length + " books";
}
function updateAllStats() {
  // Refresh UI and statistics together
  displayBooks();
  updateTotalBooks();
  updateCollectionCount();
  updateTopGenre();
  updateAverageAge();
}
// Fetch initial books from API
async function fetchInitialBooks() {
  try {
    // Request sample data
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=4",
    );
    // Stop if API request fails
    if (!response.ok) {
      throw new Error(`HTTP network error! Status: ${response.status}`);
    }
    // Convert response into JavaScript objects
    const apiData = await response.json();
    // Transform API posts into books
    for (let i = 0; i < apiData.length; i++) {
      let post = apiData[i];

      let bookTitle = "Title " + post.title;
      let bookAuthor = "Author " + post.userId;
      let bookISBN = String(1234567890 + post.id);
      let bookDate = "201" + i + "-05-12";

      let bookGenre = "";
      if (i === 0) {
        bookGenre = "Fiction";
      } else if (i === 1) {
        bookGenre = "Non-Fiction";
      } else if (i === 2) {
        bookGenre = "Science Fiction";
      } else {
        bookGenre = "Mystery";
      }
      let newBook = {
        title: bookTitle,
        author: bookAuthor,
        ISBN: bookISBN,
        publicationDate: bookDate,
        genre: bookGenre,
      };

      books.push(newBook);
    }
    // Update UI after loading
    updateAllStats();
  } catch (error) {
    // Handle API failure gracefully
    console.error("Failed to load initial API context:", error);
    alert(
      "⚠️ Could not load remote startup books. Initializing with empty system.",
    );
    updateAllStats();
  }
}
// Re-render books while typing
searchInput.addEventListener("input", function () {
  displayBooks();
});
// Re-render when genre changes
filterGenre.addEventListener("change", function () {
  displayBooks();
});
// Re-render when sort option changes
sortBy.addEventListener("change", function () {
  displayBooks();
});
// Load initial data after HTML is ready
window.addEventListener("DOMContentLoaded", fetchInitialBooks);
