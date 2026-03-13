# Testing

> Test strategy, framework setup, and testing ethos for ScoreKit.

---

## Philosophy

**Pragmatic TDD** — Tests are a tool for confidence, not a bureaucratic checkbox.

- **Core logic**: Always test first (scoring, calculations, validation)
- **UI components**: Test after if complex, skip if trivial
- **Integrations**: Test the contract, mock external services

### When to Write Tests

| Situation | Approach |
|-----------|----------|
| New scoring logic | Write test first, then implement |
| Bug fix | Write failing test that reproduces bug, then fix |
| Complex UI interaction | Write test after implementation |
| Simple UI change | Skip test, rely on visual verification |
| External API integration | Mock the API, test our handling |

---

## Framework

**Vitest** — Fast, ESM-native test runner compatible with Jest API.

Two separate Vitest environments, one per package:

| Package | Environment | Config |
|---------|-------------|--------|
| `packages/core` | `node` | `packages/core/vitest.config.ts` |
| `apps/web` | `jsdom` (browser-like) | `apps/web/vitest.config.ts` |

`apps/web` also uses `@testing-library/react` for component tests, with setup in `src/test/setup.ts`.

---

## Project Structure

```text
packages/core/
├── src/
│   ├── __tests__/
│   │   └── report-answer-mapping.test.ts   # answer → report data mapping
│   ├── template-loader.test.ts             # template loading / registry
│   └── *.ts                               # source files
└── vitest.config.ts

apps/web/
├── src/
│   ├── app/
│   │   └── api/report/pdf/
│   │       └── route.test.ts              # PDF generation API route
│   ├── components/
│   │   ├── QuestionCard.test.tsx          # quiz question rendering
│   │   ├── PillarIntro.test.tsx           # pillar intro screen
│   │   └── SectionProgress.test.tsx      # progress indicator
│   ├── lib/report-store/
│   │   └── report-store.test.ts          # localStorage report store adapter
│   └── test/
│       └── setup.ts                      # jsdom setup (localStorage mock, jest-dom matchers)
└── vitest.config.ts
```

> **Convention**: `apps/web` tests live next to the source file they test, not in a separate `__tests__/` directory. `packages/core` uses `__tests__/` for grouped unit tests.

---

## Running Tests

```bash
# Run all tests across the monorepo
pnpm test

# Watch mode (core package only — fastest feedback loop)
pnpm test:watch

# Coverage report (all packages)
pnpm test:coverage

# Run tests in a specific package only
pnpm --filter @scorekit/core test
pnpm --filter web test

# Run a specific test file
pnpm --filter web vitest run src/components/QuestionCard.test.tsx

# Run tests matching a name pattern
pnpm --filter @scorekit/core vitest run -t "calculates pillar scores"
```

Coverage reports are generated in `coverage/` inside each package. Open `apps/web/coverage/index.html` or `packages/core/coverage/index.html` in a browser for a visual breakdown.

---

## Writing Tests

### Basic Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { calculateScores } from '../scoring';

describe('calculateScores', () => {
  let mockAnswers: Record<string, number>;

  beforeEach(() => {
    mockAnswers = { q1: 3, q2: 4, q3: 2 };
  });

  it('returns pillar scores for each pillar', () => {
    const result = calculateScores(mockAnswers, template);

    expect(result.pillars).toBeDefined();
    expect(result.pillars.leadership.score).toBeGreaterThanOrEqual(0);
  });

  it('handles empty answers gracefully', () => {
    const result = calculateScores({}, template);

    expect(result.total).toBe(0);
  });
});
```

### Test Naming

Use descriptive names that explain the behaviour:

```typescript
// ✅ Good
it('returns zero score when no questions answered')
it('assigns "Starting" band for scores below 40%')
it('throws on unknown template ID')

// ❌ Bad
it('works correctly')
it('test scoring')
it('should do the thing')
```

### Arrange-Act-Assert Pattern

```typescript
it('identifies lowest scoring pillar as primary constraint', () => {
  // Arrange
  const answers = {
    leadership_q1: 5,
    leadership_q2: 5,
    data_q1: 1,
    data_q2: 1,
  };

  // Act
  const result = calculateScores(answers, template);

  // Assert
  expect(result.primaryConstraint).toBe('data');
});
```

### Component Tests (apps/web)

Use `@testing-library/react` with the standard render/screen pattern:

```typescript
import { render, screen } from '@testing-library/react';
import { QuestionCard } from './QuestionCard';

it('renders the question text', () => {
  render(<QuestionCard question={mockQuestion} onAnswer={vi.fn()} />);

  expect(screen.getByText(mockQuestion.text)).toBeInTheDocument();
});
```

The `toBeInTheDocument()` matcher (and other DOM matchers) come from `@testing-library/jest-dom`, loaded automatically via `apps/web/src/test/setup.ts`.

---

## Test Setup — apps/web

`apps/web/src/test/setup.ts` runs before every test in the `apps/web` package. It does two things:

1. **Imports `@testing-library/jest-dom`** — adds DOM matchers like `toBeInTheDocument()`, `toHaveClass()`, `toHaveTextContent()` to Vitest's `expect`.

2. **Installs an in-memory `localStorage` mock** — jsdom's `localStorage` is unreliable in some environments. The setup detects this and replaces it with a simple `Map`-backed implementation so tests that read/write `localStorage` work consistently.

You don't need to configure either of these per-test — they're global for the whole `apps/web` package.

---

## Coverage Targets

| Layer | Target | Rationale |
|-------|--------|-----------|
| Core logic (scoring, calculations) | >90% | Business-critical, must be correct |
| Template loader & validation | >90% | Data integrity |
| API routes | >80% | Contract verification |
| UI components | Key flows | Complex interactions only |

There are no end-to-end tests currently. If you're adding Playwright or Cypress, add a new section here.

---

## Mocking

### Mocking Modules

```typescript
import { vi } from 'vitest';

// Mock entire module
vi.mock('../lib/email-provider', () => ({
  getEmailProvider: vi.fn().mockReturnValue({
    sendEmail: vi.fn().mockResolvedValue(undefined),
  }),
}));
```

### Mocking External APIs (fetch)

```typescript
import { vi, beforeEach, afterEach } from 'vitest';

beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('handles API error gracefully', async () => {
  vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

  await expect(submitLead(leadData)).rejects.toThrow('Network error');
});
```

### Mocking localStorage

`localStorage` is already mocked globally by `src/test/setup.ts` (see above). If you need a clean state between tests:

```typescript
beforeEach(() => {
  localStorage.clear();
});
```

---

## Continuous Integration

Tests run automatically via GitHub Actions on:
- Every push to `main`
- Every pull request to `main`

**Workflow file:** `.github/workflows/ci.yml`

If CI fails:
1. Check the Actions tab in GitHub for error details
2. Reproduce locally: `pnpm test`
3. Fix, then push again

---

## Debugging Tests

### Run a single test by name

```bash
pnpm --filter web vitest run -t "specific test name"
```

### Verbose output

```bash
pnpm --filter web vitest run --reporter=verbose
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest (web)",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["--run", "--reporter=verbose"],
  "cwd": "${workspaceFolder}/apps/web",
  "console": "integratedTerminal"
}
```

---

## Related Documents

- [CONTRIBUTING.md](../05-open-source/CONTRIBUTING.md) — Contribution guidelines including test expectations
- [WORKFLOW.md](../00-overview/WORKFLOW.md) — Development workflow including test step
- [ARCHITECTURE.md](./ARCHITECTURE.md) — System architecture
