import React, { useState, useCallback } from 'react';
import { View, StyleSheet, useWindowDimensions, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// IMPORT YOUR EXISTING DISCORD COMPONENTS
import ServerRail from '../components/ServerRail';
import DMSidebar from '../components/DMSidebar';
import ChatScreen from '../screens/ChatScreen';
import MemberList from '../components/MemberList';

// Other screens
import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import VoiceCallScreen from '../screens/VoiceCallScreen';
import SessionsScreen from '../screens/SessionsScreen';
import MessageRequestsScreen from '../screens/MessageRequestsScreen';
import HomeScreen from '../screens/HomeScreen';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function MainLayout() {
  const { width } = useWindowDimensions();
  const { user, loading } = useAuth();
  const isMobile = width < 768;
  const showMemberList = width > 1000;

  const [activeView, setActiveView] = useState('messages'); 

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

  if (activeView === 'settings') return <SafeAreaView style={styles.safe}><SettingsScreen onClose={() => handleNavigate('messages')} onOpenSessions={() => handleNavigate('sessions')} onOpenEditProfile={() => handleNavigate('edit-profile')} /></SafeAreaView>;
  if (activeView === 'edit-profile') return <SafeAreaView style={styles.safe}><EditProfileScreen onClose={() => handleNavigate('messages')} /></SafeAreaView>;
  if (activeView === 'sessions') return <SafeAreaView style={styles.safe}><SessionsScreen onBack={() => handleNavigate('settings')} /></SafeAreaView>;
  if (activeView === 'voice-call') return <SafeAreaView style={styles.safe}><VoiceCallScreen channelName="Lounge" onLeave={() => handleNavigate('messages')} /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* 1. FAR LEFT: Server Rail */}
        <ServerRail activeView={activeView} onNavigate={handleNavigate} />
        
        {/* 2. MIDDLE LEFT: DM Sidebar */}
        {activeView === 'messages' && !isMobile && (
          <DMSidebar onNavigate={handleNavigate} />
        )}
        
        {/* 3. MAIN CHAT AREA */}
        <View style={styles.mainContent}>
          {activeView === 'messages' && <ChatScreen channelName="Goats" isDM={true} dmUser={{ name: 'Goats', color: colors.accent }} />}
          {activeView === 'home' && <HomeScreen onNavigate={handleNavigate} />}
          {activeView === 'requests' && <MessageRequestsScreen />}
        </View>

        {/* 4. FAR RIGHT: Member List */}
        {activeView === 'messages' && showMemberList && (
          <MemberList />
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