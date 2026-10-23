import React, { useState, useCallback } from 'react';
import { View, StyleSheet, useWindowDimensions, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ServerRail from '../components/ServerRail';
import DMSidebar from '../components/DMSidebar';
import ProfileSidebar from '../components/ProfileSidebar';
import VexroChatScreen from '../screens/VexroChatScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import VoiceCallScreen from '../screens/VoiceCallScreen';
import CommunitiesScreen from '../screens/CommunitiesScreen';
import SafetyScreen from '../screens/SafetyScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SessionsScreen from '../screens/SessionsScreen';
import CreateCommunityScreen from '../screens/CreateCommunityScreen';
import FriendsScreen from '../screens/FriendsScreen';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function MainLayout() {
  const { width } = useWindowDimensions();
  const { user, loading } = useAuth();
  const isMobile = width < 768;
  
  const [activeView, setActiveView] = useState('home'); 

  const handleNavigate = useCallback((view: string) => {
    setActiveView(view);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={{ color: colors.textDim, marginTop: 16 }}>Connecting to VEXRO...</Text>
      </View>
    );
  }
  if (!user) return null;

  if (activeView === 'settings') return <SafeAreaView style={styles.safe}><SettingsScreen onClose={() => handleNavigate('home')} onOpenSessions={() => handleNavigate('sessions')} onOpenEditProfile={() => handleNavigate('edit-profile')} /></SafeAreaView>;
  if (activeView === 'edit-profile') return <SafeAreaView style={styles.safe}><EditProfileScreen onClose={() => handleNavigate('home')} /></SafeAreaView>;
  if (activeView === 'sessions') return <SafeAreaView style={styles.safe}><SessionsScreen onBack={() => handleNavigate('settings')} /></SafeAreaView>;
  if (activeView === 'create-community') return <SafeAreaView style={styles.safe}><CreateCommunityScreen onClose={() => handleNavigate('home')} /></SafeAreaView>;
  if (activeView === 'voice-call') return <SafeAreaView style={styles.safe}><VoiceCallScreen channelName="Lounge" onLeave={() => handleNavigate('messages')} /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {!isMobile && <ServerRail />}
        {!isMobile && <DMSidebar activeView={activeView} onNavigate={handleNavigate} />}
        
        <View style={styles.mainContent}>
          {activeView === 'messages' && <VexroChatScreen channelName="general" onStartCall={() => handleNavigate('voice-call')} />}
          
          {/* Dashboard is back on Home */}
          {activeView === 'home' && <HomeScreen onNavigate={handleNavigate} />}
          
          {/* Profile is on its own tab */}
          {activeView === 'profile' && <ProfileScreen />}
          
          {activeView === 'communities' && <CommunitiesScreen />}
          {activeView === 'safety' && <SafetyScreen />}
          {activeView === 'notifications' && <NotificationsScreen />}
          {activeView === 'friends' && <FriendsScreen />}
        </View>

        {!isMobile && width > 1000 && activeView === 'messages' && (
          <ProfileSidebar onNavigate={handleNavigate} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, flexDirection: 'row' },
  mainContent: { flex: 1 },
});