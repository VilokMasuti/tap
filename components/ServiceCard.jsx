"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Clock, Phone, Navigation, Star, Dot } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const ServiceCard = ({ service, index, networkInfo }) => {
  const [isVisible, setIsVisible] = useState(false)         // Tracks if the card is visible in viewport
  const [hasAnimated, setHasAnimated] = useState(false)     // Used to avoid re-triggering
  const cardRef = useRef(null)                              // Ref for the

  //  Intersection Observer to detect when card is visible on screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true)             // Make the card visible
            setHasAnimated(true)           // Prevent future re-animations
          }, index * 100)                  // Add a small delay based on index for staggered reveal
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    )

    if (cardRef.current) observer.observe(cardRef.current)

    return () => observer.disconnect()     // Clean up observer on unmount
  }, [hasAnimated, index])

  //  Decide whether to load image based on network speed
  const shouldLoadImage = networkInfo.isOnline && networkInfo.effectiveType !== "2g"

  //  Returns config object (colors, emoji) based on service type
  const getServiceConfig = (type) => {
    const configs = {
      Hospital: {
        color: "destructive",
        icon: "🏥",
        bgColor: "bg-red-50 dark:bg-red-950/20",
        iconBg: "bg-red-100 text-red-700",
      },
      ATM: {
        color: "default",
        icon: "🏧",
        bgColor: "bg-green-50 dark:bg-green-950/20",
        iconBg: "bg-green-100 text-green-700",
      },
      Pharmacy: {
        color: "secondary",
        icon: "💊",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
        iconBg: "bg-blue-100 text-blue-700",
      },
    }
    return configs[type] || configs.ATM
  }

  const config = getServiceConfig(service.type)

  //  Open directions in Google Maps using Geolocation
  const handleDirections = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const url = `https://www.google.com/maps/dir/${latitude},${longitude}/${encodeURIComponent(service.address)}`
          window.open(url, "_blank")
        },
        () => {
          // Fallback if location fails
          const url = `https://www.google.com/maps/search/${encodeURIComponent(service.name)}`
          window.open(url, "_blank")
        }
      )
    }
  }

  // Open phone dialer with confirmation
  const handleCall = () => {
    if (confirm(`Call ${service.name}?\n${service.phone}`)) {
      window.location.href = `tel:${service.phone}`
    }
  }

  //  Return null if not visible (skip render until intersected)
  if (!isVisible) return <div ref={cardRef}></div>

  return (
    <div ref={cardRef}>

      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md">

        <div className={`relative h-48 ${config.bgColor}`}>
          {shouldLoadImage ? (
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-6xl">{config.icon}</div>
                <div>
                  <p className="text-sm font-medium">Image disabled</p>
                  <Badge variant="outline" className="text-xs">
                    Network optimized
                  </Badge>
                </div>
              </div>
            </div>
          )}


          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={config.color} className="shadow-sm">{service.type}</Badge>
            <Badge variant={service.isOpen ? "default" : "secondary"} className="shadow-sm">
              <Dot className={`h-3 w-3 mr-1 ${service.isOpen ? "text-green-500" : "text-gray-500"}`} />
              {service.isOpen ? "Open" : "Closed"}
            </Badge>
          </div>


          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="shadow-sm bg-white/90 backdrop-blur-sm">
              <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
              {service.rating}
            </Badge>
          </div>
        </div>


        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={config.iconBg}>{config.icon}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight">{service.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{service.address}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>


        <CardContent className="pt-0 space-y-4">

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{service.distance} away</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span className="font-mono text-xs">{service.phone}</span>
            </div>
          </div>

          <Separator />


          <div className="flex gap-2">
            <Button onClick={handleDirections} className="flex-1" size="sm" variant="default">
              <Navigation className="h-4 w-4 mr-2" />
              Directions
            </Button>
            <Button onClick={handleCall} variant="outline" size="sm" className="px-3 bg-transparent">
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ServiceCard
