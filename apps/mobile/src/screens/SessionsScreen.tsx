import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { api } from '../lib/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Sessions'>;

export default function SessionsScreen({ navigation }: Props) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try { const r = await api.listSessions(); setSessions(Array.isArray(r.sessions) ? r.sessions : []); }
    catch {}
    finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function revoke(id: string) {
    try { await api.revokeSession(id); load(); }
    catch (e: any) { Alert.alert('Failed', e.message); }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></TouchableOpacity>
        <Text style={styles.title}>Active Sessions</Text>
        <View style={{ width: 30 }} />
      </View>

      {loading ? <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} /> : (
        <FlatList
          data={sessions}
          keyExtractor={s => s.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={styles.empty}>No other active sessions.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconBox}><Text style={styles.icon}>📱</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.deviceName}>{item.device_name || 'Unknown Device'}</Text>
                <Text style={styles.time}>Last active: {new Date(item.last_active).toLocaleDateString()}</Text>
              </View>
              <TouchableOpacity onPress={() => revoke(item.id)} style={styles.revokeBtn}>
                <Text style={styles.revokeText}>Revoke</Text>
              </TouchableOpacity>
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
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  empty: { color: colors.textDim, textAlign: 'center', marginTop: 40 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.card, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bg4, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  icon: { fontSize: 20 },
  deviceName: { color: colors.text, fontSize: 16, fontWeight: '600' },
  time: { color: colors.textDim, fontSize: 12, marginTop: 4 },
  revokeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.danger },
  revokeText: { color: colors.danger, fontSize: 13, fontWeight: '600' },
});