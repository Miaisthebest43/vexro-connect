import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { absUrl } from '../lib/api';

interface Server { id: string; name: string; icon_url: string | null; }

interface Props {
  servers: Server[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onHome: () => void;
}

export default function ServerRail({ servers, activeId, onSelect, onHome }: Props) {
  return (
    <View style={styles.rail}>
      <TouchableOpacity style={styles.homeBtn} onPress={onHome}>
        <Text style={styles.homeText}>V</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4 }}>
        {servers.map((s) => {
          const icon = absUrl(s.icon_url);
          const active = s.id === activeId;
          return (
            <TouchableOpacity key={s.id} onPress={() => onSelect(s.id)} style={styles.serverWrap}>
              {active && <View style={styles.activeIndicator} />}
              {icon ? (
                <Image source={{ uri: icon }} style={[styles.serverIcon, active && styles.serverActive]} />
              ) : (
                <View style={[styles.serverIcon, styles.serverFallback, active && styles.serverActive]}>
                  <Text style={styles.serverText}>{s.name[0].toUpperCase()}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: { width: 68, backgroundColor: colors.bg, paddingTop: 44, paddingBottom: 12, alignItems: 'center' },
  homeBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  homeText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  divider: { width: 28, height: 2, backgroundColor: colors.border, marginVertical: 8 },
  serverWrap: { position: 'relative', marginBottom: 8, alignItems: 'center' },
  serverIcon: { width: 44, height: 44, borderRadius: 14 },
  serverFallback: { backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center' },
  serverActive: { borderRadius: 12, backgroundColor: colors.accent },
  serverText: { color: colors.text, fontSize: 17, fontWeight: '700' },
  activeIndicator: {
    position: 'absolute', left: -12, top: 14,
    width: 4, height: 16, borderRadius: 2, backgroundColor: colors.text,
  },
});