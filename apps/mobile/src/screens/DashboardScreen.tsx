import React, { useCallback, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  ActivityIndicator, Alert, TextInput, Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import { api, type Server } from '../lib/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [newName, setNewName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const load = useCallback(async () => {
    try {
      const { servers } = await api.listServers();
      setServers(servers);
    } catch (e: any) { Alert.alert('Failed to load servers', e.message); }
    finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function onCreate() {
    if (!newName.trim()) return;
    try {
      const { server } = await api.createServer(newName.trim());
      setNewName(''); setCreating(false);
      navigation.navigate('Channels', { serverId: server.id, serverName: server.name });
    } catch (e: any) { Alert.alert('Failed to create server', e.message); }
  }

  async function onJoin() {
    const code = joinCode.trim();
    if (!code) return;
    try {
      const { serverId } = await api.redeemInvite(code);
      setJoinCode(''); setJoining(false);
      load();
      navigation.navigate('Channels', { serverId, serverName: 'Joined' });
    } catch (e: any) { Alert.alert('Failed to join', e.message); }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>VEXRO</Text>
          <Text style={styles.user}>@{user?.username}</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.subTitle}>Your servers</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={() => setJoining(true)} style={styles.ghostBtn}>
            <Text style={styles.ghostText}>Join</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCreating(true)} style={styles.newBtn}>
            <Text style={styles.newBtnText}>+ New</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      ) : servers.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No servers yet</Text>
          <Text style={styles.emptyText}>Create one or join with an invite code.</Text>
        </View>
      ) : (
        <FlatList
          data={servers}
          keyExtractor={(s) => s.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.serverCard}
              onPress={() => navigation.navigate('Channels', { serverId: item.id, serverName: item.name })}
            >
              <View style={styles.serverAvatar}>
                <Text style={styles.serverAvatarText}>{item.name[0].toUpperCase()}</Text>
              </View>
              <Text style={styles.serverName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={creating} transparent animationType="fade" onRequestClose={() => setCreating(false)}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create server</Text>
            <TextInput style={styles.modalInput} placeholder="Server name" placeholderTextColor={colors.textDim}
              value={newName} onChangeText={setNewName} autoFocus />
            <View style={styles.modalRow}>
              <TouchableOpacity onPress={() => setCreating(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onCreate} style={styles.confirmBtn}>
                <Text style={styles.confirmText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={joining} transparent animationType="fade" onRequestClose={() => setJoining(false)}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Join with code</Text>
            <TextInput style={styles.modalInput} placeholder="Paste invite code" placeholderTextColor={colors.textDim}
              autoCapitalize="none" value={joinCode} onChangeText={setJoinCode} autoFocus />
            <View style={styles.modalRow}>
              <TouchableOpacity onPress={() => setJoining(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onJoin} style={styles.confirmBtn}>
                <Text style={styles.confirmText}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  brand: { color: colors.text, fontSize: 24, fontWeight: '800', letterSpacing: 3 },
  user: { color: colors.textDim, marginTop: 4 },
  logout: { color: colors.danger, fontSize: 14 },
  subHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingBottom: 12 },
  subTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  newBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.accent },
  newBtnText: { color: '#fff', fontWeight: '700' },
  ghostBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
    borderWidth: 1, borderColor: colors.border },
  ghostText: { color: colors.text, fontWeight: '700' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '700' },
  emptyText: { color: colors.textDim, marginTop: 8, textAlign: 'center' },
  serverCard: { flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 8,
    borderRadius: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  serverAvatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center' },
  serverAvatarText: { color: '#fff', fontWeight: '800', fontSize: 20 },
  serverName: { color: colors.text, fontSize: 16, fontWeight: '600', marginLeft: 14 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: colors.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalInput: { backgroundColor: colors.bg, color: colors.text, padding: 14, borderRadius: 10,
    borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 10 },
  cancelText: { color: colors.textDim },
  confirmBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.accent },
  confirmText: { color: '#fff', fontWeight: '700' },
});