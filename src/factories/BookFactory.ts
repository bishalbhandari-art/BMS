import { BaseBook, EBook, PrintedBook } from "../models/book.js";
import type { IApiBook } from "../interfaces/book.interface.js";

// OCP: Factory for creating book instances based on genre.
// Creates EBook for Science Fiction/Mystery genres, PrintedBook for all others.
// Supports creation from both API data (create) and form input (createFromForm).
export class BookFactory {
  static create(data: IApiBook, id?: string): BaseBook {
    const title = data.title;
    const author = data.author;
    const isbn = data.isbn || data.ISBN || "";
    const pubDate = data.publicationdate || data.publicationDate || "";
    const genre = data.genre;
    const price = data.price || Math.floor(Math.random() * 51) + 10;

    if (genre === "Science Fiction" || genre === "Mystery") {
      return new EBook(title, author, isbn, pubDate, genre, price, data.fileSizeMB || 3.5, id);
    }
    return new PrintedBook(title, author, isbn, pubDate, genre, price, data.weightInGrams || 500, id);
  }

  static createFromForm(
    title: string,
    author: string,
    isbn: string,
    pubDate: string,
    genre: string,
    price: number
  ): BaseBook {
    if (genre === "Science Fiction" || genre === "Mystery") {
      return new EBook(title, author, isbn, pubDate, genre, price);
    }
    return new PrintedBook(title, author, isbn, pubDate, genre, price);
  }
}
