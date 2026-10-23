import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Monitor, Smartphone, Globe, LogOut, ChevronLeft, ShieldAlert } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { api } from '../lib/api';

export default function SessionsScreen({ onBack }: { onBack: () => void }) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = () => {
    setLoading(true);
    api.get('/auth/sessions')
      .then((res: any) => setSessions(res.sessions))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSessions(); }, []);

  const revokeSession = async (id: string) => {
    try {
      await api.delete(`/auth/sessions/${id}`);
      fetchSessions();
    } catch (err) { console.error(err); }
  };

  const revokeAll = async () => {
    try {
      await api.delete('/auth/sessions');
      fetchSessions();
    } catch (err) { console.error(err); }
  };

  const getDeviceIcon = (ua: string) => {
    if (!ua) return <Globe size={20} color={colors.textDim} />;
    if (ua.toLowerCase().includes('mobile')) return <Smartphone size={20} color={colors.textDim} />;
    return <Monitor size={20} color={colors.textDim} />;
  };

  const formatDeviceName = (ua: string) => {
    if (!ua) return 'Unknown Device';
    if (ua.includes('Windows')) return 'Windows PC';
    if (ua.includes('Mac')) return 'MacBook / iMac';
    if (ua.includes('iPhone')) return 'iPhone';
    if (ua.includes('Android')) return 'Android Device';
    return 'Web Browser';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <ChevronLeft size={20} color={colors.accent} />
        <Text style={styles.backText}>Back to Settings</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Logged-in Devices</Text>
      <Text style={styles.headerDesc}>You're currently logged into {sessions.length} devices. If you see something you don't recognize, log out of that device immediately.</Text>

      <TouchableOpacity style={styles.dangerBtn} onPress={revokeAll}>
        <ShieldAlert size={18} color="#fff" />
        <Text style={styles.dangerBtnText}>Log Out All Other Devices</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.list}>
          {sessions.map((session, index) => (
            <View key={session.id} style={styles.row}>
              <View style={styles.iconWrap}>
                {getDeviceIcon(session.user_agent)}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.deviceName}>
                  {formatDeviceName(session.user_agent)} {index === 0 && <Text style={styles.currentTag}>(Current)</Text>}
                </Text>
                <Text style={styles.deviceInfo}>IP: {session.ip_hash ? session.ip_hash.slice(0, 8) + '...' : 'Hidden'}</Text>
                <Text style={styles.deviceInfo}>Logged in: {new Date(session.created_at).toLocaleDateString()}</Text>
              </View>
              {index !== 0 && (
                <TouchableOpacity style={styles.revokeBtn} onPress={() => revokeSession(session.id)}>
                  <LogOut size={16} color={colors.danger} />
                </TouchableOpacity>
              )}
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
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 4 },
  backText: { color: colors.accent, fontSize: 14, fontWeight: '600' },
  headerTitle: { color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 8 },
  headerDesc: { color: colors.textDim, fontSize: 14, marginBottom: 24, lineHeight: 20 },
  dangerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.danger, padding: 12, borderRadius: 8, gap: 8, marginBottom: 32, alignSelf: 'flex-start' },
  dangerBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  list: { backgroundColor: colors.bg2, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 8 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  iconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  deviceName: { color: colors.text, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  currentTag: { color: colors.success, fontSize: 12 },
  deviceInfo: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  revokeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(218, 55, 60, 0.1)', alignItems: 'center', justifyContent: 'center' },
});