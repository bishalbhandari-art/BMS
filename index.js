// let books = JSON.parse(localStorage.getItem("bms_books")) || [];
// let editId = null;
// const form = document.getElementById("Bookform");
// const isbnInput = document.getElementById("ISBN");
// const booksGrid = document.getElementById("booksGrid");
// const searchInput = document.getElementById("searchInput");
// const filterGenre = document.getElementById("filterGenre");
// const sortBy = document.getElementById("sortBy");
// const saveBooks = () => localStorage.setItem("bms_books", JSON.stringify(books));
// const getBookAge = (dateStr) => {
//   const diff = new Date().getFullYear() - new Date(dateStr).getFullYear();
//   return diff < 0 ? 0 : diff;
// };
// isbnInput.addEventListener("input", (e) => {
//   e.target.value = e.target.value.replace(/\D/g, "");
// });
// const showToast = (message, isError = false) => {
//   const container = document.getElementById("toastContainer");
//   const toast = document.createElement("div");
//   toast.className = `toast ${isError ? 'toast-error' : 'toast-success'} show`;
//   toast.innerHTML = `<span>${message}</span>`;
//   container.appendChild(toast);

//   setTimeout(() => {
//     toast.style.opacity = "0";
//     setTimeout(() => toast.remove(), 300);
//   }, 3000);
// };

// const validateForm = (data) => {
//   let isValid = true;

//   const setError = (id, message) => {
//     const el = document.getElementById(id);
//     const errorEl = document.getElementById(`error-${id}`);
//     if (message) {
//       el.classList.add("is-invalid");
//       errorEl.textContent = message;
//       isValid = false;
//     } else {
//       el.classList.remove("is-invalid");
//       errorEl.textContent = "";
//     }
//   };

//   setError("title", !data.title.trim() ? "Book title is required." : "");
//   setError("author", !data.author.trim() ? "Author name is required." : "");

//   if (!data.ISBN.trim()) {
//     setError("ISBN", "ISBN number is required.");
//   } else if (data.ISBN.length !== 10 && data.ISBN.length !== 13) {
//     setError("ISBN", "ISBN must be exactly 10 or 13 digits.");
//   } else {
//     setError("ISBN", "");
//   }

//   if (!data.publicationDate) {
//     setError("publicationDate", "Publication date is required.");
//   } else if (new Date(data.publicationDate) > new Date()) {
//     setError("publicationDate", "Publication date cannot be in the future.");
//   } else {
//     setError("publicationDate", "");
//   }

//   setError("genre", !data.genre ? "Please select a genre." : "");

//   return isValid;
// };

// const render = () => {
//   const total = books.length;

//   const avgAge = total ? Math.round(books.reduce((sum, b) => sum + getBookAge(b.publicationDate), 0) / total) : 0;

//   let topGenre = "-";
//   if (total > 0) {
//     const counts = {};
//     books.forEach(b => counts[b.genre] = (counts[b.genre] || 0) + 1);
//     topGenre = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
//   }

//   document.getElementById("stat-total").textContent = total;
//   document.getElementById("stat-avg-age").textContent = `${avgAge} yrs`;
//   document.getElementById("stat-top-genre").textContent = topGenre;

//   const searchVal = searchInput.value.toLowerCase().trim();
//   const genreFilter = filterGenre.value;
//   const sortVal = sortBy.value;

//   let filtered = books.filter(b => {
//     const matchSearch = b.title.toLowerCase().includes(searchVal) ||
//                         b.author.toLowerCase().includes(searchVal) ||
//                         b.ISBN.includes(searchVal);
//     const matchGenre = genreFilter === "All" || b.genre === genreFilter;
//     return matchSearch && matchGenre;
//   });

//   filtered.sort((a, b) => {
//     if (sortVal === "title") return a.title.localeCompare(b.title);
//     if (sortVal === "age-asc") return getBookAge(a.publicationDate) - getBookAge(b.publicationDate);
//     if (sortVal === "age-desc") return getBookAge(b.publicationDate) - getBookAge(a.publicationDate);
//     return new Date(b.dateAdded) - new Date(a.dateAdded);
//   });

//   booksGrid.innerHTML = "";
//   const noBooksView = document.getElementById("noBooksView");
//   document.getElementById("collection-count").textContent = `${filtered.length} book${filtered.length === 1 ? '' : 's'}`;

//   if (filtered.length === 0) {
//     booksGrid.style.display = "none";
//     noBooksView.style.display = "flex";
//   } else {
//     booksGrid.style.display = "grid";
//     noBooksView.style.display = "none";

//     filtered.forEach(b => {
//       const card = document.createElement("div");
//       card.className = "book-card";
//       card.innerHTML = `
//         <div class="book-card-header">
//           <span class="book-genre-pill genre-${b.genre.toLowerCase().replace(" ", "-")}">${b.genre}</span>
//           <span class="book-age-pill">${getBookAge(b.publicationDate)} yrs old</span>
//         </div>
//         <h4 class="book-title" title="${b.title}">${b.title}</h4>
//         <p class="book-author">by ${b.author}</p>
//         <div class="book-details">
//           <div class="detail-item">
//             <span class="detail-label">ISBN:</span>
//             <span class="detail-value">${b.ISBN}</span>
//           </div>
//           <div class="detail-item">
//             <span class="detail-label">Published:</span>
//             <span class="detail-value">${b.publicationDate}</span>
//           </div>
//         </div>
//         <div class="book-actions">
//           <button class="btn-icon btn-edit" onclick="editBook('${b.id}')" title="Edit book">📝</button>
//           <button class="btn-icon btn-delete" onclick="deleteBook('${b.id}')" title="Delete book">🚮</button>
//         </div>
//       `;
//       booksGrid.appendChild(card);
//     });
//   }
// };

// form.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const formData = {
//     title: document.getElementById("title").value,
//     author: document.getElementById("author").value,
//     ISBN: document.getElementById("ISBN").value,
//     publicationDate: document.getElementById("publicationDate").value,
//     genre: document.getElementById("genre").value,
//   };

//   if (!validateForm(formData)) return;

//   if (editId) {
//     const idx = books.findIndex(b => b.id === editId);
//     books[idx] = { ...books[idx], ...formData };
//     showToast(`Updated "${formData.title}" successfully.`);
//     resetForm();
//   } else {
//     const newBook = {
//       id: Date.now().toString(),
//       ...formData,
//       dateAdded: new Date().toISOString()
//     };
//     books.push(newBook);
//     showToast(`Added "${formData.title}" successfully.`);
//     form.reset();
//   }

//   saveBooks();
//   render();
// });

// window.editBook = (id) => {
//   const book = books.find(b => b.id === id);
//   if (!book) return;

//   editId = id;
//   document.getElementById("title").value = book.title;
//   document.getElementById("author").value = book.author;
//   document.getElementById("ISBN").value = book.ISBN;
//   document.getElementById("publicationDate").value = book.publicationDate;
//   document.getElementById("genre").value = book.genre;

//   document.getElementById("formTitle").textContent = "Edit Book Details";
//   document.getElementById("submitBtn").textContent = "Update Book";
//   document.getElementById("cancelBtn").style.display = "block";

//   clearErrors();
//   window.scrollTo({ top: 0, behavior: "smooth" });
// };

// window.deleteBook = (id) => {
//   const book = books.find(b => b.id === id);
//   if (!book) return;

//   if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
//     books = books.filter(b => b.id !== id);
//     saveBooks();
//     render();
//     showToast(`Removed "${book.title}".`, true);
//     if (editId === id) resetForm();
//   }
// };

// const clearErrors = () => {
//   form.querySelectorAll("input, select").forEach(input => {
//     input.classList.remove("is-invalid");
//     const errorEl = document.getElementById(`error-${input.id}`);
//     if (errorEl) errorEl.textContent = "";
//   });
// };

// const resetForm = () => {
//   editId = null;
//   form.reset();
//   document.getElementById("formTitle").textContent = "Add New Book";
//   document.getElementById("submitBtn").textContent = "Add Book";
//   document.getElementById("cancelBtn").style.display = "none";
//   clearErrors();
// };

// document.getElementById("cancelBtn").addEventListener("click", resetForm);
// searchInput.addEventListener("input", render);
// filterGenre.addEventListener("change", render);
// sortBy.addEventListener("change", render);

// render();

let books = [];
let editIndex = -1;

const form = document.getElementById("Bookform");
const booksGrid = document.getElementById("booksGrid");
const searchInput = document.getElementById("searchInput");
const filterGenre = document.getElementById("filterGenre");
const sortBy = document.getElementById("sortBy");

function getBookAge(publicationDate) {
  let currentYear = new Date().getFullYear();
  let bookYear = new Date(publicationDate).getFullYear();

  return currentYear - bookYear;
}

function validateForm(book) {
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
  if (isNaN(book.ISBN)) {
    alert("ISBN must contain only numbers");
    return false;
  }

  if (book.ISBN.length !== 10) {
    alert("ISBN number must be exactly 10 digits");
    return false;
  }

  return true;
}

function displayBooks() {
  booksGrid.innerHTML = "";

  let searchValue = searchInput.value.toLowerCase();
  let selectedGenre = filterGenre.value;
  let booksToShow = [...books];

  if (sortBy.value === "dateAdded") {
    booksToShow.reverse();
  }

  for (let i = 0; i < booksToShow.length; i++) {
    
    if (
      !booksToShow[i].title.toLowerCase().includes(searchValue) &&
      !booksToShow[i].author.toLowerCase().includes(searchValue) &&
      !booksToShow[i].ISBN.includes(searchValue)
    ) {
      continue;
    }
    if (selectedGenre !== "All" && booksToShow[i].genre !== selectedGenre) {
      
      continue;
    }
    if (sortBy.value === "title") {
      booksToShow.sort(function (a, b) {
        return a.title.localeCompare(b.title); 
      });
    }

    if (sortBy.value === "age-asc") {
      booksToShow.sort(function (a, b) {
        return getBookAge(a.publicationDate) - getBookAge(b.publicationDate);
      });
    }

    if (sortBy.value === "age-desc") {
      booksToShow.sort(function (a, b) {
        return getBookAge(b.publicationDate) - getBookAge(a.publicationDate);
      });
    }

    let age = getBookAge(booksToShow[i].publicationDate);

    booksGrid.innerHTML += `
      <div class="book-card">
        <h3>${booksToShow[i].title}</h3>
        <p>Author: ${booksToShow[i].author}</p>
        <p>ISBN: ${booksToShow[i].ISBN}</p>
        <p>Genre: ${booksToShow[i].genre}</p>
        <p>Book Age: ${age} Years</p>

        <button class ="btnclass" onclick="editBook(${i})">
          ✍️
        </button>

        <button class = "btnclass1" onclick="deleteBook(${i})">
          🗑️
        </button>
      </div>
    `;
  }

  let noBooksView = document.getElementById("noBooksView");

  if (books.length === 0) {
    noBooksView.style.display = "block";
  } else { 
    noBooksView.style.display = "none";
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let book = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    ISBN: document.getElementById("ISBN").value,
    publicationDate: document.getElementById("publicationDate").value,
    genre: document.getElementById("genre").value,
  };

  if (!validateForm(book)) { 
    return;
  }

  let confirmAdd = confirm(`Do you want to add ${book.title}`);

  if (!confirmAdd) {
    return;
  }

  if (editIndex === -1) {
    books.push(book);
  } else {
    books[editIndex] = book;  
    editIndex = -1;
  }

  form.reset();
  displayBooks();
  updateTotalBooks();
  updateCollectionCount();
  updateTopGenre();
  updateAverageAge();
});

function editBook(index) {
  let book = books[index];

  document.getElementById("title").value = book.title;
  document.getElementById("author").value = book.author;
  document.getElementById("ISBN").value = book.ISBN;
  document.getElementById("publicationDate").value = book.publicationDate;
  document.getElementById("genre").value = book.genre;

  editIndex = index;
}

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
function updateTotalBooks() {
  document.getElementById("stat-total").textContent = books.length;
}
function updateTopGenre() {
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
  document.getElementById("collection-count").textContent =
    books.length + " books";
}

displayBooks();
updateTotalBooks();
updateCollectionCount();
updateTopGenre();
updateAverageAge();

searchInput.addEventListener("input", function () {
  displayBooks();
});
filterGenre.addEventListener("change", function () {
  displayBooks();
});
sortBy.addEventListener("change", function () {
  displayBooks();
});
