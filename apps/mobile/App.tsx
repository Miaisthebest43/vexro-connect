import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { usePush } from './src/lib/usePush';
import { registerGlobals } from '@livekit/react-native';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ChannelsScreen from './src/screens/ChannelsScreen';
import ChatScreen from './src/screens/ChatScreen';
import VoiceScreen from './src/screens/VoiceScreen';
import MembersScreen from './src/screens/MembersScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ServerSettingsScreen from './src/screens/ServerSettingsScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import SafetyScreen from './src/screens/SafetyScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import RolesScreen from './src/screens/RolesScreen';
import ModerationScreen from './src/screens/ModerationScreen';
import SessionsScreen from './src/screens/SessionsScreen';
import ThreadScreen from './src/screens/ThreadScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import { ToastProvider } from './src/components/Toast';
import { ThemeProvider } from './src/theme/ThemeContext';
import { colors } from './src/theme/colors';

registerGlobals();

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Channels: { serverId: string; serverName: string };
  Chat: { serverId: string; channelId: string; channelName: string };
  Voice: { channelId: string; channelName: string };
  Members: { serverId: string; serverName: string };
  Profile: { userId: string };
  Settings: undefined;
  ServerSettings: { serverId: string; serverName: string };
  Friends: undefined;
  Safety: undefined;
  Notifications: undefined;
  Roles: { serverId: string };
  Moderation: { serverId: string; serverName: string };
  Sessions: undefined;
  Thread: { channelId: string; parentId: string; parentContent: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    primary: colors.accent,
    border: colors.border,
  },
};

function RootNavigator() {
  const { user, loading } = useAuth();
  usePush(!!user);

  React.useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Channels" component={ChannelsScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Voice" component={VoiceScreen} />
          <Stack.Screen name="Members" component={MembersScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="ServerSettings" component={ServerSettingsScreen} />
          <Stack.Screen name="Friends" component={FriendsScreen} />
          <Stack.Screen name="Safety" component={SafetyScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Roles" component={RolesScreen} />
          <Stack.Screen name="Moderation" component={ModerationScreen} />
          <Stack.Screen name="Sessions" component={SessionsScreen} />
          <Stack.Screen name="Thread" component={ThreadScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <NavigationContainer theme={navTheme}>
              <StatusBar style="light" />
              <RootNavigator />
            </NavigationContainer>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}