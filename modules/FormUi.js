import { systemDB, editIndex, setEditIndex } from "../index.js";
// // Validate user input before saving
export default class FormUI {
  // Static validation method for book inputs
  static validate(book) {
    let isValid = true;
    if (book.title === "") {
      const errEl = document.getElementById("error-title");
      if (errEl) errEl.textContent = "*Title is required";
      isValid = false;
    }
    if (book.author === "") {
      const errEl = document.getElementById("error-author");
      if (errEl) errEl.textContent = "*Author is required";
      isValid = false;
    }
    if (book.ISBN === "") {
      const errEl = document.getElementById("error-ISBN");
      if (errEl) errEl.textContent = "*ISBN is required";
      isValid = false;
    } else if (isNaN(book.ISBN) || book.ISBN.trim().length !== 10) {
      const errEl = document.getElementById("error-ISBN");
      if (errEl) errEl.textContent = "* ISBN muist be 10 digits";
      isValid = false;
    }
    if (book.publicationDate === "") {
      const errEl = document.getElementById("error-publicationDate");
      if (errEl) errEl.textContent = "*Date is required";
      isValid = false;
    }
    if (book.genre === "") {
      const errEl = document.getElementById("error-genre");
      if (errEl) errEl.textContent = "*Select a genre";
      isValid = false;
    }
    return isValid;
  }
  static reset() {
    const form =
      document.getElementById("Bookform")
    if (form) form.reset();

    // FIXED: Use setter function instead of reassigning imported variable
    setEditIndex(-1);
    const titleEl = document.getElementById("formTitle");
    const subEl = document.getElementById("formSubtitle");
    if (titleEl) titleEl.textContent = "Add New Book";
    if (subEl)
      subEl.textContent = "Enter details below to add to your collection.";

    const submitBtn = document.querySelector("#submitBtn");
    if (submitBtn) {
      const target = submitBtn.querySelector("span") || submitBtn;
      target.textContent = "Add Book";
    }
    const cancelBtn = document.getElementById("cancelBtn");
    if (cancelBtn) cancelBtn.style.display = "none";
  }
  // Populates form fields with selected book data for "Edit Mode"
  static populateForEdit(index) {
    let book = systemDB.books[index];
    if (!book) return;
    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const ISBNInput = document.getElementById("ISBN");
    const pubDateInput = document.getElementById("publicationDate");
    const genreInput = document.getElementById("genre");

    if (titleInput) titleInput.value = book.title;
    if (authorInput) authorInput.value = book.author;
    if (ISBNInput) ISBNInput.value = book.ISBN;
    if (pubDateInput) pubDateInput.value = book.publicationDate;
    if (genreInput) genreInput.value = book.genre;
    setEditIndex(index);
    const titleEl = document.getElementById("formTitle");
    const subEl = document.getElementById("formSubtitle");

    if (titleEl) titleEl.textContent = "Edit Book";
    if (subEl) subEl.textContent = "Modify the details of your book below.";

    const submitBtn = document.querySelector("#submitBtn");
    if (submitBtn) {
      const target = submitBtn.querySelector("span") || submitBtn;
      target.textContent = "Update Book";
    }
    const cancelBtn = document.getElementById("cancelBtn");
    if (cancelBtn) cancelBtn.style.display = "block";
  }
}
