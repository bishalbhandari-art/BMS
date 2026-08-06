import { API_URL } from "../main.js";
import { BaseBook } from "../models/book.js";
import type { IApiBook, ServerSyncResponse } from "../interfaces/book.interface.js";
import type { IRenderer } from "../interfaces/IRenderer.js";
import type { IStatsService } from "../interfaces/IStatsService.js";
import { LogAction } from "../decorator/logDecorator.js";
import { BookFactory } from "../factories/BookFactory.js";

// SRP: Responsible for CRUD operations and API sync only
// DIP: Depends on IRenderer and IStatsService abstractions via constructor injection
export class BookManager {
  public books: BaseBook[];
  private renderer: IRenderer;
  private statsService: IStatsService;

  constructor(renderer: IRenderer, statsService: IStatsService) {
    this.books = [];
    this.renderer = renderer;
    this.statsService = statsService;
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
      this.books = [];

      for (const apiBook of apiData) {
        // OCP: BookFactory handles book type creation — no hardcoded genre checks here
        const newBook = BookFactory.create(apiBook);
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
    // DIP: Calls abstractions — not concrete AppDOM or calculateTopGenre directly
    this.renderer.render(this.books);
    this.statsService.updateStats(this.books);
  }
}

