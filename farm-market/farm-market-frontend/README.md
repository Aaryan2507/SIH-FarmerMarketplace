# Kisaan Direct — Farm Marketplace Frontend

A React (Vite) frontend for a farmer-to-customer produce marketplace, built
to practice wiring a decoupled frontend up to a Django + Django REST
Framework (DRF) backend.

## What's here

- **Role-based UI** — one login, two experiences. `AuthContext` stores the
  logged-in user's `role` ("seller" | "customer"), and `App.jsx` routes
  accordingly. `ProtectedRoute` gates seller-only / customer-only pages.
- **Customer flow** — `pages/customer/`: browse + search/filter, cart
  (`CartContext`, in-memory), checkout with a mock payment step.
- **Seller flow** — `pages/seller/`: dashboard summary, list/edit/delete
  produce, stock-vs-demand table, earnings view with a simple bar chart.
- **API layer** — everything that talks to Django lives in `src/api/`.
  `axios.js` is the shared client (base URL + auth header + 401 handling).
  `auth.js`, `products.js`, `orders.js` group calls by resource.
- **Mock mode** — `VITE_USE_MOCKS=true` (default) makes `products.js` and
  `orders.js` return fake data instead of calling Django, so you can build
  and demo the whole UI before the backend exists.

## Running it

```bash
npm install
cp .env.example .env
npm run dev
```

Opens on `http://localhost:5173`. With mocks on, click "Browse as a
customer" straight from the landing page — no backend needed yet.

---

## Interfacing with Django: how to actually wire this up

### 1. Start with DRF, not plain Django views
Use **Django REST Framework**. It gives you serializers (Python objects ↔
JSON), viewsets, and permission classes — all the plumbing a React frontend
needs. Plain Django views work but you'll end up reinventing DRF badly.

```bash
pip install djangorestframework djangorestframework-simplejwt django-cors-headers
```

### 2. CORS will bite you first — fix it early
Your React dev server (`localhost:5173`) and Django (`localhost:8000`) are
different origins. Without CORS headers, the browser blocks the requests
even though Postman/curl would work fine — this trips up almost everyone
the first time.

```python
# settings.py
INSTALLED_APPS += ["corsheaders"]
MIDDLEWARE = ["corsheaders.middleware.CorsMiddleware", *MIDDLEWARE]
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]
```

### 3. Pick ONE auth strategy and match it on both sides
This project's `axios.js` sends `Authorization: Bearer <token>`, which
matches **djangorestframework-simplejwt**:

```python
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}
# urls.py
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns += [
    path("api/auth/login/", TokenObtainPairView.as_view()),
    path("api/auth/refresh/", TokenRefreshView.as_view()),
]
```
If you'd rather use DRF's simpler `TokenAuthentication`, that's fine too —
just change the one line in `src/api/axios.js` from `Bearer ${token}` to
`Token ${token}`. The important thing is that the header format matches
exactly what your `DEFAULT_AUTHENTICATION_CLASSES` expects.

### 4. Model the seller/customer split with a `role` field
Simplest approach: extend Django's user model (or a `Profile` model with a
OneToOne to `User`) with a `role` choice field:

```python
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=[("seller", "Seller"), ("customer", "Customer")])
```
Your login serializer should return `role` in the response body so the
frontend can store it — that's the `data.role` this project reads in
`AuthContext.login()`.

### 5. Enforce roles on the backend too — never trust the frontend
`ProtectedRoute` in this app is a UX convenience (hide/redirect). The real
gate is DRF `permission_classes`:

```python
class IsSeller(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.profile.role == "seller"

class ProductViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsSeller()]
        return [AllowAny()]  # anyone can browse/list
```
Also filter querysets by owner so a seller can't edit someone else's stock:
`Product.objects.filter(seller=request.user)` for the `mine/` endpoint.

### 6. Match your serializer fields to what the frontend expects
The frontend reads `product.name`, `.price`, `.stock`, `.unit`,
`.category`, `.sellerName`. Your DRF `ProductSerializer` should expose
those exact keys (use `source=` if your model field names differ), e.g.:

```python
class ProductSerializer(serializers.ModelSerializer):
    sellerName = serializers.CharField(source="seller.username", read_only=True)
    class Meta:
        model = Product
        fields = ["id", "name", "category", "unit", "price", "stock", "sellerName"]
```
Whenever you get a "shows blank"/`undefined` bug in React, it is almost
always a field-name mismatch between the serializer and the JSX — check
that before anything else.

### 7. Turn off mocks endpoint by endpoint
Don't flip `VITE_USE_MOCKS` all at once. Build one Django endpoint (say,
`GET /api/products/`), test it in the browser/Postman, then edit just that
one function in `src/api/products.js` to skip the mock branch and confirm
it renders correctly — before moving to the next endpoint. Small, verified
steps beat a big-bang switch.

### 8. Payments — keep the gateway call server-side
Never put payment gateway secret keys in React. The real pattern:
1. React calls Django `POST /api/orders/checkout/` with the cart.
2. Django creates an `Order` (status `pending`), calls the payment
   gateway's API (Razorpay/Stripe) server-side using the secret key, and
   returns a public `order_id`/`client_secret` to React.
3. React uses that token to open the gateway's client-side checkout
   widget (Razorpay Checkout, Stripe Elements) — this part *is* meant to
   run in the browser, using only the public key.
4. The gateway calls a **webhook** on Django to confirm payment, and
   Django marks the order `paid`. Don't trust a "success" callback from
   the browser alone — always confirm via webhook, since a user closing
   the tab shouldn't fake a paid order.

### 9. Images (produce photos)
If sellers upload photos, use DRF's `ImageField` + `MEDIA_URL`/`MEDIA_ROOT`,
and send `multipart/form-data` from React (axios handles this if you pass
a `FormData` object instead of a plain object — just don't manually set
the `Content-Type` header, let the browser set the multipart boundary).

### 10. Debugging checklist when a request "doesn't work"
1. Check the Network tab — what status code, what response body?
2. `401` → token missing/expired/wrong header format (see step 3).
3. `403` → authenticated but failing a permission check (see step 5).
4. `CORS error in console, no request in Network tab` → step 2.
5. `Data renders as undefined` → serializer field name mismatch (step 6).
6. Nothing in Network tab at all → check `VITE_USE_MOCKS` is `false` and
   `VITE_API_BASE_URL` is correct.

---

## Suggested Django app structure to pair with this

```
backend/
  accounts/      # User/Profile, role, register/login serializers & views
  products/      # Product model, ProductViewSet, demand aggregation view
  orders/        # Order, OrderItem, checkout view, earnings aggregation
```
Building it in that order (accounts → products → orders) matches the
order this frontend expects to light up: login works → browsing works →
checkout works.
