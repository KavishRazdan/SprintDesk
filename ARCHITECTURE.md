# 🏗️ SprintDesk — Architecture & Engineering Specification

SprintDesk is an enterprise-grade Sprint Management Dashboard built with **React 18+**, **TypeScript (strict mode)**, **Vite**, **Tailwind CSS v3+**, **Zustand**, **TanStack Query v5**, and **@dnd-kit/core**.

This document outlines the architectural decisions, data flow, state management hierarchy, component composition, security, and performance optimizations.

---

## 🗺️ 1. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                 USER INTERFACE (UI)                               |
|   +-------------------+   +--------------------+   +---------------------------+  |
|   |   /login (Auth)   |   | /dashboard (Stats) |   |   /board (Kanban DnD)     |  |
|   +-------------------+   +--------------------+   +---------------------------+  |
|   |                        /analytics (Recharts Data Visualization)            |  |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                           STATE MANAGEMENT & HOOKS LAYER                          |
|                                                                                   |
|  +---------------------------+  +-------------------------+  +-----------------+  |
|  |     Client App State      |  |      Server State       |  |   Local State   |  |
|  |      (Zustand Stores)     |  |    (TanStack Query v5)  |  |  (React Hooks)  |  |
|  |  - AuthStore (Tokens)     |  |  - Notification Polling|  |  - Modals       |  |
|  |  - BoardStore (Tasks DnD) |  |  - Refetch Lifecycle    |  |  - Forms        |  |
|  |  - NotificationStore      |  |  - Visibility Listener |  |  - Active Tabs  |  |
|  |  - ThemeStore             |  +-------------------------+  +-----------------+  |
|  +---------------------------+                                                    |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                        API ACCESS & INTERCEPTOR LAYER                             |
|                                                                                   |
|  +---------------------+   +--------------------------+   +--------------------+  |
|  |    Axios Client     |   | Bearer Token Interceptor |   | Silent Token Retry |  |
|  |  (Base URL Config)  |──►| (Auto Attach Authorization)|──►| (401 Refresh Queue) |  |
|  +---------------------+   +--------------------------+   +--------------------+  |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                             EXTERNAL & MOCK DATA SOURCES                          |
|                                                                                   |
|  +---------------------+   +--------------------------+   +--------------------+  |
|  | DummyJSON Auth API  |   |  JSONPlaceholder Posts   |   |   mock-data.json   |  |
|  |  (Login & Refresh)  |   |   (Notification Feed)    |   |  (30 Seed Tasks)   |  |
|  +---------------------+   +--------------------------+   +--------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 🏛️ 2. Architectural Principles & Layer Separation

SprintDesk enforces strict layer separation to ensure code scalability, testability, and decouple the UI from specific backend implementations:

```
UI Components ──► Custom Hooks / TanStack Query ──► Service / Store Layer ──► Data Access API
```

1. **UI Layer (`src/pages/`, `src/components/`, `src/layout/`)**:
   - Zero direct calls to `fetch()` or `axios` inside components.
   - Consumes domain logic through custom hooks (`useAuth`, `useBoard`, `useNotifications`, `useToast`).
   - Every single component primitive (`Button`, `Input`, `Select`, `Modal`, `Toast`, `DataTable`, `Skeleton`) is built **100% from scratch** without third-party component libraries.

2. **Hook & Query Layer (`src/hooks/`, `src/services/`)**:
   - Encapsulates state mutations, TanStack Query polling logic, and visibility listeners (e.g. pausing polling when tab is hidden).

3. **State Management Hierarchy**:
   - **Server State (TanStack Query v5)**: Managed with caching, garbage collection, and window visibility listeners. Used for polling `jsonplaceholder.typicode.com/posts?_limit=5`.
   - **Client Application State (Zustand)**: Used for global persistent user sessions, Kanban Board state (`@dnd-kit` reorders, moves, CRUD, undo stack), notifications store, and dark theme state.
   - **Local Component State**: Kept local to components for transient UI logic (modal open/close state, active tab selections, draft input values).

4. **API Service Layer (`src/api/client.ts`, `src/api/interceptors.ts`, `src/services/`)**:
   - Centralized Axios instance with request and response interceptors.
   - Automatically injects `Authorization: Bearer <accessToken>` headers.
   - Handles 401 Unauthorized errors by queueing requests, requesting a new access token via `/auth/refresh`, and retrying queued requests silently.

---

## 🎨 3. Design System Architecture

SprintDesk features a custom futuristic **GrubPac-inspired dark technology identity**:

- **Color Palette**:
  - Primary Background: `#020B09`
  - Secondary Header & Columns: `#041F18`
  - Dark Surface Cards: `#0A1513`
  - Primary Accent: `#00F5A0` (Vibrant Mint Cyan) & `#22C55E` (Emerald Green)
  - Text Primary: `#FFFFFF`
  - Text Secondary: `#A1A1AA`
- **Typography**:
  - Headings: **Space Grotesk** (tight tracking, bold, futuristic)
  - Body: **Inter** (clean readability)
- **Component Primitives**:
  - `Button`: Variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), sizes (`sm`, `md`, `lg`), loading spinner, glowing shadow.
  - `Input`: Rounded-full / rounded-xl, left/right icon slots, focus ring `#00F5A0`.
  - `Select`: Fully keyboard-accessible custom dropdown with ARIA attributes and focus management.
  - `Modal`: Glass panel backdrop blur, focus trapping, Escape key listener, rendered at `document.body` level via `createPortal`.
  - `ToastContainer`: Accessible alert container with auto-dismiss and color-coded left borders.
  - `DataTable`: Generic paginated table with sorting, loading skeletons, and empty state.
  - `Skeleton`: Shimmer pulse loader placeholders.

---

## 🛡️ 4. Security & Authentication Design

1. **Token Storage**:
   - `accessToken`: Kept **in-memory** inside Zustand `authStore` to prevent XSS storage extraction.
   - `refreshToken`: Stored in `localStorage` simulating persistent session renewal.
   - **30-Day Persistence**: "Remember Me" toggle supported on the sign-in form.

2. **Route Protection**:
   - `ProtectedRoute`: Guards `/dashboard`, `/board`, `/analytics`. Redirects unauthenticated users to `/login`.
   - `PublicOnlyRoute`: Guards `/login`. Redirects authenticated users to `/dashboard`.
   - Full-screen session restoration splash screen shown while validating existing refresh tokens on startup.

---

## ⚡ 5. Performance & Accessibility Optimizations

1. **Performance**:
   - **Route Code Splitting**: Routes loaded lazily using `React.lazy()` and `<Suspense>` to keep initial JS bundle small.
   - **Component Memoization**: `TaskCard` and `KanbanColumn` wrapped in `React.memo` to avoid unnecessary re-renders during drag-and-drop.
   - **Zustand Selectors**: Uses scalar atomic selectors to avoid React 19 snapshot cache invalidation.

2. **Accessibility (WCAG 2.1 AA)**:
   - Keyboard navigation for modals (focus trap, `Escape` key close, focus restoration).
   - `@dnd-kit` KeyboardSensor enabled for accessible drag-and-drop.
   - Proper form labeling with `htmlFor` and `useId()`.
   - Clear ARIA attributes (`aria-expanded`, `aria-haspopup`, `aria-invalid`, `aria-describedby`).
