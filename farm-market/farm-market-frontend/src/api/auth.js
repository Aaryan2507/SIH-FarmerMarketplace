import api from "./axios";

/**
 * Each function here maps to ONE Django view/endpoint. Keeping them
 * named and grouped by resource (auth, products, orders...) means
 * when a backend route changes, you only edit it in one place.
 *
 * Expected Django URLs (adjust to match your urls.py):
 *   POST /api/auth/register/   {username, password, role, ...}
 *   POST /api/auth/login/      {username, password} -> {access, refresh, role}
 *   GET  /api/auth/me/         -> current user profile
 */

export async function registerUser({ username, email, password, role }) {
  const { data } = await api.post("/auth/register/", { username, email, password, role });
  return data;
}

export async function loginUser({ username, password }) {
  const { data } = await api.post("/auth/login/", { username, password });
  // simplejwt returns {access, refresh}; adapt the keys to whatever
  // your serializer actually returns.
  if (data.access) {
    localStorage.setItem("access_token", data.access);
  }
  if (data.role) {
    localStorage.setItem("user_role", data.role);
  }
  return data;
}

export function logoutUser() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_role");
}

export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/profile/");
  return data;
}
