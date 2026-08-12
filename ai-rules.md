# InsuraHub 


## AI DEVELOPMENT RULES

### 1. GLOBAL SOFTWARE PRINCIPLES
- **SOLID, DRY, KISS, YAGNI:** Adhere strictly to these principles. Prevent code duplication.
- **Colocation:** Tests MUST live right next to the files they test (except E2E).
- **Single Source of Truth:** The Backend/Database MUST remain the absolute single source of truth for all business logic, state, and authorization. Client-side state or frontend filtering MUST NEVER be trusted as a security boundary.

### 2. ARCHITECTURE, RBAC & ORGANIZATIONAL SCOPE
- **Modular Monolith:** Organize code by domain (DDD). Controllers MUST only handle HTTP routing/DTOs. Services MUST contain all business logic (Fat Services, Skinny Controllers).
- **Strict Organizational Scope:** Authorization MUST evaluate both role and organizational scope.
  - Branch Managers/Brokers MUST NOT access other branches' data unless explicitly authorized.
  - Agency Managers MAY access all their branches.
  - Company users MAY access all their agencies/branches.
- **Historical Context & Transfers:** Users MAY be transferred between branches. However, transferring a user MUST NOT rewrite historical policy ownership, commissions, or audit records. Historical records MUST preserve the organizational context that existed at the exact time the business event occurred.
- **Large Dataset Export:** Exports MUST use server-side processing, respect organizational scope, and NEVER load unbounded datasets into browser memory.

### 3. POLICY LIFECYCLE & CONCURRENCY
- **Explicit State Machine:** Policy lifecycle MUST be modeled as a strict state machine. Valid/invalid transitions MUST be defined centrally in the backend. The frontend MUST NOT determine transition validity.
- **Atomic Claiming:** Policy claiming MUST be an atomic server-side operation. The database MUST verify the policy is still in an "unassigned" state at the exact moment of assignment. If multiple brokers claim concurrently, exactly ONE MUST succeed; others MUST receive a clear business error.
- **Renewal History:** Renewals MUST preserve the relationship with the original policy without destroying historical records. Financial records of previous periods MUST remain immutable.

### 4. DYNAMIC COMMISSION ENGINE & FINANCES
- **Rule-Based Engine:** Commission distribution MUST NOT be hardcoded. It MUST be resolved dynamically via configurable rules (Company, Agency, Branch, Broker splits).
- **Invariant & Rounding:** Distributions MUST satisfy strict invariants (e.g., percentages MUST NOT exceed 100%). The system MUST define a deterministic rounding strategy for floating-point monetary values.
- **Immutable Snapshots & Versioning:** Commission rules MUST be versionable. Once a commission is calculated/finalized, it MUST be stored as an immutable `CommissionSnapshot`. Future changes to rules MUST NOT silently alter historical commissions.

### 5. REAL-TIME, NOTIFICATIONS & AUDIT TRAIL
- **Socket.io vs. State:** Socket.io MUST ONLY be used for transient real-time UI synchronization, NEVER as the source of truth for authorization or financial state. Losing connection MUST NOT corrupt business state.
- **Persistent Notifications:** Business-critical alerts MUST be stored as persistent notifications in the DB, separate from transient Socket events.
- **Ticket / Chat Authorization:** Communication MUST respect organizational hierarchy. Users MUST NOT access conversations outside their scope, even if they know the ID.
- **Immutable Audit Logging:** Every critical action (transfers, state changes, claims, rule updates) MUST generate an immutable audit log (Who, What, When) and SHOULD preserve relevant before/after values.

### 6. FRONTEND RULES (Next.js, Zustand & UI)
- **Framework & State:** App Router ONLY. Use Server Components by default. Use Zustand for global UI state. Components MUST NOT call APIs directly without a structured fetch layer.
- **Strict File Size:** Frontend components MUST NOT exceed 150 lines. Break logic into hooks or sub-components. Backend files (Services) MUST NOT exceed 300 lines; controllers < 150 lines.
- **Reconciliation:** UI actions MUST rely on backend API responses for state updates. Never assume success (like claiming) purely via client-side logic or Socket events.
- **Tech Stack:** `ag-grid-react` (Tables), `@amcharts/amcharts5` (Charts), Tailwind CSS v4. No `any` types. Use `pnpm` exclusively.