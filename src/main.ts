import { BookManager } from "./manages/BookManager.js";
import AppDOM from "./services/AppDOM.js";
import { StatsService } from "./services/StatsService.js";
import { BookValidator } from "./validation/BookValidator.js";
import FormUI from "./services/FormUi.js";
import { EventController } from "./events/EventController.js";

export interface ApiConfig {
  baseUrl: string;
}

export const API_URL: ApiConfig = {
  baseUrl: "https://6a460aefa268c8be2ce71a1d.mockapi.io/books/BookAPI"
};

// DIP: Composition Root — wire all dependencies via abstractions
const renderer = new AppDOM();
const statsService = new StatsService();
const validator = new BookValidator();
const formUI = new FormUI(validator);

export const systemDB: BookManager = new BookManager(renderer, statsService);

window.addEventListener("DOMContentLoaded", () => {
  // SRP: EventController owns all event wiring; editIndex managed internally
  new EventController(systemDB, formUI);
  systemDB.fetchInitialBooks();
});
