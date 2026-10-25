import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Plus, Compass } from 'lucide-react-native';
import { colors } from '../theme/colors';

const SERVERS = [
  { id: '1', name: 'VEXRO', icon: 'V', color: '#5865F2', badge: 13, unread: true },
  { id: '2', name: 'Nitro', icon: '⭐', color: '#A855F7', unread: true },
  { id: '3', name: 'Scanner', icon: '👤', color: '#313338', unread: true },
  { id: '4', name: 'Alerts', icon: '❗', color: '#000000', unread: true },
  { id: '5', name: 'Demon', icon: '😈', color: '#2B2D31', unread: false },
  { id: '6', name: 'Lunafy', icon: 'lunafy.', color: '#313338', unread: true, isText: true },
  { id: '7', name: 'Water', icon: '💧', color: '#0EA5E9', unread: true },
  { id: '8', name: 'Gaming', icon: '👾', color: '#1E1F22', unread: false },
  { id: '9', name: 'DS', icon: 'DS', color: '#111214', unread: true, isText: true },
  { id: '10', name: 'Monkey', icon: '🐵', color: '#F59E0B', unread: true },
  { id: '11', name: 'Wolf', icon: '🐺', color: '#E5E7EB', unread: true },
  { id: '12', name: 'Fire', icon: '🔥', color: '#DC2626', unread: true },
  { id: '13', name: 'Ghost', icon: '👻', color: '#000000', unread: true },
];

export default function VexroRail({ activeView, onNavigate }: { activeView: string, onNavigate: (view: string) => void }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const ServerIcon = ({ item, isHome = false, isActive = false }: any) => {
    const isHovered = hoveredId === item.id;
    const showPill = item.unread || isHome || isActive;
    
    return (
      <View style={styles.serverWrapper}>
        <View style={[styles.pillIndicator, { height: isHovered || isActive ? 40 : (showPill ? 8 : 0) }]} />
        <TouchableOpacity 
          style={[styles.serverBtn, { backgroundColor: item.color }, (isHovered || isActive || isHome) && styles.serverBtnActive]}
          onPress={() => onNavigate(isHome ? 'home' : 'messages')}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <Text style={[styles.serverEmoji, item.isText && { fontSize: 14, fontWeight: '700' }]}>{item.icon}</Text>
        </TouchableOpacity>
        {item.badge && (
          <View style={styles.badge}><Text style={styles.badgeText}>{item.badge}</Text></View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ServerIcon item={{ id: 'home', icon: 'V', color: colors.accent }} isHome={activeView === 'home'} />
        <View style={styles.separator} />
        {SERVERS.map((server) => <ServerIcon key={server.id} item={server} />)}
        
        <TouchableOpacity style={styles.addServerBtn} onMouseEnter={() => setHoveredId('add')} onMouseLeave={() => setHoveredId(null)}>
          <Plus size={24} color={colors.success} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addServerBtn} onMouseEnter={() => setHoveredId('explore')} onMouseLeave={() => setHoveredId(null)}>
          <Compass size={24} color={colors.success} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 72, backgroundColor: '#1E1F22', alignItems: 'center', paddingVertical: 12 },
  scrollContent: { alignItems: 'center', gap: 8, paddingBottom: 20 },
  serverWrapper: { position: 'relative', width: 72, alignItems: 'center', justifyContent: 'center' },
  pillIndicator: { position: 'absolute', left: 0, width: 8, backgroundColor: '#fff', borderTopRightRadius: 4, borderBottomRightRadius: 4, transition: 'height 0.15s ease' },
  serverBtn: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', transition: 'border-radius 0.15s ease' },
  serverBtnActive: { borderRadius: 24 },
  serverEmoji: { fontSize: 24 },
  badge: { position: 'absolute', bottom: -2, right: 8, backgroundColor: '#DA373C', borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#1E1F22', paddingHorizontal: 4 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  separator: { width: 32, height: 2, backgroundColor: '#35363C', marginVertical: 4 },
  addServerBtn: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#313338', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
});