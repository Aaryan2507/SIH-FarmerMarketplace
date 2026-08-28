import { simulateLatency, ApiError } from "./api"
import { mockUsers, findUserByPhone } from "@/data/mockUsers"
import { readStorage, writeStorage, removeStorage } from "@/utils/storage"

// Mock auth service. Mirrors the shape a real `/api/auth/*` integration
// with Express/Django would take (Promise-based, throws ApiError on
// failure) so swapping in real HTTP calls later needs no component changes.

let otpStore = {}

export async function requestOtp(phone) {
  await simulateLatency()
  const code = "123456" // fixed demo OTP, shown in the UI for the prototype
  otpStore[phone] = code
  return { phone, expiresInSeconds: 60, demoOtp: code }
}

export async function verifyOtp(phone, code) {
  await simulateLatency()
  const expected = otpStore[phone] || "123456"
  if (code !== expected) {
    throw new ApiError("Incorrect OTP. Please try again.", 401)
  }
  return { verified: true }
}

export async function login({ phone, password }) {
  await simulateLatency()
  const user = findUserByPhone(phone)
  if (!user) {
    throw new ApiError("No account found for this phone number.", 404)
  }
  // Demo password is intentionally simple — this is a frontend prototype only.
  if (password && password !== "demo1234" && password.length < 4) {
    throw new ApiError("Incorrect password.", 401)
  }
  const token = `mock-token-${user.id}-${Date.now()}`
  writeStorage("authToken", token)
  writeStorage("currentUser", user)
  return { user, token }
}

export async function loginWithOtp({ phone }) {
  await simulateLatency()
  const user = findUserByPhone(phone)
  if (!user) {
    throw new ApiError("No account found for this phone number.", 404)
  }
  const token = `mock-token-${user.id}-${Date.now()}`
  writeStorage("authToken", token)
  writeStorage("currentUser", user)
  return { user, token }
}

export async function signup({ name, phone, email, role, ...rest }) {
  await simulateLatency()
  if (findUserByPhone(phone)) {
    throw new ApiError("An account already exists with this phone number.", 409)
  }
  const id = `${role.charAt(0)}-${Date.now().toString().slice(-6)}`
  const user = {
    id,
    role,
    name,
    phone,
    email,
    location: rest.location || "India",
    memberSince: new Date().toISOString().slice(0, 10),
    aadhaarVerified: false,
    avatar: null,
    ...rest,
  }
  mockUsers.push(user)
  const token = `mock-token-${user.id}-${Date.now()}`
  writeStorage("authToken", token)
  writeStorage("currentUser", user)
  return { user, token }
}

export async function verifyAadhaar(aadhaarLastFour) {
  await simulateLatency(600, 1200)
  if (!/^\d{4}$/.test(aadhaarLastFour)) {
    throw new ApiError("Enter the last 4 digits shown on your mock Aadhaar card.", 400)
  }
  const current = readStorage("currentUser", null)
  if (current) {
    const updated = { ...current, aadhaarVerified: true }
    writeStorage("currentUser", updated)
    return { verified: true, user: updated }
  }
  return { verified: true }
}

export function getCurrentUser() {
  return readStorage("currentUser", null)
}

export function getToken() {
  return readStorage("authToken", null)
}

export async function logout() {
  await simulateLatency(100, 200)
  removeStorage("authToken")
  removeStorage("currentUser")
}
