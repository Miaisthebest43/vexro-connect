import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert, TextInput, Modal, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import { api, absUrl, type Server } from '../lib/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;
type Tab = 'servers' | 'dms';

export default function DashboardScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('servers');
  const [servers, setServers] = useState<Server[]>([]);
  const [dms, setDms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [newName, setNewName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const load = useCallback(async () => {
    try {
      if (tab === 'servers') {
        const { servers } = await api.listServers();
        setServers(servers);
      } else {
        const { dms } = await api.listDMs();
        setDms(dms);
      }
    } catch (e: any) { Alert.alert('Failed', e.message); }
    finally { setLoading(false); }
  }, [tab]);

  useFocusEffect(useCallback(() => { setLoading(true); load(); }, [load]));

  async function onCreate() {
    if (!newName.trim()) return;
    try {
      const { server } = await api.createServer(newName.trim());
      setNewName(''); setCreating(false);
      navigation.navigate('Channels', { serverId: server.id, serverName: server.name });
    } catch (e: any) { Alert.alert('Failed', e.message); }
  }
  async function onJoin() {
    const code = joinCode.trim();
    if (!code) return;
    try {
      const { serverId } = await api.redeemInvite(code);
      setJoinCode(''); setJoining(false); load();
      navigation.navigate('Channels', { serverId, serverName: 'Joined' });
    } catch (e: any) { Alert.alert('Failed', e.message); }
  }

  const avatarUrl = absUrl(user?.avatar_url);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ flexDirection: 'row', alignItems: 'center' }}>
          {avatarUrl ? <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            : <View style={[styles.avatar, styles.avatarFallback]}><Text style={styles.avatarText}>{user?.username[0].toUpperCase()}</Text></View>}
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.brand}>VEXRO</Text>
            <Text style={styles.user}>@{user?.username}</Text>
          </View>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
            <Text style={{ color: colors.accent, fontSize: 15, fontWeight: '600' }}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}><Text style={styles.logout}>Log out</Text></TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'servers' && styles.tabActive]} onPress={() => setTab('servers')}>
          <Text style={[styles.tabText, tab === 'servers' && styles.tabTextActive]}>Servers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'dms' && styles.tabActive]} onPress={() => setTab('dms')}>
          <Text style={[styles.tabText, tab === 'dms' && styles.tabTextActive]}>DMs</Text>
        </TouchableOpacity>
      </View>

      {tab === 'servers' && (
        <View style={styles.subHeader}>
          <Text style={styles.subTitle}>Your servers</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={() => setJoining(true)} style={styles.ghostBtn}><Text style={styles.ghostText}>Join</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setCreating(true)} style={styles.newBtn}><Text style={styles.newBtnText}>+ New</Text></TouchableOpacity>
          </View>
        </View>
      )}

      {loading ? <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} /> : tab === 'servers' ? (
        servers.length === 0 ? (
          <View style={styles.empty}><Text style={styles.emptyTitle}>No servers yet</Text><Text style={styles.emptyText}>Create one or join with an invite code.</Text></View>
        ) : (
          <FlatList data={servers} keyExtractor={(s) => s.id} contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => {
              const icon = absUrl(item.icon_url);
              return (
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Channels', { serverId: item.id, serverName: item.name })}>
                  {icon ? <Image source={{ uri: icon }} style={styles.icon} /> : <View style={styles.iconFallback}><Text style={styles.iconText}>{item.name[0].toUpperCase()}</Text></View>}
                  <Text style={styles.cardName}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        )
      ) : (
        dms.length === 0 ? (
          <View style={styles.empty}><Text style={styles.emptyTitle}>No DMs yet</Text><Text style={styles.emptyText}>Add a friend and start chatting.</Text></View>
        ) : (
          <FlatList data={dms} keyExtractor={(d) => d.id} contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Chat', { serverId: '', channelId: item.id, channelName: item.username })}>
                <View style={styles.iconFallback}><Text style={styles.iconText}>{item.username[0].toUpperCase()}</Text></View>
                <Text style={styles.cardName}>@{item.username}</Text>
              </TouchableOpacity>
            )}
          />
        )
      )}

      <Modal visible={creating} transparent animationType="fade" onRequestClose={() => setCreating(false)}>
        <View style={styles.modalBg}><View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Create server</Text>
          <TextInput style={styles.modalInput} placeholder="Server name" placeholderTextColor={colors.textDim} value={newName} onChangeText={setNewName} autoFocus />
          <View style={styles.modalRow}>
            <TouchableOpacity onPress={() => setCreating(false)} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
            <TouchableOpacity onPress={onCreate} style={styles.confirmBtn}><Text style={styles.confirmText}>Create</Text></TouchableOpacity>
          </View>
        </View></View>
      </Modal>

      <Modal visible={joining} transparent animationType="fade" onRequestClose={() => setJoining(false)}>
        <View style={styles.modalBg}><View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Join with code</Text>
          <TextInput style={styles.modalInput} placeholder="Paste invite code" placeholderTextColor={colors.textDim} autoCapitalize="none" value={joinCode} onChangeText={setJoinCode} autoFocus />
          <View style={styles.modalRow}>
            <TouchableOpacity onPress={() => setJoining(false)} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
            <TouchableOpacity onPress={onJoin} style={styles.confirmBtn}><Text style={styles.confirmText}>Join</Text></TouchableOpacity>
          </View>
        </View></View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  avatar: { width: 48, height: 48, borderRadius: 14 },
  avatarFallback: { backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  brand: { color: colors.text, fontSize: 20, fontWeight: '800', letterSpacing: 3 },
  user: { color: colors.textDim, marginTop: 2 },
  logout: { color: colors.danger, fontSize: 14 },
  tabs: { flexDirection: 'row', paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.accent },
  tabText: { color: colors.textDim, fontSize: 16, fontWeight: '600' },
  tabTextActive: { color: colors.accent },
  subHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 12 },
  subTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  newBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.accent },
  newBtnText: { color: '#fff', fontWeight: '700' },
  ghostBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  ghostText: { color: colors.text, fontWeight: '700' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '700' },
  emptyText: { color: colors.textDim, marginTop: 8, textAlign: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 8, borderRadius: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  icon: { width: 44, height: 44, borderRadius: 12 },
  iconFallback: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  iconText: { color: '#fff', fontWeight: '800', fontSize: 20 },
  cardName: { color: colors.text, fontSize: 16, fontWeight: '600', marginLeft: 14 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: colors.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalInput: { backgroundColor: colors.bg, color: colors.text, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 10 },
  cancelText: { color: colors.textDim },
  confirmBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.accent },
  confirmText: { color: '#fff', fontWeight: '700' },
});