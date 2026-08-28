import { cn } from "@/utils/cn"

export function Tabs({ tabs, value, onChange, className }) {
  return (
    <div className={cn("no-scrollbar flex gap-1.5 overflow-x-auto rounded-lg bg-muted p-1", className)} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.value === value
        return (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={cn(
              "shrink-0 rounded-md px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive ? "bg-card text-primary-dark shadow-soft" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn("ml-1.5 text-xs", isActive ? "text-primary" : "text-muted-foreground")}>
                ({tab.count})
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
