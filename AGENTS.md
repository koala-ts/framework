## General instructions

- Follow instructions in `~/.codex/AGENTS.md` when present, unless this file overrides them.

## JavaScript / TypeScript Rules

- Strictly follow functional programming principles.
- Do not use classes unless strongly justified.
- Do not use module-local `index.ts` barrels.
- Treat the framework public API as a stability boundary and be deliberate when changing or adding exports.
- Export public API explicitly from the library root entrypoint.
- Export modules only when they represent a meaningful public capability or contract.
- Declare internal types in the same file where they are used when they belong to a single file or a single behavior.
- Place exported or shared types in dedicated named files inside their module when they represent a public contract or a concept used in multiple files.
- Do not create dumping-ground files such as `types.ts`, `interfaces.ts`, or `models.ts`.
- If a type is exported only to support tests, export it from the source file that owns the behavior instead of moving it to a shared file.
- If the user breaks the rules, you must:
  - Stop.
  - Explain the violation clearly.
  - Propose a correction.
  - Continue only after alignment.
- Strictly follow TDD iterations:
  1. Write a failing test.
  2. Write the minimum code to pass the test.
  3. Refactor the code while ensuring tests still pass.
- For new directory and file names, use kebab-case.

## Unit Tests

- Always follow AAA.
- Each module should have an in-place unit test when unit testing is appropriate for the behavior.
- Do not add root entrypoint export-surface tests such as `src/index.test.ts` unless the user explicitly asks for them.
- Do not add comments like Arrange, Act, Assert.
- Each test must have exactly three sections: Arrange, Act, Assert.
- Separate Arrange → Act and Act → Assert with one empty line each (exactly two empty-line separators per test case).
- The Act step must always be a single line.
- If a variable/const is needed only for assertions, declare it in the Assert section.
- Test case names must be plain English.
- DO NOT reveal implementation details in the test case names.
- Route behaviors are the exception when meaningful unit tests would require framework-level mocking; cover those through E2E tests instead.
- Maintain existing tests whenever they already cover the intended behavior.
- Add new tests only when behavior is new or currently uncovered.
- Do not add redundant tests that duplicate existing observable-behavior coverage.

## End-to-End Tests

- Each framework feature must have end-to-end coverage in the `tests` directory.
- Prefer covering route behavior through E2E tests when that gives clearer, more trustworthy coverage than mocked unit tests.

## Coverage

- Target 100% code coverage by following TDD.
- Use failing tests to drive missing coverage instead of adding coverage-only tests after implementation.

## Running development commands

- Run commands on the docker container named `koalats-framework-container`.
- Start the container if it's not running using the make file.

## Refactorings

- Refactorings MUST not introduce any breaking changes to the public API or types.
