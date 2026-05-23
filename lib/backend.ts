import Constants from 'expo-constants';

const PROD_URL = 'https://mastr-backend.onrender.com';

function resolveBackendUrl(): string {
  // In production builds always use the live backend
  if (!__DEV__) return PROD_URL;

  const env = process.env.EXPO_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';
  if (!env.includes('localhost')) return env;

  // On a physical device, swap localhost for the dev machine's LAN IP
  const devHost = (Constants.expoConfig as unknown as Record<string, unknown>)?.hostUri as string | undefined;
  const ip = devHost?.split(':')[0];
  return ip ? env.replace('localhost', ip) : env;
}

export const BACKEND = resolveBackendUrl();
