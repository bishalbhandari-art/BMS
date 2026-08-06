import type { IBookData } from './book.interface.js';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// ISP: Small, focused interface for validation only
export interface IBookValidator {
  validate(book: IBookData): ValidationResult;
}
