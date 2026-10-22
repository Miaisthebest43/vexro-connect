import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VexroSidebar from '../components/VexroSidebar';
import MessageList from '../components/MessageList';
import VexroChatScreen from '../screens/VexroChatScreen';
import SafetyScreen from '../screens/SafetyScreen';
import HomeScreen from '../screens/HomeScreen';
import CommunitiesScreen from '../screens/CommunitiesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import BlockListScreen from '../screens/BlockListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateCommunityScreen from '../screens/CreateCommunityScreen';
import { colors } from '../theme/colors';

export default function MainLayout() {
  const [activeView, setActiveView] = useState('home');

  if (activeView === 'settings') {
    return <SafeAreaView style={styles.safe}><SettingsScreen onClose={() => setActiveView('home')} /></SafeAreaView>;
  }

  if (activeView === 'create-community') {
    return <SafeAreaView style={styles.safe}><CreateCommunityScreen onClose={() => setActiveView('home')} /></SafeAreaView>;
  }

  if (activeView === 'profile') {
    return <SafeAreaView style={styles.safe}><ProfileScreen onBack={() => setActiveView('home')} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        <VexroSidebar activeView={activeView} onNavigate={setActiveView} />
        
        {activeView === 'messages' ? (
          <>
            <MessageList />
            <View style={styles.mainContent}>
              <VexroChatScreen />
            </View>
          </>
        ) : (
          <View style={styles.mainContent}>
            {activeView === 'home' && <HomeScreen onNavigate={setActiveView} />}
            {activeView === 'safety' && <SafetyScreen />}
            {activeView === 'communities' && <CommunitiesScreen />}
            {activeView === 'notifications' && <NotificationsScreen />}
            {activeView === 'discover' && <DiscoverScreen />}
            {activeView === 'privacy' && <PrivacyScreen />}
            {activeView === 'blocklist' && <BlockListScreen />}
          </View>
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