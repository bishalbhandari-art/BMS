import type { BaseBook } from '../models/book.js';

// ISP: Small, focused interface for statistics updates only
export interface IStatsService {
  updateStats(books: BaseBook[]): void;
}
