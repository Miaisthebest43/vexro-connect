import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Plus, Home } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function ServerRail({ onNavigate, activeView }: { onNavigate: (view: string) => void, activeView: string }) {
  return (
    <View style={styles.rail}>
      <TouchableOpacity style={[styles.iconWrap, styles.homeWrap, activeView === 'dashboard' && styles.activeHome]} onPress={() => onNavigate('dashboard')}>
        <Home size={24} color={activeView === 'dashboard' ? '#fff' : colors.accent} />
      </TouchableOpacity>
      
      <View style={styles.divider} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
        <TouchableOpacity style={styles.iconWrap} onPress={() => onNavigate('server')}>
          <View style={[styles.serverIcon, activeView === 'server' && styles.serverIconActive]}>
            <Text style={[styles.serverText, activeView === 'server' && styles.serverTextActive]}>VX</Text>
          </View>
          {activeView === 'server' && <View style={styles.activePill} />}
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.iconWrap, styles.addWrap]}>
          <Plus size={24} color={colors.success} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: { width: 72, backgroundColor: '#080A0F', alignItems: 'center', paddingTop: 16, paddingBottom: 16 },
  iconWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  homeWrap: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center' },
  activeHome: { backgroundColor: colors.accent, borderRadius: 12 },
  divider: { width: 32, height: 2, backgroundColor: colors.border, marginVertical: 12, borderRadius: 2 },
  serverIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.bg2, alignItems: 'center', justifyContent: 'center' },
  serverIconActive: { borderRadius: 12, backgroundColor: colors.accent },
  serverText: { color: colors.textDim, fontSize: 16, fontWeight: '700' },
  serverTextActive: { color: '#fff' },
  activePill: { position: 'absolute', left: -12, width: 4, height: 24, backgroundColor: colors.accent, borderRadius: 2 },
  addWrap: { width: 48, height: 48, borderRadius: 16, borderWidth: 1, borderColor: colors.success, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
});