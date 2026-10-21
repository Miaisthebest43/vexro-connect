import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LiveKitRoom, VideoConference } from '@livekit/react-native';
import { api } from '../lib/api';
import { colors } from '../theme/colors';
import { PhoneOff } from 'lucide-react-native';

export default function VoiceScreen({ route, navigation }: any) {
  const { channelName = 'Lounge' } = route?.params || {};
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string>('ws://localhost:7880');

  useEffect(() => {
    api.post('/voice/token', { roomName: channelName })
      .then((res: any) => setToken(res.token))
      .catch(console.error);
  }, [channelName]);

  if (!token) return (
    <View style={styles.loading}><Text style={{ color: colors.text }}>Connecting to voice...</Text></View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.leaveBtn} onPress={() => navigation.goBack()}>
        <PhoneOff size={24} color="#fff" />
      </TouchableOpacity>
      <LiveKitRoom serverUrl={url} token={token} connect={true} audio={true} video={false}>
        <VideoConference />
      </LiveKitRoom>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loading: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  leaveBtn: { position: 'absolute', top: 40, right: 20, backgroundColor: colors.danger, padding: 16, borderRadius: 50, zIndex: 10 },
});