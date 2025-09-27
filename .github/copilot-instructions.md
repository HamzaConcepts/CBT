# CBT Platform - AI Coding Guidelines

## Architecture Overview
This is a **Computer-Based Testing (CBT) platform** built with Next.js 14 App Router, TypeScript, Supabase, and shadcn/ui components. The platform enables secure online exams with lockdown browser features, analytics, and role-based access.

## Tech Stack & Patterns

### Component Architecture
- **shadcn/ui**: All UI components use the shadcn/ui pattern with Radix primitives
- **Styling**: TailwindCSS with `class-variance-authority` (cva) for variant-based components
- **Utils**: Use `cn()` from `@/lib/utils` for conditional classes (clsx + tailwind-merge)
- **Icons**: Lucide React icons exclusively

### Next.js App Router Structure
```
app/
  (account)/settings/     # Route groups for organization
  dashboard/              # Main dashboard (redirects teacher/student routes here)
  teacher/*/              # Teacher-specific routes (many redirect to /dashboard)
  student/*/              # Student-specific routes  
  quiz/[id]/take/         # Dynamic routes for quiz taking
  exam/[id]/              # Dynamic routes for exam management
```

### Database & Authentication
- **Supabase**: Auth + PostgreSQL backend
- **Schema**: Uses `profiles` table linked to `auth.users` (not custom users table)
- **Auth Pattern**: 
  ```tsx
  const { data } = await supabase.auth.getSession()
  if (!data.session?.user) window.location.href = "/"
  ```
- **Types**: Define DB types inline (e.g., `DbExam`, `DbAttempt`) at component level

### State Management
- **Client Components**: Most components are `"use client"` for interactivity
- **No External State**: Uses React useState/useEffect, no Redux/Zustand
- **Supabase Client**: Import from `@/lib/supabaseClient` (uses env vars)

## Key Development Patterns

### Component Structure
- Large feature components (500+ lines) are common (e.g., `exam-creator.tsx`, `student-dashboard.tsx`)
- Components handle their own data fetching with useEffect
- Heavy use of shadcn/ui Tabs for complex interfaces

### Security Features
- **Lockdown Browser**: `lockdown-browser.tsx` disables dev tools, right-click, keyboard shortcuts
- **Exam Security**: Time limits, attempt tracking, proctoring features
- **Role-based Access**: Profile-based roles with exam/classroom permissions

### Build Configuration
- **TypeScript**: Strict mode enabled, build errors ignored for development
- **ESLint**: Ignored during builds (`ignoreDuringBuilds: true`)
- **Images**: Unoptimized for flexibility
- **Fonts**: Geist Sans/Mono via `geist/font`

## Development Workflow

### Key Commands
```bash
pnpm dev          # Development server
pnpm build        # Production build  
pnpm lint         # ESLint (ignored in builds)
```

### Adding New Features
1. Create components in `/components` (not in `/app` directories)
2. Use existing shadcn/ui components and patterns
3. Import Supabase client from `@/lib/supabaseClient`
4. Follow the large component pattern (don't over-fragment)
5. Use TypeScript interfaces defined at component level

### Environment Setup
Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Component Examples
- **Complex Forms**: See `exam-creator.tsx` for multi-tab form patterns
- **Data Tables**: Check `analytics-dashboard.tsx` for table/chart patterns  
- **Security UI**: Reference `lockdown-browser.tsx` for exam security features
- **Authentication**: Follow `auth-form.tsx` for Supabase auth patterns

## Anti-Patterns
- Don't create separate state management - use component-level state
- Don't fragment large components unnecessarily - this codebase prefers substantial single-file components
- Don't use custom user tables - use Supabase auth.users + profiles pattern
- Don't ignore the lockdown/security patterns when building exam features