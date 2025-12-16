# Session Finish

> **Run this at the end of every ScoreKit session.**
> Copy this entire file into chat or reference it with: "Run /SESSION_FINISH.md"

---

## 1. Commit All Work

Ensure all changes are committed:

```bash
git status
git add -A
git commit -m "feat/fix/chore: [description of changes]"
git push origin main
```

Report:
- What was committed?
- Any files intentionally left uncommitted? Why?

## 2. Update Beads Tickets

For each ticket worked on:

```bash
# If completed:
bd close [ticket-id] --reason "[brief summary]"

# If in progress (will continue next session):
bd update [ticket-id] --status in_progress

# Add notes if needed:
bd note [ticket-id] "[progress notes, blockers, decisions]"
```

Then export:

```bash
bd export -o .beads/issues.jsonl
git add .beads/issues.jsonl
git commit -m "chore: update beads"
git push origin main
```

## 3. Update NOW.md

Update `docs/00-overview/NOW.md` with:
- What was completed this session
- What's in progress
- What's next up
- Any blockers or decisions made

## 4. Stop Dev Server

If running:
- Stop the dev server (Ctrl+C)
- Note any errors or warnings observed

## 5. Document Decisions

If any architectural or product decisions were made:
- Add to `docs/adr/` if significant
- Or note in relevant doc file

## 6. Flag Blockers

If anything is blocking progress:
- Document clearly in Beads ticket
- Note in session summary below
- Tag with priority if urgent

---

## Session Finish Checklist

Before closing:

- [ ] All code committed and pushed
- [ ] Beads tickets updated (closed or in_progress)
- [ ] Beads exported and committed
- [ ] NOW.md updated with current status
- [ ] No uncommitted changes (or intentionally staged)
- [ ] Dev server stopped
- [ ] Blockers documented (if any)

---

## Output Format

Provide session summary:

```markdown
## Session Finish — [Date]

### Completed This Session
- [List of accomplishments]

### Commits
- [hash] [message]
- [hash] [message]

### Beads Updates
- **Closed**: [ticket IDs] — [reasons]
- **In progress**: [ticket IDs]
- **Created**: [any new tickets]

### Decisions Made
- [Any product/architecture decisions]

### Blockers
- [Any blockers for next session, or "None"]

### Next Session Priority
- **Ticket**: [ID] — [title]
- **Goal**: [What to tackle next]

### Notes for Future Self
- [Anything important to remember]
```

---

## Quick Commit Messages

| Type | Format |
|------|--------|
| Feature | `feat: add [feature]` |
| Fix | `fix: resolve [issue]` |
| Docs | `docs: update [doc]` |
| Refactor | `refactor: [what changed]` |
| Chore | `chore: [maintenance task]` |
| Test | `test: add tests for [feature]` |

---

## Final Step

After completing all checks:

1. Provide the session summary
2. Confirm everything is committed and pushed
3. State the recommended starting point for next session

**Session complete. See you next time!**
