'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';

const NetworkWarning = ({ networkInfo }) => {
  const showSlowWarning =
    networkInfo.isOnline && networkInfo.effectiveType === '2g';

  return (
    <div className=" space-y-5">
      {showSlowWarning && (
        <div className="mb-6">
          <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <span className="font-medium text-yellow-800">
                  Slow connection detected.
                </span>{' '}
                <span className="text-yellow-700">
                  Images and maps are disabled to save data and improve speed.
                </span>
              </div>
              <Badge variant="outline" className="ml-2 text-xs">
                <Wifi className="h-3 w-3 mr-1" />
                Network API
              </Badge>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {!networkInfo.isOnline && (
        <div className="mb-6">
          <Alert variant="destructive">
            <WifiOff className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <span className="font-medium">No internet connection.</span>{' '}
                <span>Please check your network and try again.</span>
              </div>
              <Badge variant="outline" className="ml-2 text-xs">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default NetworkWarning;
