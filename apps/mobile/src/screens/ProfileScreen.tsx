import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { api, absUrl } from '../lib/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const statusColors: Record<string, string> = {
  online: colors.success, idle: '#f5a623', dnd: colors.danger, offline: colors.textDim,
};

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
    <View style={styles.container}>
      <View style={styles.avatarWrap}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
        ) : (
          <View style={styles.avatarFallback}><Text style={styles.avatarText}>{profile.username[0].toUpperCase()}</Text></View>
        )}
        <View style={[styles.statusDot, { backgroundColor: statusColors[profile.status] ?? colors.textDim }]} />
      </View>
      <Text style={styles.username}>@{profile.username}</Text>
      <Text style={styles.joined}>Joined {joined}</Text>
      {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}

      <View style={styles.stats}>
        <View style={styles.stat}><Text style={styles.statNum}>{profile.message_count}</Text><Text style={styles.statLabel}>Messages</Text></View>
        <View style={styles.stat}><Text style={styles.statNum}>{profile.server_count}</Text><Text style={styles.statLabel}>Servers</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', paddingTop: 100 },
  avatarWrap: { position: 'relative' },
  avatarImg: { width: 100, height: 100, borderRadius: 30 },
  avatarFallback: { width: 100, height: 100, borderRadius: 30, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 44, fontWeight: '800' },
  statusDot: { position: 'absolute', right: -4, bottom: -4, width: 22, height: 22, borderRadius: 11, borderWidth: 4, borderColor: colors.bg },
  username: { color: colors.text, fontSize: 26, fontWeight: '700', marginTop: 20 },
  joined: { color: colors.textDim, marginTop: 6 },
  bio: { color: colors.text, marginTop: 16, paddingHorizontal: 40, textAlign: 'center', lineHeight: 20 },
  stats: { flexDirection: 'row', marginTop: 40, gap: 40 },
  stat: { alignItems: 'center' },
  statNum: { color: colors.text, fontSize: 28, fontWeight: '800' },
  statLabel: { color: colors.textDim, marginTop: 4 },
});