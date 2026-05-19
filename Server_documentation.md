# 📚 Flipkart Clone — Module-Wise System Documentation

This documentation provides a granular, module-wise technical breakdown of the full-stack Flipkart Clone application. Each section details the architecture, component files, REST API schema specifications, database integrations, security configurations, and matching testing procedures for that specific functional area.

---

## 🗂️ Table of Contents
1. [Authentication & Security Module (`auth`)](#-1-authentication--security-module-auth)
2. [User Profiles & Addresses Module (`users`)](#-2-user-profiles--addresses-module-users)
3. [Product Catalog & Dynamic Filtering Module (`products`)](#-3-product-catalog--dynamic-filtering-module-products)
4. [Cart, Checkout & Orders Module (`orders`)](#-4-cart-checkout--orders-module-orders)
5. [Admin Panel & Seller Dashboards](#-5-admin-panel--seller-dashboards)

---

## 🔐 1. Authentication & Security Module (`auth`)

### 📌 Purpose
The Authentication module manages user identity, account registration, role classification (Consumer vs. Seller vs. Administrator), JWT lifecycle management (Access and Refresh Tokens), email verification, and secure password hashing.

### 📁 Core Files Map
* `server/src/auth/auth.controller.ts` — Authentication API routes.
* `server/src/auth/auth.service.ts` — Business logic (password verification, token signatures, email OTP generation).
* `server/src/auth/jwt-auth.guard.ts` — Guard validating the presence and validity of the Bearer JWT token.
* `server/src/auth/jwt.strategy.ts` — Custom Passport strategy extracting and mapping JWT credentials.
* `server/src/auth/roles.guard.ts` & `roles.decorator.ts` — Role-based access control (RBAC) handler.

---

### 🔌 API Endpoints Specification

#### A. Consumer Registration
* **Endpoint**: `POST /api/auth/register`
* **Request Payload**:
  ```json
  {
    "email": "customer@gmail.com",
    "password": "securePassword123",
    "name": "Jane Doe"
  }
  ```
* **Response Payload (201 Created)**:
  ```json
  {
    "id": "7a3b21c4-90ab-4cde-ef12-34567890abcd",
    "email": "customer@gmail.com",
    "name": "Jane Doe",
    "role": "customer"
  }
  ```

#### B. Seller Registration
* **Endpoint**: `POST /api/auth/register-seller`
* **Request Payload**:
  ```json
  {
    "email": "store@seller.com",
    "password": "sellerPassword123",
    "name": "Super Electronics Store"
  }
  ```
* **Response Payload (201 Created)**:
  ```json
  {
    "id": "8c4d32e5-01bc-4def-ab34-567890abcdef",
    "email": "store@seller.com",
    "name": "Super Electronics Store",
    "role": "seller"
  }
  ```

#### C. User Login
* **Endpoint**: `POST /api/auth/login`
* **Request Payload**:
  ```json
  {
    "email": "customer@gmail.com",
    "password": "securePassword123"
  }
  ```
* **Response Payload (200 OK)**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "7a3b21c4-90ab-4cde-ef12-34567890abcd",
      "email": "customer@gmail.com",
      "name": "Jane Doe",
      "role": "customer"
    }
  }
  ```

#### D. Email OTP Verification
* **Endpoint**: `POST /api/auth/verify-otp`
* **Request Payload**:
  ```json
  {
    "email": "customer@gmail.com",
    "otp": "984521"
  }
  ```
* **Response Payload (200 OK)**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "email": "customer@gmail.com"
    }
  }
  ```

---

### 🧪 Unit Testing Specification
* **Test File**: `server/src/auth/auth.controller.spec.ts`
* **Covered Scenarios**:
  - Validates successful customer registration returns the correct default role (`customer`).
  - Asserts that seller registrations return the proper escalated role (`seller`).
  - Asserts that token validation, OTP checks, and refresh flows successfully trigger sub-services and pass access tokens back.
  - Verifies mock handling of Google OAuth callbacks.

---

## 👤 2. User Profiles & Addresses Module (`users`)

### 📌 Purpose
Manages user profiles, secure credential updating (password change pipelines), and complete CRUD actions for shipping address books.

### 📁 Core Files Map
* `server/src/users/users.controller.ts` — API endpoints for user details and address management.
* `server/src/users/users.service.ts` — Password validation, hashing, and db profile query handling.
* `server/src/users/entities/user.entity.ts` — User database mapping.
* `server/src/users/entities/address.entity.ts` — Shipping Address mapping with composite foreign keys.

---

### 🔌 API Endpoints Specification

#### A. Fetch Current Profile Details
* **Endpoint**: `GET /api/user/profile` *(Bearer token required)*
* **Response Payload (200 OK)**:
  ```json
  {
    "id": "7a3b21c4-90ab-4cde-ef12-34567890abcd",
    "email": "customer@gmail.com",
    "name": "Jane Doe",
    "role": "customer"
  }
  ```

#### B. Update Generic Profile
* **Endpoint**: `PATCH /api/user/profile` *(Bearer token required)*
* **Request Payload**:
  ```json
  {
    "name": "Jane Smith"
  }
  ```
* **Response Payload (200 OK)**:
  ```json
  {
    "id": "7a3b21c4-90ab-4cde-ef12-34567890abcd",
    "email": "customer@gmail.com",
    "name": "Jane Smith",
    "role": "customer"
  }
  ```

#### C. Get Shipping Addresses
* **Endpoint**: `GET /api/user/addresses` *(Bearer token required)*
* **Response Payload (200 OK)**:
  ```json
  [
    {
      "id": "addr-1122",
      "userId": "7a3b21c4-90ab-4cde-ef12-34567890abcd",
      "fullName": "Jane Doe",
      "phone": "9876543210",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "streetAddress": "Flat 101, Sea View Apartments"
    }
  ]
  ```

#### D. Add Shipping Address
* **Endpoint**: `POST /api/user/addresses` *(Bearer token required)*
* **Request Payload**:
  ```json
  {
    "fullName": "Jane Doe",
    "phone": "9876543210",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "streetAddress": "Flat 101, Sea View Apartments"
  }
  ```
* **Response Payload (201 Created)**:
  ```json
  {
    "id": "addr-1122",
    "fullName": "Jane Doe",
    "city": "Mumbai",
    "pincode": "400001"
  }
  ```

---

### 🧪 Unit Testing Specification
* **Test File**: `server/src/users/users.controller.spec.ts`
* **Covered Scenarios**:
  - Asserts retrieving profiles triggers search validations on user ID keys.
  - Verifies password change handlers successfully issue status updates.
  - Validates full address lifecycle: creating new address entities, updates, and clean deletions from state.

---

## 🛍️ 3. Product Catalog & Dynamic Filtering Module (`products`)

### 📌 Purpose
Manages the e-commerce product listings, custom details, categorizations, review submissions, and complex multidimensional query filters.

### 📁 Core Files Map
* `server/src/products/products.controller.ts` — Filter query and entity fetching routes.
* `server/src/products/products.service.ts` — SQL Query Builders translating filters into PostgreSQL parameters.
* `server/src/products/entities/product.entity.ts` — Mapping details for prices, ratings, and variants.
* `server/src/products/search.config.ts` — Search indexing configurations.

---

### 🔌 API Endpoints Specification

#### A. Fetch Catalog (Filtered and Query-Matched)
* **Endpoint**: `GET /api/products`
* **Query Parameters**:
  * `search` *(string)*: Matches titles/categories/brands (e.g. `Smartphone`).
  * `minPrice` / `maxPrice` *(numbers)*: Bounds the item price scope.
  * `minRating` *(number)*: Filters by user review score (e.g. `4`).
  * `sortBy` *(string)*: `price_asc` | `price_desc` | `rating_desc` | `newest`.
  * `color` / `size` / `brand` *(strings)*: Variant attributes.
* **Example Query**: `/api/products?search=phone&minPrice=10000&maxPrice=50000&minRating=4`
* **Response Payload (200 OK)**:
  ```json
  [
    {
      "id": "p-101",
      "title": "Realme Narzo 60",
      "price": 17999,
      "category": "smartphones",
      "rating": 4.3,
      "brand": "Realme",
      "color": "Black",
      "images": ["/uploads/narzo-60.png"]
    }
  ]
  ```

#### B. Fetch Filter Aggregation Ranges
* **Endpoint**: `GET /api/products/filter-options?search=smartphones`
* **Response Payload (200 OK)**:
  ```json
  {
    "brands": ["Realme", "Samsung", "Apple"],
    "colors": ["Black", "Gold", "Blue"],
    "priceRange": {
      "min": 8000,
      "max": 120000
    }
  }
  ```

---

### 🧪 Unit Testing Specification
* **Test File**: `server/src/products/products.controller.spec.ts`
* **Covered Scenarios**:
  - Asserts that all **8 search parameters** (search string, minimum price, maximum price, ratings, sorting, and variant keys) map correctly to service builders.
  - Verifies individual item routing returns correct category payloads.

---

## 📦 4. Cart, Checkout & Orders Module (`orders`)

### 📌 Purpose
Handles items added to consumer baskets, inventory quantity validation, Stripe payment simulations, and order lifecycles (Placed, Shipped, Delivered).

### 📁 Core Files Map
* `server/src/orders/orders.controller.ts` — Order placement endpoints.
* `server/src/orders/orders.service.ts` — Core transactional business logic (deducting stocks, locking states).
* `server/src/orders/entities/order.entity.ts` — Stores orders, totals, itemized lists, and tracking updates.

---

### 🔌 API Endpoints Specification

#### A. Place Order (Checkout completion)
* **Endpoint**: `POST /api/orders` *(Bearer token required)*
* **Request Payload**:
  ```json
  {
    "addressId": "addr-1122",
    "paymentMethod": "card",
    "items": [
      {
        "productId": "p-101",
        "quantity": 2
      }
    ]
  }
  ```
* **Response Payload (201 Created)**:
  ```json
  {
    "orderId": "ord-8899",
    "userId": "7a3b21c4-90ab-4cde-ef12-34567890abcd",
    "totalAmount": 35998,
    "status": "Placed",
    "createdAt": "2026-05-18T11:00:00Z"
  }
  ```

---

### 🧪 Unit Testing Specification
* **Test File**: `server/src/orders/orders.controller.spec.ts`
* **Covered Scenarios**:
  - Asserts checkouts generate valid tracking references.
  - Confirms validation of cart formats.

---

## 🛡️ 5. Admin Panel & Seller Dashboards

### 📌 Purpose
Provides restricted portal capabilities to manage site resources (Administrators) and merchant sales pipelines (Sellers).

### 📁 Portal Mapping
* **Admin Dashboard Portal (`/admin`)**:
  - Access Control: Restricted to users with `role: 'admin'`.
  - Credentials: `admin@flipkart.com` | `password`.
  - Routes:
    * `/admin` — System analytics dashboard.
    * `/admin/products` — Catalog item approval/rejection and editing.
    * `/admin/orders` — Global purchase tracking.
    * `/admin/users` & `/admin/sellers` — Account role assignments.
* **Seller Portal (`/seller`)**:
  - Access Control: Restricted to users with `role: 'seller'`.
  - Credentials: `seller@flipkart.com` | `password`.
  - Routes:
    * `/seller` — Sales trends and merchant analytics.
    * `/seller/products/add` — Add new listings and stock.
