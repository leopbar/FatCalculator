# Overview

This is a US Navy Body Fat Calculator web application that allows users to calculate their body fat percentage using the official US Navy method. The application features a clean, medical calculator-inspired interface with a dedicated results flow. Users input their gender, height, weight, neck circumference, waist circumference, and hip circumference (for females) on the main form, then navigate to a dedicated results screen showing their body fat percentage calculation and fitness category classification. A "Refazer cálculo" button allows users to reset and start over.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The application uses a modern React stack with TypeScript:

- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design system following medical calculator aesthetics
- **State Management**: React hooks for local component state, TanStack Query for server state
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

The component architecture follows a modular approach with reusable UI components:
- `BodyFatCalculator` - Main calculator component with form logic and navigation to results
- `GenderSelection` - Radio group for gender selection with icons
- `MeasurementInput` - Reusable input component for body measurements  
- `Results` - Dedicated results component for elegant percentage display
- **Pages**: `Home` (form), `Results` (dedicated results screen)
- **Flow**: Form submission → localStorage storage → navigation to /results → prominent display → reset option

## Backend Architecture

The backend is a minimal Express.js server setup:

- **Framework**: Express.js with TypeScript
- **Development**: Vite integration for hot module replacement
- **Storage Interface**: Abstract storage interface with in-memory implementation
- **API Structure**: RESTful API endpoints with `/api` prefix (currently minimal routes)

The server includes middleware for request logging and error handling, with a clean separation between development and production builds.

## Data Storage

The application uses a client-side storage approach optimized for the calculator functionality:

- **Primary Storage**: localStorage for calculation results and form state
- **Session Flow**: Form data → calculation → localStorage → results screen → reset
- **No Persistence**: Calculator is session-based with no user accounts or data retention
- **Validation**: Critical domain validation prevents invalid calculations (waist > neck for males, waist + hip > neck for females)
- **Error Handling**: Robust validation and error handling for edge cases and malformed data

The application includes database infrastructure (Drizzle ORM, PostgreSQL) for potential future features but currently operates entirely client-side.

## Design System

The application implements a comprehensive design system:

- **Color Palette**: Custom green theme (#0b9c40) inspired by medical applications
- **Typography**: Inter font family with Roboto fallback
- **Component Variants**: Consistent styling using class-variance-authority
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: ARIA labels and semantic HTML structure

## Build System

The project uses a modern build configuration:

- **Bundler**: Vite for fast development and optimized production builds
- **TypeScript**: Strict configuration with path aliases for clean imports
- **CSS Processing**: PostCSS with Tailwind and Autoprefixer
- **Development**: Hot module replacement with runtime error overlay

# External Dependencies

## Core Dependencies

- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React router
- **react-hook-form + @hookform/resolvers**: Form handling with validation
- **zod**: Schema validation and type inference

## UI and Styling

- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility
- **lucide-react**: Icon library

## Database and ORM

- **drizzle-orm**: Type-safe SQL ORM
- **drizzle-zod**: Integration between Drizzle and Zod schemas
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-kit**: Database migration and introspection tool

## Development Tools

- **vite**: Build tool and development server
- **typescript**: Static type checking
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **esbuild**: Fast JavaScript bundler for server builds

The application is configured for deployment on Replit with appropriate environment variable handling for database connections and build processes.