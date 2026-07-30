import { BaseBook } from "../models/book.js";
import { systemDB, setEditIndex } from "../main.js";

export default class FormUI {
  // Static validation method for book inputs
  static validate(book: BaseBook): boolean {
    let isValid: boolean = true;
    if (book.title === "") {
      const errEl = document.getElementById("error-title") as HTMLElement | null;
      if (errEl) errEl.textContent = "*Title is required";
      isValid = false;
    }
    if (book.author === "") {
      const errEl = document.getElementById("error-author") as HTMLElement | null;
      if (errEl) errEl.textContent = "*Author is required";
      isValid = false;
    }
    const isbnVal: string = (book.ISBN || book.isbn || "").trim();
    const errIsbnEl = document.getElementById("error-ISBN") as HTMLElement | null;
    const isNumeric: boolean = isbnVal.length > 0 && isbnVal.split("").every((char) => char >= "0" && char <= "9");

    if (isbnVal === "") {
      if (errIsbnEl) errIsbnEl.textContent = "*ISBN is required";
      isValid = false;
    } else if (!isNumeric) {
      if (errIsbnEl) errIsbnEl.textContent = "* ISBN must contain numbers only";
      isValid = false;
    } else if (isbnVal.length !== 10 && isbnVal.length !== 13) {
      if (errIsbnEl) errIsbnEl.textContent = "* ISBN must be 10 or 13 digits";
      isValid = false;
    }
    if (book.publicationDate === "") {
      const errEl = document.getElementById("error-publicationDate") as HTMLElement | null;
      if (errEl) errEl.textContent = "*Date is required";
      isValid = false;
    } else if (new Date(book.publicationDate) > new Date()) {
      const errEl = document.getElementById("error-publicationDate") as HTMLElement | null;
      if (errEl) errEl.textContent = "* Publication date cannot be in the future.";
      isValid = false;
    }
    if (book.genre === "") {
      const errEl = document.getElementById("error-genre") as HTMLElement | null;
      if (errEl) errEl.textContent = "*Select a genre";
      isValid = false;
    }
    return isValid;
  }

  static reset(): void {
    const form = document.getElementById("Bookform") as HTMLFormElement | null;
    if (form) form.reset();

    // FIXED: Use setter function instead of reassigning imported variable
    setEditIndex(-1);
    const titleEl = document.getElementById("formTitle") as HTMLElement | null;
    const subEl = document.getElementById("formSubtitle") as HTMLElement | null;
    if (titleEl) titleEl.textContent = "Add New Book";
    if (subEl)
      subEl.textContent = "Enter details below to add to your collection.";

    const submitBtn = document.querySelector("#submitBtn") as HTMLButtonElement | null;
    if (submitBtn) {
      const target = (submitBtn.querySelector("span") || submitBtn) as HTMLElement;
      target.textContent = "Add Book";
    }
    const cancelBtn = document.getElementById("cancelBtn") as HTMLElement | null;
    if (cancelBtn) cancelBtn.style.display = "none";
  }

  // Populates form fields with selected book data for "Edit Mode"
  static populateForEdit(index: number): void {
    let book = systemDB.books[index];
    if (!book) return;
    const titleInput = document.getElementById("title") as HTMLInputElement | null;
    const authorInput = document.getElementById("author") as HTMLInputElement | null;
    const ISBNInput = document.getElementById("ISBN") as HTMLInputElement | null;
    const pubDateInput = document.getElementById("publicationDate") as HTMLInputElement | null;
    const genreInput = document.getElementById("genre") as HTMLSelectElement | null;

    if (titleInput) titleInput.value = book.title;
    if (authorInput) authorInput.value = book.author;
    if (ISBNInput) ISBNInput.value = book.ISBN || book.isbn;
    if (pubDateInput) pubDateInput.value = book.publicationDate;
    if (genreInput) genreInput.value = book.genre;
    setEditIndex(index);
    const titleEl = document.getElementById("formTitle") as HTMLElement | null;
    const subEl = document.getElementById("formSubtitle") as HTMLElement | null;

    if (titleEl) titleEl.textContent = "Edit Book";
    if (subEl) subEl.textContent = "Modify the details of your book below.";

    const submitBtn = document.querySelector("#submitBtn") as HTMLButtonElement | null;
    if (submitBtn) {
      const target = (submitBtn.querySelector("span") || submitBtn) as HTMLElement;
      target.textContent = "Update Book";
    }
    const cancelBtn = document.getElementById("cancelBtn") as HTMLElement | null;
    if (cancelBtn) cancelBtn.style.display = "block";
  }
}
