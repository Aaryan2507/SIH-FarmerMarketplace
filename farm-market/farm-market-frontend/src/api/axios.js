import axios from "axios";

/**
 * ------------------------------------------------------------------
 * THIS FILE IS THE SEAM BETWEEN REACT AND DJANGO.
 * Everything about "how do the two talk to each other" lives here,
 * so the rest of the app never has to think about it.
 * ------------------------------------------------------------------
 *
 * Set VITE_API_BASE_URL in a .env file at the project root, e.g.
 *    VITE_API_BASE_URL=http://127.0.0.1:8000/api
 * Vite only exposes env vars prefixed with VITE_ to the browser.
 */
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * REQUEST INTERCEPTOR
 * Runs before every request. We attach the auth token here instead of
 * repeating it in every fetch call across the app.
 *
 * If you're using Django REST Framework's TokenAuthentication or
 * djangorestframework-simplejwt, the header format is:
 *    Authorization: Token <key>          (DRF TokenAuth)
 *    Authorization: Bearer <access_jwt>  (simplejwt)
 * Pick ONE and make sure it matches your DRF settings.py
 * DEFAULT_AUTHENTICATION_CLASSES.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // switch to `Token ${token}` if using DRF TokenAuth
  }
  return config;
});

/**
 * RESPONSE INTERCEPTOR
 * A single place to react to 401s (expired/invalid token). This is
 * where you'd wire up a JWT refresh call before giving up and
 * bouncing the user to /login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
      // Avoid a hard redirect loop if we're already on the login page
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

/* ------------------------------------------------------------------
 * A NOTE ON CSRF (only matters if you use Django's SESSION auth
 * instead of tokens/JWT):
 * Django's SessionAuthentication requires an X-CSRFToken header on
 * unsafe methods (POST/PUT/PATCH/DELETE). Token/JWT auth (used above)
 * is exempt from CSRF checks, which is why most React+DRF tutorials
 * steer you toward tokens for a decoupled frontend. If you do need
 * session auth, read the csrftoken cookie and set it as a header
 * in this same interceptor.
 * ------------------------------------------------------------------ */
