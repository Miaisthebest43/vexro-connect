import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ban, UserX } from 'lucide-react-native';
import { colors } from '../theme/colors';

const BLOCKED = [
  { id: '1', name: 'SpamBot99', date: 'Blocked on Oct 12, 2026', color: '#E74C3C' },
  { id: '2', name: 'ToxicPlayer', date: 'Blocked on Sep 28, 2026', color: '#F1C40F' },
];

export default function BlockListScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Block List</Text>
      <Text style={styles.headerDesc}>Users you have blocked cannot message you, add you as a friend, or see your profile.</Text>

      {BLOCKED.length === 0 ? (
        <View style={styles.emptyState}>
          <UserX size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>You haven't blocked anyone yet.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {BLOCKED.map((user) => (
            <View key={user.id} style={styles.row}>
              <View style={[styles.avatar, { backgroundColor: user.color }]}>
                <Text style={styles.avatarText}>{user.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.date}>{user.date}</Text>
              </View>
              <TouchableOpacity style={styles.unblockBtn}>
                <Text style={styles.unblockText}>Unblock</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 32, maxWidth: 800 },
  headerTitle: { color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 8 },
  headerDesc: { color: colors.textDim, fontSize: 14, marginBottom: 32, lineHeight: 20 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 64 },
  emptyText: { color: colors.textMuted, fontSize: 15, marginTop: 16 },
  list: { backgroundColor: colors.bg2, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  name: { color: colors.text, fontSize: 15, fontWeight: '600' },
  date: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  unblockBtn: { backgroundColor: colors.bg3, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  unblockText: { color: colors.danger, fontSize: 13, fontWeight: '600' },
});