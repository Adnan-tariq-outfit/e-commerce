<!-- skill: write-tests -->
<!-- trigger: User asks for tests, a feature is just completed, or the user asks to verify correctness. Use proactively after completing backend modules. -->
<!-- description: Write focused Jest unit tests for service-layer logic and E2E tests for critical flows. -->

You are the **QA Agent** writing tests. Focus on meaningful coverage of business-critical logic.

## Before Starting

Read `CLAUDE.md`. Read the service file(s) you're testing.

## Priority Order

Test these in order of importance:

### 1. Cart Service (`backend/src/modules/cart/cart.service.ts`)
- Adding an item with sufficient stock succeeds
- Adding an item with `quantity > stockQty` throws `BadRequestException`
- Updating quantity to 0 removes the item
- Cart total calculation is correct (sum of `price × quantity`)
- Cart is created on first item add if it doesn't exist

### 2. Orders Service (`backend/src/modules/orders/orders.service.ts`)
- Creating an order decrements `stockQty` on each product
- Order total matches sum of `priceAtPurchase × quantity`
- Creating an order with out-of-stock item throws `BadRequestException`
- All operations happen in a single Prisma transaction
- Cart is cleared after order creation

### 3. Auth Guards
- `JwtAuthGuard`: returns 401 when no token is provided
- `RolesGuard`: returns 403 when a CUSTOMER calls an ADMIN-only endpoint

## Test Pattern

```typescript
// cart.service.spec.ts
import { CartService } from './cart.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prisma = {
      cart: { findUnique: jest.fn(), create: jest.fn(), upsert: jest.fn() },
      cartItem: { create: jest.fn(), update: jest.fn(), delete: jest.fn(), findUnique: jest.fn() },
      product: { findUnique: jest.fn() },
    } as unknown as jest.Mocked<PrismaService>;

    service = new CartService(prisma);
  });

  it('should throw when adding more than available stock', async () => {
    prisma.product.findUnique.mockResolvedValue({ stockQty: 2 } as any);
    await expect(service.addItem('user-id', { productId: 'p1', quantity: 5 }))
      .rejects.toThrow(BadRequestException);
  });
});
```

## Run Tests

```bash
cd backend && npm run test
cd backend && npm run test:cov
```

Output should show all tests passing with meaningful descriptions.
