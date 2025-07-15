"use client"

import { useState, useEffect } from "react"
import { MapPin, Wifi, WifiOff, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const Header = ({ location, networkInfo }) => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getNetworkStatus = () => {
    if (!networkInfo.isOnline) {
      return { icon: <WifiOff className="h-3 w-3" />, variant: "destructive", text: "Offline" }
    }
    if (networkInfo.effectiveType === "2g") {
      return { icon: <Wifi className="h-3 w-3" />, variant: "secondary", text: "2G" }
    }
    return {
      icon: <Wifi className="h-3 w-3" />,
      variant: "default",
      text: networkInfo.effectiveType?.toUpperCase() || "Online",
    }
  }

  const networkStatus = getNetworkStatus()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
     
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <MapPin className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold">Nearby Essentials</h1>
            <p className="text-xs text-muted-foreground">TAP Invest Assessment</p>
          </div>
        </div>

        <Separator orientation="vertical" className="mx-4 h-6" />



        <div className="flex items-center space-x-2 ml-auto">
          <Badge variant={networkStatus.variant} className="hidden sm:flex items-center gap-1">
            {networkStatus.icon}
            <span className="text-xs">{networkStatus.text}</span>
          </Badge>


          {location.latitude && (
            <Badge variant="outline" className="hidden md:flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="text-xs font-mono">
                {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}
              </span>
            </Badge>
          )}


          <Badge variant="secondary" className="hidden lg:flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="text-xs font-mono">{time.toLocaleTimeString()}</span>
          </Badge>
        </div>
      </div>
    </header>
  )
}

export default Header
