import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Monitor, Smartphone, X, ChevronLeft } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { api } from '../lib/api';

export default function SessionsScreen({ onBack }: { onBack: () => void }) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = () => {
    setLoading(true);
    api.get('/auth/sessions')
      .then((res: any) => setSessions(res.sessions || []))
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

  const DeviceRow = ({ session, isCurrent, onRevoke }: any) => {
    const isMobile = session.user_agent?.toLowerCase().includes('mobile');
    const Icon = isMobile ? Smartphone : Monitor;
    
    // Format the date
    const date = new Date(session.created_at);
    const timeAgo = Math.floor((Date.now() - date.getTime()) / 60000); // minutes
    let timeString = '';
    if (timeAgo < 60) timeString = `${timeAgo} mins ago`;
    else if (timeAgo < 1440) timeString = `${Math.floor(timeAgo / 60)} hours ago`;
    else timeString = `${Math.floor(timeAgo / 1440)} days ago`;

    return (
      <View style={styles.deviceRow}>
        <View style={styles.deviceIconWrap}>
          <Icon size={24} color={colors.text} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.deviceName}>
            {isMobile ? 'Android' : 'Windows'} <Text style={styles.deviceClient}>• {isMobile ? 'VEXRO Android' : 'VEXRO Client'}</Text>
          </Text>
          <Text style={styles.deviceInfo}>
            Boynton Beach, Florida, United States {!isCurrent && `• ${timeString}`}
          </Text>
        </View>
        {!isCurrent && (
          <TouchableOpacity onPress={onRevoke} style={styles.revokeBtn}>
            <X size={20} color={colors.textDim} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <ChevronLeft size={20} color={colors.text} />
        <Text style={styles.backText}>Back to Settings</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.contentScroll}>
        <Text style={styles.pageTitle}>Logged-in Devices</Text>
        <Text style={styles.pageDesc}>These are all the devices that are currently logged-in with your VEXRO account. Log out of devices that you don't recognize.</Text>

        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
        ) : (
          <>
            <Text style={styles.sectionTitle}>Current Device</Text>
            {sessions.length > 0 && <DeviceRow session={sessions[0]} isCurrent={true} />}

            {sessions.length > 1 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Other Devices</Text>
                {sessions.slice(1).map((s) => (
                  <DeviceRow key={s.id} session={s} isCurrent={false} onRevoke={() => revokeSession(s.id)} />
                ))}
              </>
            )}

            <View style={styles.logoutAllWrap}>
              <Text style={styles.logoutAllTitle}>Log out of all known devices</Text>
              <Text style={styles.logoutAllDesc}>You'll have to log back in on all logged out devices.</Text>
              <TouchableOpacity style={styles.logoutAllBtn} onPress={revokeAll}>
                <Text style={styles.logoutAllBtnText}>Log Out All Known Devices</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  backBtn: { flexDirection: 'row', alignItems: 'center', padding: 24, gap: 8 },
  backText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  contentScroll: { paddingHorizontal: 40, paddingBottom: 40, maxWidth: 800 },
  pageTitle: { color: colors.text, fontSize: 24, fontWeight: '800', marginBottom: 8 },
  pageDesc: { color: colors.textDim, fontSize: 14, lineHeight: 20, marginBottom: 32 },
  
  sectionTitle: { color: colors.textDim, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 },
  
  deviceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  deviceIconWrap: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.bg2, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  deviceName: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  deviceClient: { color: colors.textDim, fontSize: 15, fontWeight: '400' },
  deviceInfo: { color: colors.textDim, fontSize: 13 },
  revokeBtn: { padding: 8 },
  
  logoutAllWrap: { marginTop: 48, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 24 },
  logoutAllTitle: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  logoutAllDesc: { color: colors.textDim, fontSize: 13, marginBottom: 16 },
  logoutAllBtn: { backgroundColor: colors.danger, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 4, alignSelf: 'flex-start' },
  logoutAllBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});