import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { Pencil, Circle, Shield, Diamond, User, Copy, ChevronRight, Smartphone, Gamepad2 } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function ProfilePopout({ onClose, onOpenSettings }: { onClose: () => void, onOpenSettings: () => void }) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const MenuItem = ({ icon: Icon, label, value, color, onPress, id }: any) => {
    const isHovered = hoveredItem === id;
    return (
      <TouchableOpacity 
        style={[styles.menuItem, isHovered && styles.menuItemHovered]}
        onPress={onPress}
        onHoverIn={() => setHoveredItem(id)}
        onHoverOut={() => setHoveredItem(null)}
      >
        <View style={styles.menuIconWrap}>
          <Icon size={16} color={color || colors.textDim} />
        </View>
        <Text style={[styles.menuLabel, isHovered && { color: colors.text }]}>{label}</Text>
        {value && <Text style={[styles.menuValue, { color: value === 'Invisible' ? colors.warning : colors.textDim }]}>{value}</Text>}
        <ChevronRight size={16} color={colors.textMuted} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background Click to Close */}
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />

      <View style={styles.popoutCard}>
        {/* Banner */}
        <View style={styles.banner}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop' }} 
            style={{ width: '100%', height: '100%' }}
          />
        </View>

        {/* Avatar & Status Bubble */}
        <View style={styles.avatarRow}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop' }} 
                style={{ width: '100%', height: '100%', borderRadius: 40 }} 
              />
            </View>
            <View style={styles.statusBadge}>
              <Smartphone size={12} color="#fff" />
            </View>
          </View>

          <View style={styles.statusBubble}>
            <Text style={styles.statusBubbleText} numberOfLines={1}>📱 https://beacons.ai/lastd...</Text>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.displayName}>FairyTales</Text>
          <View style={styles.tagRow}>
            <Text style={styles.username}>ifwyobody</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.username}>He/him/</Text>
          </View>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: '#5865F2' }]}><Gamepad2 size={12} color="#fff" /></View>
            <View style={[styles.badge, { backgroundColor: '#EB459E' }]}><Gamepad2 size={12} color="#fff" /></View>
            <View style={[styles.badge, { backgroundColor: '#23A559' }]}><Gamepad2 size={12} color="#fff" /></View>
            <View style={[styles.badge, { backgroundColor: '#9B59B6' }]}><Gamepad2 size={12} color="#fff" /></View>
          </View>
        </View>

        {/* Game Collection */}
        <View style={styles.gameCollection}>
          <Text style={styles.gameCollectionTitle}>Game Collection</Text>
          <View style={styles.gameIcons}>
            <View style={[styles.gameIcon, { backgroundColor: '#E5E7EB' }]}><Text style={{ fontSize: 16 }}>💀</Text></View>
            <View style={[styles.gameIcon, { backgroundColor: '#10B981' }]}><Text style={{ fontSize: 16 }}>🧱</Text></View>
            <View style={[styles.gameIcon, { backgroundColor: '#3B82F6' }]}><Text style={{ fontSize: 16 }}>📘</Text></View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <MenuItem id="edit" icon={Pencil} label="Edit Profile" onPress={onOpenSettings} />
          <MenuItem id="status" icon={Circle} label="Invisible" color={colors.textMuted} value="Invisible" />
          <MenuItem id="badges" icon={Shield} label="Badges" />
          <MenuItem id="orbs" icon={Diamond} label="240 Orbs" />
        </View>

        {/* Secondary Actions */}
        <View style={styles.actions}>
          <MenuItem id="switch" icon={User} label="Switch Accounts" />
          <MenuItem id="copy" icon={Copy} label="Copy User ID" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 70, left: 10, zIndex: 9999 },
  popoutCard: { width: 300, backgroundColor: '#1A1D27', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOpacity: 0.8, shadowRadius: 20, elevation: 10 },
  
  banner: { height: 80, backgroundColor: '#111' },
  
  avatarRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: -30, paddingHorizontal: 16, position: 'relative' },
  avatarWrap: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 6, borderColor: '#1A1D27', backgroundColor: colors.bg3, overflow: 'hidden' },
  statusBadge: { position: 'absolute', bottom: 4, right: 4, width: 20, height: 20, borderRadius: 10, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#1A1D27' },
  
  statusBubble: { backgroundColor: '#2B2D31', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 12, marginBottom: 8, flex: 1 },
  statusBubbleText: { color: colors.textDim, fontSize: 12 },

  userInfo: { paddingHorizontal: 16, paddingTop: 8 },
  displayName: { color: '#fff', fontSize: 20, fontWeight: '800' },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  username: { color: colors.textDim, fontSize: 12 },
  dot: { color: colors.textDim, fontSize: 12, marginHorizontal: 4 },
  badgeRow: { flexDirection: 'row', gap: 4, marginTop: 8 },
  badge: { width: 20, height: 20, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },

  gameCollection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#232736', marginHorizontal: 12, marginTop: 16, padding: 12, borderRadius: 8 },
  gameCollectionTitle: { color: '#fff', fontSize: 12, fontWeight: '600' },
  gameIcons: { flexDirection: 'row', gap: 6 },
  gameIcon: { width: 24, height: 24, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },

  actions: { backgroundColor: '#12141D', marginHorizontal: 12, marginTop: 12, borderRadius: 8, padding: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 6 },
  menuItemHovered: { backgroundColor: '#232736' },
  menuIconWrap: { width: 24, marginRight: 8 },
  menuLabel: { color: colors.textDim, fontSize: 13, fontWeight: '600', flex: 1 },
  menuValue: { fontSize: 12, marginRight: 8 },
});