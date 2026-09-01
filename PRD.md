# PRD — Harry Potter Explorer

**Project:** Harry Potter Explorer
**Type:** Frontend Developer Take-Home Assignment
**Status:** Development
**Deployment:** Cloudflare Pages
**Framework:** Next.js App Router + TypeScript

---

## 1. Product Overview

Harry Potter Explorer is an interactive web application for exploring characters, Hogwarts houses, and spells from the Harry Potter universe.

The application uses the Harry Potter API as its primary data source and provides a clean, responsive, and intuitive browsing experience.

The project focuses on:

* Clean UI/UX
* Responsive design
* Clear component architecture
* Proper API and data handling
* Loading, error, and empty states
* Search and filtering
* Character detail pages
* Maintainable TypeScript code
* Appropriate project scoping without over-engineering

---

## 2. Goals

### Primary Goals

1. Display Harry Potter characters in a responsive interface.
2. Allow users to search for characters by name.
3. Allow users to filter characters by Hogwarts house.
4. Provide detailed information about individual characters.
5. Display a list of spells.
6. Handle loading, error, and empty states gracefully.
7. Provide a polished and consistent user interface.
8. Ensure the application works well across desktop, tablet, and mobile devices.
9. Deploy the application to Cloudflare Pages.

### Secondary Goals

* Implement character pagination.
* Provide house-based visual theming.
* Add subtle UI transitions.
* Persist search, filtering, and pagination through URL state.
* Add basic automated tests.

---

# 3. Target Users

## Primary Users

Harry Potter fans who want to:

* Search for specific characters.
* Explore character information.
* Browse characters by Hogwarts house.
* Discover spells and their descriptions.

## Secondary Users

Technical reviewers evaluating:

* Frontend architecture
* Code quality
* UI/UX quality
* API integration
* State management
* Responsiveness
* Engineering decisions

---

# 4. Scope

## 4.1 Characters

The application must provide:

* Character listing
* Responsive character grid
* Character cards
* Character search
* House filtering
* Pagination
* Character detail page
* Character image fallback
* Character metadata

### Character Card

Each character card should display, when available:

* Character image
* Name
* House
* Species
* Gender

Missing fields should be handled gracefully rather than displaying broken or misleading content.

---

## 4.2 Houses

Users can filter characters by Hogwarts house.

Supported houses:

* Gryffindor
* Hufflepuff
* Ravenclaw
* Slytherin

House identity can be represented through subtle:

* Badges
* Accents
* Borders
* Hover states
* Detail-page styling

---

## 4.3 Spells

Users can browse a list of spells.

Each spell should display:

* Spell name
* Incantation
* Description

Optional search or filtering may be added if supported efficiently by the API.

---

## 4.4 UI States

The application must provide clear states for:

* Loading
* Error
* Empty results
* Image loading
* Missing image
* Failed image

---

## 4.5 Responsive Design

The application must support:

* Mobile
* Tablet
* Desktop

The interface must not introduce unintended horizontal scrolling.

---

# 5. Out of Scope

To keep the assignment appropriately scoped, the following features are intentionally excluded:

* Authentication
* User accounts
* Database
* Custom backend API
* Admin dashboard
* Social login
* Real-time features
* WebSocket communication
* Complex global state
* CMS
* Analytics dashboard
* AI features
* Persistent user favorites
* Custom authentication or authorization system

---

# 6. Functional Requirements

## 6.1 Character Listing

Users can browse available characters from the Harry Potter API.

Example:

```text
Harry Potter
Gryffindor
Human
Male
```

The application must gracefully handle missing API fields.

---

## 6.2 Character Search

Users can search characters by name.

Example:

```text
Search characters...
```

Expected behavior:

1. User enters a search query.
2. The character list updates accordingly.
3. Only relevant characters are displayed.
4. Search state is reflected in the URL.

Example:

```text
/characters?search=harry
```

---

## 6.3 House Filter

Users can filter characters by Hogwarts house.

Available options:

```text
All
Gryffindor
Hufflepuff
Ravenclaw
Slytherin
```

Example:

```text
/characters?house=gryffindor
```

Search and house filtering should work together.

Example:

```text
/characters?search=harry&house=gryffindor
```

---

## 6.4 Pagination

Character results should be paginated to avoid displaying a large dataset on a single page.

Example:

```text
← Previous

1  2  3  4  5

Next →
```

The current page should be reflected in the URL.

Example:

```text
/characters?page=2
```

When search or filtering changes, pagination should reset or update appropriately.

---

## 6.5 Character Detail

Users can navigate to an individual character detail page.

Route:

```text
/characters/[id]
```

The detail page should display available character information such as:

* Name
* Image
* House
* Species
* Gender
* Actor
* Date of birth
* Ancestry
* Patronus
* Hogwarts student status
* Hogwarts staff status
* Wand information

Only available fields should be displayed.

---

## 6.6 Spells

Users can browse available spells.

Example:

```text
Expelliarmus

Incantation:
Expelliarmus

Description:
Disarms an opponent.
```

Route:

```text
/spells
```

---

# 7. User Experience Requirements

## 7.1 Navigation

The application should provide global navigation:

```text
Harry Potter Explorer

Characters
Spells
```

Navigation should work across desktop and mobile layouts.

---

## 7.2 Character Grid

Suggested responsive behavior:

```text
Mobile
1 column

Tablet
2 columns

Desktop
3–4 columns
```

The exact number of columns may adapt based on available screen width.

---

## 7.3 Loading State

While data is being fetched:

* Avoid blank screens.
* Display skeleton components.
* Skeleton structure should resemble the final content.

---

## 7.4 Error State

If an API request fails, display a clear error message.

Example:

```text
Something went wrong.

We couldn't load the characters.

[ Try Again ]
```

Users should be able to retry the request without manually refreshing the page.

---

## 7.5 Empty State

When no characters match the current search or filter:

```text
No characters found.

Try another search or remove your filters.
```

Provide an appropriate reset action where useful.

---

## 7.6 Image Fallback

Character images may be missing or fail to load.

The application must handle:

* Empty image URLs
* Null image values
* Broken image URLs
* Image loading states

A fallback visual should be displayed when an image is unavailable.

---

# 8. Visual Design

## Design Direction

The visual direction should be:

**Modern, magical, and premium editorial.**

The application should feel polished without becoming overly decorative or looking like an unofficial fan website.

Design priorities:

* Clean
* Elegant
* Readable
* Responsive
* Subtle magical aesthetic

---

## House Visual Identity

Each house may have a subtle visual accent.

### Gryffindor

Red / Gold

### Hufflepuff

Yellow / Black

### Ravenclaw

Blue / Bronze

### Slytherin

Green / Silver

House colors should be used sparingly for visual identity rather than overwhelming the interface.

---

# 9. Information Architecture

```text
/
│
├── Characters
│   ├── Character List
│   └── Character Detail
│
└── Spells
    └── Spell List
```

Routes:

```text
/
 /characters
 /characters/[id]
 /spells
```

---

# 10. Technical Architecture

## 10.1 Framework

```text
Next.js
App Router
TypeScript
```

Next.js Server Components should be used by default.

Client Components should only be introduced when client-side interactivity is required, such as:

* Search input
* Interactive filters
* Pagination
* Dialogs
* Browser APIs
* Client-side query state

---

## 10.2 Data Fetching

The application uses:

```text
TanStack Query
```

Responsibilities include:

* API requests
* Query caching
* Loading states
* Error states
* Retry behavior
* Refetching
* Query lifecycle management

API/server state should not be duplicated in Zustand.

---

## 10.3 Client State

The project may use:

```text
Zustand
```

for shared client-only state when there is a genuine requirement.

For simple local UI state, prefer:

```text
useState
```

If no shared client state is required, Zustand should not be introduced just for the sake of using it.

---

## 10.4 URL State

The project uses:

```text
nuqs
```

for URL-based state such as:

* Search
* House filter
* Pagination

Example:

```text
/characters?search=harry&house=gryffindor&page=2
```

Benefits:

* Shareable URLs
* Browser back/forward support
* State persistence after refresh
* Better navigation experience

---

## 10.5 Validation

The project uses:

```text
Zod
```

for validation and parsing of API responses where appropriate.

External API data should not be assumed to always be complete or perfectly formatted.

---

# 11. Project Structure

```text
src/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   │
│   ├── characters/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   └── spells/
│       └── page.tsx
│
├── components/
│   ├── characters/
│   │   ├── character-card.tsx
│   │   ├── character-grid.tsx
│   │   ├── character-filters.tsx
│   │   ├── character-skeleton.tsx
│   │   └── character-image.tsx
│   │
│   ├── spells/
│   │   ├── spell-card.tsx
│   │   └── spell-list.tsx
│   │
│   ├── shared/
│   │   ├── empty-state.tsx
│   │   ├── error-state.tsx
│   │   └── loading-state.tsx
│   │
│   └── ui/
│       └── ...
│
├── features/
│   ├── characters/
│   │   ├── api.ts
│   │   ├── queries.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   └── spells/
│       ├── api.ts
│       ├── queries.ts
│       └── types.ts
│
├── lib/
│   ├── api-client.ts
│   ├── constants.ts
│   └── utils.ts
│
└── providers/
    └── query-provider.tsx
```

---

# 12. Component Architecture

Components should follow a clear hierarchy:

```text
Page
 ↓
Feature Components
 ↓
UI Components
```

Example:

```text
CharactersPage
│
├── CharacterFilters
│   ├── SearchInput
│   └── HouseFilter
│
├── CharacterGrid
│   └── CharacterCard
│       ├── CharacterImage
│       ├── CharacterName
│       └── HouseBadge
│
└── Pagination
```

Components should follow the single-responsibility principle and avoid unnecessary abstraction.

---

# 13. API Integration

The Harry Potter API is the application's external data source.

API logic must be separated from UI components.

Example:

```text
features/characters/api.ts
```

Responsibilities:

* Fetch characters
* Fetch character details
* Handle API errors
* Normalize or transform API responses when necessary

Components should not perform raw API requests directly.

---

# 14. State Ownership

Each type of state should have a clear owner.

| State                    | Owner                  |
| ------------------------ | ---------------------- |
| API data                 | TanStack Query         |
| Search                   | URL / nuqs             |
| House filter             | URL / nuqs             |
| Pagination               | URL / nuqs             |
| Modal state              | useState               |
| Temporary UI state       | useState               |
| Shared client-only state | Zustand when necessary |

API responses should not be duplicated in a global client store.

---

# 15. Accessibility

The application should follow basic accessibility best practices.

Requirements:

* Semantic HTML
* Keyboard navigation
* Accessible buttons
* Proper form labels
* Meaningful image alt text
* Sufficient color contrast
* Visible focus states
* Keyboard-accessible dialogs

Native semantic elements should be preferred over clickable non-semantic elements.

---

# 16. Performance

Performance priorities:

1. Use Server Components by default.
2. Minimize unnecessary Client Components.
3. Optimize image rendering.
4. Leverage TanStack Query caching.
5. Avoid unnecessary global state.
6. Minimize unnecessary re-renders.
7. Lazy-load non-critical UI where appropriate.

Avoid premature optimization.

---

# 17. Animation

The project may use:

```text
Motion
```

for subtle interactions such as:

* Card hover
* Page transitions
* Filter transitions
* Dialog animations
* Content transitions

Animations should enhance the experience without distracting from the content.

---

# 18. Testing

Testing stack:

```text
Vitest
Testing Library
```

Testing should focus on important user-facing behavior.

### Character Card

Test:

* Character name renders correctly.
* House renders correctly.
* Missing image is handled.

### Character Filters

Test:

* Search input updates correctly.
* House filter works.
* Reset functionality works.

### API / Query

Test:

* Successful data fetching.
* Error handling.
* Retry behavior where appropriate.

100% test coverage is not required.

---

# 19. Code Quality

Tools:

```text
TypeScript
ESLint
Prettier
```

Requirements:

* Avoid unnecessary `any`.
* Use meaningful variable and function names.
* Keep components focused.
* Avoid duplicated logic.
* Maintain clear API boundaries.
* Keep formatting consistent.
* Remove unused imports.
* Remove development/debugging logs before production.

---

# 20. Dependency Strategy

Dependencies should only be added when they provide meaningful value.

### Core

```text
Next.js
React
TypeScript
Tailwind CSS
```

### UI

```text
shadcn/ui
Lucide React
```

### Data

```text
TanStack Query
Zod
```

### URL State

```text
nuqs
```

### Client State

```text
Zustand
```

Only when required.

### Animation

```text
Motion
```

### Testing

```text
Vitest
Testing Library
```

The project should avoid unnecessary dependencies and abstractions.

---

# 21. Deployment

## Platform

```text
Cloudflare Pages
```

The application must be successfully built and deployed to Cloudflare Pages.

Production requirements:

* Production build succeeds.
* Environment variables are configured correctly.
* API requests work in production.
* No development-only configuration is required.
* Responsive behavior is verified after deployment.
* Production URL is accessible.

---

# 22. Environment Variables

Environment variables should be used for configuration where appropriate.

Example:

```text
NEXT_PUBLIC_API_URL=...
```

No sensitive secrets should be exposed through `NEXT_PUBLIC_*` variables.

---

# 23. Error Handling Strategy

Error handling should exist across multiple layers.

### API Layer

```text
Request
   ↓
API Error
   ↓
Normalized Error
```

### Query Layer

```text
isLoading
isError
data
```

### UI Layer

```text
Loading → Skeleton
Error   → Error State
Empty   → Empty State
Success → Content
```

Expected flow:

```text
             ┌──────────┐
             │ Loading  │
             └────┬─────┘
                  ↓
           ┌──────────────┐
           │ API Request  │
           └──────┬───────┘
                  │
        ┌─────────┼─────────┐
        ↓         ↓         ↓
     Success    Error     Empty
        ↓         ↓         ↓
     Content    Retry    Empty UI
```

---

# 24. Acceptance Criteria

## Characters

* [ ] Character list loads successfully.
* [ ] Character cards display correctly.
* [ ] Responsive grid works.
* [ ] Character search works.
* [ ] House filtering works.
* [ ] Pagination works.
* [ ] Character detail page works.
* [ ] Missing character images have a fallback.
* [ ] Missing character fields are handled gracefully.

## Spells

* [ ] Spell list loads successfully.
* [ ] Spell name is displayed.
* [ ] Incantation is displayed when available.
* [ ] Description is displayed when available.
* [ ] Loading state works.
* [ ] Error state works.
* [ ] Empty state works where applicable.

## UX

* [ ] Loading skeletons are implemented.
* [ ] Error state is implemented.
* [ ] Empty state is implemented.
* [ ] Mobile responsive behavior works.
* [ ] Keyboard navigation works for interactive elements.
* [ ] Images have appropriate alt text.
* [ ] Search/filter state is reflected in the URL.

## Technical

* [ ] TypeScript is used throughout the application.
* [ ] API logic is separated from UI.
* [ ] TanStack Query manages server state.
* [ ] nuqs manages URL state.
* [ ] Zustand is only used when shared client state is actually required.
* [ ] No unnecessary Redux/global state is introduced.
* [ ] ESLint passes.
* [ ] Tests pass.
* [ ] Production build passes.

## Deployment

* [ ] Application is deployed to Cloudflare Pages.
* [ ] Production URL is accessible.
* [ ] Production API requests work.
* [ ] No critical production console errors exist.

---

# 25. Definition of Done

The project is considered complete when:

1. Character listing works correctly.
2. Character search works.
3. House filtering works.
4. Pagination works.
5. Character detail pages work.
6. Spells page works.
7. Loading, error, and empty states are implemented.
8. Missing images and fields are handled gracefully.
9. Application is responsive.
10. Basic accessibility requirements are met.
11. Critical user-facing behavior has automated tests.
12. ESLint passes.
13. Production build succeeds.
14. Application is deployed to Cloudflare Pages.
15. Production functionality has been verified.
16. The codebase remains clean, maintainable, and appropriately scoped.

---

# 26. Implementation Priority

## Phase 1 — Foundation

* Initialize Next.js project.
* Configure TypeScript.
* Configure Tailwind CSS.
* Configure shadcn/ui.
* Configure API client.
* Configure TanStack Query.
* Establish project structure.

## Phase 2 — Characters

* Implement character API.
* Define character types.
* Implement character queries.
* Build character card.
* Build character grid.
* Add loading state.
* Add error state.
* Add empty state.
* Add image fallback.

## Phase 3 — Filtering & Pagination

* Implement search.
* Implement house filter.
* Implement URL state with nuqs.
* Implement pagination.
* Handle filter/search state transitions.

## Phase 4 — Character Detail

* Implement dynamic route.
* Fetch character details.
* Build character detail UI.
* Add missing-data handling.
* Add image fallback.

## Phase 5 — Spells

* Implement spell API.
* Define spell types.
* Implement spell queries.
* Build spell list.
* Build spell cards.
* Add search/filter if appropriate.

## Phase 6 — Polish

* Refine responsive layouts.
* Add house visual identity.
* Add subtle Motion animations.
* Improve accessibility.
* Refine loading transitions.
* Improve error handling.

## Phase 7 — Testing & Deployment

* Add component/unit tests.
* Run ESLint.
* Run production build.
* Deploy to Cloudflare Pages.
* Verify production behavior.
* Perform final UI/UX review.

---

# 27. Engineering Principles

## Keep It Simple

Use the simplest solution that satisfies the requirement.

---

## Separate Server State from Client State

```text
API data
→ TanStack Query

URL filters
→ nuqs

Local UI state
→ useState

Shared client state
→ Zustand only when necessary
```

---

## Server Components First

Server Components should be the default.

Client Components should only be introduced when browser-side interactivity or client-only APIs require them.

---

## Feature-Oriented Architecture

API logic, queries, types, and feature-specific utilities should remain close to their respective features.

---

## Graceful Failure

External API data cannot be assumed to be perfect.

The UI should handle:

```text
Missing data
Invalid image
API errors
Empty results
Slow network
```

---

## Avoid Over-Engineering

Do not introduce:

* Redux without a real requirement.
* A custom backend.
* A database.
* Complex state machines.
* WebSockets.
* Unnecessary abstractions.
* Unnecessary dependencies.

The goal is not to demonstrate how many technologies can be used.

The goal is to demonstrate that the technologies chosen are appropriate for the problem.

---

# 28. Final Technology Stack

```text
Framework
Next.js 15/16 + App Router

Language
TypeScript

Styling
Tailwind CSS

UI
shadcn/ui v4 + Base UI

Icons
Lucide React

Server/API State
TanStack Query

Client State
Zustand (only if required)

URL State
nuqs

Validation
Zod

Animation
Motion

Testing
Vitest + Testing Library

Code Quality
ESLint + Prettier

API
Harry Potter API

Deployment
Cloudflare Pages
```

---

# 29. Success Criteria

The assignment is successful if a reviewer can quickly see that the application:

> **Looks polished, behaves reliably, has a clean architecture, handles real-world API states, and uses modern frontend technologies without unnecessary complexity.**

The implementation should prioritize:

* Clarity
* Maintainability
* User experience
* Accessibility
* Appropriate technical decisions
* Proper project scoping

over the number of features or dependencies.
