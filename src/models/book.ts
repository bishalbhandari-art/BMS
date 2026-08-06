import type { IBookData, IDiscountable, IAgeable, ISummarizable, BookGenre } from "../interfaces/book.interface.js";

// LSP: BaseBook implements all split interfaces so EBook/PrintedBook
// are always substitutable wherever BaseBook is expected
export class BaseBook implements IBookData, IDiscountable, IAgeable, ISummarizable {
  public id: string;
  public title: string;
  public author: string;
  public isbn: string; // LSP fix: single standardized property (no duplicate ISBN)
  public publicationDate: string;
  public genre: BookGenre;
  public price: number;

  constructor(
    title: string,
    author: string,
    isbn: string,
    publicationDate: string,
    genre: BookGenre,
    price: number = 20,
    id?: string
  ) {
    this.id = id || String(Date.now() + Math.random());
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.publicationDate = publicationDate;
    this.genre = genre;
    this.price = price;
  }

  getDiscountedPrice(): number {
    return this.price * 0.9;
  }

  get discountedPrice(): string {
    return this.getDiscountedPrice().toFixed(0);
  }

  // Dynamic computation of book age
  getBookAge(): number {
    const pubDate = new Date(this.publicationDate);
    const bookYear = pubDate.getFullYear();
    if (isNaN(bookYear)) return 0;
    const currentYear: number = new Date().getFullYear();
    return Math.max(0, currentYear - bookYear);
  }

  get bookAge(): number {
    return this.getBookAge();
  }

  getSummary(): string {
    return `"${this.title}" by ${this.author}`;
  }
}

export class EBook extends BaseBook {
  public fileSizeMB?: number | undefined;

  constructor(
    title: string,
    author: string,
    isbn: string,
    publicationDate: string,
    genre: BookGenre,
    price: number = 20,
    fileSizeMB?: number,
    id?: string
  ) {
    super(title, author, isbn, publicationDate, genre, price, id);
    if (fileSizeMB !== undefined) {
      this.fileSizeMB = fileSizeMB;
    }
  }

  getFileSizeInMB(): number | undefined {
    return this.fileSizeMB;
  }
}

export class PrintedBook extends BaseBook {
  public weightInGrams?: number | undefined;

  constructor(
    title: string,
    author: string,
    isbn: string,
    publicationDate: string,
    genre: BookGenre,
    price: number = 20,
    weightInGrams?: number,
    id?: string
  ) {
    super(title, author, isbn, publicationDate, genre, price, id);
    if (weightInGrams !== undefined) {
      this.weightInGrams = weightInGrams;
    }
  }

  getWeightInGrams(): number | undefined {
    return this.weightInGrams;
  }
}

