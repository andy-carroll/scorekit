# Session Start

> **Run this at the start of every ScoreKit session.**
> Copy this entire file into chat or reference it with: "Run /SESSION_START.md"

---

## 0. The Golden Rule

**Follow the workflow**: `docs/00-overview/WORKFLOW.md`

```
PICK → CLARIFY → TEST → BUILD → VERIFY → COMMIT → CLOSE
```

If you skip steps, things rot. Don't skip steps.

---

## 1. Re-establish Context

**Always read** (every session):

1. **NOW**: `docs/00-overview/NOW.md` — current status and immediate focus
2. **WORKFLOW**: `docs/00-overview/WORKFLOW.md` — the development loop

**Read if relevant** (check freshness):

3. **PRD**: `docs/01-product/PRD-ASSESSMENT-FRAMEWORK.md` — requirements
4. **ARCHITECTURE**: `docs/03-engineering/ARCHITECTURE.md` — tech stack
5. **PRINCIPLES**: `docs/00-overview/PRINCIPLES.md` — product & engineering principles

## 2. Check Git Status

Run:
```bash
git status
git log --oneline -5
```

Report:
- Any uncommitted changes?
- Last 5 commits (what was done recently?)
- Current branch (should be `main` unless feature work)

## 3. Check Beads Tickets

Run:
```bash
bd list --status open
bd list --status in_progress
```

Report:
- What tickets are in progress?
- What's the next priority ticket by phase?
- Any blockers noted?

## 4. Check Dev Server

If `apps/web` exists:
```bash
cd apps/web && pnpm dev
```

Report:
- Does the app start without errors?
- What's the current state of the UI?

## 5. Review Session History

Check if there's a `SESSION_LOG.md` or recent session notes:
- What was completed last session?
- What was deferred or blocked?
- Any decisions made that affect today's work?

---

## Session Start Checklist

Before proceeding, confirm:

- [ ] I understand the current project state
- [ ] I know what was done last session
- [ ] I know what the next priority ticket is
- [ ] Git is clean (or I've noted uncommitted work)
- [ ] Dev server runs (if applicable)
- [ ] No blockers preventing progress

---

## Output Format

After running checks, provide:

```markdown
## Session Start — [Date]

### Project State
- **Last commit**: [hash] [message]
- **Uncommitted changes**: Yes/No
- **Dev server**: Running / Not started / Error

### Beads Status
- **In progress**: [ticket IDs or "None"]
- **Next up**: [ticket ID] — [title]
- **Blockers**: [any blockers or "None"]

### Last Session Summary
- [What was completed]
- [What was deferred]

### Today's Focus
- **Primary ticket**: [ID] — [title]
- **Goal**: [What we'll accomplish this session]

### Ready to Start
[Confirm ready or list what's missing]
```

---

## 6. Docs Health Check (Weekly)

Once per week, verify these docs are current:

| Doc | Check | Action if stale |
|-----|-------|-----------------|
| `NOW.md` | Reflects actual current state? | Update immediately |
| `WORKFLOW.md` | Process still accurate? | Update or flag for discussion |
| `ARCHITECTURE.md` | Matches actual tech stack? | Update with changes |
| `CONTEXT.md` | Decisions still valid? | Update or create ADR |
| `ROADMAP.md` | Priorities still correct? | Discuss with product lead |

**If any doc is stale, update it before starting feature work.**

---

## Quick Reference

| Resource | Path |
|----------|------|
| Workflow | `docs/00-overview/WORKFLOW.md` |
| Current status | `docs/00-overview/NOW.md` |
| PRD | `docs/01-product/PRD-ASSESSMENT-FRAMEWORK.md` |
| Architecture | `docs/03-engineering/ARCHITECTURE.md` |
| Beads issues | `bd list` |
| App | `apps/web/` |

---

**Once checks complete, state the focus for this session and await confirmation to begin.**
