import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { usePush } from './src/lib/usePush';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ChannelsScreen from './src/screens/ChannelsScreen';
import ChatScreen from './src/screens/ChatScreen';
import MembersScreen from './src/screens/MembersScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ServerSettingsScreen from './src/screens/ServerSettingsScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import VoiceScreen from './src/screens/VoiceScreen';
import { colors } from './src/theme/colors';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Channels: { serverId: string; serverName: string };
  Chat: { serverId: string; channelId: string; channelName: string };
  Members: { serverId: string; serverName: string };
  Profile: { userId: string };
  Settings: undefined;
  ServerSettings: { serverId: string; serverName: string };
  Friends: undefined;
  Voice: { channelId: string; channelName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const navTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.bg, card: colors.bg, text: colors.text, primary: colors.accent, border: colors.border } };

function RootNavigator() {
  const { user, loading } = useAuth();
  usePush(!!user);
  if (loading) return null;
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
      <AuthProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}