"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Filter } from "lucide-react"


import servicesData from "@/data/services.json"


import Header from "@/components/Header"
import LocationMap from "@/components/LocationMap"
import ServiceCard from "@/components/ServiceCard"
import NetworkWarning from "@/components/NetworkWarning"
import HowToUse from "@/components/HowToUse"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function Home() {

  const [location, setLocation] = useState({ latitude: null, longitude: null, accuracy: null })
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [locationLoading, setLocationLoading] = useState(false)
  const [networkInfo, setNetworkInfo] = useState({ isOnline: true, effectiveType: "4g" })
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  // const [viewMode, setViewMode] = useState("grid")

  // Network Information API
  useEffect(() => {
    const updateNetwork = () => {
      setNetworkInfo({
        isOnline: navigator.onLine,
        effectiveType: navigator.connection?.effectiveType || "4g",
      })
    }

    updateNetwork()
    window.addEventListener("online", updateNetwork)
    window.addEventListener("offline", updateNetwork)
    navigator.connection?.addEventListener("change", updateNetwork)

    return () => {
      window.removeEventListener("online", updateNetwork)
      window.removeEventListener("offline", updateNetwork)
      navigator.connection?.removeEventListener("change", updateNetwork)
    }
  }, [])

  // Geolocation API
  const getLocation = () => {
    setLocationLoading(true)

    if (!navigator.geolocation) {
      alert("Geolocation not supported by this browser")
      setLocationLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
        setLocationLoading(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        alert(`Location error: ${error.message}`)
        setLocationLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 60000,
      },
    )
  }

  // Load services from JSON
  useEffect(() => {
    setTimeout(() => {
      setServices(servicesData.services)
      setLoading(false)
    }, 800)
  }, [])

  // Get location on start
  useEffect(() => {
    getLocation()
  }, [])

  // Filter and search services
  const filteredServices = services.filter((service) => {
    return filter === "all" || service.type.toLowerCase() === filter
  })

  const serviceTypes = [
    { value: "all", label: "All Services", count: services.length },
    { value: "hospital", label: "Hospitals", count: services.filter((s) => s.type === "Hospital").length },
    { value: "atm", label: "ATMs", count: services.filter((s) => s.type === "ATM").length },
    { value: "pharmacy", label: "Pharmacies", count: services.filter((s) => s.type === "Pharmacy").length },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header location={location} networkInfo={networkInfo} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <NetworkWarning networkInfo={networkInfo} />

        <LocationMap location={location} onRefresh={getLocation} loading={locationLoading} networkInfo={networkInfo} />

        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-primary" />
                    Nearby Services
                    <Badge variant="secondary" className="ml-2">
                      {filteredServices.length} found
                    </Badge>
                  </CardTitle>
                  <CardDescription>Essential services in Bagalkot with real-time availability</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Filter Tabs */}
              <Tabs value={filter} onValueChange={setFilter}>
                <TabsList className="grid w-full grid-cols-4">
                  {serviceTypes.map((type) => (
                    <TabsTrigger key={type.value} value={type.value} className="flex items-center gap-2">
                      <span>{type.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {type.count}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={filter} className="mt-6">
                  {loading ? (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {[...Array(6)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                          <Skeleton className="h-48 w-full" />
                          <div className="p-4 space-y-3">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex gap-2">
                              <Skeleton className="h-8 flex-1" />
                              <Skeleton className="h-8 w-12" />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : filteredServices.length > 0 ? (
                    <motion.div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" layout>
                      {filteredServices.map((service, index) => (
                        <ServiceCard key={service.id} service={service} index={index} networkInfo={networkInfo} />
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-16 space-y-4">
                      <div className="text-6xl">🔍</div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">No services found</h3>
                        <p className="text-muted-foreground">Try a different filter</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        <HowToUse />

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center space-y-4"
        >
          <Separator />
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="outline" className="flex items-center gap-1">
               Geolocation API
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
               Intersection Observer API
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
               Network Information API
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              TAP Invest Technical Assessment - Modern Web APIs Implementation
            </p>
            <p className="text-xs text-muted-foreground">
              Built with React, Next.js, shadcn/ui, Tailwind CSS & Framer Motion
            </p>
          </div>
        </motion.footer>
      </main>
    </div>
  )
}
