// models/Book.js
export class BaseBook{
  constructor(title, author, ISBN, publicationDate, genre, price) {
    this.title = title;
    this.author = author;
    this.ISBN = ISBN;
    this.publicationDate = publicationDate;
    this.genre = genre;
    this.price = Math.floor(Math.random() * 51) + 10;
    this.id = String(Date.now()+(Math.random()));
    this.bookAge = this.getBookAge();
  }

  getDiscountedPrice() {
    return this.price * 0.9;
  }
  get discountedPrice() {
    return this.getDiscountedPrice().toFixed(0);
  }

  // Business logic method to calculate book age
  getBookAge() {
    const pubDate = new Date(this.publicationDate);
    const bookYear = pubDate.getFullYear();
    if (isNaN(bookYear)) return 0;
    const currentYear = new Date().getFullYear();
    return Math.max(0, currentYear - bookYear);
  }
}

export class EBook extends BaseBook {
  constructor(title, author, ISBN, publicationDate, genre,fileSizeMB, price = 20) {
    super(title, author, ISBN, publicationDate, genre, price);
    this.fileSizeMB = fileSizeMB;
  }
  getFileSizeMB() {
    return this.fileSizeMB;
  }
}


export class PrintedBook extends BaseBook {
  constructor(title, author, ISBN, publicationDate, genre, weightInGrams, price = 20) {
    super(title, author, ISBN, publicationDate, genre, price);
    this.weightInGrams = weightInGrams;
  }
  getWeightInGrams() {
    return this.weightInGrams;
  }
}