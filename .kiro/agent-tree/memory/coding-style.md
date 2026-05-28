# Coding Style

## TypeScript
- Strict mode enforced via `tsconfig.base.json`
- No `any` casts (`code-no-any-casts.ts` lint rule)
- No dangerous type assertions (`code-no-dangerous-type-assertions.ts`)
- No `in` operator (`code-no-in-operator.ts`)
- Use DI service brand pattern (`code-declare-service-brand.ts`)

## Disposables
- Must use `super.dispose()` (`code-must-use-super-dispose.ts`)
- Watch potentially unsafe disposables (`code-no-potentially-unsafe-disposables.ts`)
- Tests must not leak disposables (`code-ensure-no-disposables-leak-in-test.ts`)

## Async
- No accessor after await (`code-no-accessor-after-await.ts`)
- No reader after await (`code-no-reader-after-await.ts`)
- No async test suite (`code-no-test-async-suite.ts`)

## Imports
- No deep imports of internals (`code-no-deep-import-of-internal.ts`)
- No HTTP imports (`code-no-http-import.ts`)
- No runtime imports (`code-no-runtime-import.ts`)
- No static node module imports (`code-no-static-node-module-import.ts`)

## Localization
- No icons in localized strings (`code-no-icons-in-localized-strings.ts`)
- No template literals in localization (`code-no-localization-template-literals.ts`)
- No localized model descriptions (`code-no-localized-model-description.ts`)
- No NLS in standalone editor (`code-no-nls-in-standalone-editor.ts`)
