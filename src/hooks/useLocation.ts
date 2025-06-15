import { useState, useEffect } from 'react';
import { getCurrentLocation, LocationCoordinates, LocationError } from '../utils/location';

interface UseLocationResult {
  location: LocationCoordinates | null;
  loading: boolean;
  error: LocationError | null;
  refetch: () => Promise<void>;
}

export const useLocation = (autoFetch: boolean = true): UseLocationResult => {
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<LocationError | null>(null);

  const fetchLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const coords = await getCurrentLocation();
      setLocation(coords);
    } catch (err) {
      setError(err as LocationError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchLocation();
    }
  }, [autoFetch]);

  return {
    location,
    loading,
    error,
    refetch: fetchLocation
  };
}; 