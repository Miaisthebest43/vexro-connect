import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Bell, AtSign, UserPlus, ShieldAlert, CheckCircle, ChevronRight } from 'lucide-react-native';
import { colors } from '../theme/colors';

const NOTIFICATIONS = [
  { id: '1', type: 'mention', title: 'Nova mentioned you', desc: 'in #general: "Hey @you, check this out!"', time: '2m ago', unread: true, color: colors.accent },
  { id: '2', type: 'friend', title: 'New Friend Request', desc: 'PixelDev wants to be your friend.', time: '15m ago', unread: true, color: colors.success },
  { id: '3', type: 'system', title: 'Security Alert', desc: 'A new login was detected from a Windows PC.', time: '1h ago', unread: false, color: colors.warning },
  { id: '4', type: 'mention', title: 'Creator Lounge', desc: 'You were mentioned in a thread.', time: '3h ago', unread: false, color: colors.accent },
  { id: '5', type: 'friend', title: 'Friend Request Accepted', desc: 'Echo accepted your friend request.', time: '1d ago', unread: false, color: colors.success },
];

export default function NotificationsScreen() {
  const [tab, setTab] = useState('All');

  const getIcon = (type: string, color: string) => {
    switch (type) {
      case 'mention': return <AtSign size={20} color={color} />;
      case 'friend': return <UserPlus size={20} color={color} />;
      case 'system': return <ShieldAlert size={20} color={color} />;
      default: return <Bell size={20} color={color} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Nav */}
      <View style={styles.topNav}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Bell size={24} color={colors.text} />
          <Text style={styles.title}>Notifications</Text>
        </View>
        <TouchableOpacity style={styles.markReadBtn}>
          <CheckCircle size={16} color={colors.accent} />
          <Text style={styles.markReadText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {['All', 'Unread', 'Mentions'].map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {NOTIFICATIONS.map((notif) => (
          <TouchableOpacity key={notif.id} style={[styles.notifCard, notif.unread && styles.notifCardUnread]}>
            <View style={[styles.iconWrap, { backgroundColor: notif.color + '15' }]}>
              {getIcon(notif.type, notif.color)}
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={[styles.notifTitle, notif.unread && { color: '#fff' }]}>{notif.title}</Text>
              <Text style={styles.notifDesc} numberOfLines={2}>{notif.desc}</Text>
            </View>

            <View style={{ alignItems: 'flex-end', gap: 8 }}>
              <Text style={styles.notifTime}>{notif.time}</Text>
              {notif.unread && <View style={styles.unreadDot} />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { color: colors.text, fontSize: 20, fontWeight: '700', marginLeft: 12 },
  markReadBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg2, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 6 },
  markReadText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  
  tabsRow: { flexDirection: 'row', gap: 12, padding: 24, paddingBottom: 12 },
  tab: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, backgroundColor: colors.bg2 },
  tabActive: { backgroundColor: colors.accent },
  tabText: { color: colors.textDim, fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#fff' },

  scrollContent: { paddingHorizontal: 24, paddingBottom: 32 },
  notifCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg2, padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  notifCardUnread: { backgroundColor: '#181A24', borderColor: '#2A2D3A' },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  notifTitle: { color: colors.textDim, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  notifDesc: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
  notifTime: { color: colors.textMuted, fontSize: 11 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
});