# 🧪 Flipkart Clone — Complete Testing & QA Documentation

This document serves as the comprehensive guide to the **Quality Assurance & Automated Testing System** implemented on the NestJS backend of the Flipkart Clone.

---

## 🗂️ Table of Contents
1. [Testing Stack & Environment](#1-testing-stack--environment)
2. [Test Execution Commands](#2-test-execution-commands)
3. [Module-Wise Test Cases & Assertions Mapping](#3-module-wise-test-cases--assertions-mapping)
4. [Testing Architecture & Sandbox Configuration](#4-testing-architecture--sandbox-configuration)

---

## 1. Testing Stack & Environment

The test suites are designed to provide high-speed, isolated unit validation without introducing database side-effects or heavy process overheads:

* **Testing Runner**: Jest (`jest` v30.x)
* **Testing Sandbox Compiler**: `@nestjs/testing` (provides a virtual NestJS container for dependency injection isolation)
* **TS Execution Engine**: `ts-jest` (pre-compiles TypeScript on-the-fly inside Jest memory buffers)

---

## 2. Test Execution Commands

Run these commands inside your project directories:

### ⚡ General Runs
* **Run All 9 Test Suites (54 Cases)**:
  ```bash
  cd server && npm run test
  ```
* **Watch Mode (Re-runs on save)**:
  ```bash
  cd server && npm run test:watch
  ```
* **Code Coverage Analysis**:
  ```bash
  cd server && npm run test:cov
  ```

### 🎯 Specific Spec Runs
To target and run a single test file:
```bash
# Admin module tests only
cd server && npx jest src/admin/admin.controller.spec.ts

# Seller module tests only
cd server && npx jest src/seller/seller.controller.spec.ts

# Payments module tests only
cd server && npx jest src/payments/payments.controller.spec.ts

# Wishlist module tests only
cd server && npx jest src/wishlist/wishlist.controller.spec.ts
```

---

## 3. Module-Wise Test Cases & Assertions Mapping

Our testing suite covers **9 test suites** and **54 distinct test cases**:

| Test Suite Spec File | Purpose | Assertion / Scenario Covered |
| :--- | :--- | :--- |
| **🛡️ Admin Module**<br>`src/admin/admin.controller.spec.ts` | Validates dashboard stats, user role management, catalog approvals, coupon/banner CRUD, and analytical reports. | 1. **Defines controller**: Instantiation check.<br>2. **Stats**: Fetch revenue/order counts.<br>3. **Users & Sellers**: Fetch accounts logs.<br>4. **Products**: Approve or reject pending items.<br>5. **Roles**: Update user security profiles.<br>6. **Orders**: Update logistics status.<br>7. **Coupons**: Full CRUD validation (create, update, delete).<br>8. **Banners**: Full CRUD validation.<br>9. **Analytics Reports**: Retrieve mock sales/inventory records.<br>10. **Verification**: Toggle user verification and create administrative profiles. |
| **🏪 Seller Module**<br>`src/seller/seller.controller.spec.ts` | Validates merchant sales stats, product catalogs, order lists, profile details, and analytics. | 1. **Defines controller**: Instantiation check.<br>2. **Stats**: Fetch seller store totals.<br>3. **Products**: Fetch active store items.<br>4. **CRUD Product**: Create, update price, and delete merchant items.<br>5. **Orders**: Fetch customer orders matching seller ID.<br>6. **Profile**: Update store name details.<br>7. **Analytics**: Fetch seller charts and earnings balance. |
| **🔌 Payments Module**<br>`src/payments/payments.controller.spec.ts` | Validates Stripe PaymentIntents, payment confirmations, invoice JSON generator, and refunds. | 1. **Defines controller**: Instantiation check.<br>2. **Create Intent**: Request Stripe mock payment intents.<br>3. **Confirm**: Confirm credit card submissions.<br>4. **Query**: Fetch payments by Order ID or Payment ID.<br>5. **Invoice**: Download JSON invoice cards (with 404 fallback check).<br>6. **Refunds**: Perform transactional payment refunds. |
| **💖 Wishlist Module**<br>`src/wishlist/wishlist.controller.spec.ts` | Validates preferred items list, items adding, items removing, and cart transfers. | 1. **Defines controller**: Instantiation check.<br>2. **Fetch**: Query list of saved items.<br>3. **Add**: Add products to active lists.<br>4. **Remove**: Drop items by ID.<br>5. **Transfer**: Move wishlisted products directly to cart. |
| **🔐 Auth Module**<br>`src/auth/auth.controller.spec.ts` | Validates user registration, session tokens, OTP validation, and Google OAuth Callbacks. | 1. **Defines controller**: Instantiation check.<br>2. **Register Customer**: Registration outputs `customer` role.<br>3. **Register Seller**: Registration outputs `seller` role.<br>4. **Login**: Verifies credentials return JWT access tokens.<br>5. **Refresh**: Confirms token renewal exchanges.<br>6. **Forgot Password**: Verifies password reset triggers.<br>7. **Reset Password**: Validates new credentials updates.<br>8. **Verify OTP**: Asserts checks on email codes.<br>9. **Google OAuth**: Validates third-party oauth redirects and callbacks. |
| **👤 Users Module**<br>`src/users/users.controller.spec.ts` | Audits profile details, password edits, and address book CRUD functions. | 1. **Defines controller**: Instantiation check.<br>2. **Get Profile**: Asserts details retrieved by token ID.<br>3. **Update Profile**: Confirms editing generic fields.<br>4. **Change Password**: Validates credentials modifications.<br>5. **Get Addresses**: Asserts address card lists.<br>6. **Create Address**: Confirms address creation.<br>7. **Update Address**: Verifies shipping card changes.<br>8. **Delete Address**: Confirms address deletions. |
| **🛍️ Products Module**<br>`src/products/products.controller.spec.ts` | Asserts e-commerce dynamic filtering, search matches, and catalog pages. | 1. **Defines controller**: Instantiation check.<br>2. **List All Products**: Asserts 8-parameter dynamic search filters match catalog queries.<br>3. **Search Filtering**: Confirms category searches return correct subsets.<br>4. **Fetch Item**: Verifies single item UUID routing returns matches. |
| **📦 Orders Module**<br>`src/orders/orders.controller.spec.ts` | Audits order logs and checkout completions. | 1. **Checkout**: Asserts placed orders return tracking ID. |
| **⚙️ Heartbeat Module**<br>`src/app.controller.spec.ts` | Validates initial server availability. | 1. **Ping Test**: Confirms output returns `Hello World!`. |

---

## 4. Testing Architecture & Sandbox Configuration

Every test file utilizes the NestJS `TestingModule` compiler to declare clean, sandboxed scopes:

### Dependency Isolation Pattern
Instead of compiling actual database connections (like PostgreSQL TypeORM connections) or sending real emails, we pass mock values in `TestingModule` providers:

```typescript
const mockUsersService = {
    findOne: jest.fn((id: string) => Promise.resolve({ id, name: 'John Doe' })),
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
};

beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
            {
                provide: UsersService,
                useValue: mockUsersService, // Mocks the real service
            },
        ],
    })
    .overrideGuard(JwtAuthGuard) // Bypasses security layers for test scope
    .useValue({ canActivate: () => true })
    .compile();
});
```

Using this pattern, our unit tests are **100% stable**, run in **under 2 seconds**, and generate zero side-effects on real tables.
