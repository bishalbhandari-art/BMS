import type { IStatsService } from "../interfaces/IStatsService.js";
import type { BaseBook } from "../models/book.js";

// SRP: Responsible only for calculating and displaying statistics
export class StatsService implements IStatsService {
  updateStats(books: BaseBook[]): void {
    this.updateTotal(books);
    this.calculateTopGenre(books);
    this.calculateAverageAge(books);
  }

  private updateTotal(books: BaseBook[]): void {
    const totalEl = document.getElementById("stat-total") as HTMLElement | null;
    if (totalEl) totalEl.textContent = books.length.toString();
  }

  private calculateTopGenre(books: BaseBook[]): void {
    const counts: Record<string, number> = {
      "Fiction": 0,
      "Non-Fiction": 0,
      "Science Fiction": 0,
      "Mystery": 0,
    };
    for (const b of books) {
      const current = counts[b.genre];
      if (current !== undefined) {
        counts[b.genre] = current + 1;
      }
    }
    let topGenre = "-";
    let max = 0;
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

  private calculateAverageAge(books: BaseBook[]): void {
    let totalAge = 0;
    for (const b of books) {
      totalAge += b.bookAge;
    }
    const avg = books.length > 0 ? Math.round(totalAge / books.length) : 0;
    const ageEl = document.getElementById("stat-avg-age") as HTMLElement | null;
    if (ageEl) ageEl.textContent = `${avg} yrs`;
  }
}
