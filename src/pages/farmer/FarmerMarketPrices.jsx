import { useState } from "react"
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent } from "../../components/ui/Card"
import { mockMarketPrices } from "../../data/mockMarketPrices"
import { formatCurrency, formatDate } from "../../utils/format"

function trendDirection(trend) {
  if (trend.length < 2) return "flat"
  const diff = trend[trend.length - 1].price - trend[0].price
  if (diff > 1) return "up"
  if (diff < -1) return "down"
  return "flat"
}

export default function FarmerMarketPrices() {
  const [selected, setSelected] = useState(mockMarketPrices[0].productId)
  const active = mockMarketPrices.find((m) => m.productId === selected) || mockMarketPrices[0]
  const direction = trendDirection(active.trend)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Market prices</h1>
      <p className="mt-1 text-sm text-muted-foreground">Live mandi prices to help you price your produce competitively.</p>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-2 lg:col-span-1">
          {mockMarketPrices.map((m) => {
            const dir = trendDirection(m.trend)
            const isActive = m.productId === selected
            return (
              <button
                key={m.productId}
                onClick={() => setSelected(m.productId)}
                className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
                  isActive ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{m.productName}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{m.market}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(m.marketPrice)}</span>
                  {dir === "up" && <TrendingUp className="h-4 w-4 text-success" />}
                  {dir === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
                  {dir === "flat" && <Minus className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>
            )
          })}
        </div>

        <Card className="lg:col-span-2">
          <CardContent>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">{active.productName}</h2>
                <p className="text-sm text-muted-foreground">{active.market}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-muted-foreground">Mandi price</p>
                  <p className="font-heading text-xl font-semibold text-foreground">{formatCurrency(active.marketPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Your price</p>
                  <p className="font-heading text-xl font-semibold text-primary">{formatCurrency(active.farmerPrice)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={active.trend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) => formatDate(d).split(" ").slice(0, 2).join(" ")}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), "Price"]}
                    labelFormatter={(d) => formatDate(d)}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                      fontSize: 12,
                      background: "hsl(var(--card))",
                    }}
                  />
                  <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#priceGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              {direction === "up" && "Prices are trending upward — a good time to sell."}
              {direction === "down" && "Prices are trending downward — consider holding stock if possible."}
              {direction === "flat" && "Prices have remained stable over the past week."}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
