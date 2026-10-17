import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

export function usePush(enabled: boolean) {
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (isExpoGo()) {
      console.log('[push] Expo Go detected — skipping push setup');
      return;
    }

    if (!Device.isDevice) {
      console.log('[push] Not a physical device — skipping push setup');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const Notifications = await import('expo-notifications');

        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });

        const { status: existing } = await Notifications.getPermissionsAsync();
        let status = existing;
        if (status !== 'granted') {
          const req = await Notifications.requestPermissionsAsync();
          status = req.status;
        }
        if (status !== 'granted') {
          console.log('[push] permission denied');
          return;
        }

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.DEFAULT,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#7c5cff',
          });
        }

        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ??
          Constants.easConfig?.projectId;

        const tokenResp = await Notifications.getExpoPushTokenAsync(
          projectId ? { projectId } : undefined
        );
        const token = tokenResp.data;
        if (cancelled) return;
        tokenRef.current = token;

        const { registerPushToken } = await import('./api');
        const platform: 'ios' | 'android' | 'web' =
          Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';
        await registerPushToken(token, platform);
      } catch (e: any) {
        console.log('[push] setup failed (non-fatal):', e?.message ?? e);
      }
    })();

    return () => {
      cancelled = true;
      const t = tokenRef.current;
      if (t) {
        import('./api').then(({ unregisterPushToken }) => {
          unregisterPushToken(t).catch(() => {});
        }).catch(() => {});
        tokenRef.current = null;
      }
    };
  }, [enabled]);
}