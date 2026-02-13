# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Task Three is a daily task scheduler application with three independent components:
- **Backend**: NestJS REST API with PostgreSQL (port 3000)
- **Frontend**: Next.js web application (port 3000)
- **Mobile**: React Native app using Granite.js framework

## Development Commands

### Backend (NestJS)
```bash
cd backend
yarn install
yarn start:dev          # Development server with hot reload
yarn build              # Production build
yarn lint               # Run ESLint with auto-fix
yarn test               # Run unit tests
yarn test:watch         # Run tests in watch mode
yarn test:e2e           # Run e2e tests
```

### Frontend (Next.js)
```bash
cd frontend
yarn install
yarn dev                # Development server (port 3000)
yarn build              # Production build
yarn lint               # Run Next.js linter
yarn api                # Generate TypeScript types from OpenAPI spec
yarn svgr               # Generate React components from SVG icons
```

### Mobile (React Native)
```bash
cd mobile
yarn install
yarn dev                # Development mode
yarn build              # Production build
yarn test               # Run tests
yarn typecheck          # TypeScript type checking
yarn lint               # Run ESLint
```

### Database
```bash
# Start PostgreSQL via Docker
docker-compose up -d

# Database credentials (development):
# Host: localhost:5432
# User: postgres
# Password: 1234
# Database: task_three
```

## Architecture

### Backend (NestJS)
- **Entities**: TypeORM entities with snake_case naming strategy (`Member`, `Task`, `Schedule`)
- **Controllers**: REST endpoints for tasks and schedules
- **Services**: Business logic layer
- **DTOs**: Request/response validation using class-validator
- **Middleware**: `VisitorMiddleware` handles visitor session management
- **Config**: Environment-based configuration via @nestjs/config
- **Database**: PostgreSQL with TypeORM, uses soft deletes (deleted_at)

Key files:
- [app.module.ts](backend/src/app.module.ts) - Main application module
- [entities/](backend/src/entities/) - Database models
- [controller/](backend/src/controller/) - API endpoints
- [service/](backend/src/service/) - Business logic

### Frontend (Next.js)
Uses **Feature Sliced Design** architecture:

```
src/
├── app/              # Application initialization, providers, global styles
├── pages/            # Next.js pages (routing)
├── widgets/          # Complex UI blocks composed of features/entities
├── features/         # User interactions and business logic
├── entities/         # Business entities (visitor, etc.)
└── shared/           # Reusable code
    ├── ui/           # UI components (Button, Input, Dialog, etc.)
    ├── lib/          # Utilities and helpers
    ├── api/          # API client and OpenAPI generated types
    └── routes/       # Route definitions
```

**Tech Stack:**
- React 19, Next.js 16
- TailwindCSS 4 for styling
- React Query (@tanstack/react-query) for server state
- Zustand for client state
- React Hook Form + Zod for forms
- dnd-kit for drag-and-drop
- class-variance-authority (CVA) for component variants
- overlay-kit for modals/overlays

**API Integration:**
- OpenAPI TypeScript codegen: Run `yarn api` to regenerate types from backend Swagger docs
- API client in [shared/api/](frontend/src/shared/api/)
- Environment variable `API_DOCS_URL` points to OpenAPI spec

### Mobile (React Native)
- Built with **Granite.js** framework (@granite-js/react-native)
- Uses **@toss/tds-react-native** design system
- Router generated via Granite's file-based routing

## Database Design

See [DB_DESIGN.md](DB_DESIGN.md) for comprehensive schema documentation.

**Key Tables:**
- `member` - User accounts (email/password)
- `task` - User's task backlog with target_date
- `schedule` - Daily schedule (max 3 tasks per day)
- `member_settings` - User preferences (schedule start/end times)

**Important Constraints:**
- Tasks have 20 character name limit
- Schedules limited to 3 per day per user (enforced via `order` field 1-3)
- Time validation: start_time < end_time
- All tables use soft deletes (deleted_at)
- Snake_case naming convention in database

**Business Rules:**
1. Incomplete tasks automatically roll over to next day
2. Users must set schedule times before accessing main page
3. Schedule time overlaps are allowed
4. Tasks can be moved to schedule via drag-and-drop (updates schedule with independent time info)
5. Task-to-Schedule relationship is 1:0..1 (a task can only be in one schedule)

## Common Patterns

### Backend
- All entities extend `BaseModel` with id, created_at, updated_at, deleted_at
- Use DTOs with class-validator decorators for validation
- Services handle business logic, controllers are thin
- TypeORM repositories injected via @InjectRepository

### Frontend
- Use React Query hooks for data fetching
- Form validation with react-hook-form + Zod schemas
- UI components use CVA for variants (see Input component)
- Drag-and-drop with @dnd-kit/core
- Overlay/modals with overlay-kit
- Type-safe API calls via generated OpenAPI types

### Mobile
- File-based routing via Granite.js
- Use TDS components from @toss/tds-react-native

## Development Workflow

1. **Backend changes**: Update entities/DTOs → Run migrations if needed → Update controllers/services
2. **API contract changes**: Update Swagger decorators in backend → Run `yarn api` in frontend → Update frontend hooks
3. **Frontend UI**: Follow Feature Sliced Design - add to appropriate layer (shared/entities/features/widgets)
4. **Database schema**: Document changes in DB_DESIGN.md, use TypeORM migrations for production

## Testing

- Backend: Jest for unit tests, spec files co-located with source
- Frontend: Jest + React Testing Library (configured but minimal coverage)
- Mobile: Jest + React Native Testing Library

## Important Notes

- Frontend and backend both run on port 3000 by default - run on different ports or adjust configuration
- OpenAPI type generation requires backend to be running and `API_DOCS_URL` env var set
- Mobile uses Hermes engine for React Native
- Visitor tracking: Anonymous users get visitor IDs via middleware
- All date operations respect user's selected date (not just "today")
