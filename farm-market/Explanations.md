# Farm Market Project Explanation

This project is a full-stack farm marketplace. It connects a Django + Django REST Framework backend to a React + Vite frontend so growers can list produce, customers can browse and order it, and sellers can monitor demand and earnings.

The codebase is split into two main folders:

- `farm-market-backend/` — Django API server, database models, serializers, permissions, and admin logic
- `farm-market-frontend/` — React application for customer and seller flows

The project is designed around a seller/customer role split, with seller actions protected by backend permissions and frontend route guards.

---

## Root-level files and folders

### `DEBUG_FIXES_SUMMARY.md`
This is a short project history file documenting bugs that were encountered and fixed during development, especially around:

- empty product database issues
- seller login/signup validation problems
- test account details for seller/customer flows

It is helpful for onboarding and debugging recurring issues.

### `farm-market-backend/`
This folder contains the Django backend application and the SQLite database used during local development.

### `farm-market-frontend/`
This folder contains the React frontend and the app’s UI, state management, and API client code.

---

# Backend: `farm-market-backend/`

## `farm-market-backend/backend/`
This folder is the Django project root.

### `backend/__init__.py`
Empty package marker file. It tells Python this folder is a package.

### `backend/settings.py`
Global Django configuration.

What it does:
- Enables the main Django apps: `accounts`, `products`, and `orders`
- Adds DRF, JWT auth, and CORS support
- Configures SQLite as the development database
- Sets JWT authentication as the default API auth strategy
- Enables pagination for API responses
- Allows frontend dev origins like `localhost:5173`

This file is the central config for database, auth, API, and CORS behavior.

### `backend/urls.py`
Main URL router for the backend.

What it does:
- Exposes the Django admin UI at `/admin/`
- Mounts all API endpoints under `/api/`
- Includes auth routes: login, refresh, register, profile
- Uses a DRF router to expose `products` and `orders` endpoints

This is the main entry point for the backend API.

### `backend/asgi.py`
ASGI entry point for async Django deployment. Typical project boilerplate, used for async server environments.

### `backend/wsgi.py`
WSGI entry point for server deployment. Standard Django setup file for production-style hosting.

---

## `farm-market-backend/backend/accounts/`
This app handles user accounts and profiles.

### `accounts/__init__.py`
Empty package marker file.

### `accounts/apps.py`
App configuration for the `accounts` Django app.

### `accounts/models.py`
Defines the user profile model.

What it stores:
- `user`: one-to-one relation with Django’s built-in `User`
- `role`: either `seller` or `customer`
- timestamps for creation and updates

This is the core role model used throughout the app.

### `accounts/serializers.py`
Serializers for auth and profile APIs.

What it defines:
- `ProfileSerializer`: serializes the profile object
- `UserSerializer`: exposes the Django user plus nested profile data
- `RegisterSerializer`: validates new user registration and creates the user + profile
- `LoginSerializer`: basic login form serializer
- `TokenResponseSerializer`: generic token response representation

This file is the bridge between HTTP input and database/user objects.

### `accounts/views.py`
Authentication and profile API views.

What it does:
- Custom JWT login serializer via `CustomTokenObtainPairSerializer`
- Adds `user` and `role` into the login response payload
- `register()` creates a new user and role-based profile
- `get_profile()` returns the current authenticated user profile

This is the backend API used by the React login and registration flow.

### `accounts/admin.py`
Admin registration for account-related models. Usually hooks models into the Django admin panel.

### `accounts/tests.py`
Placeholder test file for account logic. Not heavily used in this project yet.

### `accounts/migrations/`
Database migration folder for the `accounts` app.

#### `accounts/migrations/__init__.py`
Marks the folder as a Python package.

#### `accounts/migrations/0001_initial.py`
Initial database migration for the `Profile` model.

---

## `farm-market-backend/backend/products/`
This app manages farm products and demand tracking.

### `products/__init__.py`
Empty package marker file.

### `products/apps.py`
App config for the product app.

### `products/models.py`
Defines the main business entities for products.

What it stores:
- `Product`: product name, description, category, pricing, stock, image, seller reference, timestamps
- `ProductDemand`: demand summary per product, including total ordered count

Key notes:
- `category` uses a fixed choice list: `vegetables`, `fruits`, `grains`, `dairy`, `other`
- `unit` uses a fixed choice list: `kg`, `liter`, `dozen`, `unit`, `bundle`
- each product belongs to a seller using `ForeignKey(User, related_name='products')`

### `products/serializers.py`
Transforms product models to JSON and back.

What it does:
- `ProductSerializer`: sends product data to the frontend, including nested seller name and demand info
- `ProductDemandSerializer`: serializes demand in a compact format
- `ProductCreateUpdateSerializer`: validates create/update payloads and normalizes input values like `Vegetables` → `vegetables` and `bunch` → `bundle`

This is crucial for preventing invalid seller submissions.

### `products/views.py`
DRF view logic for the products API.

What it does:
- defines `IsSeller` and `IsSellerOrReadOnly` permission checks
- exposes product CRUD and seller-only product logic
- `my_products` returns the currently logged-in seller’s own inventory
- `update_stock` allows a seller to change stock
- `search` filters by query and category
- `categories` returns all valid product categories

This is the central API used by the seller listing page and customer browsing page.

### `products/admin.py`
Admin registration for product models and product demand data.

### `products/tests.py`
Contains API tests for product creation.

The important test covers seller product creation and validates the frontend payload against the backend choices.

### `products/migrations/`
Database migration folder for the product app.

#### `products/migrations/__init__.py`
Package marker.

#### `products/migrations/0001_initial.py`
Initial migration creating the `Product` and `ProductDemand` tables.

---

## `farm-market-backend/backend/orders/`
This app handles customer orders, checkout, and seller earnings.

### `orders/__init__.py`
Empty package marker file.

### `orders/apps.py`
App configuration for the orders app.

### `orders/models.py`
Defines order records and order line items.

What it stores:
- `Order`: customer, status, total price, timestamps
- `OrderItem`: product snapshot details at checkout time, including product name, price, quantity, unit, seller, order reference

This model snapshots order data so it remains accurate even if the original product is later edited or deleted.

### `orders/serializers.py`
Serializers for checkout, order detail, and earnings.

What it defines:
- `OrderItemSerializer`: order line item payload
- `OrderSerializer`: order summary payload
- `CheckoutItemSerializer`: validates individual checkout cart entries
- `CheckoutSerializer`: validates the order payload sent from frontend
- `OrderDetailSerializer`: expanded order payload for single-order retrieval
- `EarningsSerializer`: output serializer for seller financial summaries

This file is the contract between the frontend cart/checkout flow and the backend order logic.

### `orders/views.py`
Order and earnings API logic.

What it does:
- `checkout()` validates the cart, checks stock, creates an order, reduces stock, updates demand, and records sales
- `my_orders()` returns a customer’s own orders
- `earnings()` aggregates total earnings across all products sold by the logged-in seller
- `seller_sales()` returns seller-related orders

This file powers the customer checkout and seller earnings dashboard.

### `orders/admin.py`
Admin registration for order models.

### `orders/tests.py`
Placeholder test file for orders. Not yet expanded heavily.

### `orders/migrations/`
Database migration folder for orders.

#### `orders/migrations/__init__.py`
Package marker.

#### `orders/migrations/0001_initial.py`
Initial migration creating the `Order` and `OrderItem` tables and linking them to `Product` and the Django `User` model.

---

## `farm-market-backend/backend/check_products.py`
Utility script used to print all products and sellers currently in the database.

It is used for quick database inspection and debugging. It helps confirm whether sample products exist and how many products each seller owns.

## `farm-market-backend/backend/create_sample_products.py`
Seeds the database with demo content.

What it does:
- creates or updates a seller account: `farmer1` / `farmer123`
- ensures the seller has a valid `Profile` with `role='seller'`
- creates sample produce data like tomatoes, carrots, onions, apples, bananas, and rice
- initializes first-demand tracking entries for each product

This file is extremely useful for testing the app before real inventory data exists.

## `farm-market-backend/backend/test_api.py`
Small script used to hit the live API and print products from `/api/products/`.

This is a quick way to verify the backend API is live and returning the expected JSON structure.

## `farm-market-backend/backend/test_seller_product.py`
Manual seller product creation test script.

What it does:
- creates a Django user with role `seller`
- gets JWT tokens
- posts a product to `/api/products/`
- prints the success or error response

Useful for debugging seller listing issues directly against the API.

## `farm-market-backend/backend/db.sqlite3`
Development database file containing local application state. It is generated by Django and stores users, products, orders, and other app data during testing and local work.

## `farm-market-backend/backend/manage.py`
Django management entry point.

What it does:
- initializes the Django app
- allows commands like:
  - `python manage.py runserver`
  - `python manage.py migrate`
  - `python manage.py createsuperuser`
  - `python manage.py test`

This is the command center for backend management.

---

# Frontend: `farm-market-frontend/`

## `farm-market-frontend/package.json`
Project metadata and scripts for the frontend.

Defines:
- `npm run dev` to start Vite
- `npm run build` to build production assets
- `npm run preview` to preview the build

Dependencies include React, React Router, and Axios.

## `farm-market-frontend/vite.config.js`
Vite configuration file. Used to configure the frontend build and development server, including React plugin support.

## `farm-market-frontend/index.html`
HTML entry point for the Vite app. This file loads the root DOM container and app assets.

## `farm-market-frontend/README.md`
Frontend documentation.

It explains:
- project purpose
- role-based app structure
- backend integration strategy
- API wiring tips and authentication patterns
- debugging guidance

This is a good onboarding document for future developers.

---

## `farm-market-frontend/src/`
This is the main source folder for the React application.

### `src/main.jsx`
Entry file for React rendering.

What it does:
- mounts the app into the `root` element
- wraps the app in `React.StrictMode`
- imports the global stylesheet

### `src/App.jsx`
Top-level routing file.

What it does:
- wraps the app in `AuthProvider` and `CartProvider`
- defines navigation routes for landing, login, customer pages, and seller pages
- protects routes by role using `ProtectedRoute`

This is the app’s central navigation and access-control map.

### `src/index.css`
Global design system.

This file contains:
- color palette and theme tokens
- layout utilities such as `.container`, `.main`, `.grid`, `.row`
- button styles and card styles
- product ticket styling
- form controls and pills for stock status

This is the styling backbone for the whole marketplace UI.

### `src/mockData.js`
Mock data used when the app is in mock mode (`VITE_USE_MOCKS`).

It simulates products and sellers so the UI can run before the backend is ready.

---

## `farm-market-frontend/src/api/`
This folder contains all API-related logic.

### `src/api/auth.js`
Authentication calls for login and registration.

What it does:
- `registerUser()` hits `/api/auth/register/`
- `loginUser()` posts to `/api/auth/login/` and stores local auth token/role
- `logoutUser()` removes stored credentials
- `fetchCurrentUser()` gets profile data

This is the frontend auth adapter for the Django API.

### `src/api/axios.js`
Shared Axios instance used across the app.

What it does:
- sets the base URL to `http://127.0.0.1:8000/api`
- attaches the JWT token to outgoing requests via `Authorization: Bearer ...`
- removes expired tokens on `401` responses
- redirects users to `/login` when auth is invalid

This is the single integration point for all backend communication.

### `src/api/products.js`
Product-related API calls.

What it does:
- `fetchAllProducts()` reads all products for the customer shop
- `fetchMyProducts()` reads the current seller’s inventory
- `createProduct()` posts a new product
- `updateProduct()` patches an existing product
- `deleteProduct()` removes a product
- `fetchDemandStats()` pulls demand info for seller planning

This file is the main bridge between the seller listing pages and the Django product API.

### `src/api/orders.js`
Order-related API calls.

What it does:
- `checkout()` sends checkout data to `/api/orders/checkout/`
- `fetchMyOrders()` fetches the customer’s order history
- `fetchEarnings()` retrieves seller earnings summary

This file powers the cart checkout and seller earnings screens.

---

## `farm-market-frontend/src/context/`
This folder stores React context providers for shared app state.

### `src/context/AuthContext.jsx`
Authentication state context.

What it does:
- stores current `role`, `username`, and auth state
- reads/writes `localStorage` values for access token and role
- exposes `login`, `register`, and `logout` actions

This determines which routes the user can access and what UI is shown.

### `src/context/CartContext.jsx`
Shopping cart state.

What it does:
- stores cart items in memory
- supports add/update/remove/clear cart actions
- calculates total cart value and item count

This powers the customer side of the marketplace flow.

---

## `farm-market-frontend/src/components/`
Reusable UI components.

### `src/components/Navbar.jsx`
Top navigation bar across the app.

What it does:
- shows brand name and primary navigation
- conditionally renders customer links or seller links based on role
- shows logged-in username and logout button

This is the app’s global navigation and user session switcher.

### `src/components/ProductCard.jsx`
Reusable card used to display a single product in the customer browse page.

What it shows:
- product name, category, seller, price, stock status
- button to add item to cart

### `src/components/ProtectedRoute.jsx`
Route protection wrapper.

What it does:
- redirects unauthenticated users to login
- redirects users to the page matching their role if access isn’t allowed

This is a frontend guard, while Django permission classes are the real security enforcement.

---

## `farm-market-frontend/src/pages/`
This folder contains page-level UI views.

### `src/pages/Landing.jsx`
The landing page shown at `/`.

What it does:
- explains the marketplace concept
- gives users the option to browse as a customer or log in as a seller

### `src/pages/Login.jsx`
Login/register form page.

What it does:
- selects customer or seller mode
- validates input and handles server-side error display
- calls the auth context login/register functions
- redirects based on user role

This page is the starting point for app authentication.

### `src/pages/customer/`
Customer-facing pages.

#### `src/pages/customer/CustomerHome.jsx`
Marketplace home screen.

What it does:
- fetches all products
- searches and filters by category
- renders product cards

This is the main customer browsing experience.

#### `src/pages/customer/Cart.jsx`
Cart page for selected produce.

What it does:
- shows added products
- allows quantity updates and removal
- calculates subtotal
- navigates to checkout

#### `src/pages/customer/Checkout.jsx`
Checkout flow.

What it does:
- collects delivery address and payment method
- submits the cart to the backend order endpoint
- clears the cart after confirmation
- shows a success screen with order details

### `src/pages/seller/`
Seller-facing pages.

#### `src/pages/seller/SellerDashboard.jsx`
Main dashboard for sellers.

What it does:
- displays active listings count
- shows stock warnings
- shows total earnings summary
- links to listing, demand, and earnings screens

#### `src/pages/seller/ListProduce.jsx`
Seller product management page.

What it does:
- loads the current seller’s products
- lets the seller add a new listing
- lets the seller edit an existing listing
- lets the seller delete a listing
- sends normalized category/unit payloads to the backend

This is the page directly involved in the seller listing issue and is the main seller inventory interface.

#### `src/pages/seller/StockDemand.jsx`
Inventory planning page.

What it does:
- compares product stock vs. demand
- highlights products that are likely to need restocking

#### `src/pages/seller/Earnings.jsx`
Seller earnings visualization page.

What it does:
- fetches earnings data
- displays aggregate totals
- renders a simple bar chart of recent sales values

---

# How the app fits together

1. A user logs in or registers through the React frontend.
2. The backend creates a Django `User` and a `Profile` with a `role` (`seller` or `customer`).
3. The frontend stores the auth token and role in local storage.
4. Customers browse the products screen and add items to a cart.
5. Sellers use the listing page to create, edit, and delete products.
6. Checkout sends order data to the Django order API.
7. The backend validates stock and creates order records while reducing inventory.
8. Seller dashboards show earnings and demand summaries built from completed orders.

---

# Practical update guidance

When editing this codebase:

- modify backend logic in the `farm-market-backend/backend/...` app folders
- modify frontend logic in `farm-market-frontend/src/...`
- keep serializer field names aligned with React component property access
- maintain the role split between seller and customer in both backend permissions and frontend route guards
- prefer making small, direct changes to the matching API/resource file instead of changing many unrelated files

---

# Summary

This project is intentionally structured to mirror a simplified real-world marketplace:

- `accounts` = who the user is and what role they have
- `products` = what is for sale and how demand is tracked
- `orders` = how sales are processed and earnings are summarized
- `frontend` = how users interact with that system

Each part depends on the others, so when debugging, it is best to trace one flow end-to-end: login → product listing → checkout → seller dashboard.
