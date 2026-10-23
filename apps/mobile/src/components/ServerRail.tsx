import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Plus, Compass } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function ServerRail() {
  const servers = [
    { id: '1', name: 'VEXRO', initials: 'VX', active: true, color: colors.accent },
    { id: '2', name: 'Gaming', initials: 'GM', color: '#3498DB' },
    { id: '3', name: 'Devs', initials: 'DV', color: '#9B59B6' },
  ];

  return (
    <View style={styles.rail}>
      <TouchableOpacity style={[styles.iconWrap, styles.homeWrap]}>
        <Compass size={24} color={colors.textDim} />
      </TouchableOpacity>
      
      <View style={styles.divider} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
        {servers.map((s) => (
          <TouchableOpacity key={s.id} style={styles.iconWrap}>
            <View style={[styles.serverIcon, s.active && { backgroundColor: s.color, borderRadius: 12 }]}>
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
  rail: { width: 72, backgroundColor: '#0A0B10', alignItems: 'center', paddingTop: 16, paddingBottom: 16 },
  iconWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  homeWrap: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.bg2, alignItems: 'center', justifyContent: 'center' },
  divider: { width: 32, height: 2, backgroundColor: colors.border, marginVertical: 12, borderRadius: 2 },
  serverIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.bg2, alignItems: 'center', justifyContent: 'center' },
  serverText: { color: colors.textDim, fontSize: 16, fontWeight: '700' },
  serverTextActive: { color: '#fff' },
  activePill: { position: 'absolute', left: -12, width: 4, height: 24, backgroundColor: '#fff', borderRadius: 2 },
  addWrap: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
});