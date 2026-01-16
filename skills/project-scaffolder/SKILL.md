---
name: project-scaffolder
description: "Generate a production-ready React + Hono monorepo with a feature-first architecture, a platform layer (Axios + React Query + third-party SDK wrappers), and shared packages (types, zod validation, UI, config). Enforces strict guardrails: domain features in apps/web and apps/api, centralized platform clients, zod at boundaries, barrel exports, and consistent query keys. Use for scaffolding, extending features, or refactoring into this structure."
snippet: "Generate a production-ready React + Hono monorepo with feature-first architecture"
---

# project-scaffolder

## When to use this skill

Use this skill when the user asks to:

- Scaffold or refactor a monorepo for React (frontend) + Hono (backend) with shared packages.

- Add a new feature/domain (payment, user, orders) following feature-first conventions and platform clients.

- Introduce platform-level Axios instance, React Query caching, and third-party SDK wrappers (e.g., email).

- Enforce shared types/schemas and strict data contracts between web and api.

**Example scenarios:**

- "Generate a React + Hono monorepo with payment/user features and shared zod types."

- "Add an 'orders' feature with pages, hooks, services, API routes, and shared validation."

- "Replace direct Resend usage with a platform client wrapper and update all feature imports."

## Tech Stack

This skill requires knowledge of the following technologies. The agent should ask the user to specify their choices for each category before proceeding:

- **Language/Runtime**: TypeScript, JavaScript, Node.js version requirements
- **Frontend Framework**: React, Vue, Svelte, or other (specify version)
- **UI Library**: Tailwind CSS, Material-UI, Chakra UI, shadcn/ui, or custom CSS
- **Backend Framework**: Hono, Express, Fastify, or other (specify version)
- **State Management**: React Query, Zustand, Redux, or other
- **HTTP Client**: Axios, Fetch API, or other
- **Validation**: Zod, Yup, or other schema validation library
- **Build Tool**: Vite, Webpack, Turbopack, or other
- **Monorepo Tool**: pnpm workspaces, Turborepo, Nx, or other
- **Package Manager**: pnpm, npm, yarn
- **Database/ORM**: Prisma, Drizzle, TypeORM, or other (if applicable)
- **Testing**: Vitest, Jest, or other (if applicable)

**Important**: Always ask the user to specify their tech stack choices before scaffolding. Do not assume defaults.


## How it works

The skill creates a consistent monorepo skeleton and code modules with strict boundaries:

- apps/web: React feature-first architecture (components, hooks, services, pages, store).

- apps/api: Hono routes (handlers, service, schemas), subrouters per feature.

- packages: shared types, zod schemas, UI components, and common config.

- platform layer: central Axios instance, React Query client, query keys, and third-party SDK wrappers.

- Guardrails: All data IO validated with zod; features import only platform services; barrel exports control public API; secrets never in client.

## Step-by-step instructions

### Step 1: Assess project state and create workspace structure

**First, check if the project already has an existing code structure:**

- Check for existing directories: `src/`, `app/`, `apps/`, `packages/`, or any feature directories
- Check for existing configuration files: `package.json`, `tsconfig.json`, `vite.config.ts`, or framework config files
- Check for existing source files in the root or common locations

**If the project already has code structure:**
- Skip workspace initialization
- Analyze the existing structure to understand the current organization
- Proceed to adapt the baseline conventions to the existing structure rather than creating new folders
- Document the existing structure and work within it

**If the project is new or empty:**
- Initialize a monorepo using the user's specified package manager (pnpm workspaces, yarn, npm) and monorepo tool (Turborepo, Nx, or basic workspaces)
- Create apps/web, apps/api, packages/types, packages/validation, packages/ui, packages/config directories
- Add environment support (dotenv or framework-specific env handling) and tsconfig base configuration

**Example:**

```
// root
.
├── apps/                                                    # Application code (frontend + backend)
│   ├── web/                                                 # React app (Vite)
│   │   ├── index.html                                       # App shell loaded by Vite
│   │   ├── vite.config.ts                                   # Vite config (aliases, env, dev server proxy)
│   │   ├── tsconfig.json                                    # Extends root tsconfig.base; web-specific paths
│   │   ├── .env.example                                     # Frontend env (non-secret) e.g. VITE_API_URL
│   │   └── src/
│   │       ├── main.tsx                                     # Entry: mounts AppProviders + Router
│   │       ├── app/                                         # App shell, global providers, routing
│   │       │   ├── App.tsx                                  # Top-level layout; composes header/footer/outlet
│   │       │   ├── AppProviders.tsx                         # QueryClientProvider, theme, toasts, etc.
│   │       │   ├── router.tsx                               # Route definitions (feature pages wired here)
│   │       │   ├── routes/                                  # Optional: file-based route components
│   │       │   │   ├── HomePage.tsx                         # Example home page
│   │       │   │   └── NotFoundPage.tsx                     # 404 page
│   │       │   ├── styles/                                  # Global CSS (Tailwind, variables)
│   │       │   │   ├── index.css                            # Global styles import
│   │       │   │   └── tailwind.css                         # If using Tailwind
│   │       │   └── providers/                               # Additional providers (Auth, Theme, Intl)
│   │       │       └── AuthProvider.tsx                     # Centralized auth state/context
│   │       ├── platform/                                    # Platform layer: HTTP, React Query, SDK wrappers
│   │       │   ├── http.ts                                  # Axios instance + interceptors (baseURL, auth)
│   │       │   ├── query.ts                                 # QueryClient + query keys (QK) helpers
│   │       │   ├── services/                                # Domain HTTP clients (typed, zod-validated)
│   │       │   │   ├── paymentClient.ts                     # charge/get endpoints -> zod validate -> typed
│   │       │   │   ├── userClient.ts                        # list/create endpoints -> zod validate -> typed
│   │       │   │   └── index.ts                             # Barrel exports for platform services
│   │       │   ├── thirdparty/                              # Client-side SDK wrappers (if truly safe)
│   │       │   │   ├── resendEmailClient.ts                 # Wrap Resend; NOTE: prefer server-side usage
│   │       │   │   └── index.ts                             # Barrel for thirdparty clients
│   │       │   └── config.ts                                # Platform config (timeouts, retries, feature flags)
│   │       ├── shared/                                      # Cross-feature UI and helpers (local to web)
│   │       │   ├── components/                              # Reusable presentational components
│   │       │   │   ├── Button.tsx                           # Generic button wrapper
│   │       │   │   ├── Input.tsx                            # Generic input field
│   │       │   │   └── Modal.tsx                            # Generic modal component
│   │       │   ├── hooks/                                   # Shared hooks (e.g., useToast)
│   │       │   │   └── useToast.ts                          # Toast notifications hook
│   │       │   ├── utils/                                   # Shared utilities (formatters, guards)
│   │       │   │   ├── formatCurrency.ts                    # Currency formatting
│   │       │   │   └── guards.ts                            # Type guards helpers
│   │       │   └── index.ts                                 # Barrel exports for shared components/hooks/utils
│   │       └── features/                                    # Feature-first structure (one folder per domain)
│   │           ├── payment/
│   │           │   ├── components/                          # UI pieces; pure presentational
│   │           │   │   ├── PaymentForm.tsx                  # Controlled form; props-only logic
│   │           │   │   ├── Summary.tsx                      # Shows totals/status
│   │           │   │   └── StatusBadge.tsx                  # Approved/Declined indicator
│   │           │   ├── hooks/                               # Feature hooks orchestrate state + services
│   │           │   │   ├── useChargePayment.ts              # useMutation -> paymentService.charge
│   │           │   │   └── usePaymentById.ts                # useQuery -> paymentService.getById
│   │           │   ├── pages/                               # Route-level containers compose components/hooks
│   │           │   │   ├── CheckoutPage.tsx                 # Wires form/hooks; handles UX states
│   │           │   │   └── PaymentDetailPage.tsx            # Shows a payment by reference/id
│   │           │   ├── services/                            # Feature-facing service layer (calls platform)
│   │           │   │   ├── paymentService.ts                # Delegates to PaymentClient; maps to UI models
│   │           │   │   └── index.ts                         # Barrel for feature services
│   │           │   ├── store/                               # Feature state (slice/context if needed)
│   │           │   │   └── checkoutSlice.ts                 # Local slice for status/steps (optional)
│   │           │   ├── utils/                               # Feature-specific utilities
│   │           │   │   └── normalizePayment.ts              # Map API DTO -> UI-friendly model
│   │           │   └── index.ts                             # Barrel for public exports of payment feature
│   │           ├── user/
│   │           │   ├── components/
│   │           │   │   └── UserDropdown.tsx                 # Select user; typed props only
│   │           │   ├── hooks/
│   │           │   │   └── useUsers.ts                      # useQuery -> UserClient.list
│   │           │   ├── pages/
│   │           │   │   └── UsersPage.tsx                    # Page wiring list/create UX
│   │           │   ├── services/
│   │           │   │   └── userService.ts                   # Delegates to UserClient
│   │           │   ├── store/
│   │           │   │   └── userSlice.ts                     # Optional: current user selection
│   │           │   ├── utils/
│   │           │   │   └── normalizeUser.ts                 # Map API DTO -> UI model
│   │           │   └── index.ts                             # Barrel for user feature
│   │           └── index.ts                                  # Public exports for all features
│   └── api/                                                 # Hono backend
│       ├── package.json                                     # Backend scripts and deps
│       ├── tsconfig.json                                    # Backend tsconfig
│       ├── .env.example                                     # Server env template (secrets live here)
│       └── src/
│           ├── index.ts                                     # Entry point (node/worker bootstrap)
│           ├── server.ts                                    # Hono app setup: middlewares + route mounting
│           ├── routes/                                      # Subrouters per domain (feature-first)
│           │   ├── payment/
│           │   │   ├── index.ts                             # Subrouter registration (/payment)
│           │   │   ├── handlers.ts                          # Hono handlers; thin controllers
│           │   │   ├── schemas.ts                           # Import shared zod; (optional) OpenAPI wiring
│           │   │   └── service.ts                          # Business logic independent of Hono
│           │   ├── user/
│           │   │   ├── index.ts
│           │   │   ├── handlers.ts
│           │   │   ├── schemas.ts
│           │   │   └── service.ts
│           │   └── health.ts                                # GET /health; simple readiness probe
│           ├── middlewares/                                 # Cross-cutting concerns
│           │   ├── cors.ts                                  # CORS config (origins, headers)
│           │   ├── auth.ts                                  # Auth (JWT/session) guard
│           │   ├── error.ts                                 # Unified error handling/formatting
│           │   └── logging.ts                               # Request logging
│           ├── libs/                                        # Integrations: DB/cache/third-party SDKs
│           │   ├── db.ts                                    # DB client (Prisma/Drizzle) init
│           │   ├── cache.ts                                 # Cache client (Redis)
│           │   ├── paymentsGateway.ts                       # External payments provider wrapper
│           │   └── emailClient.ts                           # Server-side email (Resend) using secrets
│           ├── config/                                      # Server config (env parsing, constants)
│           │   └── env.ts                                   # Zod-validated env variables
│           └── utils/                                       # Server utilities (id, time, etc.)
│               └── id.ts                                    # ULID/UUID helpers
│       └── wrangler.toml                                    # Example: Cloudflare Workers config (or vercel.json)
├── packages/                                                # Shared libraries across apps
│   ├── types/                                               # Canonical DTOs and enums (source of truth)
│   │   ├── package.json                                     # Library metadata (type: module)
│   │   ├── tsconfig.json                                    # Build tsconfig for types package
│   │   └── src/
│   │       ├── payment.ts                                   # PaymentRequest/PaymentResponse types
│   │       ├── user.ts                                      # User type(s)
│   │       └── index.ts                                     # Barrel exports for all types
│   ├── validation/                                          # Zod schemas shared by web/api
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── payment.ts                                   # PaymentRequestSchema/PaymentResponseSchema
│   │       ├── user.ts                                      # UserSchema/UsersSchema
│   │       └── index.ts                                     # Barrel exports for schemas
│   ├── ui/                                                  # Shared design system primitives
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── Button.tsx                                   # Shared button with theme/variants
│   │       ├── Input.tsx                                    # Shared input
│   │       ├── Spinner.tsx                                  # Loading spinner
│   │       └── index.ts                                     # Barrel exports for UI components
│   ├── config/                                              # Shared tooling configs to extend in apps
│   │   ├── package.json
│   │   ├── eslint/                                          # ESLint config modules
│   │   │   └── index.js                                     # Base config (no-restricted-imports guardrails)
│   │   ├── tsconfig/                                        # TS base configs
│   │   │   └── base.json                                    # Compiler options, path aliases
│   │   ├── prettier/                                        # Prettier config
│   │   │   └── index.json                                   # Formatting rules
│   │   └── index.ts                                         # Optional: export helpers for configs
│   └── rpc/                                                 # Optional: Hono RPC typed client bindings
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── client.ts                                    # Generated bindings to API routes
│           └── index.ts                                     # Barrel exports
├── package.json                                             # Root scripts (dev/build/lint/test) + workspaces
├── pnpm-workspace.yaml                                      # Workspaces definition (apps/*, packages/*)
├── tsconfig.base.json                                       # Base TS config extended by apps/packages
├── turbo.json                                               # Turborepo pipelines: build/test/lint/cache
├── .editorconfig                                            # Consistent editor settings
├── .prettierignore                                          # Ignore generated files
├── .eslintignore                                            # Ignore build output
└── .gitignore                                               # Ignore node_modules, dist, env files

# Notes and guardrails:
# - Feature-first: Every domain (payment, user, etc.) mirrors the same folder pattern in web/api.
# - Platform-only IO: Frontend features import services from platform/services; never import axios or third-party SDKs directly.
# - Shared contracts: All request/response types live in packages/types; validation in packages/validation. Both web and api import from here.
# - Thin handlers: Backend handlers validate input/output (zod) and delegate to service.ts; business logic resides in service.ts and libs/*.
# - Barrel exports: Each feature and package exposes a controlled API via index.ts to prevent deep, unstable imports.
# - Secrets: Client-side .env holds non-secrets only (VITE_*). Real secrets (API keys) exist in server .env and are used in apps/api/libs/*.
# - Query keys: Centralized in platform/query.ts to keep cache keys consistent; features must use QK helpers.
# - Lint rules: packages/config/eslint/index.js should enforce no-restricted-imports to block direct third-party SDK/axios usage in features.
# - Path aliases: tsconfig.base.json defines @repo/* (types, validation, ui) used across apps; vite.config.ts / backend tsconfig resolve same aliases.
# - Testing: add unit tests per feature/service; e2e can live under apps/*/tests; ensure schemas/types are the single source of truth in tests.
```

### Step 2: Implement shared packages (contracts first)

- packages/types: canonical DTOs for requests/responses.

- packages/validation: zod schemas for every DTO.

- packages/config: shared eslint/prettier/tsconfig; both apps extend these.

- packages/ui: shared React primitives (Button, Input, Modal) for consistent design.

**Example:**

### Step 3: Build the web platform layer

- Create apps/web/src/platform/http.ts with Axios instance and interceptors.

- Create apps/web/src/platform/query.ts with QueryClient and query key helpers.

- Create apps/web/src/platform/services/*Client.ts for domain clients (PaymentClient, UserClient) that use http and zod.

- Create apps/web/src/platform/thirdparty/* wrappers (e.g., ResendEmailClient) so features never import SDKs directly.

**Example:**

### Step 4: Implement feature modules in web

- Under apps/web/src/features/{domain}/ create components, hooks, services, pages, store, utils, index.ts.

- Hooks use React Query's useQuery/useMutation with platform clients.

- Components are presentational; services orchestrate platform clients; pages compose everything.

**Example:**

### Step 5: Implement api feature modules in Hono

- apps/api/src/routes/{domain}/ with index.ts, handlers.ts, service.ts, schemas.ts.

- handlers validate input/output with shared zod schemas and delegate to service.

- service contains business rules and calls libs (db, gateway).

- server.ts registers subrouters and middlewares (CORS/auth/logging).

**Example:**

### Step 6: Wire app shell and providers

- apps/web/src/app/AppProviders.tsx wraps QueryClientProvider.

- apps/web/src/app routes and layout configure feature pages.

- Ensure env variables and secrets are handled correctly (client vs server).

**Example:**

## Complete examples

### Example 1: Scaffold a new "orders" feature end-to-end

**User request:** "Add an orders feature with list/detail pages, useQuery/useMutation, and Hono endpoints."

**What the agent should do:**

1. Create apps/web/src/features/orders/{components,hooks,services,pages,store,utils,index.ts}.

2. Create apps/api/src/routes/orders/{index.ts,handlers.ts,service.ts,schemas.ts}.

3. Add packages/types/orders.ts and packages/validation/orders.ts.

4. Implement OrdersClient in platform/services; use it in feature services and hooks.

**Expected output:**

### Example 2: Replace direct SDK usage with platform wrapper

**User request:** "Stop importing Resend in features; use a platform email client."

**What the agent should do:**

1. Create apps/web/src/platform/thirdparty/resendEmailClient.ts.

2. Remove Resend imports from features; expose functions via a platform EmailClient interface.

3. Update feature services/hooks to call platform email client methods.

**Expected output:**

## Edge cases and error handling

### Edge case 1: Secret keys required by third-party SDK

**When this occurs:** SDK requires server-side secrets (e.g., Resend API key).

**How to handle:** Use server-side integration only. Create backend service (apps/api/libs/emailClient.ts) and expose an API endpoint; the web calls your endpoint, not the SDK.

**Example:**

### Edge case 2: Response shape drift between server and client

**When this occurs:** Client fails zod parsing of server response.

**How to handle:** Fail fast; log error; return typed error to UI; fix shared schema in packages/validation and align both sides.

**Example:**

### Edge case 3: Network/auth errors

**When this occurs:** Axios throws due to network or 401.

**How to handle:** Centralize in http interceptors; bubble meaningful errors; optionally trigger refresh or logout; notify features via React Query error states.

### Edge case 4: Feature import boundary violations

**When this occurs:** Feature imports third-party SDK or deep files from other features.

**How to handle:** Enforce lint rules (no-restricted-imports); expose only via index.ts barrels; refactor to use platform services.

## Limitations

- This skill does not generate proprietary UI kits; it scaffolds minimal packages/ui primitives only.

- Real DB schemas and complex infra (CI/CD, deployments) are placeholders; integrate your provider specifics in apps/api/libs and configs.

- If the stack deviates (e.g., no React Query or Axios), adapt the platform layer equivalents; guardrails assume Axios + React Query.

## Notes

- Always put contracts first: update packages/types and packages/validation before coding features or endpoints.

- Features never import Axios or third-party SDKs directly—only platform clients.

- All IO (requests and responses) must be validated with zod at both ends.

- Use barrel exports (index.ts) to define feature public API; avoid deep imports.

- Keep secrets server-side; client uses environment variables only for non-sensitive config.
