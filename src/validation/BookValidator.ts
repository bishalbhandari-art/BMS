import type { IBookData } from "../interfaces/book.interface.js";
import type { IBookValidator, ValidationResult } from "../interfaces/IBookValidator.js";

// SRP: Pure validation logic only — no DOM access whatsoever
export class BookValidator implements IBookValidator {
  validate(book: IBookData): ValidationResult {
    const errors: Record<string, string> = {};

    if (!book.title || book.title.trim() === "") {
      errors["title"] = "*Title is required";
    }

    if (!book.author || book.author.trim() === "") {
      errors["author"] = "*Author is required";
    }

    const isbnVal = (book.isbn || "").trim();
    const isNumeric =
      isbnVal.length > 0 &&
      isbnVal.split("").every((char) => char >= "0" && char <= "9");

    if (isbnVal === "") {
      errors["ISBN"] = "*ISBN is required";
    } else if (!isNumeric) {
      errors["ISBN"] = "* ISBN must contain numbers only";
    } else if (isbnVal.length !== 10 && isbnVal.length !== 13) {
      errors["ISBN"] = "* ISBN must be 10 digits or 13 digits";
    }

    if (!book.publicationDate || book.publicationDate === "") {
      errors["publicationDate"] = "*Date is required";
    } else {
      const pubDate = new Date(book.publicationDate);
      if (Number.isNaN(pubDate.getTime())) {
        errors["publicationDate"] = "*Publication date is invalid";
      } else if (pubDate > new Date()) {
        errors["publicationDate"] = "*Publication date cannot be in the future.";
      }
    }

    if (!book.genre || book.genre === "") {
      errors["genre"] = "*Select a genre";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
