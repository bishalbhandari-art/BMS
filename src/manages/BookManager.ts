import { API_URL } from "../main.js";
import AppDOM from "../services/AppDOM.js";
import { BaseBook, EBook, PrintedBook } from "../models/book.js";
import type { IApiBook, ServerSyncResponse } from "../interfaces/book.interface.js";
import { LogAction } from "../decorator/logDecorator.js";

export class BookManager {
  public books: BaseBook[];

  constructor() {
    this.books = [];
  }

  @LogAction
  async saveToServer<T>(_bookData: T): Promise<ServerSyncResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve({ status: 200, message: "Synchronized successfully!" });
        } else {
          reject(new Error("Network Error: Connection timed out."));
        }
      }, 1200);
    });
  }

  async fetchInitialBooks(): Promise<void> {
    const loadingMessage = document.getElementById("loadingMessage") as HTMLElement | null;
    try {
      if (loadingMessage) loadingMessage.style.display = "block";

      await new Promise<void>((r) => setTimeout(r, 1500));
      const response = await fetch(API_URL.baseUrl);
      if (!response.ok) throw new Error(`HTTP Status: ${response.status}`);

      const apiData: IApiBook[] = await response.json();
      this.books = []; // Clear current references

      for (let i = 0; i < apiData.length; i++) {
        let apiBook: IApiBook = apiData[i]!;
        const title: string = apiBook.title;
        const author: string = apiBook.author;
        const isbn: string = apiBook.isbn || apiBook.ISBN || "";
        const pubDate: string = apiBook.publicationdate || apiBook.publicationDate || "";
        const genre: string = apiBook.genre;
        const bookPrice: number = apiBook.price || Math.floor(Math.random() * 51) + 10;

        let newBook: BaseBook =
          genre === "Science Fiction" || genre === "Mystery"
            ? new EBook(title, author, isbn, pubDate, genre, bookPrice, apiBook.fileSizeMB || 3.5)
            : new PrintedBook(title, author, isbn, pubDate, genre, bookPrice, apiBook.weightInGrams || 500);
        this.books.push(newBook);
      }
      if (loadingMessage) loadingMessage.style.display = "none";
      this.updateAllStats();
    } catch (error) {
      console.error("Failed to load startup books:", error);
      alert("⚠️ Remote sync failed. Initializing empty collection.");
      if (loadingMessage) loadingMessage.style.display = "none";
      this.updateAllStats();
    }
  }

  updateAllStats(): void {
    AppDOM.renderGrid(this.books);
    const totalEl = document.getElementById("stat-total") as HTMLElement | null;
    const countEl = document.getElementById("collection-count") as HTMLElement | null;

    if (totalEl) totalEl.textContent = this.books.length.toString();
    if (countEl) countEl.textContent = `${this.books.length} books`;

    this.calculateTopGenre();
    this.calculateAverageAge();
  }

  calculateTopGenre(): void {
    let counts: Record<string, number> = {
      "Fiction": 0,
      "Non-Fiction": 0,
      "Science Fiction": 0,
      "Mystery": 0,
    };
    for (let b of this.books) {
      const current = counts[b.genre];
      if (current !== undefined) {
        counts[b.genre] = current + 1;
      }
    }
    let topGenre: string = "-";
    let max: number = 0;
    for (const key of Object.keys(counts)) {
      const count = counts[key]!;
      if (count > max) {
        max = count;
        topGenre = key;
      }
    }
    const genreEl = document.getElementById("stat-top-genre") as HTMLElement | null;
    if (genreEl) genreEl.textContent = topGenre;
  }

  calculateAverageAge(): void {
    let totalAge: number = 0;
    for (let b of this.books) {
      totalAge += b.bookAge;
    }
    let avg: number =
      this.books.length > 0 ? Math.round(totalAge / this.books.length) : 0;
    const ageEl = document.getElementById("stat-avg-age") as HTMLElement | null;
    if (ageEl) ageEl.textContent = `${avg} yrs`;
  }
}
