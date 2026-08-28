import { createContext, useContext, useState, useMemo, useEffect } from "react"
import { readStorage, writeStorage } from "@/utils/storage"

const LocationContext = createContext(null)

export const AVAILABLE_LOCATIONS = [
  "Pune, Maharashtra",
  "Mumbai, Maharashtra",
  "Nashik, Maharashtra",
  "Pimpri-Chinchwad, Maharashtra",
  "Nagpur, Maharashtra",
]

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(() => readStorage("location", AVAILABLE_LOCATIONS[0]))

  useEffect(() => {
    writeStorage("location", location)
  }, [location])

  const value = useMemo(() => ({ location, setLocation, options: AVAILABLE_LOCATIONS }), [location])

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}

export function useLocation() {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error("useLocation must be used within LocationProvider")
  return ctx
}
