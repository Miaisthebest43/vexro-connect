import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Mic, MicOff, Headphones, HeadphoneOff, Video, VideoOff, ScreenShare, PhoneOff, ShieldAlert, MonitorUp } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

// Native LiveKit imports (Wrapped so web doesn't crash)
let LiveKitRoom: any = View;
let useTracks: any = () => [];
let TrackReference: any = {};

if (Platform.OS !== 'web') {
  try {
    const LiveKit = require('@livekit/react-native');
    LiveKitRoom = LiveKit.LiveKitRoom;
    useTracks = LiveKit.useTracks;
  } catch (e) {
    console.log('LiveKit not linked yet');
  }
}

export default function VoiceCallScreen({ channelName = 'Lounge', onLeave }: { channelName?: string, onLeave: () => void }) {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [deafened, setDeafened] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [connected, setConnected] = useState(false);

  // Fetch the Voice Token from backend
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await api.post('/voice/token', { roomName: channelName });
        setToken((res as any).token);
        setConnected(true);
      } catch (err) {
        console.error('Failed to get voice token', err);
      }
    };
    if (user) fetchToken();
  }, [channelName, user]);

  const handleLeave = () => {
    setConnected(false);
    onLeave();
  };

  // MOCK UI FOR WEB (Looks like a real call)
  const mockParticipants = [
    { id: 1, name: user?.username || 'You', color: colors.accent, muted: !micOn, speaking: micOn },
    { id: 2, name: 'DØR †☆', color: '#E91E63', muted: false, speaking: true },
    { id: 3, name: 'ZeroRush', color: '#23A559', muted: true, speaking: false },
  ];

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.connectionPill}>
          <View style={[styles.dot, { backgroundColor: connected ? colors.success : colors.warning }]} />
          <Text style={styles.connectionText}>{connected ? `Voice Connected • ${channelName}` : 'Connecting...'}</Text>
        </View>
        <TouchableOpacity style={styles.disconnectBtn} onPress={handleLeave}>
          <PhoneOff size={16} color={colors.text} />
          <Text style={styles.disconnectText}>Disconnect</Text>
        </TouchableOpacity>
      </View>

      {/* Video/Grid Area */}
      <View style={styles.gridContainer}>
        {mockParticipants.map((p) => (
          <View key={p.id} style={[styles.participantTile, p.speaking && { borderColor: colors.success }]}>
            <View style={[styles.avatar, { backgroundColor: p.color }]}>
              <Text style={styles.avatarText}>{p.name[0].toUpperCase()}</Text>
            </View>
            <View style={styles.tileFooter}>
              <Text style={styles.participantName}>{p.name}</Text>
              {p.muted && <MicOff size={14} color={colors.danger} style={{ marginLeft: 6 }} />}
            </View>
          </View>
        ))}
      </View>

      {/* Bottom Controls */}
      <View style={styles.controlsWrap}>
        <View style={styles.controls}>
          <TouchableOpacity style={[styles.controlBtn, !micOn && styles.controlBtnDanger]} onPress={() => setMicOn(!micOn)}>
            {micOn ? <Mic size={24} color={colors.text} /> : <MicOff size={24} color={colors.danger} />}
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.controlBtn, deafened && styles.controlBtnDanger]} onPress={() => setDeafened(!deafened)}>
            {deafened ? <HeadphoneOff size={24} color={colors.danger} /> : <Headphones size={24} color={colors.text} />}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.controlBtn, videoOn && styles.controlBtnActive]} onPress={() => setVideoOn(!videoOn)}>
            {videoOn ? <Video size={24} color="#fff" /> : <VideoOff size={24} color={colors.textDim} />}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.controlBtn, screenShare && styles.controlBtnActive]} onPress={() => setScreenShare(!screenShare)}>
            <MonitorUp size={24} color={screenShare ? '#fff' : colors.textDim} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.controlBtn, { backgroundColor: colors.danger }]} onPress={handleLeave}>
            <PhoneOff size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0B10' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
  connectionPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg2, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  connectionText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  disconnectBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(218, 55, 60, 0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.danger },
  disconnectText: { color: colors.danger, fontSize: 14, fontWeight: '700', marginLeft: 8 },

  gridContainer: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 24, gap: 16, justifyContent: 'center', alignContent: 'center' },
  participantTile: { width: 280, height: 220, backgroundColor: colors.bg2, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent', overflow: 'hidden' },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  tileFooter: { position: 'absolute', bottom: 16, left: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  participantName: { color: '#fff', fontSize: 13, fontWeight: '600' },

  controlsWrap: { alignItems: 'center', paddingBottom: 40 },
  controls: { flexDirection: 'row', backgroundColor: colors.bg2, padding: 12, borderRadius: 24, gap: 12, borderWidth: 1, borderColor: colors.border },
  controlBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center' },
  controlBtnActive: { backgroundColor: colors.accent },
  controlBtnDanger: { backgroundColor: 'rgba(218, 55, 60, 0.15)', borderWidth: 1, borderColor: colors.danger },
});