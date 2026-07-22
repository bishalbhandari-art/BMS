// models/Book.js
export class BaseBook{
  constructor(title, author, ISBN, publicationDate, genre) {
    this.title = title;
    this.author = author;
    this.ISBN = ISBN;
    this.publicationDate = publicationDate;
    this.genre = genre; 
    
    const currentYear = new Date().getFullYear();
    const bookYear = new Date(this.publicationDate).getFullYear();
    this.bookAge = Math.max(!isNaN(bookYear) ? currentYear - bookYear : 0, 1);
    this.discountedPrice = (Math.random() * 40 + 5).toFixed(2);
  }

  // Business logic method to calculate book age
  getBookAge() {
    return this.bookAge;
}
}

export class EBook extends BaseBook {
  constructor(title, author, ISBN, publicationDate, genre,fileSizeMB) {
    super(title, author, ISBN, publicationDate, genre);
    this.fileSizeMB = fileSizeMB;
  }
  getBookAge(){
    return `this.fileSizeMB`;
  }}


export class PrintedBook extends BaseBook {
  constructor(title, author, ISBN, publicationDate, genre, weightInGrams) {
    super(title, author, ISBN, publicationDate, genre);
    this.weightInGrams = weightInGrams;
  }
  getbooksize(){
    return `this.weightInGrams`;
  }
}