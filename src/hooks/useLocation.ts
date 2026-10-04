import {useState, useEffect, useCallback, useRef} from 'react';
import {
  getCurrentLocation,
  requestLocationPermission,
  checkLocationPermission,
  watchLocation,
  clearWatch,
  LocationData,
} from '../services/locationService';

interface UseLocationReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
  requestPermission: () => Promise<boolean>;
  refreshLocation: () => Promise<void>;
  startWatching: () => void;
  stopWatching: () => void;
}

/**
 * Custom hook for managing location permissions and fetching location.
 */
export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // Check permission on mount
  useEffect(() => {
    checkLocationPermission().then(granted => {
      setPermissionGranted(granted);
    });
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const granted = await requestLocationPermission();
      setPermissionGranted(granted);
      if (!granted) {
        setError('Location permission was denied');
      }
      return granted;
    } catch (err: any) {
      setError(err.message || 'Failed to request permission');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
      setPermissionGranted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to get location');
    } finally {
      setLoading(false);
    }
  }, []);

  const startWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      return; // Already watching
    }

    watchIdRef.current = watchLocation(
      loc => {
        setLocation(loc);
        setError(null);
      },
      err => {
        setError(err.message);
      },
    );
  }, []);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    location,
    loading,
    error,
    permissionGranted,
    requestPermission,
    refreshLocation,
    startWatching,
    stopWatching,
  };
}
