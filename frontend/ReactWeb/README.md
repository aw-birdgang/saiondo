# Saiondo React Web Application

This is a React web application built with Clean Architecture principles.

## Project Structure

The project follows Clean Architecture with the following layers:

```
src/
├── core/                    # Core Business Logic
│   ├── domain/             # Domain Layer
│   │   ├── entities/       # Business Entities
│   │   ├── repositories/   # Repository Interfaces
│   │   └── usecases/       # Use Cases
│   ├── data/               # Data Layer
│   │   ├── datasources/    # Data Sources (API, Local Storage)
│   │   └── repositories/   # Repository Implementations
│   └── di/                 # Dependency Injection
├── presentation/           # Presentation Layer
│   ├── components/         # React Components
│   ├── hooks/             # Custom Hooks
│   ├── pages/             # Page Components
│   ├── providers/         # Context Providers
│   └── routes/            # Routing Configuration
└── shared/                # Shared Layer
    ├── constants/         # Application Constants
    ├── types/            # Shared TypeScript Types
    └── utils/            # Utility Functions
```

## Architecture Principles

### 1. Domain Layer
- **Entities**: Core business objects (User, UserProfile)
- **Repositories**: Interfaces defining data access contracts
- **Use Cases**: Business logic and application rules

### 2. Data Layer
- **Data Sources**: Implementation of external data access (API, Local Storage)
- **Repository Implementations**: Concrete implementations of repository interfaces

### 3. Presentation Layer
- **Components**: React components for UI
- **Hooks**: Custom React hooks for state management
- **Pages**: Page-level components
- **Providers**: Context providers for dependency injection
- **Routes**: Application routing configuration

### 4. Shared Layer
- **Constants**: Application-wide constants
- **Types**: Shared TypeScript type definitions
- **Utils**: Reusable utility functions

## Key Features

- **Clean Architecture**: Separation of concerns with clear layer boundaries
- **TypeScript**: Full type safety throughout the application
- **React Query**: Efficient data fetching and caching
- **React Router**: Client-side routing
- **Dependency Injection**: Centralized dependency management
- **Error Handling**: Comprehensive error handling at all layers

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Development Guidelines

### Adding New Features

1. **Domain Layer**: Define entities, repository interfaces, and use cases
2. **Data Layer**: Implement repository interfaces with data sources
3. **Presentation Layer**: Create components and hooks
4. **Dependency Injection**: Register new dependencies in the container

### Code Organization

- Keep components small and focused
- Use custom hooks for complex state logic
- Follow TypeScript best practices
- Maintain clear separation between layers
- Use dependency injection for testability

## Testing

The application is structured to support easy testing:

- Domain layer can be tested independently
- Use cases can be tested with mock repositories
- Components can be tested with mock hooks
- Data layer can be tested with mock data sources

## Dependencies

- **React**: UI library
- **TypeScript**: Type safety
- **React Query**: Data fetching and caching
- **React Router**: Routing
- **Axios**: HTTP client
- **Vite**: Build tool
