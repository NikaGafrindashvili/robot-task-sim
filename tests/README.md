# Tests Directory

This directory contains all test files for the robot task simulation project.

## Structure

```
tests/
├── setup.ts              # Global test setup and configuration
├── lib/                  # Tests for utility functions
│   └── utils.test.ts     # Pathfinding and utility function tests
├── store/                # Tests for Zustand store (future)
├── components/           # Tests for React components (future)
└── hooks/                # Tests for custom hooks (future)
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- tests/lib/utils.test.ts
```

## Testing Conventions

- **File naming**: Use `.test.ts` or `.spec.ts` suffix
- **Structure**: Mirror the source code structure within the `tests/` directory
- **Imports**: Use relative paths from test files to source files
- **Setup**: Global setup is in `setup.ts`, imported automatically

## Test Categories

### Unit Tests
- Individual functions and utilities
- Store actions and state management
- Pure logic without UI

### Component Tests
- React component rendering
- User interactions
- Props and state changes

### Integration Tests
- Multiple components working together
- Store + component interactions
- Simulation workflows

## Coverage Goals

- **Utilities**: 100% coverage for pure functions
- **Store**: 100% coverage for actions and state changes
- **Components**: Focus on user interactions and edge cases
- **Hooks**: Complete lifecycle and dependency testing 