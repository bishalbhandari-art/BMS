import type { BaseBook } from '../models/book.js';

// ISP: Small, focused interface for rendering only
export interface IRenderer {
  render(books: BaseBook[]): void;
}
