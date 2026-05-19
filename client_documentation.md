# 🖥️ Flipkart Clone — Client-Side System Documentation

This documentation provides a granular, module-wise technical breakdown of the frontend client-side React application. It outlines the global state management, reusable UI component library, modular page views, restricted backoffice portals, and style aesthetics system.

---

## 🗂️ Table of Contents
1. [Vite Setup & Build Pipeline](#1-vite-setup--build-pipeline)
2. [Global State Management (Redux Store)](#2-global-state-management-redux-store)
3. [Reusable UI Component Library](#3-reusable-ui-component-library)
4. [Modular Page Views](#4-modular-page-views)
5. [Restricted Backoffice Portals](#5-restricted-backoffice-portals)
6. [CSS & Design System Aesthetics](#6-css--design-system-aesthetics)

---

## 1. Vite Setup & Build Pipeline

The frontend is constructed using a high-performance React-TypeScript build pipeline managed by **Vite**:

* **Development Command**: `npm run dev` (runs at `http://localhost:5173`)
* **Production Build Command**: `npm run build` (compiles and bundles optimal code to `/dist` using Rolldown/ESBuild)
* **Code Formatting & Linting**: ESLint and Prettier configs for maintaining clean visual aesthetics and zero syntax errors.

---

## 2. Global State Management (Redux Store)

State management is centralized in the Redux store (`client/src/store/store.ts`). This controls three core interactive domains using Redux Toolkit slices:

### 🔐 A. Auth Slice (`slices/authSlice.ts`)
* **Purpose**: Tracks customer, seller, and administrator sessions.
* **State Keys**:
  * `user`: `{ id, name, email, role }` | `null`
  * `token`: Active Bearer JWT | `null`
  * `isAuthenticated`: `boolean`
* **Actions**:
  * `setCredentials(payload)`: Saves JWT token and user payload upon successful registration or login.
  * `logout()`: Clears active sessions and drops cached states.

### 🛒 B. Cart Slice (`slices/cartSlice.ts`)
* **Purpose**: Controls product additions, quantity calculations, and checkout price adjustments.
* **State Keys**:
  * `items`: Array of `{ product, quantity, selectedColor, selectedSize }`
  * `totalPrice`: Total cart value before taxes and discounts.
* **Actions**:
  * `addToCart(item)`: Increments existing quantity or adds new items to the basket.
  * `removeFromCart(productId)`: Drops product items.
  * `updateQuantity({ id, quantity })`: Direct scale multiplier of items.
  * `clearCart()`: Drops all items upon successful checkout completion.

### 📍 C. Location Slice (`slices/locationSlice.ts`)
* **Purpose**: Manages consumer shipping configurations and dynamic delivery estimations.
* **State Keys**:
  * `pincode`: Custom delivery zip code (e.g. `400001`).
  * `delivery`: Delivery target location details.
* **Actions**:
  * `setPincode(code)`: Updates user location parameters across headers.

---

## 3. Reusable UI Component Library (`components/`)

### 📁 Core Files Map

#### 1. `Navbar.tsx` & `Footer.tsx`
* **Purpose**: General page headers and complex footers matching the classic Flipkart UI.
* **Details**: Renders search bar fields, cart icons with active counters, "More" dropdown menus, and footer maps including social feeds.

#### 2. `BannerCarousel.tsx`
* **Purpose**: Auto-sliding promotional homepage banners.
* **Details**: Utilizes CSS transition sweeps and absolute timers to cycle high-quality mock product banners.

#### 3. `CategoryNavIcons.tsx`
* **Purpose**: Grid categories strip rendering item classes (Fashion, Electronics, Mobile, etc.) with custom hover dropdown options.

#### 4. `DeliveryLocationModal.tsx`
* **Purpose**: Interactive backdrop modal setting default shipping pincodes.
* **Details**: Updates the `location` Redux slice and provides delivery estimations.

#### 5. `ProductFilters.tsx`
* **Purpose**: Product filtering sidebar supporting nested filter logic.
* **Details**: Features interactive price sliding tracks, checkbox lists (brands, colors, rating stars), and quick clearing.

---

## 4. Modular Page Views (`pages/`)

### 📁 Core Files Map

#### 1. `Home.tsx` — Flipkart Homepage View
* **Purpose**: Custom white header bar, carousel layers, categories navigator, and product shelves.
* **🔑 Custom UI/UX Hover Delay Logic**:
  * **The Problem**: A 30px physical gap exists between the "Login" button and the absolute dropdown container. Moving the cursor directly downward triggers an immediate `onMouseLeave` event, closing the dropdown before the user can select an item.
  * **The Solution**: 
    - `onMouseEnter={onLoginEnter}`: Immediately opens the dropdown menu and clears any active close timers.
    - `onMouseLeave={onLoginLeave}`: Employs a **3-second timeout** (`3000ms`) before setting `loginOpen` to `false`. This gives the user ample time to hover down to the menu.
    - `closeLoginMenu` & `toggleLoginMenu`: Instantly clears active timeouts and hides the menu when a link inside is clicked or during standard toggles.
    - **Click Outside**: Uses a `mousedown` event listener to close the dropdown immediately if the user clicks anywhere else on the screen.

#### 2. `Search.tsx` — Catalog Engine
* **Purpose**: Renders the product filtering sidebar and the active items grid matching search parameters.

#### 3. `ProductDetails.tsx` — Item Profile View
* **Purpose**: Detailed specifications, high-res image galleries, rating distribution bars, customer reviews, and cart triggers.

#### 4. `Cart.tsx` & `Checkout.tsx` — Order Transaction pipeline
* **Purpose**: Cart item reviews, price balance columns (price, delivery charges, savings), address cards selection, mock card input fields, and order confirmation.

#### 5. `Login.tsx` & `Register.tsx` — User Account forms
* **Purpose**: Classic blue sidebar credential inputs, mobile phone OTP simulations, and account creations.

#### 6. `Profile.tsx` — Consumer Panel
* **Purpose**: Modular customer backoffice enabling account edits, change passwords validation, and shipping card CRUD configurations.

#### 7. `Orders.tsx` — My Orders & Tracking View
* **Purpose**: Displays customer purchase history, supports real-time order cancellations, handles secure local JSON invoice downloads, and features an interactive visual stepper displaying active delivery status (Placed ➔ Confirmed ➔ Shipped ➔ Delivered).

---

## 5. Restricted Backoffice Portals

### 🛡️ A. Admin Panel (`pages/admin/`)
* **Access Rule**: Requires authentication token payload matching `role: 'admin'`.
* **Sub-Modules**:
  * `Dashboard` — System charts, revenue statistics, sales summaries.
  * `Products` — Manage catalog approval states.
  * `Orders` — Manage delivery logistics state cycles.
  * `Users` & `Sellers` — Manage user roles.
  * `Inventory` — Bulk stock updates.

### 🏪 B. Seller Portal (`pages/seller/`)
* **Access Rule**: Requires authentication token payload matching `role: 'seller'`.
* **Sub-Modules**:
  * `Dashboard` — Total revenue trends and order volumes.
  * `My Products` — Active store listings.
  * `Add Product` — Form validator pushing product parameters to the backend.

---

## 6. CSS & Design System Aesthetics

To deliver a premium, modern experience, the frontend incorporates curated styling rules inside `client/src/index.css` and `App.css`:

* **Color Palette**: Curated Flipkart core colors:
  * Primary Blue: `#2874f0`
  * Spotlight Yellow: `#ffe500`
  * Background Tint: `#f1f3f6`
  * Text Colors: Sleek grays (`#212121`, `#878787`)
* **Typography**: Outfitted with premium sans-serif typography (`Inter`, `system-ui`) instead of simple browser defaults.
* **Micro-Animations**: Hover animations on categories, image scales on carousels, and smooth transitions on active headers to make the platform feel alive and reactive.
