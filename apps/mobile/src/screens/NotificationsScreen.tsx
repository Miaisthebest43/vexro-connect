import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { api } from '../lib/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

export default function NotificationsScreen({ navigation }: Props) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try { const r = await api.listNotifications(); setNotifications(Array.isArray(r.notifications) ? r.notifications : []); }
    catch {}
    finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function markAllRead() {
    try { await api.markAllNotificationsRead(); load(); } catch {}
  }

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso); const now = new Date();
      const diff = (now.getTime() - d.getTime()) / 60000;
      if (diff < 1) return 'Just now';
      if (diff < 60) return `${Math.floor(diff)}m ago`;
      if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
      return d.toLocaleDateString();
    } catch { return ''; }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead}><Text style={styles.action}>Mark all</Text></TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} /> : (
        <FlatList
          data={notifications}
          keyExtractor={n => n.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={styles.empty}>You're all caught up.</Text>}
          renderItem={({ item }) => (
            <View style={[styles.row, !item.read && styles.rowUnread]}>
              <View style={styles.iconBox}><Text style={styles.icon}>🔔</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                {item.body ? <Text style={styles.rowBody} numberOfLines={2}>{item.body}</Text> : null}
                <Text style={styles.rowTime}>{formatTime(item.created_at)}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { color: colors.accent, fontSize: 24, width: 30 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700', flex: 1 },
  action: { color: colors.accent, fontSize: 13, fontWeight: '600' },
  empty: { color: colors.textDim, textAlign: 'center', marginTop: 60 },
  row: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, backgroundColor: colors.card, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  rowUnread: { borderColor: colors.accent },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bg4, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  icon: { fontSize: 18 },
  rowTitle: { color: colors.text, fontWeight: '700', fontSize: 14 },
  rowBody: { color: colors.textDim, fontSize: 13, marginTop: 4 },
  rowTime: { color: colors.textMuted, fontSize: 11, marginTop: 6 },
});