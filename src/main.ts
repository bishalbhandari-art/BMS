import { BookManager } from "./manages/BookManager.js";

// Tracks which book is being edited
export let editIndex: number = -1;
export function setEditIndex(val: number): void {
  editIndex = val;
}

export interface ApiConfig {
  baseUrl: string;
}

export const API_URL: ApiConfig = {
  baseUrl: "https://6a460aefa268c8be2ce71a1d.mockapi.io/books/BookAPI"
};
// Instantiate Global Database Manager
export const systemDB: BookManager = new BookManager();

window.addEventListener("DOMContentLoaded", () => {
  systemDB.fetchInitialBooks();
});
