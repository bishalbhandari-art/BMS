# 📚 Book Management System (BMS)

A production-style **Book Management System** built using **TypeScript** as part of the SourceFuse internship assignments. The project demonstrates modern software engineering practices including **SOLID Principles**, **Object-Oriented Programming**, **Decorators**, **Factory Pattern**, and **GitHub Actions CI**.

---

## 🚀 Features

- Add, Edit and Delete Books
- Filter Books by Genre (Fiction, Non-Fiction, Science Fiction, Mystery)
- Book Age Calculation from Publication Date
- 10% Discount Price Calculation per Book
- Form Validation with Inline Error Messages
- Live Dashboard Statistics (Total Books, Top Genre, Average Age)
- Fetch Books from External MockAPI on Startup
- Server Sync with Success / Error Feedback
- Loading Indicator during API Fetch
- Responsive User Interface

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- TypeScript

### Programming Concepts
- Object-Oriented Programming (OOP)
- SOLID Principles
- Decorators (`@LogAction`)
- Factory Pattern (`BookFactory`)
- Dependency Injection (Composition Root)
- Async / Await & Promises

### Version Control
- Git
- GitHub

### Continuous Integration
- GitHub Actions

---

## 📂 Project Structure

```text
BMS/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── assect/
│
├── diagrams/
│
├── dist/
│
├── src/
│   │
│   ├── decorator/
│   │   └── logDecorator.ts
│   │
│   ├── events/
│   │   └── EventController.ts
│   │
│   ├── factories/
│   │   └── BookFactory.ts
│   │
│   ├── interfaces/
│   │   ├── book.interface.ts
│   │   ├── IBookValidator.ts
│   │   ├── IRenderer.ts
│   │   └── IStatsService.ts
│   │
│   ├── manages/
│   │   └── BookManager.ts
│   │
│   ├── models/
│   │   └── book.ts
│   │
│   ├── services/
│   │   ├── AppDOM.ts
│   │   ├── FormUi.ts
│   │   └── StatsService.ts
│   │
│   ├── types/
│   │   └── bookTypes.ts
│   │
│   ├── utils/
│   │   └── genericUtils.ts
│   │
│   ├── validation/
│   │   └── BookValidator.ts
│   │
│   └── main.ts
│
├── index.html
├── demo.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🏛️ SOLID Principles Implemented

### 1. Single Responsibility Principle (SRP)

Each class has a single, focused responsibility:

- `BookManager` → CRUD operations and API sync only
- `AppDOM` → DOM rendering of the book list only
- `StatsService` → Statistics calculation and display only
- `FormUI` → Form DOM operations (populate, reset, display errors)
- `EventController` → All DOM event wiring only
- `BookFactory` → Book object creation only
- `BookValidator` → Input validation logic only

---

### 2. Open/Closed Principle (OCP)

The project is open for extension through inheritance.

- `BaseBook`
- `EBook`
- `PrintedBook`

`BookFactory.create()` selects the correct type from API data without any hardcoded checks inside `BookManager`. New book types can be added without modifying existing logic.

---

### 3. Liskov Substitution Principle (LSP)

`EBook` and `PrintedBook` both extend `BaseBook` and are fully substitutable wherever a `BaseBook` is expected, without changing application behavior.

---

### 4. Interface Segregation Principle (ISP)

The book contract is split into four small, focused interfaces:

- `IBookData` — raw storage / API shape
- `IDiscountable` — pricing behaviour (`getDiscountedPrice`)
- `IAgeable` — age calculation behaviour (`getBookAge`)
- `ISummarizable` — summary display behaviour (`getSummary`)

Service contracts are also separated:

- `IRenderer` — `render(books: BaseBook[]): void`
- `IStatsService` — `updateStats(books: BaseBook[]): void`
- `IBookValidator` — form input validation contract

---

### 5. Dependency Inversion Principle (DIP)

`BookManager` depends on `IRenderer` and `IStatsService` abstractions, **not** on the concrete `AppDOM` or `StatsService` classes. All dependencies are wired at the Composition Root (`src/main.ts`) via constructor injection.

---

## 🧩 Design Patterns Used

- **Factory Pattern** — `BookFactory` creates `EBook` or `PrintedBook` from API data
- **Decorator Pattern** — `@LogAction` logs async method calls to the console
- **Dependency Injection** — All services injected via constructors
- **Observer-like Pattern** — `EventController` listens for DOM events and delegates to `BookManager`

---

## 🌐 API Integration

The application integrates with **MockAPI** to fetch initial book data on startup.

```
GET https://6a460aefa268c8be2ce71a1d.mockapi.io/books/BookAPI
```

Features include:

- Fetch all books on `DOMContentLoaded`
- Dynamic book type creation (`EBook` if `fileSizeMB` present, `PrintedBook` if `weightInGrams` present)
- Server sync simulation (`saveToServer`) with 1200 ms delay and ~90% success rate
- Error fallback with alert if remote fetch fails

---

## ⚙️ GitHub Actions

The project includes a Continuous Integration workflow.

On every **Push** and **Pull Request**, GitHub automatically:

1. Checks out the repository
2. Sets up Node.js 24
3. Installs dependencies (`npm ci`)
4. Builds the TypeScript project (`npm run build`)
5. Type-checks without emitting files (`npm run typecheck`)

Workflow file:

```text
.github/workflows/ci.yml
```

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| Build | `npm run build` | Compiles TypeScript to `dist/` |
| Watch Mode | `npm run dev` | Watches `src/` and recompiles on save |
| Type Check | `npm run typecheck` | Runs `tsc --noEmit` (no output files) |

---

## ▶️ Installation

```bash
git clone <repository-url>
cd BMS
npm install
npm run build
```

Then open `index.html` in your browser (or use **Live Server** in VS Code).

> **Note:** No bundler is used. The app runs on native ES modules via `<script type="module">` in `index.html`.

---

## 🖼️ Architecture Diagrams

**Client-Server Model**

<img width="835" height="711" alt="3-Tier Architecture" src="https://github.com/user-attachments/assets/d2079bd9-5d08-4468-b4de-d7832d5d1fc5" />

**3-Tier Architecture**

<img width="1020" height="681" alt="Client-Server Model" src="https://github.com/user-attachments/assets/a8fa9960-b031-4ae8-aacd-21d27796cd13" />


---

## 👨‍💻 Author

**Bishal Bhandhari**  
SourceFuse Internship Assignment

The project demonstrates SDLC planning, frontend development, and architectural design using Client-Server and 3-Tier Architecture models.

2026
