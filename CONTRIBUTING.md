# Contributing to School Counselor AI Platform

Thank you for your interest in contributing! Here's how you can help.

## Code of Conduct

- Be respectful and inclusive
- Focus on code quality and user experience
- Help others learn and grow

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/SchoolCounsellorAI.git
   cd SchoolCounsellorAI
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Set up development environment**
   ```bash
   docker-compose up -d
   # OR
   cd backend && npm install && npm run dev
   cd frontend && npm install && npm run dev
   ```

## Development Guidelines

### Backend (NestJS)

**Code Style:**
- Follow NestJS best practices
- Use TypeScript strict mode
- Add proper error handling
- Write descriptive service methods

**File Structure:**
```
module/
├── module.module.ts
├── module.service.ts
├── module.controller.ts
├── dto/
│   ├── create-module.dto.ts
│   └── update-module.dto.ts
└── module.entity.ts
```

**Database Changes:**
- Create migrations for schema changes
- Update entities and migrations together
- Test migrations locally first

### Frontend (React)

**Code Style:**
- Use functional components with hooks
- Prefer TypeScript types
- Keep components focused and reusable
- Use Tailwind CSS for styling

**File Structure:**
```
pages/             # Full page components
components/        # Reusable components
services/          # API services
contexts/          # State management
styles/            # Global CSS
```

## Making Changes

### Backend Changes

1. **Create a new feature**
   ```bash
   cd backend
   npx nest generate module features/my-feature
   npx nest generate service features/my-feature
   npx nest generate controller features/my-feature
   ```

2. **Create entities**
   - Define in `/entities`
   - Export from entity file

3. **Create DTOs**
   - Input validation DTOs
   - Response DTOs

4. **Write services**
   - Business logic
   - Database operations
   - Error handling

5. **Write controllers**
   - Route definitions
   - Request/response handling
   - Guards and decorators

### Frontend Changes

1. **Create new pages**
   - Add in `/src/pages`
   - Import in `App.tsx`
   - Add routes

2. **Create components**
   - Functional components
   - Props TypeScript interface
   - Docstring comments

3. **API integration**
   - Add methods to `api.ts`
   - Use in components with hooks
   - Error handling with toast

## Testing

### Backend
```bash
cd backend
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:cov         # With coverage
```

### Frontend
```bash
cd frontend
npm run test              # Run tests
npm run test:watch       # Watch mode
```

## Commit Messages

Follow conventional commits:
```
feat: Add new counseling session feature
fix: Resolve database connection issue
docs: Update API documentation
style: Format code with prettier
refactor: Improve auth service
test: Add unit tests for auth
chore: Update dependencies
```

## Pull Request Process

1. **Update your branch**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Push changes**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create PR on GitHub**
   - Clear title and description
   - Link related issues
   - Screenshots for UI changes
   - Testing checklist

4. **Address review feedback**
   - Make requested changes
   - Push updates
   - Request re-review

## Documentation

- Update README.md for user-facing changes
- Update API.md for API changes
- Add docstrings to complex functions
- Include examples where helpful

## Running Tests Before PR

```bash
# Backend
cd backend
npm run lint
npm run test
npm run build

# Frontend
cd frontend
npm run lint
npm run type-check
npm run build
```

## Reporting Issues

**Bug Report:**
- Describe the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Your environment (OS, Node version, etc)

**Feature Request:**
- Clear description of the feature
- Use cases
- Proposed API changes
- Screenshots or mockups

## Getting Help

- Check existing documentation
- Review closed issues
- Ask in PR comments
- Create a discussion thread

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create git tag
4. Build and push Docker images
5. Deploy to production

## Areas for Contribution

- **Backend:** New features, performance improvements, security fixes
- **Frontend:** UI/UX improvements, new pages, responsive design
- **DevOps:** Docker, Kubernetes, CI/CD pipelines
- **Documentation:** Guides, tutorials, API docs
- **Testing:** Unit tests, integration tests, E2E tests
- **Security:** Vulnerability reports, security improvements
- **Localization:** Translations, regional adaptations

## Code Review Checklist

Before submitting:
- [ ] Code follows style guide
- [ ] Comments added for complex logic
- [ ] No console.log or debug code
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Error handling implemented
- [ ] Performance considered

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the School Counselor AI Platform! 🙏
