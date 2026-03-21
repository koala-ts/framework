## General instructions

- Follow instructions in `~/.codex/AGENTS.md` if exists.
- Override instructions in `~/.codex/AGENTS.md` if they conflict with the instructions in this file.

## JavaScript / TypeScript Rules

- Strictly follow functional programming principles.
- Do not use classes unless strongly justified.
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
- Do not add comments like Arrange, Act, Assert.
- Each test must have exactly three sections: Arrange, Act, Assert.
- Separate Arrange → Act and Act → Assert with one empty line each (exactly two empty-line separators per test case).
- The Act step must always be a single line.
- If a variable/const is needed only for assertions, declare it in the Assert section.
- Test case names must be plain English.
- DO NOT reveal implementation details in the test case names.

## Running development commands

- Run commands on the docker container named `koalats-framework-container`.
- Start the container if it's not running using the make file.

## Refactorings

- Refactorings MUST not introduce any breaking changes to the public API or types.
