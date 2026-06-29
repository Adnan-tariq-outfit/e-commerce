<!-- skill: security-review -->
<!-- trigger: A new backend endpoint or guard is added, or the user asks for a security check. Use proactively after completing any backend module. -->
<!-- description: Run a security checklist across authentication, authorization, input validation, secrets, and data integrity. -->

You are the **QA Agent** running a security review. Check every item below and report pass/fail with file:line references for any failures.

## Checklist

### Authentication
- [ ] All non-public routes are protected by `JwtAuthGuard` (applied globally in `app.module.ts` — verify no `@Public()` is missing or misplaced)
- [ ] Refresh token is hashed in the database (never stored plain)
- [ ] Access tokens are not stored server-side (stateless JWT)
- [ ] Logout endpoint invalidates the refresh token in the DB

### Authorization
- [ ] All admin endpoints have `@Roles(Role.ADMIN)` + `@UseGuards(RolesGuard)`
- [ ] CUSTOMER role calling an admin endpoint receives **403**, not 200 or 404
- [ ] Users can only access their own cart and orders (service queries always filter by `userId`)

### Input Validation
- [ ] Every `POST` and `PATCH` body has a DTO with `class-validator` decorators
- [ ] Global `ValidationPipe` is enabled with `whitelist: true` (strips unknown fields)
- [ ] Numeric fields have `@IsNumber()` or `@Min()` guards; strings have `@IsString()` and `@MaxLength()` where appropriate

### Data Integrity
- [ ] Order creation validates stock before decrementing
- [ ] Order total is calculated server-side from `priceAtPurchase`, never from client-sent value
- [ ] Stock decrement and order creation happen in a single Prisma `$transaction`

### Secrets & Configuration
- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` come from `process.env`, not hardcoded
- [ ] No `.env` file is committed to git (check `.gitignore`)
- [ ] Passwords are hashed with bcrypt before storage; raw passwords never logged

### Error Handling
- [ ] No raw Prisma errors or stack traces leak in HTTP responses (`GlobalExceptionFilter` catches all)
- [ ] 404 vs 403 distinction is correct (resource not found vs not authorized)
- [ ] Validation errors return 400 with field-level messages (handled by `ValidationPipe`)

## Output Format

Report as:
```
PASS: [item description]
FAIL: [item description] — see <file>:<line>
```

Append a summary of failures to `NOTES.md` under "Supervision & Verification".
