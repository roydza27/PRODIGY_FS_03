# Contributing to the Platform

First off, thank you for considering contributing to this platform! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

The following is a set of guidelines for contributing. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

---

## 🧠 Mental Model & Architecture

Before contributing, please read the [ARCHITECTURE.md](./ARCHITECTURE.md). 
We use a **Feature-Sliced Design (FSD)** approach on the frontend (`client/src/features`) and a **Modular Service-Oriented Architecture** on the backend (`server/src/modules`). 

Ensure your code changes respect these boundaries. Domain logic should live inside its respective feature/module, not in global utility files unless strictly necessary.

---

## 🛠️ Local Development Setup

1. **Fork the repository** and clone it to your local machine.
2. **Install dependencies** for both the `client` and `server`:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
3. **Setup environment variables** using the `.env.example` templates in both directories.
4. **Start the development servers**:
   - Backend: `npm run dev` in the `/server` folder.
   - Frontend: `npm run dev` in the `/client` folder.

---

## 🌿 Branch Naming Convention

We use a standardized branch naming convention to keep track of work easily.

Format: `<type>/<issue-number>-<short-description>`

**Types:**
- `feat/`: A new feature
- `fix/`: A bug fix
- `docs/`: Documentation only changes
- `style/`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor/`: A code change that neither fixes a bug nor adds a feature
- `test/`: Adding missing tests or correcting existing tests
- `chore/`: Changes to the build process or auxiliary tools and libraries

**Example:**
`feat/142-add-seller-analytics-dashboard`

---

## 💬 Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This leads to more readable messages that are easy to follow when looking through the project history.

**Format:**
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Examples:**
- `feat(cart): add drag and drop reordering`
- `fix(auth): resolve token hydration race condition`
- `refactor(server): extract mongoose schema logic`

---

## 🚀 Pull Request Workflow

1. **Keep it focused:** Try to keep your PR focused on a single feature or bug fix.
2. **Sync with main:** Before submitting your PR, make sure your branch is up to date with the `main` branch.
   ```bash
   git fetch origin
   git rebase origin/main
   ```
3. **Run Linting & TypeScript Checks:**
   Ensure no warnings or errors exist.
   ```bash
   # In client
   npm run lint
   npm run build # (runs tsc validation)
   
   # In server
   npm run build
   ```
4. **Draft the PR:** Clearly describe the problem you are solving, the solution you implemented, and add screenshots or screen recordings if your changes affect the UI.

---

## 🎨 Coding Standards

### Frontend (React/TypeScript)
- Use functional components and React Hooks.
- Prefer `Zustand` for complex global state, but keep state local to components when it doesn't need to be shared.
- Styling is done via Tailwind CSS. Use `cn()` from `@/lib/utils` for conditional classes.
- Place reusable UI elements in `src/shared/components/ui`.
- Type everything strictly. Avoid using `any`.

### Backend (Node.js/Express)
- Keep controllers thin. They should only handle HTTP request/response logic.
- Place business logic in the `.service.ts` files.
- Validate all incoming request bodies, params, and queries using **Zod** in `.validation.ts` files and the `validateBody` middleware.
- Handle errors gracefully using the custom `AppError` class.

Thank you for contributing! 🚀
