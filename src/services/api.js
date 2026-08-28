import axios from "axios"

// Central Axios instance. Reads the future Django REST Framework base URL
// from an environment variable so no backend URLs are hard-coded. Every
// service in this folder is written against this instance — when the real
// backend is ready, only this file (and the mock fallbacks in each service)
// need to change.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("agrilink:authToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Simulated network latency so loading states are exercised realistically
// even though data currently comes from local mock fixtures.
export function simulateLatency(min = 250, max = 600) {
  const ms = Math.floor(Math.random() * (max - min)) + min
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class ApiError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}
