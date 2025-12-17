# PRD: Report Access Token Model (Staged Storage)

> **Status**: Draft  
> **Author**: Andy Carroll  
> **Created**: Dec 2025  
> **Related tickets**: scorekit-12z

---

## 1. Summary

We will implement a **stable “report access token” contract** so that reports can be accessed via `/report/[token]` in a way that is:

- Reliable across refresh
- Unambiguous and testable
- Easy to upgrade from prototype storage to production storage without UI rework

The contract is implemented once, then the backing storage moves through stages:

1. **Stage 0 (Option 1)**: Local storage (fastest to ship, per-browser)
2. **Stage 1 (Option 2)**: API route-backed storage (shareable link across devices; still simple)
3. **Stage 2 (Option 3)**: Supabase-backed storage (production)

The UI flow must not change when we swap storage implementations.

---

## 2. Problem Statement

The current report access relies on `sessionStorage`, which:

- Breaks on refresh / navigation edge cases
- Does not produce a stable “shareable report link” contract
- Makes later work (PDF, sharing, GHL) harder because report identity is not robust

---

## 3. Goals

- Users can access a report via `/report/[token]`.
- The product has a single, documented contract for report creation + retrieval.
- Storage can be upgraded (local → API → Supabase) with minimal code churn.
- Clear UX for missing/invalid/expired report tokens.

---

## 4. Non-goals (for this PRD)

- Full auth system or user accounts.
- Hard security guarantees for sensitive data (this is still a V1 lead-gen product).
- Final Supabase schema and RLS policies (will be a follow-on ticket).

---

## 5. User Stories

- As a respondent, after completing the email gate, I can open my report via a URL.
- As a respondent, if I refresh the report page, it still loads.
- As a respondent, if I open an invalid link, I get a clear error state.
- As the business, we can later email a report link that works across devices.

---

## 6. UX Requirements

- Email gate creates a report token and routes to `/report/[token]`.
- Report page loads the report based on the token.
- Report page includes:
  - Loading state
  - Not-found/invalid token state
  - (Future) expired token state

---

## 7. Data & Token Model

### 7.1 Token shape

- `token`: opaque, unguessable string (e.g., UUIDv4).
- The token is used in the URL:
  - `/report/[token]`

### 7.2 Report payload (V1)

Report record contains:

- `token`
- `createdAt`
- `templateId`
- `answers` (raw)
- `result` (computed scoring summary)
- `lead` (name/email/company) (optional in early stages; may be stored separately later)

---

## 8. The Contract (Option 2.3)

We define a single interface (implementation detail: where the data lives is swappable).

**Contract:**

- `createReport(payload) -> { token }`
- `getReport(token) -> report | null`

### 8.1 Implementation boundaries

- UI components/pages call the contract only.
- Storage implementation is selected behind a single factory.
- We avoid spreading `localStorage`/`fetch('/api/...')` calls across multiple pages.

### 8.2 Suggested code locations

- `apps/web/src/lib/report-store/types.ts` (types + interface)
- `apps/web/src/lib/report-store/local.ts` (Stage 0)
- `apps/web/src/lib/report-store/api.ts` (Stage 1)
- `apps/web/src/lib/report-store/index.ts` (factory)

---

## 9. Staged Delivery Plan

### Stage 0 (Option 1): Local storage (ship immediately)

- Implement the contract with `localStorage`.
- Works across refresh in the same browser.
- Not guaranteed cross-device.

### Stage 1 (Option 2): API route-backed storage

- Add route handlers:
  - `POST /api/reports` → create
  - `GET /api/reports/[token]` → retrieve
- Backed by a simple store initially (in-memory or file) with a clear migration path.
- Enables true “shareable link” behavior across devices.

### Stage 2 (Option 3): Supabase

- Replace API route storage with Supabase persistence.
- Introduce expiry policies, RLS, and separation of lead PII if needed.

---

## 10. Acceptance Criteria (for scorekit-12z)

- A report token is created at the email gate and the app routes to `/report/[token]`.
- The report page loads from the token via the `ReportStore` contract.
- Refreshing the report page works reliably.
- Invalid tokens show a clear error state.
- Tests/build pass.

---

## 11. Notes / Future Considerations

- Token expiry and revocation.
- Separating lead PII from report content.
- Emailing the report link and PDF generation should reuse the token.
- Share cards and Web Share should share `/report/[token]`.
