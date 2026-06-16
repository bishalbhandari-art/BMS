let books = [];
let editIndex = -1;

const form = document.getElementById("Bookform");
const booksGrid = document.getElementById("booksGrid");
const searchInput = document.getElementById("searchInput");
const filterGenre = document.getElementById("filterGenre");
const sortBy = document.getElementById("sortBy");
const saveBookToServer = (bookData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      
      const isSuccessful = Math.random() > 0.1; 
      if (isSuccessful) {
        resolve({ status: 200, message: "Server: Action synchronized successfully!", data: bookData });
      } else {
        reject(new Error("Network Error: Connection timed out. Could not reach server."));
      }
    }, 1200); 
  });
};
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

form.addEventListener("submit", async function (e) {
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
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.textContent : "Submit";
  if(submitBtn) {
    submitBtn.textContent = "Connecting to server...";
    submitBtn.disabled = true;
  }
  try {
    
    await saveBookToServer(book);
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
}catch(error){
  console.error(error);
  alert(`${error.message} - your changes were not saved locally`);
}finally{
  if (submitBtn) {
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
  }
}});

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
function updateAllStats(){
displayBooks();
updateTotalBooks();
updateCollectionCount();
updateTopGenre();
updateAverageAge();
}
async function fetchInitialBooks() {
  try {
    
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=4");
    
    if (!response.ok) {
      throw new Error(`HTTP network error! Status: ${response.status}`);
    }
    
    const apiData = await response.json();

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
    genre: bookGenre
  };

  books.push(newBook);
}
    updateAllStats();
    
  } catch (error) {
    console.error("Failed to load initial API context:", error);
    alert("⚠️ Could not load remote startup books. Initializing with empty system.");
    updateAllStats();
  }
}

searchInput.addEventListener("input", function () {
  displayBooks();
});
filterGenre.addEventListener("change", function () {
  displayBooks();
});
sortBy.addEventListener("change", function () {
  displayBooks();
});

window.addEventListener("DOMContentLoaded", fetchInitialBooks);