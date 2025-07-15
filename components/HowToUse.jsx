'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import {
  CheckCircle,
  Code,
  Eye,
  HelpCircle,
  MapPin,
  Wifi,
  X,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const HowToUse = () => {
  const [isOpen, setIsOpen] = useState(false);

  const apis = [
    {
      id: 'geolocation',
      name: 'Geolocation API',
      icon: <MapPin className="h-5 w-5" />,
      description: 'Real-time GPS location tracking with high accuracy',

      demo: "Allow location → See coordinates in header → Click 'Directions' on any service",
    },
    {
      id: 'intersection',
      name: 'Intersection Observer API',
      icon: <Eye className="h-5 w-5" />,
      description: 'Performance-optimized lazy loading for better UX',

      demo: 'Scroll down → Watch service cards animate in smoothly → Performance optimized',
    },
    {
      id: 'network',
      name: 'Network Information API',
      icon: <Wifi className="h-5 w-5" />,
      description: 'Adaptive content delivery based on connection speed',

      demo: 'Check network badge → Slow connection = optimized content → Data saved',
    },
  ];

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40 hover:scale-105 transition-transform"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" />
              TAP Invest Assessment
            </h2>
            <p className="text-muted-foreground">
              Web API Implementation Showcase
            </p>
          </div>
          <Button onClick={() => setIsOpen(false)} variant="ghost" size="icon">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="geolocation">Geolocation</TabsTrigger>
              <TabsTrigger value="intersection">Intersection</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>
                    All 3 required Web APIs successfully implemented!
                  </strong>{' '}
                  This modern React application demonstrates real-world usage of
                  browser APIs for location services.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                {apis.map((api, i) => (
                  <Card key={i} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {api.icon}
                          {api.name}
                        </div>
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </CardTitle>
                      <CardDescription>{api.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>Demo:</strong> {api.demo}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Technical Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Frontend:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• React 18 with hooks</li>
                        <li>• Next.js 14 App Router</li>
                        <li>• shadcn/ui components</li>
                        <li>• Tailwind CSS</li>
                        <li>• Framer Motion</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {apis.map((api) => (
              <TabsContent key={api.id} value={api.id} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {api.icon}
                      {api.name}
                    </CardTitle>
                    <CardDescription>{api.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">
                        Implementation Features:
                      </h4>
                    </div>
                    <Separator />
                    <Alert>
                      {api.icon}
                      <AlertDescription>
                        <strong>How to test:</strong> {api.demo}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <Separator className="my-6" />

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Submitted for <strong>TAP TAP Invest </strong>
            </p>
            <p className="text-xs text-muted-foreground">
              TAP Invest Technical Assessment
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HowToUse;
