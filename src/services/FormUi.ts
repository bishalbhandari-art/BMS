import type { BaseBook } from "../models/book.js";
import type { IBookValidator } from "../interfaces/IBookValidator.js";

// SRP: Responsible only for form DOM operations (populate/reset/display errors)
// DIP: Depends on IBookValidator abstraction injected via constructor
export default class FormUI {
  private validator: IBookValidator;

  constructor(validator: IBookValidator) {
    this.validator = validator;
  }

  validate(book: BaseBook): boolean {
    const result = this.validator.validate(book);
    // Display validation errors in DOM
    for (const [field, msg] of Object.entries(result.errors)) {
      const errEl = document.getElementById(`error-${field}`) as HTMLElement | null;
      if (errEl) errEl.textContent = msg;
    }
    return result.isValid;
  }

  reset(): void {
    const form = document.getElementById("Bookform") as HTMLFormElement | null;
    if (form) form.reset();

    const titleEl = document.getElementById("formTitle") as HTMLElement | null;
    const subEl = document.getElementById("formSubtitle") as HTMLElement | null;
    if (titleEl) titleEl.textContent = "Add New Book";
    if (subEl) subEl.textContent = "Enter details below to add to your collection.";

    const submitBtn = document.querySelector("#submitBtn") as HTMLButtonElement | null;
    if (submitBtn) {
      const target = (submitBtn.querySelector("span") || submitBtn) as HTMLElement;
      target.textContent = "Add Book";
    }
    const cancelBtn = document.getElementById("cancelBtn") as HTMLElement | null;
    if (cancelBtn) cancelBtn.style.display = "none";
  }

  // Populates form fields with selected book data for "Edit Mode"
  populateForEdit(index: number, books: BaseBook[]): void {
    const book = books[index];
    if (!book) return;

    const titleInput = document.getElementById("title") as HTMLInputElement | null;
    const authorInput = document.getElementById("author") as HTMLInputElement | null;
    const ISBNInput = document.getElementById("ISBN") as HTMLInputElement | null;
    const pubDateInput = document.getElementById("publicationDate") as HTMLInputElement | null;
    const genreInput = document.getElementById("genre") as HTMLSelectElement | null;

    if (titleInput) titleInput.value = book.title;
    if (authorInput) authorInput.value = book.author;
    if (ISBNInput) ISBNInput.value = book.isbn; // LSP fix: standardized isbn
    if (pubDateInput) pubDateInput.value = book.publicationDate;
    if (genreInput) genreInput.value = book.genre;

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
