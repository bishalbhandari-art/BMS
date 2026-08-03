import { API_URL } from "./modules/configUrl.js";
import FormUI from "./modules/FormUi.js";
import AppDOM from "./modules/AppDOM.js";
import { BaseBook, EBook, PrintedBook } from "./modules/book.js";
// Tracks which book is being edited
export let editIndex = -1;
export function setEditIndex(val) {
  editIndex = val;
}
class BookManager {
  constructor() {
    this.books = [];
  }
  async saveToServer(bookData) {
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
  async fetchInitialBooks() {
    const loadingMessage = document.getElementById("loadingMessage");
    try {
      if (loadingMessage) loadingMessage.style.display = "block";

      await new Promise((r) => setTimeout(r, 1500));
      const response = await fetch(API_URL.baseUrl);
      if (!response.ok) throw new Error(`HTTP Status: ${response.status}`);

      const apiData = await response.json();
      this.books = []; // Clear current references

      for (let i = 0; i < apiData.length; i++) {
        let apiBook = apiData[i];
        const title = apiBook.title;
        const author = apiBook.author;
        const isbn = apiBook.isbn || apiBook.ISBN;
        const pubDate = apiBook.publicationdate || apiBook.publicationDate;
        const genre = apiBook.genre;

        let newBook =
          genre === "Science Fiction" || genre === "Mystery"
            ? new EBook(title, author, isbn, pubDate, genre, apiBook.fileSizeMB || 3.5)
            : new PrintedBook(title, author, isbn, pubDate, genre, apiBook.weightInGrams || 500);
        this.books.push(newBook);
      }
      if (loadingMessage) loadingMessage.style.display = "none";
      this.updateAllStats();
    } catch (error) {
      console.error("Failed to load startup books:", error);
      alert("⚠️ Remote sync failed. Initializing empty collection.");
      if (loadingMessage)loadingMessage.style.display = "none";
      this.updateAllStats();
    }
  }
  updateAllStats() {
    AppDOM.renderGrid(this.books);
    const totalEl = document.getElementById("stat-total");

    if (totalEl) totalEl.textContent = this.books.length;

    this.calculateTopGenre();
    this.calculateAverageAge();
  }
  calculateTopGenre() {
    let counts = {
      "Fiction": 0,
      "Non-Fiction": 0,
      "Science Fiction": 0,
      "Mystery": 0,
    };
    for (let b of this.books) {
      if (counts[b.genre] !== undefined) counts[b.genre]++;
    }
    let topGenre = "-";
    let max = 0;
    for (let key in counts) {
      if (counts[key] > max) {
        max = counts[key];
        topGenre = key;
      }
    }
    const genreEl = document.getElementById("stat-top-genre");
    if (genreEl) genreEl.textContent = topGenre;
  }
  calculateAverageAge() {
    let totalAge = 0;
    for (let b of this.books) {
      totalAge += b.bookAge;
    }
    let avg =
      this.books.length > 0 ? Math.round(totalAge / this.books.length) : 0;
    const ageEl = document.getElementById("stat-avg-age");
    if (ageEl) ageEl.textContent = `${avg} yrs`;
  }
}
// Instantiate Global Database Manager
export const systemDB = new BookManager();
window.addEventListener("DOMContentLoaded", () => {
  systemDB.fetchInitialBooks();
});
