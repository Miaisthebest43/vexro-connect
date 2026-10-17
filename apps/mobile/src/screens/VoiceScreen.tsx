import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { LiveKitRoom, useTracks, AudioSession, useRoomContext, VideoView, useLocalParticipant } from '@livekit/react-native';
import { Track } from 'livekit-client';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getToken, API_URL } from '../lib/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Voice'>;

const LIVEKIT_HOST = Platform.OS === 'android' && API_URL.includes('10.0.0.148')
  ? 'ws://10.0.2.2:7880'
  : 'ws://10.0.0.148:7880';

export default function VoiceScreen({ route, navigation }: Props) {
  const { channelId, channelName } = route.params;
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const authToken = await getToken();
        const res = await fetch(`${API_URL}/channels/${channelId}/voice-token`, {
          method: 'POST', headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to get token');
        setToken(data.token);
      } catch (e: any) { setError(e.message); }
    })();
    AudioSession.startAudioSession();
    return () => { AudioSession.stopAudioSession(); };
  }, [channelId]);

  if (error) return <View style={styles.center}><Text style={styles.errorText}>Error: {error}</Text></View>;
  if (!token) return <View style={styles.center}><ActivityIndicator size="large" color={colors.accent} /></View>;

  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_HOST} token={token} connect={true} audio={true} video={false}
      onDisconnected={() => navigation.goBack()}
      onError={(e) => setError(e.message)}
      style={{ flex: 1, backgroundColor: colors.bg }}
    >
      <VoiceRoomUI channelName={channelName} />
    </LiveKitRoom>
  );
}

function VoiceRoomUI({ channelName }: { channelName: string }) {
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  const toggleMute = async () => {
    await localParticipant.setMicrophoneEnabled(isMuted);
    setIsMuted(!isMuted);
  };

  const toggleVideo = async () => {
    await localParticipant.setCameraEnabled(!isVideoOn);
    setIsVideoOn(!isVideoOn);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔊 {channelName}</Text>
        <Text style={styles.subtitle}>Connected to Voice</Text>
      </View>
      
      <View style={styles.grid}>
        {tracks.map(t => (
          <View key={t.participant.identity} style={styles.participant}>
            {t.source === Track.Source.Camera ? (
              <VideoView style={styles.video} trackRef={t} />
            ) : (
              <View style={[styles.avatar, t.isSpeaking && styles.avatarSpeaking]}>
                <Text style={styles.avatarText}>{t.participant.name?.[0]?.toUpperCase()}</Text>
              </View>
            )}
            <Text style={styles.name}>{t.participant.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={[styles.controlBtn, isMuted && styles.controlBtnDanger]} onPress={toggleMute}>
          <Text style={styles.controlIcon}>{isMuted ? '🔇' : '🎤'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, isVideoOn && styles.controlBtnActive]} onPress={toggleVideo}>
          <Text style={styles.controlIcon}>{isVideoOn ? '📹' : '📷'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, styles.controlBtnDanger]} onPress={() => room.disconnect()}>
          <Text style={styles.controlIcon}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: colors.danger, fontSize: 16, padding: 24, textAlign: 'center' },
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingTop: 80, paddingHorizontal: 24, alignItems: 'center' },
  title: { color: colors.text, fontSize: 24, fontWeight: '800' },
  subtitle: { color: colors.success, fontSize: 14, marginTop: 8 },
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 24, justifyContent: 'center', gap: 20 },
  participant: { alignItems: 'center', width: 100 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.bg4, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  avatarSpeaking: { borderColor: colors.success },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  video: { width: 100, height: 100, borderRadius: 12, backgroundColor: '#000' },
  name: { color: colors.text, marginTop: 8, fontSize: 12, fontWeight: '600' },
  controls: { flexDirection: 'row', justifyContent: 'center', gap: 16, paddingBottom: 48 },
  controlBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.bg4, alignItems: 'center', justifyContent: 'center' },
  controlBtnActive: { backgroundColor: colors.accent },
  controlBtnDanger: { backgroundColor: colors.danger },
  controlIcon: { fontSize: 24 },
});