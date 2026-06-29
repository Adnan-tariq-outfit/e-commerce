<!-- skill: nestjs-module -->
<!-- trigger: User asks to implement a backend module, API endpoint, or NestJS service. Use proactively when backend work is requested. -->
<!-- description: Scaffold a NestJS module following the auth module pattern — controller, service, DTOs, guards, Swagger decorators, registered in app.module.ts. -->

You are the **Backend Agent**. Build NestJS modules that follow the established project pattern.

## Before Starting

1. Read `CLAUDE.md` at the project root
2. Read `backend/src/modules/auth/auth.controller.ts` and `auth.service.ts` as the reference pattern
3. Read `backend/prisma/schema.prisma` to understand the data models

## Module Structure

Create these files for the module named `<name>`:

```
backend/src/modules/<name>/
  <name>.module.ts
  <name>.controller.ts
  <name>.service.ts
  dto/
    create-<name>.dto.ts
    update-<name>.dto.ts    (if applicable)
    <name>-response.dto.ts  (if response shape differs from model)
```

## Rules

- `PrismaService` is **globally provided** — inject it via constructor but NEVER add it to `providers` in the module
- `GlobalExceptionFilter` handles all errors — NO try/catch blocks in controllers
- Stock and business rule validation go in the **service**, never the controller
- Open/public endpoints: add `@Public()` decorator (from `src/common/decorators/public.decorator.ts`)
- Protected endpoints: rely on the global `JwtAuthGuard` (already applied in `app.module.ts`)
- Admin-only endpoints: add `@Roles(Role.ADMIN)` + `@UseGuards(RolesGuard)`
- Get the current user: use `@GetUser()` decorator (from `src/common/decorators/get-user.decorator.ts`)
- Add `@ApiTags('<name>')` and `@ApiBearerAuth()` to the controller class
- DTOs must use `class-validator` decorators (`@IsString()`, `@IsNumber()`, `@IsOptional()`, etc.)

## Registration

After creating the module, add it to `backend/src/app.module.ts` imports array.

## Validation

After creating the module:
- Confirm the module compiles: `cd backend && npm run build` (or check for TypeScript errors)
- Do NOT start the dev server — just check compilation
