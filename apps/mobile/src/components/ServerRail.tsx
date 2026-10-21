import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Plus, Compass } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function ServerRail() {
  const servers = [
    { id: '1', name: 'VEXRO', initials: 'VX', active: true },
    { id: '2', name: 'Gaming', initials: 'GM' },
    { id: '3', name: 'Devs', initials: 'DV' },
  ];

  return (
    <View style={styles.rail}>
      <TouchableOpacity style={[styles.iconWrap, styles.homeWrap]}>
        <Compass size={24} color={colors.accent} />
      </TouchableOpacity>
      
      <View style={styles.divider} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
        {servers.map((s) => (
          <TouchableOpacity key={s.id} style={styles.iconWrap}>
            <View style={[styles.serverIcon, s.active && styles.serverIconActive]}>
              <Text style={[styles.serverText, s.active && styles.serverTextActive]}>{s.initials}</Text>
            </View>
            {s.active && <View style={styles.activePill} />}
          </TouchableOpacity>
        ))}
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
  divider: { width: 32, height: 2, backgroundColor: colors.border, marginVertical: 12, borderRadius: 2 },
  serverIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.bg2, alignItems: 'center', justifyContent: 'center' },
  serverIconActive: { borderRadius: 12, backgroundColor: colors.accent },
  serverText: { color: colors.textDim, fontSize: 16, fontWeight: '700' },
  serverTextActive: { color: '#fff' },
  activePill: { position: 'absolute', left: -12, width: 4, height: 24, backgroundColor: colors.accent, borderRadius: 2 },
  addWrap: { width: 48, height: 48, borderRadius: 16, borderWidth: 1, borderColor: colors.success, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
});