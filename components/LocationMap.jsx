"use client"

import { motion } from "framer-motion"
import { MapPin, RefreshCw, Satellite, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

const LocationMap = ({ location, onRefresh, loading, networkInfo }) => {
  const { latitude, longitude, accuracy } = location

  const shouldShowMap = networkInfo.isOnline && networkInfo.effectiveType !== "2g"

  const mapUrl =
    shouldShowMap && latitude && longitude
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`
      : null

  const getAccuracyBadge = () => {
    if (!accuracy) return null
    if (accuracy <= 50) return <Badge variant="default">High Accuracy</Badge>
    if (accuracy <= 100) return <Badge variant="secondary">Good Accuracy</Badge>
    return <Badge variant="destructive">Low Accuracy</Badge>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Satellite className="h-5 w-5 text-primary" />
                Your Location
                <Badge variant="outline" className="text-xs">
                  Geolocation API
                </Badge>
              </CardTitle>
              <CardDescription>Real-time GPS tracking with high accuracy mode</CardDescription>
            </div>
            <Button onClick={onRefresh} disabled={loading} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {latitude && longitude ? (
            <>
              {/* Location Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Latitude</p>
                  <p className="text-lg font-mono">{latitude.toFixed(6)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Longitude</p>
                  <p className="text-lg font-mono">{longitude.toFixed(6)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">±{Math.round(accuracy)}m</span>
                    {getAccuracyBadge()}
                  </div>
                </div>
              </div>

              {/* Map or Fallback */}
              <div className="relative">
                {mapUrl ? (
                  <div className="w-full h-80 rounded-lg overflow-hidden border bg-muted">
                    <iframe
                      src={mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      title="Interactive Location Map"
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-full h-80 rounded-lg border bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <MapPin className="h-16 w-16 mx-auto text-muted-foreground/50" />
                      <div>
                        <p className="font-medium">Map disabled for slow connection</p>
                        <p className="text-sm text-muted-foreground">Network Information API optimization</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Accuracy Warning */}
              {accuracy && accuracy > 100 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Location accuracy is low ({Math.round(accuracy)}m). For better results, go outdoors and ensure GPS
                    is enabled.
                  </AlertDescription>
                </Alert>
              )}
            </>
          ) : (
            <div className="text-center py-12 space-y-4">
              <Satellite className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <div>
                <h3 className="font-medium mb-2">{loading ? "Getting your location..." : "Location not available"}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {loading
                    ? "Please wait while we detect your GPS coordinates"
                    : "Click below to enable location access"}
                </p>
              </div>
              {!loading && (
                <Button onClick={onRefresh} size="lg">
                  <MapPin className="h-4 w-4 mr-2" />
                  Enable Location
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default LocationMap
