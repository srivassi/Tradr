import Constants from 'expo-constants';

/**
 * On a physical device, `localhost` resolves to the phone, not the dev machine.
 * Swap it out for the Expo Metro bundler host, which IS the dev machine IP.
 * When EXPO_PUBLIC_BACKEND_URL points at a real server (Railway, etc.) the
 * host won't contain "localhost" and the URL is used as-is.
 */
function resolveBackendUrl(): string {
  const env = process.env.EXPO_PUBLIC_BACKEND_URL ?? 'https://mastr-backend.onrender.com';

  if (!env.includes('localhost')) return env;

  // hostUri format: "192.168.x.x:19000"
  const devHost = (Constants.expoConfig as unknown as Record<string, unknown>)?.hostUri as string | undefined;
  const ip = devHost?.split(':')[0];
  if (ip) return env.replace('localhost', ip);

  return env;
}

export const BACKEND = resolveBackendUrl();
