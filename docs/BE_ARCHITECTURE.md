# Backend Architecture

## Overview
The backend is built using Django and follows a modular, domain-driven design approach. It's structured to support a dance class booking platform with features for managing classes, reviews, users, and locations.

## Core Modules

### 1. Accounts Module (`accounts/`)
- **Responsibility**: User management and authentication
- **Key Components**:
  - Custom User model extending Django's AbstractUser
  - User roles (student, instructor, admin)
  - Profile management
  - Authentication services

### 2. Classes Module (`classes/`)
- **Responsibility**: Dance class and location management
- **Key Components**:
  - Dance class management
  - Location management
  - Search and filtering capabilities
  - Class booking logic

### 3. Reviews Module (`reviews/`)
- **Responsibility**: Review and rating system
- **Key Components**:
  - Review management with component-based structure
    - Teaching approach reviews
    - Environment reviews
    - Music reviews with genre management
    - Facilities reviews with detailed amenities tracking
  - Review verification system with audit trail
    - Separate verification model with verification methods
    - Staff verification tracking
    - Verification notes and timestamps
  - Schema-driven validation using Pydantic v2
    - Type-safe field definitions with Annotated types
    - Custom field validators
    - ORM-compatible model configurations
  - Rating aggregation and statistics
    - Component-specific statistics
    - Verification status tracking
    - Detailed facility availability stats

### 4. Core Module (`mydanceclub/`)
- **Responsibility**: Core application configuration and API routing
- **Key Components**:
  - Django settings
  - URL routing
  - API endpoints
  - Common utilities

## Architecture Layers

### 1. Models Layer (`models.py`)
- Domain models representing business entities
- Inherits from BaseModel for common fields (id, created_at, updated_at)
- Includes model-specific validation and business logic
- Example: `DanceClass`, `Review`, `Location`

### 2. Schema Layer (`schemas/`)
- Two types of schemas:
  1. Internal DTOs using Pydantic v2 BaseModel
     - Used for data validation and transformation
     - Modern type hints with Annotated fields
     - Custom field validators
     - ORM-compatible model configurations
  2. API Response schemas using Django Ninja Schema
     - Based on Pydantic but integrated with Django Ninja
     - Used for API endpoint responses
     - Automatic OpenAPI documentation generation
     - Example: `ReviewResponseSchema`, `ReviewListSchema`
- Clear separation between:
  - Internal data models (`models.py`)
  - Data validation schemas (`schemas/base.py`)
  - API response contracts (`schemas/response.py`)
- Example schema hierarchy:
  - Base schemas: `TeachingApproachSchema`, `EnvironmentSchema` (Pydantic)
  - Response schemas: `ReviewResponseSchema`, `ReviewListSchema` (Ninja)
  - Create/Update schemas: `ReviewCreateSchema` (Ninja)

### 3. Service Layer (`services/`)
- Business logic implementation
- Encapsulates complex operations
- Handles interactions between different models
- Example: `ClassManager`, `ReviewManager`

### 4. API Layer (`api/`)
- REST API endpoints using Django Ninja
- Route definitions and request handling
- Authentication and permissions
- Separated into public and private APIs

## Design Patterns and Principles

### 1. Repository Pattern
- Service classes act as repositories
- Encapsulate data access logic
- Clear separation between data access and business logic
- Example: `ReviewManagerService`, `ReviewStatsService`

### 2. Schema-First Design
- Clear API contracts using Pydantic v2 schemas
- Strict type checking with modern type hints
- Separation between internal models and external representations
- Validation at both schema and model levels

### 3. Service Layer Pattern
- Business logic isolation in service classes
- Reusable operations
- Clear separation of concerns

## Code Organization

### File Structure
```
backend/
├── accounts/              # User management
│   ├── models.py         # User model
│   ├── admin.py         # Admin interface
│   └── management/      # Management commands
├── classes/              # Dance class management
│   ├── models.py        # Class and location models
│   ├── schemas/         # API schemas
│   ├── services/        # Business logic
│   └── admin.py        # Admin interface
├── reviews/              # Review system
│   ├── models.py        # Review models
│   ├── schemas/         # API schemas
│   ├── services/        # Review logic
│   └── admin.py        # Admin interface
└── mydanceclub/          # Core application
    ├── settings.py      # Django settings
    ├── urls.py         # URL routing
    └── api/            # API endpoints
```

### Naming Conventions
- Models: Singular nouns (e.g., `DanceClass`, `Review`)
- Services: Purpose + Service (e.g., `ClassManager`, `ReviewManagerService`)
- Schemas: Purpose + Schema (e.g., `DanceClassSchema`, `ReviewCreateSchema`)

## API Structure

### Public API (`api/public.py`)
- Unauthenticated endpoints
- Read-only operations
- Public data access

### Private API (`api/classes.py`, etc.)
- Authenticated endpoints
- Write operations
- User-specific data

## Testing
- Unit tests for models and services
- Integration tests for API endpoints
- Test data generation through management commands

## Development Guidelines

### 1. Model Design
- Use BaseModel for common fields
- Implement `to_schema()` methods for serialization
- Include proper validation and constraints

### 2. Service Implementation
- Single responsibility principle
- Clear method names indicating operations
- Proper error handling and validation

### 3. API Development
- Use descriptive route names
- Include proper documentation
- Use Django Ninja schemas for responses
- Implement proper validation
- Handle errors gracefully

### 4. Schema Design
- Clear separation between create/update/response schemas
- Proper validation rules
- Clear documentation of fields

## Security Considerations

### 1. Authentication
- Token-based authentication
- Role-based access control
- Proper permission checks in services

### 2. Data Protection
- Validation at schema level
- Proper error handling
- Secure password handling

### 3. API Security
- Rate limiting
- Input validation
- Proper error responses

## Future Considerations

### 1. Scalability
- Consider caching for frequently accessed data
- Optimize database queries
- Consider async operations for long-running tasks

### 2. Maintainability
- Keep services focused and small
- Document complex business logic
- Follow consistent patterns

### 3. Extensibility
- Design for feature additions
- Keep modules loosely coupled
- Use interfaces where appropriate
