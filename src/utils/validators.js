export function isValidPhone(value) {
  return /^[6-9]\d{9}$/.test(String(value).trim())
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())
}

export function isValidOtp(value) {
  return /^\d{6}$/.test(String(value).trim())
}

export function isValidPincode(value) {
  return /^\d{6}$/.test(String(value).trim())
}

export function required(value) {
  return value !== undefined && value !== null && String(value).trim().length > 0
}

export function isPositiveNumber(value) {
  return !Number.isNaN(Number(value)) && Number(value) > 0
}
