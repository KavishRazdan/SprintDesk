# 🌿 SprintDesk — Enterprise Sprint Management Dashboard

SprintDesk is a production-quality, enterprise-ready Sprint Management SaaS Application built with **React 18+**, **TypeScript (strict mode)**, **Vite**, **Tailwind CSS v3+**, **Zustand v5**, **TanStack Query v5**, **@dnd-kit/core**, **Recharts**, **Vitest**, and **React Testing Library**.

Every single UI component primitive (`Button`, `Input`, `Select`, `Modal`, `Toast`, `DataTable`, `Skeleton`, `TaskCard`, `KanbanColumn`, `NotificationBell`, `SprintDeskLogo`) has been **built 100% from scratch** without using third-party component libraries.

---

## 🚀 Quick Links & Deployment

- **GitHub Repository**: Ready for pushing to GitHub (`git init`, `git add .`, `git commit -m "feat: SprintDesk SaaS App"`)
- **Vercel / Netlify Deployment**: Configured with `vercel.json` and `public/_redirects` for 100% seamless single-page application (SPA) routing.

---

## 🎨 Design System & Visual Identity

### Sage Green & Warm Beige Aesthetic (Section 7 Compliant)
- **App Background (`app-bg`)**: Warm, light beige/off-white (`#F4F2EE`)
- **Brand Primary (`brand-primary`)**: Muted, earthy sage green (`#728974`)
- **Surface (`surface`)**: Pure white (`#FFFFFF`) for all cards, panels, and sidebars
- **Text Main (`text-main`)**: Dark charcoal (`#1C1C1C`) for primary headings and data points
- **Text Muted (`text-muted`)**: Medium slate gray (`#8A8A8A`) for secondary text and table headers
- **Sidebar Active Nav Item**: Solid, fully rounded pill (`rounded-full`) filled with `#1C1C1C` dark charcoal background and white text/icons
- **Custom Geometric SVG Logo (`SprintDeskLogo.tsx`)**: Abstract geometric sunburst icon consisting of 8 radiating sage green pill petals around a central hub

### Dual Theme Support
- **Light Mode**: Sage Green & Warm Beige aesthetic (`#F4F2EE` backdrop, `#FFFFFF` cards, `#1C1C1C` text).
- **Dark Mode**: GrubPac dark technology aesthetic (`#020B09` backdrop, `#041F18` emerald header, `#0A1513` surface cards, `#00F5A0` mint cyan highlights).

---

## ⚡ Tech Stack (100% Mandatory & Compliant)

- **Framework**: React 18+ (React 19)
- **Language**: TypeScript (strict mode enabled)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3+ with custom design tokens
- **Routing**: React Router v6+ (v7 SPA routing)
- **Server-State Management**: TanStack Query v5 (polling, caching, window visibility handling)
- **Client-State Management**: Zustand v5 (auth tokens, board drag-and-drop state, notifications, theme)
- **Drag and Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Data Visualization**: Recharts (dynamic, responsive sprint analytics)
- **Testing**: Vitest + React Testing Library + jsdom

> **Strict Prohibition Compliance**:
> ❌ NO Next.js, NO Remix, NO Material UI, NO Ant Design, NO Chakra UI, NO Shadcn UI, NO react-beautiful-dnd.

---

## 🚀 Key Functional Features

### 1. Authentication (`/login` & `/signup`)
- **DummyJSON Auth API Integration**: Authenticates via `POST https://dummyjson.com/auth/login`.
- **Token Management**: In-memory `accessToken` storage + `localStorage` refresh token persistence.
- **Axios Bearer Interceptor**: Automatically attaches Authorization header to outgoing requests.
- **Silent Refresh Queue**: Intercepts `401 Unauthorized` responses, calls `/auth/refresh`, and silently retries queued requests.
- **Route Guarding**: Protected routes (`/dashboard`, `/board`, `/analytics`) vs Public routes (`/login`, `/signup`).
- **Bonus Features**:
  - **Remember Me**: Simulated 30-day session persistence checkbox.
  - **Password Strength Indicator**: Dynamic weak / medium / strong character evaluation.
  - **Dedicated Sign Up Page**: Full `/signup` registration screen with auto-fill demo capabilities.

### 2. Kanban Sprint Board (`/board`)
- **4 Columns**: Backlog, In Progress, Review, Done.
- **Initial Seed Data**: Populated with 30 tasks mapped directly from `mock-data.json`.
- **Drag & Drop**: Built with `@dnd-kit/core`. Supports reordering within columns and moving between columns.
- **Action History Stack & Undo**: Full undo capability (`undoLastAction()`) to revert drag-and-drop actions.
- **Task Drawer**: Portaled side drawer (`createPortal`, `z-[9999]`) for viewing and editing title, status, priority, story points, due date, assignee, and comments.
- **Task Management**: Create new sprint tasks and delete tasks with confirmation modal.
- **Persistence**: Board state persists across page refreshes via Zustand `persist`.

### 3. Real-Time Notifications (`useNotifications.ts`)
- **Polling Hook**: Polls notification telemetry at regular intervals.
- **TanStack Query Caching**: Refetches in background without layout shift.
- **Badge Counter & Bell Drawer**: Interactive unread counter badge and notification drawer.

### 4. Sprint Analytics (`/analytics`)
- **4 Dynamic Recharts**:
  1. **Sprint Velocity**: Planned vs Completed story points per sprint.
  2. **Task Status Distribution**: Pie chart breakdown of active sprint task statuses.
  3. **Priority Breakdown**: Bar chart categorizing tasks by priority tier.
  4. **Completion Trend**: Area chart showing cumulative task progression.

### 5. Multi-Device Responsiveness
- **Desktop (1440px+)**: Sidebar layout with global search bar and metric grids.
- **Tablet (768px - 1024px)**: Responsive multi-column layout.
- **Mobile (375px - 640px)**: Portaled sliding navigation drawer (`z-[9999]`), horizontal column scrolling on board, and responsive modal dialogs.

---

## 📁 Project Architecture

```
SprintDesk/
├── public/
│   ├── _redirects            # Netlify SPA rewrite configuration
│   └── favicon.svg           # Brand favicon
├── src/
│   ├── api/
│   │   ├── auth.api.ts       # DummyJSON Login API methods
│   │   └── interceptors.ts   # Axios bearer token & 401 retry queue
│   ├── components/
│   │   ├── Button/           # Scratch-built Button primitive
│   │   ├── DataTable/        # Sortable & paginated table component
│   │   ├── Input/            # Form Input with left/right icons
│   │   ├── KanbanColumn/     # Droppable Kanban column container
│   │   ├── Modal/            # Accessible dialog portal
│   │   ├── NotificationBell/ # Polled notification drawer
│   │   ├── Select/           # Custom listbox dropdown
│   │   ├── Skeleton/         # Pulse loading fallback
│   │   ├── SprintDeskLogo/   # Custom geometric sunburst SVG logo mark
│   │   ├── TaskCard/         # Draggable task card item
│   │   └── Toast/            # Toast alert notification container
│   ├── hooks/
│   │   ├── useAuth.ts        # Authentication workflow hook
│   │   ├── useBoard.ts       # Board state and filter selectors
│   │   ├── useNotifications.ts # Polling hook via TanStack Query
│   │   └── useToast.ts       # Global toast trigger hook
│   ├── layout/
│   │   ├── AuthLayout.tsx    # Split hero layout for authentication
│   │   └── MainLayout.tsx    # Main layout with header, sidebar & drawer
│   ├── pages/
│   │   ├── Analytics/        # Recharts sprint analytics dashboard
│   │   ├── Board/            # Kanban drag-and-drop workspace
│   │   ├── Dashboard/        # Control center metrics & recent activity
│   │   └── Login/            # Login & SignUp pages
│   ├── routes/
│   │   ├── AppRoutes.tsx     # Route declarations with lazy loading
│   │   └── ProtectedRoute.tsx # Route guards
│   ├── store/
│   │   ├── auth.store.ts     # Zustand store for authentication
│   │   ├── board.store.ts    # Zustand store for sprint board tasks & undo
│   │   ├── notification.store.ts # Notification store
│   │   └── theme.store.ts   # Light/dark theme store
│   ├── types/                # Domain model TypeScript declarations
│   └── utils/
│       ├── formatters.ts     # Date & priority badge utilities
│       └── mockData.ts       # Initial seed data from mock-data.json
├── vercel.json               # Vercel SPA routing rewrite configuration
├── vite.config.ts            # Vite build setup
├── tailwind.config.js        # Sage Green & Warm Beige Tailwind tokens
└── README.md                 # Project documentation
```

---

## 🛠️ Setup & Local Development

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/SprintDesk.git
cd SprintDesk
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Unit Test Suite
```bash
npm test
```

### 4. Build Production Bundle
```bash
npm run build
```

---

## 📦 Publishing to GitHub

To push this repository to GitHub:

```bash
git init
git add .
git commit -m "feat: SprintDesk SaaS Application with Sage Green & Warm Beige aesthetic"
git branch -M main
git remote add origin https://github.com/your-username/SprintDesk.git
git push -u origin main
```

---

## ☁️ Online Deployment Guide

### Vercel Deployment (Recommended)
1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the `SprintDesk` repository.
4. Keep the default settings (Framework Preset: **Vite**, Build Command: `npm run build`, Output Directory: `dist`).
5. Click **"Deploy"**. The included `vercel.json` handles all single-page application routes.

### Netlify Deployment
1. Import the repository in [Netlify](https://netlify.com).
2. Set Build Command to `npm run build` and Publish Directory to `dist`.
3. The included `public/_redirects` file automatically configures SPA fallback routing.

---

## 📄 License
Licensed under the [MIT License](LICENSE).
