# Development Workflow

> Pragmatic, not bureaucratic. Supports speed while ensuring quality and traceability.

---

## The Loop

Every piece of work follows this loop:

```text
1. PICK    → Select ticket from backlog, mark in_progress
2. CLARIFY → Ensure spec is clear, ask questions if not
3. TEST    → Write failing test(s) for acceptance criteria
4. BUILD   → Implement until tests pass
5. VERIFY  → Local UAT (manual check it actually works)
6. COMMIT  → Push with clear commit message
7. CLOSE   → Close ticket, update docs, pull next
```

**Never skip steps 5-7.** This is where quality and documentation happen.

---

## 1. PICK — Select Work

Before starting:

```bash
bd list --status open -l [current-phase]  # See what's ready
bd update [ticket-id] --status in_progress
```

**Check**:

- [ ] Ticket has clear acceptance criteria
- [ ] Links to relevant PRD/spec if needed
- [ ] No blockers

If acceptance criteria are vague, clarify with product lead before coding.

---

## 2. CLARIFY — Understand the Spec

Read the linked documentation:

- `docs/01-product/PRD-*.md` for product requirements
- `docs/03-engineering/*.md` for technical specs
- Existing code for patterns to follow

**Ask questions now, not after you've built the wrong thing.**

---

## 3. TEST — Write Failing Tests First

For new features, write tests before implementation:

```typescript
// packages/core/src/__tests__/scoring.test.ts
describe('calculateScores', () => {
  it('returns pillar scores for each pillar', () => {
    const result = calculateScores(mockAnswers, mockTemplate);
    expect(result.pillars).toHaveProperty('leadership');
    expect(result.pillars.leadership.score).toBeGreaterThanOrEqual(0);
  });

  it('identifies the primary constraint as lowest scoring pillar', () => {
    // ...
  });
});
```

**Pragmatic TDD**:

- Core logic (scoring, calculations, validation): **Always test first**
- UI components: Test after if complex, skip if trivial
- Integrations: Test the contract, mock external services

Run tests:

```bash
pnpm test           # Run all tests
pnpm test:watch     # Watch mode during development
```

---

## 4. BUILD — Implement

Write code to make tests pass. Follow existing patterns:

- Types in `packages/core/src/types.ts`
- Logic in `packages/core/src/*.ts`
- UI in `apps/web/src/`

**Commit frequently** with conventional commit messages:

```text
feat: add pillar score calculation
fix: handle edge case when no questions answered
test: add tests for band assignment
docs: update scoring model spec
chore: update dependencies
```

---

## 5. VERIFY — Local UAT

**This is the step we've been skipping. Don't skip it.**

Before pushing, manually verify the work:

### For UI changes

```bash
cd apps/web && pnpm dev
```

- [ ] Navigate to the feature
- [ ] Test happy path
- [ ] Test edge cases (empty state, error state)
- [ ] Check responsive design (if applicable)
- [ ] Verify no console errors

### For core logic

- [ ] Tests pass: `pnpm test`
- [ ] Types compile: `pnpm typecheck`
- [ ] Try it with real data (not just mocks)

### UAT Checklist Template

```markdown
## UAT: [Ticket ID] — [Title]

### Acceptance Criteria
- [ ] Criterion 1 — verified
- [ ] Criterion 2 — verified

### Manual Tests Performed
- [ ] Happy path: [describe what you tested]
- [ ] Edge case: [describe]
- [ ] Error handling: [describe]

### Issues Found
- None / [list any issues]

### Ready to Push
- [x] All criteria met
- [x] Tests pass
- [x] No console errors
```

**If UAT fails, fix before pushing.**

---

## 6. COMMIT — Push to GitHub

Only after UAT passes:

```bash
git add -A
git commit -m "feat: [description]

- [detail 1]
- [detail 2]

Closes [ticket-id]"

git push origin main
```

**Commit message includes**:

- Type (feat/fix/test/docs/chore)
- Clear description
- Ticket reference

---

## 7. CLOSE — Complete the Loop

### Close the ticket

```bash
bd close [ticket-id] --reason "[summary of what was done]"
```

### Update documentation

- `docs/00-overview/NOW.md` — Update current status
- Any spec docs that changed during implementation
- ADR if architectural decision was made

### Export and commit Beads

```bash
bd export -o .beads/issues.jsonl
git add .beads/issues.jsonl
git commit -m "chore: update beads"
git push origin main
```

### Pull next ticket

```bash
bd list --status open -l [current-phase]
bd update [next-ticket] --status in_progress
```

---

## Testing Strategy

### What to Test

| Layer | What | How | Coverage Target |
|-------|------|-----|-----------------|
| **Core logic** | Scoring, calculations, validation | Unit tests (Vitest) | >90% |
| **Template loader** | Parse, validate, helpers | Unit tests | >90% |
| **API routes** | Request/response contracts | Integration tests | >80% |
| **UI components** | Complex interactions | Component tests | Key flows only |
| **E2E** | Critical user journeys | Playwright | Happy path |

### When to Write Tests

- **Before implementation**: Core logic, calculations, validation
- **During implementation**: Edge cases as you discover them
- **After implementation**: UI components (if complex)

### Test File Locations

```text
packages/core/src/__tests__/       # Core logic tests
apps/web/src/__tests__/            # App-specific tests
apps/web/e2e/                      # End-to-end tests
```

### Running Tests

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Coverage report
pnpm test:e2e          # E2E tests (requires dev server)
```

---

## Documentation Standards

### Keep These Updated

| Document | When to Update |
|----------|----------------|
| `NOW.md` | After every phase/milestone completion |
| `ROADMAP.md` | When priorities change |
| `PRD-*.md` | When requirements clarify or change |
| `ARCHITECTURE.md` | When system design changes |
| `docs/adr/*.md` | When making significant technical decisions |

### ADR (Architecture Decision Record) Template

Create in `docs/adr/NNNN-title.md`:

```markdown
# NNNN: [Decision Title]

## Status
Accepted / Proposed / Deprecated

## Context
[Why is this decision needed?]

## Decision
[What did we decide?]

## Consequences
[What are the implications?]
```

---

## Continuous Integration

### GitHub Actions (Active)

CI runs automatically on every push to `main` and on pull requests.

**Workflow file:** `.github/workflows/ci.yml`

**What it does:**

1. Checkout code
2. Setup Node.js 20 + pnpm
3. Install dependencies
4. Run tests (`pnpm test`)
5. Build (`pnpm build`)

**If CI fails:**

- Check the Actions tab in GitHub for error details
- Fix locally, push again
- PRs cannot be merged with failing CI (recommended branch protection)

### Pre-commit Hook (optional)

For faster feedback, add a pre-commit hook:

```bash
# .husky/pre-commit
pnpm test --run
pnpm typecheck
```

---

## Quick Reference

### Daily Commands

```bash
# Start session
bd list --status in_progress        # What's active?
bd list --status open -l phase-2    # What's next?

# During work
pnpm dev                            # Start dev server
pnpm test:watch                     # Tests in watch mode
pnpm typecheck                      # Check types

# End work
bd close [id] --reason "[summary]"
bd export -o .beads/issues.jsonl
git add -A && git commit && git push
```

### The Golden Rule

> **If you can't verify it works, it's not done.**

UAT is not optional. Documentation is not optional. Closing the loop is not optional.

This discipline now prevents chaos later.
