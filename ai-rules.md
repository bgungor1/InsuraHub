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
- **Historical Context & Transfers:** Users MAY be transferred between branches. However, transferring a user MUST NOT rewrite historical policy ownership, commissions, or audit records. 
- **Large Dataset Export:** Exports MUST use server-side processing, respect organizational scope, and NEVER load unbounded datasets into browser memory.

### 3. BACKEND ENTERPRISE STANDARDS
- **File Size Limits (Anti-Hoarding):** Prevent "God Objects". Backend files (especially Services) MUST NOT exceed 250-300 lines of code. Controllers must be under 150 lines. 
- **Audit Logging & Traceability:** Every critical business action MUST generate an immutable audit log (Who did what, and when).
- **No Magic Numbers/Strings:** NEVER hardcode business rules, statuses, or commission rates into functions. Use Enums or a centralized `constants.ts` file.
- **Pagination by Default:** Any API endpoint returning a list of data MUST implement pagination (`skip`/`take`). NEVER return unbounded arrays.
- **Environment Variable Validation (Fail Fast):** All environment variables MUST be validated at application startup. 

### 4. FRONTEND RULES (Next.js, Zustand & UI)
- **Framework & State:** App Router ONLY. Default to React Server Components (SSR). Use `"use client"` ONLY when interactivity (hooks, Zustand state, onClick) is explicitly required.
- **State Management & Interaction:** Use **Zustand** for global UI state. Components MUST NOT call APIs directly without a structured layer.
- **Single Source of Truth:** The UI MUST strictly reflect the backend state. Frontend MUST NOT calculate business logic or commissions. 
- **Component & UI Rules:** Keep components small and reusable (< 150 lines). Use `ag-grid-react` for massive data tables. Use `@amcharts/amcharts5` for dashboards.
- **Code Quality:** Use `camelCase` for variables/functions, `PascalCase` for Components/Classes, and `kebab-case` for file/folder names. No `any` types. 

### 5. POLICY LIFECYCLE & CONCURRENCY
- **Explicit State Machine:** Policy lifecycle MUST be modeled as a strict state machine. Valid/invalid transitions MUST be defined centrally in the backend. 
- **Atomic Claiming:** Policy claiming MUST be an atomic server-side operation. The database MUST verify the policy is still in an "unassigned" state at the exact moment of assignment. 

### 6. REAL-TIME, NOTIFICATIONS & AUDIT TRAIL
- **Socket.io vs. State:** Socket.io MUST ONLY be used for transient real-time UI synchronization, NEVER as the source of truth for authorization or financial state. 
- **Persistent Notifications:** Business-critical alerts MUST be stored as persistent notifications in the DB, separate from transient Socket events.

### 7. BUSINESS DOMAIN & OPERATIONAL RULES (CRITICAL)
- **Commission Rule Versioning (Temporal Logic):** NEVER overwrite an active commission rule. Use temporal versioning (`validFrom`, `validUntil`). To change a rule, deactivate the old (`validUntil = Date.now()`) and create a new one. Per YAGNI, rules are **Global** by default.
- **Calculation Trigger (Revenue Recognition):** Commissions MUST ONLY be calculated and finalized using the commission rule that is valid at the exact time the policy transition to `COMPLETED` is committed within the database transaction.
- **Commission Snapshots (Immutability):** Once calculated, the commission distribution MUST be saved as an immutable `CommissionSnapshot`. Historical commissions MUST NEVER change.
- **Rounding & Leftover Cents:** Calculate bottom tiers first (Broker, Branch, Agency). The top-tier (Company) share is calculated by subtracting the sum of the bottom tiers from the total amount.
- **Claim Release (Time-To-Live & Manual):** Implement a hybrid release model: Manual release by Broker, forced release by Branch Manager, and a Cron Job TTL release. The TTL duration MUST be configurable (e.g., via `.env`).
- **Policy Renewal (Linked Group Model):** Policy renewals MUST be created as completely new policy records, linked to the old one using a `previousPolicyId`.
- **Payout Separation & Idempotency:** The system MUST separate `Commissions` from `Payouts`. A `CommissionSnapshot` MUST NOT be paid out twice.

### 8. DOMAIN MODEL & ENTITY RELATIONSHIPS (NEW)
- **User Architecture:** Single-role model. A user has one specific role (e.g., Broker) and a specific organizational scope (e.g., `branchId`).
- **Customer Isolation:** `Customer` is an independent entity. Do not link Customers directly to Branches. The relationship to a branch is derived through their `Policy`.
- **Policy Assignment Model:** Do not embed claim status directly inside the Policy. Use a separate `PolicyAssignment` entity to track the full lifecycle of a claim (claimedBy, assignedAt, releasedAt, releaseReason) for deep auditability.
- **Payout Relationship Model:** Use a bridge table for payouts. The flow is: `CommissionSnapshot` -> `PayoutItem` -> `Payout`. A Payout represents a billing period containing multiple PayoutItems.
- **AuditLog & Notifications:** Must be standalone governance entities referencing actors and target entities, not embedded arrays inside business documents.
- **Centralized Support Model (Ticketing):** The ticket/support system MUST NOT be strictly hierarchical or peer-to-peer. It MUST follow a centralized flow where Branches and Agencies open tickets directly to the core Insurance Company's operation pool. 
- Tickets MUST contain a mandatory categorization (e.g., `TECHNICAL`, `POLICY_APPROVAL`, `FINANCE`).
 - **Visibility Scope:** Company Users have full access. Brokers/Branch Managers ONLY see tickets they created. Agency Managers MUST have "Read-Only" visibility into tickets opened by their subsidiary branches to monitor operations.