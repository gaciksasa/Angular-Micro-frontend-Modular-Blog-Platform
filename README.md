# Angular Micro-Frontend Blog Platform

A modular blog platform built with Angular featuring separate blog viewing and management applications sharing common functionality through a shared library.

## Architecture

## Features

- 🏰 Independent blog viewing and management applications
- 🔄 Shared state and services
- 🌓 Dark/light theme support
- 🔍 Search and filtering by title, content, tags
- 👥 Author management
- 🏷️ Tag system
- 📱 Responsive design

## Technical Stack

- Angular 19
- Standalone components
- RxJS for state management
- Tailwind CSS
- JSON Server (mock backend)

## Implementation Decisions

### Micro-Frontend Architecture

**Pros:**

- Independent deployment capabilities
- Team scalability
- Clear separation of concerns
- Independent development

**Cons:**

- More complex initial setup
- Routing coordination required
- Shared state management challenges

### Shared Library (shared-lib)

**Pros:**

- Code reuse across applications
- Consistent interfaces and types
- Centralized state management
- Single source of truth

**Cons:**

- Build coordination needed
- Version management overhead
- Potential for tight coupling

### Standalone Components

**Pros:**

- Simplified dependency injection
- Improved tree-shaking
- Easier testing isolation

**Cons:**

- Newer Angular feature
- Learning curve for teams
- Limited legacy support

## Setup

### Development

```bash
# Install dependencies
npm install

# Start mock backend
json-server --watch db.json --port 3000

# Serve application
ng serve shell         # Main application
```
