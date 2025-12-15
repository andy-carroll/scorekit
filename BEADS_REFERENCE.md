# Beads Issue Reference - ScoreKit

All work is tracked in **Beads** (Git-backed issue tracker). This document maps Beads IDs to V1 workstreams and provides quick commands.

---

## V1 Roadmap (High Level)

Source of truth (one level above Beads):

- `docs/05-open-source/ROADMAP.md`

Beads is used for ultra-granular implementation tickets that ladder up into the roadmap.

---

## Initial Ticket Map (to be filled)

| Beads ID | Title | Spec File | Status |
|----------|-------|-----------|--------|
| **scorekit-*** | *(TBD)* | `docs/05-open-source/ROADMAP.md` | open |

---

## Quick Beads Commands

### Viewing Issues

```bash
# See all open work
bd list

# See what’s ready (no blockers)
bd ready

# View specific issue details
bd show scorekit-xxx

# See issue dependencies
bd dep tree scorekit-xxx
```

### Working on Issues

```bash
# Mark as in progress
bd update scorekit-xxx --status in_progress

# Close/complete an issue
bd close scorekit-xxx --reason "Implemented and tested"

# Add a note to an issue
bd note scorekit-xxx "Progress update"
```

### Committing

Commit format:

```bash
git commit -m "scorekit-xxx: brief description"
```

---

## Sync to Git

Beads changes are committed to `.beads/issues.jsonl`.

```bash
bd sync
```

---

## Reference

- **Beads (official)**: <https://github.com/steveyegge/beads>
- **ScoreKit roadmap**: `docs/05-open-source/ROADMAP.md`

---

**Project**: ScoreKit
**Current Phase**: V1 foundation
