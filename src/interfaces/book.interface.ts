import type { CategoryType } from "../types/bookTypes.js";

export type BookGenre = CategoryType | string;

// ISP: IBook is split into four small, focused interfaces

// Pure data shape — for storage and API mapping
export interface IBookData {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publicationDate: string;
  genre: BookGenre;
  price: number;
}

// Pricing behavior — for discount features
export interface IDiscountable {
  getDiscountedPrice(): number;
  get discountedPrice(): string;
}

// Time/age behavior — for age calculation
export interface IAgeable {
  getBookAge(): number;
  get bookAge(): number;
}

// Summary behavior — for display
export interface ISummarizable {
  getSummary(): string;
}

export interface IApiBook {
  title: string;
  author: string;
  isbn?: string;
  ISBN?: string;
  publicationdate?: string;
  publicationDate?: string;
  genre: string;
  price?: number;
  fileSizeMB?: number;
  weightInGrams?: number;
}

export interface ServerSyncResponse {
  status: number;
  message: string;
}
