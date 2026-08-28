import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { mockDemand } from "../../data/mockDemand"
import { formatNumber } from "../../utils/format"

const LEVEL_VARIANT = { high: "success", medium: "warning", low: "destructive" }
const TREND_ICON = { up: TrendingUp, down: TrendingDown, flat: Minus }

export default function FarmerDemandInsights() {
  const chartData = mockDemand.map((d) => ({ name: d.productName, searches: d.weeklySearches }))

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Demand insights</h1>
      <p className="mt-1 text-sm text-muted-foreground">See what buyers are searching for so you can plan what to grow and stock.</p>

      <Card className="mt-6">
        <CardContent>
          <h2 className="font-heading text-base font-semibold text-foreground">Weekly search volume</h2>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  formatter={(value) => [formatNumber(value), "Searches"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12, background: "hsl(var(--card))" }}
                />
                <Bar dataKey="searches" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockDemand.map((d) => {
          const TrendIcon = TREND_ICON[d.trend]
          return (
            <Card key={d.productName}>
              <CardContent>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-sm font-semibold text-foreground">{d.productName}</h3>
                  <Badge variant={LEVEL_VARIANT[d.demandLevel]}>{d.demandLevel} demand</Badge>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TrendIcon className="h-3.5 w-3.5" />
                  {formatNumber(d.weeklySearches)} searches this week
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground">{d.suggestion}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
