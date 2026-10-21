import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu } from 'lucide-react-native';
import ServerRail from '../components/ServerRail';
import ChannelSidebar from '../components/ChannelSidebar';
import ChatScreen from '../screens/ChatScreen';
import { colors } from '../theme/colors';

export default function MainLayout() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeChannel, setActiveChannel] = useState('general');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        {(!isMobile || showSidebar) && (
          <View style={[styles.sidebarWrapper, isMobile && styles.mobileSidebar]}>
            <ServerRail />
            <ChannelSidebar 
              activeChannel={activeChannel}
              onSelectChannel={(ch) => {
                if (isMobile) setShowSidebar(false);
                setActiveChannel(ch);
              }} 
            />
          </View>
        )}

        <View style={styles.mainContent}>
          {isMobile && (
            <TouchableOpacity style={styles.menuBtn} onPress={() => setShowSidebar(true)}>
              <Menu size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          <ChatScreen channelName={activeChannel} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#080A0F' },
  container: { flex: 1, flexDirection: 'row' },
  sidebarWrapper: { flexDirection: 'row' },
  mobileSidebar: { position: 'absolute', zIndex: 100, height: '100%', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 10 },
  mainContent: { flex: 1 },
  menuBtn: { position: 'absolute', top: 16, left: 16, zIndex: 10, padding: 8, backgroundColor: colors.bg2, borderRadius: 8 },
});