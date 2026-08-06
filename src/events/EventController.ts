import type { BookManager } from "../manages/BookManager.js";
import FormUI from "../services/FormUi.js";
import { EBook, PrintedBook } from "../models/book.js";
import { BookFactory } from "../factories/BookFactory.js";

// SRP: Responsible only for wiring all UI event listeners
export class EventController {
  private editIndex: number = -1; // Tracks which book is being edited
  private db: BookManager;
  private formUI: FormUI;

  constructor(db: BookManager, formUI: FormUI) {
    this.db = db;
    this.formUI = formUI;
    this.registerEvents();
  }

  private registerEvents(): void {
    this.setupFormSubmit();
    this.setupGridActions();
    this.setupFilters();
    this.setupCancelBtn();
    this.setupValidationResetTriggers();
  }

  private setupFormSubmit(): void {
    const bookForm = document.getElementById("Bookform") as HTMLFormElement | null;
    if (!bookForm) return;

    bookForm.addEventListener("submit", async (e: SubmitEvent) => {
      e.preventDefault();

      const titleInput = document.getElementById("title") as HTMLInputElement;
      const authorInput = document.getElementById("author") as HTMLInputElement;
      const isbnInput = document.getElementById("ISBN") as HTMLInputElement;
      const pubDateInput = document.getElementById("publicationDate") as HTMLInputElement;
      const genreSelect = document.getElementById("genre") as HTMLSelectElement;

      const title = titleInput.value.trim();
      const author = authorInput.value.trim();
      const isbn = isbnInput.value.trim();
      const pubDate = pubDateInput.value;
      const genre = genreSelect.value;
      const randomPrice: number = Math.floor(Math.random() * 51) + 10;

      // OCP: BookFactory handles book type creation
      const book = BookFactory.createFromForm(title, author, isbn, pubDate, genre, randomPrice);

      if (!this.formUI.validate(book)) return;

      const confirmMsg: string =
        this.editIndex === -1
          ? `Do you want to add "${book.title}"?`
          : `Do you want to update "${book.title}"?`;
      if (!confirm(confirmMsg)) return;

      const submitBtn = document.querySelector("#submitBtn") as HTMLButtonElement | null;
      if (!submitBtn) return;

      const target = (submitBtn.querySelector("span") || submitBtn) as HTMLElement;
      const originalText: string = target.textContent || "";

      target.textContent = "Connecting to server...";
      submitBtn.disabled = true;

      try {
        await this.db.saveToServer(book);
        if (this.editIndex === -1) {
          this.db.books.push(book);
        } else {
          const existingBook = this.db.books[this.editIndex];
          if (existingBook) {
            book.id = existingBook.id;
            book.price = existingBook.price;
            if (book instanceof EBook && existingBook instanceof EBook) {
              book.fileSizeMB = existingBook.fileSizeMB;
            } else if (book instanceof PrintedBook && existingBook instanceof PrintedBook) {
              book.weightInGrams = existingBook.weightInGrams;
            }
          }
          this.db.books[this.editIndex] = book;
        }
        this.editIndex = -1;
        this.formUI.reset();
        this.db.updateAllStats();
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "An unexpected error occurred.";
        alert(`${msg} - Changes could not be saved.`);
      } finally {
        target.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  private setupGridActions(): void {
    const booksGrid = document.getElementById("booksGrid") as HTMLElement | null;
    if (!booksGrid) return;

    booksGrid.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const targetBtn = target.closest("button") as HTMLButtonElement | null;
      if (!targetBtn) return;

      const bookId = targetBtn.getAttribute("data-id");
      if (!bookId) return;

      const targetIndex = this.db.books.findIndex((b) => b.id === bookId);
      if (targetIndex === -1) return;

      if (targetBtn.classList.contains("edit-action-btn")) {
        this.editIndex = targetIndex;
        this.formUI.populateForEdit(targetIndex, this.db.books);
      } else if (targetBtn.classList.contains("delete-action-btn")) {
        const selectedBook = this.db.books[targetIndex];
        if (selectedBook && confirm(`Do you want to delete "${selectedBook.title}"?`)) {
          if (this.editIndex === targetIndex) {
            this.editIndex = -1;
            this.formUI.reset();
          }
          this.db.books.splice(targetIndex, 1);
          this.db.updateAllStats();
        }
      }
    });
  }

  private setupFilters(): void {
    const searchInput = document.getElementById("searchInput") as HTMLInputElement | null;
    if (searchInput) {
      searchInput.addEventListener("input", () => this.db.updateAllStats());
    }

    const filterGenre = document.getElementById("filterGenre") as HTMLSelectElement | null;
    if (filterGenre) {
      filterGenre.addEventListener("change", () => this.db.updateAllStats());
    }

    const sortBy = document.getElementById("sortBy") as HTMLSelectElement | null;
    if (sortBy) {
      sortBy.addEventListener("change", () => this.db.updateAllStats());
    }
  }

  private setupCancelBtn(): void {
    const cancelBtn = document.getElementById("cancelBtn") as HTMLButtonElement | null;
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        this.editIndex = -1;
        this.formUI.reset();
      });
    }
  }

  // Real-time Input Validation Reset Triggers
  private setupValidationResetTriggers(): void {
    ["title", "author", "ISBN", "publicationDate"].forEach((id: string) => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (el) {
        el.addEventListener("input", () => {
          const errEl = document.getElementById(`error-${id}`) as HTMLElement | null;
          if (errEl) errEl.textContent = "";
        });
      }
    });

    const genreEl = document.getElementById("genre") as HTMLSelectElement | null;
    if (genreEl) {
      genreEl.addEventListener("change", () => {
        const errEl = document.getElementById("error-genre") as HTMLElement | null;
        if (errEl) errEl.textContent = "";
      });
    }
  }
}
