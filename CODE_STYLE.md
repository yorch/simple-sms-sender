# Code Style Guidelines

These guidelines define the code style and conventions for the `simple-sms-sender` repository.

---

## 1. General

- Use **TypeScript** for all source code (`.ts` files).
- All code should be placed in the `src/` directory.
- Use **ES Modules** (`import`/`export` syntax).
- Target Node.js LTS environments.

## 2. Formatting

- Use **Prettier** for code formatting.
- Enforce single quotes for strings: `'single'`.
- Always use semicolons.
- Indentation: 2 spaces.
- No trailing whitespace.
- End files with a newline.

## 3. Linting

- Use ESLint with:
  - `@typescript-eslint` for TypeScript rules.
  - `eslint-config-prettier` and `eslint-plugin-prettier` for Prettier integration.
- Key rules:
  - No unused variables (`@typescript-eslint/no-unused-vars`).
  - No usage of `any` type (`@typescript-eslint/no-explicit-any`).
  - No inferrable types unless for parameters (`@typescript-eslint/no-inferrable-types`).
  - Function return types do not need to be explicit.
  - Prettier formatting issues are treated as errors.

## 4. TypeScript

- Use strictest settings (extends `@tsconfig/strictest`).
- No implicit `any`.
- Prefer type aliases and interfaces for all object shapes.
- Use `type` imports where possible (`import type { ... }`).

## 5. Naming

- Use `camelCase` for variables and functions.
- Use `PascalCase` for classes and type aliases.
- File names should be `PascalCase` for classes, otherwise `camelCase`.

## 6. Functions & Classes

- Use arrow functions unless a class method is required.
- Prefer `async/await` for asynchronous code.
- All exported classes and functions must be documented with a comment describing their purpose.

## 7. Testing

- Use `vitest` for all tests.
- Place tests alongside source files, using `.test.ts` suffix.
- Mock external dependencies (e.g., Twilio) in tests.

## 8. Commits & Changelog

- Follow conventional commits for commit messages.
- Update `CHANGELOG.md` for every release.

## 9. Other

- Use `yarn` as the package manager.
- Use `rimraf` for cleaning build artifacts.
- Use `tsup` for building the project.

---
