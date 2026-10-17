import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

// Keep the native splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { usePush } from './src/lib/usePush';
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
import LoadingScreen from './src/screens/LoadingScreen';
import { ToastProvider } from './src/components/Toast';
import { ThemeProvider } from './src/theme/ThemeContext';
import ThreadScreen from './src/screens/ThreadScreen';
import { colors } from './src/theme/colors';
import { registerGlobals } from '@livekit/react-native';

registerGlobals();

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Channels: { serverId: string; serverName: string };
  Chat: { serverId: string; channelId: string; channelName: string };
  Thread: { channelId: string; parentId: string; parentContent: string };
  Voice: { channelId: string; channelName: string };
  Members: { serverId: string; serverName: string };
  Profile: { userId: string };
  Settings: undefined;
  ServerSettings: { serverId: string; serverName: string };
  Friends: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const navTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.bg, card: colors.bg, text: colors.text, primary: colors.accent, border: colors.border } };

function RootNavigator() {
  const { user, loading } = useAuth();
  usePush(!!user);

  React.useEffect(() => {
    if (!loading) {
      // Hide the native splash screen once AuthProvider finishes loading
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    // Show our custom animated loading screen
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Channels" component={ChannelsScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />`n          <Stack.Screen name="Thread" component={ThreadScreen} />
          <Stack.Screen name="Voice" component={VoiceScreen} />
          <Stack.Screen name="Members" component={MembersScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="ServerSettings" component={ServerSettingsScreen} />
          <Stack.Screen name="Friends" component={FriendsScreen} />
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
    <SafeAreaProvider>`n      <ThemeProvider>
      <ToastProvider>
      <AuthProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ToastProvider>`n      </ThemeProvider>
    </SafeAreaProvider>
  );
}