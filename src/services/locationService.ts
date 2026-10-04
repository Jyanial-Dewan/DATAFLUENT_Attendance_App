import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export type PermissionStatus = 'granted' | 'denied' | 'never_ask_again';

/**
 * Request location permission on Android.
 * Returns true if granted, false otherwise.
 */
export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location to mark attendance.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    // If fine location denied, try coarse as fallback
    if (granted === PermissionsAndroid.RESULTS.DENIED) {
      const coarseGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'Approximate Location Permission',
          message: 'We can use approximate location to mark your attendance.',
          buttonPositive: 'OK',
        },
      );
      return coarseGranted === PermissionsAndroid.RESULTS.GRANTED;
    }

    return false;
  } catch (err) {
    console.warn('Permission request error:', err);
    return false;
  }
}

/**
 * Check if location permission is already granted.
 */
export async function checkLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }

  const fineGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (fineGranted) {
    return true;
  }

  const coarseGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  );
  return coarseGranted;
}

/**
 * Get the current device location.
 * Throws if permission is not granted.
 */
export async function getCurrentLocation(): Promise<LocationData> {
  const hasPermission = await checkLocationPermission();
  if (!hasPermission) {
    const granted = await requestLocationPermission();
    if (!granted) {
      throw new Error('Location permission denied');
    }
  }

  return new Promise<LocationData>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        });
      },
      error => {
        reject(new Error(error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  });
}

/**
 * Watch the device location for continuous updates.
 * Returns a watch ID that can be passed to clearWatch.
 */
export function watchLocation(
  onLocation: (location: LocationData) => void,
  onError?: (error: Error) => void,
): number {
  return Geolocation.watchPosition(
    position => {
      onLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: position.timestamp,
      });
    },
    error => {
      if (onError) {
        onError(new Error(error.message));
      }
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 10, // minimum distance (meters) between updates
      interval: 5000, // Android: update interval in ms
      fastestInterval: 2000, // Android: fastest update interval
    },
  );
}

/**
 * Stop watching location updates.
 */
export function clearWatch(watchId: number): void {
  Geolocation.clearWatch(watchId);
}
