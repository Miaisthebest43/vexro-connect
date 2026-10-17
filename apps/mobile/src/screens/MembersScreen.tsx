import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert, Image, TextInput, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { api, absUrl, type Member, type Ban } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Members'>;

const statusColors: Record<string, string> = { online: colors.success, idle: '#f5a623', dnd: colors.danger, offline: colors.textDim };

export default function MembersScreen({ route, navigation }: Props) {
  const { serverId, serverName } = route.params;
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [bans, setBans] = useState<Ban[]>([]);
  const [myRole, setMyRole] = useState<string>('member');
  const [loading, setLoading] = useState(true);
  const [showBans, setShowBans] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editNick, setEditNick] = useState('');

  const load = useCallback(async () => {
    try {
      const [m, s] = await Promise.all([api.listMembers(serverId), api.getServer(serverId)]);
      setMembers(m.members);
      setMyRole(s.myRole);
      if (['owner', 'admin'].includes(s.myRole)) {
        try { const b = await api.listBans(serverId); setBans(b.bans); } catch {}
      }
    } catch (e: any) { Alert.alert('Failed', e.message); }
    finally { setLoading(false); }
  }, [serverId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  function memberActions(m: Member) {
    if (m.id === user?.id) {
      Alert.alert(m.username, undefined, [
        { text: 'Set nickname', onPress: () => { setEditingMember(m); setEditNick(m.nickname ?? ''); } },
        { text: 'View profile', onPress: () => navigation.navigate('Profile', { userId: m.id }) },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }
    const canManage = myRole === 'owner' || myRole === 'admin';
    if (!canManage) {
      navigation.navigate('Profile', { userId: m.id });
      return;
    }
    const actions: any[] = [
      { text: 'View profile', onPress: () => navigation.navigate('Profile', { userId: m.id }) },
      { text: 'Set nickname', onPress: () => { setEditingMember(m); setEditNick(m.nickname ?? ''); } },
    ];
    if (myRole === 'owner' && m.role !== 'owner') {
      actions.push({ text: m.role === 'admin' ? 'Demote to member' : 'Promote to admin', onPress: async () => {
        try { await api.updateMember(serverId, m.id, { role: m.role === 'admin' ? 'member' : 'admin' }); load(); } catch (e: any) { Alert.alert('Failed', e.message); }
      }});
    }
    actions.push({ text: 'Kick', style: 'destructive', onPress: () => {
      Alert.alert('Kick ' + m.username + '?', undefined, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Kick', style: 'destructive', onPress: async () => {
          try { await api.kickMember(serverId, m.id); load(); } catch (e: any) { Alert.alert('Failed', e.message); }
        }},
      ]);
    }});
    actions.push({ text: 'Ban', style: 'destructive', onPress: () => {
      Alert.prompt?.('Ban reason', 'Optional', async (reason) => {
        try { await api.banMember(serverId, m.id, reason); load(); } catch (e: any) { Alert.alert('Failed', e.message); }
      });
      if (!Alert.prompt) {
        Alert.alert('Ban ' + m.username + '?', undefined, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Ban', style: 'destructive', onPress: async () => {
            try { await api.banMember(serverId, m.id); load(); } catch (e: any) { Alert.alert('Failed', e.message); }
          }},
        ]);
      }
    }});
    actions.push({ text: 'Cancel', style: 'cancel' });
    Alert.alert(m.username, undefined, actions);
  }

  async function saveNickname() {
    if (!editingMember) return;
    try {
      await api.updateMember(serverId, editingMember.id, { nickname: editNick.trim() || null });
      setEditingMember(null); load();
    } catch (e: any) { Alert.alert('Failed', e.message); }
  }

  async function unban(userId: string) {
    try { await api.unbanMember(serverId, userId); const b = await api.listBans(serverId); setBans(b.bans); } catch (e: any) { Alert.alert('Failed', e.message); }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>â€¹</Text></TouchableOpacity>
        <Text style={styles.title}>{serverName} Â· Members</Text>
        {['owner','admin'].includes(myRole) && (
          <TouchableOpacity onPress={() => setShowBans((v) => !v)}>
            <Text style={styles.headerBtn}>{showBans ? 'Members' : 'Bans'}</Text>
          </TouchableOpacity>
        )}
        {!['owner','admin'].includes(myRole) && <View style={{ width: 30 }} />}
      </View>

      {loading ? <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} /> : showBans ? (
        <FlatList
          data={bans}
          keyExtractor={(b) => b.user_id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={styles.empty}>No bans.</Text>}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{item.username[0].toUpperCase()}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.username}>@{item.username}</Text>
                {item.reason && <Text style={styles.reason}>{item.reason}</Text>}
              </View>
              <TouchableOpacity onPress={() => unban(item.user_id)} style={styles.unbanBtn}>
                <Text style={styles.unbanText}>Unban</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => {
            const avatarUrl = absUrl(item.avatar_url);
            const display = item.nickname ?? item.username;
            return (
              <TouchableOpacity style={styles.row} onPress={() => memberActions(item)}>
                <View style={styles.avatarWrap}>
                  {avatarUrl ? <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
                    : <View style={styles.avatar}><Text style={styles.avatarText}>{display[0].toUpperCase()}</Text></View>}
                  <View style={[styles.statusDot, { backgroundColor: statusColors[item.status] ?? colors.textDim }]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.username}>{display}{item.nickname ? ` (${item.username})` : ''}</Text>
                  <Text style={styles.role}>{item.role}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <Modal visible={!!editingMember} transparent animationType="fade" onRequestClose={() => setEditingMember(null)}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Set nickname</Text>
            <TextInput style={styles.modalInput} value={editNick} onChangeText={setEditNick} placeholder="Leave blank to reset" placeholderTextColor={colors.textDim} autoFocus maxLength={32} />
            <View style={styles.modalRow}>
              <TouchableOpacity onPress={() => setEditingMember(null)} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={saveNickname} style={styles.confirmBtn}><Text style={styles.confirmText}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { color: colors.accent, fontSize: 24, width: 30 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center' },
  headerBtn: { color: colors.accent, fontSize: 14 },
  empty: { color: colors.textDim, textAlign: 'center', marginTop: 40 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10 },
  avatarWrap: { position: 'relative', marginRight: 12 },
  avatarImg: { width: 40, height: 40, borderRadius: 20 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  statusDot: { position: 'absolute', right: -2, bottom: -2, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: colors.bg },
  username: { color: colors.text, fontSize: 15, fontWeight: '600' },
  role: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  reason: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  unbanBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.accent },
  unbanText: { color: colors.accent, fontSize: 13 },
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