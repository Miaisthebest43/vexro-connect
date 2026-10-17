import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { api, absUrl } from '../lib/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const statusColors: Record<string, string> = { online: colors.success, idle: colors.warning, dnd: colors.danger, offline: colors.textDim };

export default function ProfileScreen({ route }: Props) {
  const { userId } = route.params;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => { try { const { user } = await api.getProfile(userId); setProfile(user); } catch {} finally { setLoading(false); } })();
  }, [userId]);

  if (loading) return <ActivityIndicator color={colors.accent} style={{ flex: 1, backgroundColor: colors.bg }} />;
  if (!profile) return <Text style={{ color: colors.textDim, padding: 24 }}>Not found</Text>;

  const joined = new Date(profile.created_at).toLocaleDateString();
  const avatarUrl = absUrl(profile.avatar_url);

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.banner, { backgroundColor: profile.banner_color || colors.accent }]} />
      <View style={styles.profileContent}>
        <View style={styles.avatarWrap}>
          {avatarUrl ? <Image source={{ uri: avatarUrl }} style={styles.avatarImg} /> : <View style={styles.avatarFallback}><Text style={styles.avatarText}>{profile.username[0].toUpperCase()}</Text></View>}
          <View style={[styles.statusDot, { backgroundColor: statusColors[profile.status] ?? colors.textDim }]} />
        </View>
        <Text style={styles.username}>@{profile.username}</Text>
        {profile.custom_status && <Text style={styles.customStatus}>{profile.custom_status}</Text>}
        <Text style={styles.joined}>Joined {joined}</Text>
        
        <View style={styles.bioBox}>
          <Text style={styles.bioTitle}>ABOUT ME</Text>
          <Text style={styles.bio}>{profile.bio || 'No bio yet.'}</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}><Text style={styles.statNum}>{profile.message_count}</Text><Text style={styles.statLabel}>Messages</Text></View>
          <View style={styles.stat}><Text style={styles.statNum}>{profile.server_count}</Text><Text style={styles.statLabel}>Servers</Text></View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  banner: { height: 120, width: '100%' },
  profileContent: { padding: 24, alignItems: 'center', marginTop: -50 },
  avatarWrap: { position: 'relative', marginBottom: 16 },
  avatarImg: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: colors.bg },
  avatarFallback: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.accent, borderWidth: 4, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 44, fontWeight: '800' },
  statusDot: { position: 'absolute', right: 4, bottom: 4, width: 20, height: 20, borderRadius: 10, borderWidth: 3, borderColor: colors.bg },
  username: { color: colors.text, fontSize: 24, fontWeight: '700' },
  customStatus: { color: colors.textDim, marginTop: 4, fontSize: 14 },
  joined: { color: colors.textMuted, marginTop: 8, fontSize: 12 },
  bioBox: { width: '100%', backgroundColor: colors.bg2, padding: 16, borderRadius: 12, marginTop: 24, borderWidth: 1, borderColor: colors.border },
  bioTitle: { color: colors.textDim, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  bio: { color: colors.text, lineHeight: 20 },
  stats: { flexDirection: 'row', marginTop: 32, gap: 40 },
  stat: { alignItems: 'center' },
  statNum: { color: colors.text, fontSize: 24, fontWeight: '800' },
  statLabel: { color: colors.textDim, marginTop: 4, fontSize: 12 },
});