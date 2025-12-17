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

### Why Vitest

- Native ESM support (no transpilation headaches)
- Fast execution with smart caching
- Jest-compatible API (familiar syntax)
- Built-in coverage reporting
- First-class TypeScript support

---

## Project Structure

```text
packages/core/
├── src/
│   ├── __tests__/           # Unit tests for core logic
│   │   ├── scoring.test.ts
│   │   ├── template.test.ts
│   │   └── validation.test.ts
│   └── *.ts                 # Source files
├── vitest.config.ts         # Test configuration

apps/web/
├── src/
│   ├── __tests__/           # App-specific tests
│   │   └── components/      # Component tests
│   └── components/
├── e2e/                     # End-to-end tests (Playwright)
│   └── quiz-flow.spec.ts
└── vitest.config.ts
```

---

## Running Tests

```bash
# Run all tests
pnpm test

# Watch mode (re-run on file changes)
pnpm test:watch

# Coverage report
pnpm test:coverage

# Run specific test file
pnpm test packages/core/src/__tests__/scoring.test.ts

# Run tests matching pattern
pnpm test -t "calculates pillar scores"
```

---

## Writing Tests

### Basic Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { calculateScores } from '../scoring';

describe('calculateScores', () => {
  let mockAnswers: Record<string, number>;
  let mockTemplate: Template;

  beforeEach(() => {
    mockAnswers = { q1: 3, q2: 4, q3: 2 };
    mockTemplate = createMockTemplate();
  });

  it('returns pillar scores for each pillar', () => {
    const result = calculateScores(mockAnswers, mockTemplate);
    
    expect(result.pillars).toBeDefined();
    expect(result.pillars.leadership).toBeDefined();
    expect(result.pillars.leadership.score).toBeGreaterThanOrEqual(0);
  });

  it('handles empty answers gracefully', () => {
    const result = calculateScores({}, mockTemplate);
    
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
it('throws validation error for missing required fields')

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

---

## Coverage Targets

| Layer | Target | Rationale |
|-------|--------|-----------|
| Core logic (scoring, calculations) | >90% | Business-critical, must be correct |
| Template loader & validation | >90% | Data integrity |
| API routes | >80% | Contract verification |
| UI components | Key flows | Complex interactions only |
| E2E | Happy path | Critical user journeys |

### Viewing Coverage

```bash
pnpm test:coverage
```

Coverage report generated in `coverage/` directory. Open `coverage/index.html` in browser.

---

## Mocking

### Mocking Modules

```typescript
import { vi } from 'vitest';

// Mock entire module
vi.mock('../api/ghl', () => ({
  syncContact: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock specific function
import { syncContact } from '../api/ghl';
vi.mocked(syncContact).mockResolvedValue({ success: true });
```

### Mocking External APIs

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
  
  const result = await submitLead(leadData);
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('Network error');
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
2. Fix locally
3. Push again

---

## Test Data

### Mock Factories

Create reusable mock data factories:

```typescript
// packages/core/src/__tests__/factories.ts

export function createMockTemplate(overrides = {}): Template {
  return {
    id: 'test-template',
    name: 'Test Template',
    pillars: [
      { id: 'leadership', name: 'Leadership', weight: 1 },
      { id: 'data', name: 'Data', weight: 1 },
    ],
    questions: [],
    ...overrides,
  };
}

export function createMockAnswers(overrides = {}): Record<string, number> {
  return {
    q1: 3,
    q2: 4,
    q3: 2,
    ...overrides,
  };
}
```

---

## Common Patterns

### Testing Async Code

```typescript
it('fetches template data', async () => {
  const result = await loadTemplate('ai-readiness');
  
  expect(result).toBeDefined();
  expect(result.id).toBe('ai-readiness');
});
```

### Testing Errors

```typescript
it('throws on invalid template', () => {
  expect(() => validateTemplate(invalidData))
    .toThrow('Missing required field: pillars');
});

it('throws on invalid template (async)', async () => {
  await expect(loadTemplate('nonexistent'))
    .rejects.toThrow('Template not found');
});
```

### Snapshot Testing (use sparingly)

```typescript
it('generates expected report structure', () => {
  const report = generateReport(scores, template);
  
  expect(report).toMatchSnapshot();
});
```

---

## Debugging Tests

### Run Single Test

```bash
pnpm test -t "specific test name"
```

### Verbose Output

```bash
pnpm test --reporter=verbose
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["--run", "--reporter=verbose"],
  "cwd": "${workspaceFolder}",
  "console": "integratedTerminal"
}
```

---

## Related Documents

- [WORKFLOW.md](../00-overview/WORKFLOW.md) — Development workflow including test step
- [ARCHITECTURE.md](./ARCHITECTURE.md) — System architecture
