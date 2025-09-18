# Overview

This is a US Navy Body Fat Calculator web application that allows users to calculate their body fat percentage using the official US Navy method. The application features a clean, medical calculator-inspired interface with a comprehensive results and meal planning flow. Users input their gender, height, weight, neck circumference, waist circumference, hip circumference (for females), age, and physical activity level on the main form, then navigate to a dedicated results screen showing:

- Body fat percentage calculation and fitness category classification
- Daily energy expenditure (TDEE) based on Mifflin-St Jeor formula with activity level multipliers
- Weight loss recommendations with three categories (Suave, Moderado, Restritivo) showing daily calorie targets and estimated weekly weight loss
- Selectable categories leading to personalized meal plans

From the results screen, users can select a weight loss category to generate a personalized meal plan with:
- Macronutrient targets calculated using international AMDR standards (Acceptable Macronutrient Distribution Ranges)
- Complete daily meal plan with 5 meals (café da manhã, almoço, lanche da tarde, janta, ceia)
- Each food item with precise gram quantities based on real USDA nutritional data
- Balanced macronutrients and portion sizes designed for satiety and volume

A "Refazer cálculo" button allows users to reset and start over from any screen.

## Authentication System

The application now includes a complete authentication system for authorized access:

- **Login/Registration**: Two-column layout with form and hero section explaining the app
- **Session Management**: Uses passport.js with express-session for secure authentication
- **Protected Routes**: All calculator and menu pages require authentication
- **User Interface**: Login/logout functionality with user greeting and logout button
- **Security**: Password hashing with scrypt, session storage, and secure credential validation
- **Portuguese Interface**: All authentication messages and forms are in Portuguese

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
- `BodyFatCalculator` - Main calculator component with form logic including age, activity level, and navigation to results
- `GenderSelection` - Radio group for gender selection with icons
- `MeasurementInput` - Reusable input component for body measurements  
- `Results` - Comprehensive results component displaying body fat percentage, TDEE, weight loss recommendations with category selection
- `Menu` - Personalized meal plan component displaying macronutrient targets and daily meal schedule
- **Pages**: `Home` (form), `Results` (dedicated results screen), `Menu` (personalized meal plan), `AuthPage` (login/registration)
- **Flow**: Authentication → Form submission → localStorage storage → /results → category selection → /menu → meal plan display → reset option
- **Authentication**: All pages protected by login requirement with logout functionality in main calculator

## Nutrition System

The application includes a comprehensive nutrition and meal planning system:

- **Food Database**: Curated dataset of Brazilian and international foods with nutritional data sourced from USDA FoodData Central
- **Macro Calculation**: AMDR-compliant macronutrient distribution (Protein 10-35%, Carbs 45-65%, Fat 20-35%) with activity-specific protein targets
- **Meal Generation**: Deterministic algorithm generating 5 balanced meals with proper portion sizes and satiety optimization
- **Schema**: TypeScript types for food items, meals, macro targets, and complete menu plans with Zod validation

## Backend Architecture

The backend is a minimal Express.js server setup:

- **Framework**: Express.js with TypeScript
- **Development**: Vite integration for hot module replacement
- **Storage Interface**: Abstract storage interface with in-memory implementation
- **API Structure**: RESTful API endpoints with `/api` prefix (currently minimal routes)

The server includes middleware for request logging and error handling, with a clean separation between development and production builds.

## Data Storage

The application uses a client-side storage approach optimized for the calculator and meal planning functionality:

- **Primary Storage**: localStorage for calculation results, form state, and navigation parameters
- **Session Flow**: Form data → calculation → localStorage → results screen → category selection → meal plan generation → reset
- **No Persistence**: Calculator and meal planner are session-based with no user accounts or data retention
- **Validation**: Critical domain validation prevents invalid calculations (waist > neck for males, waist + hip > neck for females) and robust parameter validation for meal planning
- **Error Handling**: Comprehensive validation and error handling for edge cases, malformed data, and invalid nutrition parameters
- **Meal Data**: Static USDA-based food database stored as JSON with deterministic meal generation algorithms

The application includes a complete database infrastructure with PostgreSQL and Drizzle ORM:

- **Meal Plan Templates**: Template_menus table populated with 25 comprehensive meal plans (5 for each calorie level: 1200, 1500, 1800, 2300, 2500 kcal)
- **Structured Meal Data**: Each template contains complete macronutrient breakdown, 5 daily meals with specific food items and portions, and smart substitution guidelines
- **Hispanic Food Focus**: All meal plans feature Brazilian and Hispanic cuisine with culturally appropriate foods and portions
- **Database Schema**: Complete type-safe schema using Drizzle ORM with Zod validation for all meal plan data

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