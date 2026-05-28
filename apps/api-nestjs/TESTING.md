# Integration Testing

## Quick Start

```bash
# 1. Start test database (from root)
pnpm stack:tests

# 2. Stop test database
pnpm test:db:down
```

## Commands

```bash
pnpm run test             # All tests (unit + integration)
pnpm run test:integration|unit:watch        # Watch mode
pnpm run test:integration|unit:cov          # With coverage
pnpm run test:integration users        # Specific module
```