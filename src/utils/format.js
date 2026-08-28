export function formatCurrency(value, { compact = false } = {}) {
  const n = Number(value) || 0
  if (compact && n >= 1000) {
    return `₹${(n / 1000).toFixed(1)}K`
  }
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
}

export function formatNumber(value) {
  return Number(value).toLocaleString("en-IN")
}

export function formatDate(date, { withTime = false } = {}) {
  const d = typeof date === "string" ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return "—"
  const opts = { day: "numeric", month: "short", year: "numeric" }
  if (withTime) {
    opts.hour = "2-digit"
    opts.minute = "2-digit"
  }
  return d.toLocaleDateString("en-IN", opts)
}

export function relativeTime(date) {
  const d = typeof date === "string" ? new Date(date) : date
  const diffMs = Date.now() - d.getTime()
  const diffMin = Math.round(diffMs / 60000)
  if (diffMin < 1) return "just now"
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.round(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`
  return formatDate(d)
}

export function timeAgo(date) {
  return relativeTime(date)
}
