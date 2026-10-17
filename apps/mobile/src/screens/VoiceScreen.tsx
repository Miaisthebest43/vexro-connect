import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LiveKitRoom, VideoView, useTracks, AudioSession, useRoomContext } from '@livekit/react-native';
import { Track } from 'livekit-client';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getToken, API_URL } from '../lib/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Voice'>;

export default function VoiceScreen({ route, navigation }: Props) {
  const { channelId, channelName } = route.params;
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const authToken = await getToken();
        const res = await fetch(`${API_URL}/channels/${channelId}/voice-token`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setToken(data.token);
      } catch (e: any) { setError(e.message); }
    })();
    
    AudioSession.startAudioSession();
    return () => { AudioSession.stopAudioSession(); };
  }, [channelId]);

  if (error) return <View style={styles.center}><Text style={styles.text}>Error: {error}</Text></View>;
  if (!token) return <View style={styles.center}><ActivityIndicator size="large" color={colors.accent} /></View>;

  return (
    <LiveKitRoom
      serverUrl="ws://10.0.0.148:7880"
      token={token}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={() => navigation.goBack()}
      style={{ flex: 1, backgroundColor: colors.bg }}
    >
      <VoiceRoomUI channelName={channelName} />
    </LiveKitRoom>
  );
}

function VoiceRoomUI({ channelName }: { channelName: string }) {
  const tracks = useTracks([Track.Source.Microphone]);
  const room = useRoomContext();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔊 {channelName}</Text>
        <Text style={styles.subtitle}>Connected to Voice</Text>
      </View>
      
      <View style={styles.grid}>
        {tracks.map(t => (
          <View key={t.participant.identity} style={styles.participant}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{t.participant.name?.[0]?.toUpperCase()}</Text>
            </View>
            <Text style={styles.name}>{t.participant.name}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.disconnect} onPress={() => room.disconnect()}>
        <Text style={styles.disconnectText}>Disconnect</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' },
  text: { color: 'red', fontSize: 16 },
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingTop: 80, paddingHorizontal: 24, alignItems: 'center' },
  title: { color: colors.text, fontSize: 24, fontWeight: '800' },
  subtitle: { color: colors.success, fontSize: 14, marginTop: 8 },
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 24, justifyContent: 'center', gap: 20 },
  participant: { alignItems: 'center', width: 80 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '800' },
  name: { color: colors.text, marginTop: 8, fontSize: 12 },
  disconnect: { margin: 24, backgroundColor: colors.danger, padding: 16, borderRadius: 12, alignItems: 'center' },
  disconnectText: { color: '#fff', fontWeight: '800', fontSize: 16 }
});