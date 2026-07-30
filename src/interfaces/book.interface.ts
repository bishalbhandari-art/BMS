import type { CategoryType } from '../types/bookTypes';

export type BookGenre = CategoryType | string;

export interface IBook {
  id?: string;
  title: string;
  author: string;
  isbn: string;
  publicationDate: string;
  genre: BookGenre;
  price?: number;
  bookAge?: number;
  getSummary?(): string;
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
