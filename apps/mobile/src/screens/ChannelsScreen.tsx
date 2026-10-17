import React, { useCallback, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  ActivityIndicator, Alert, TextInput, Modal, Share,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { api, type Channel } from '../lib/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Channels'>;

export default function ChannelsScreen({ route, navigation }: Props) {
  const { serverId, serverName } = route.params;
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { server } = await api.getServer(serverId);
      setChannels(server.channels);
    } catch (e: any) { Alert.alert('Failed to load', e.message); }
    finally { setLoading(false); }
  }, [serverId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function onCreate() {
    const name = newName.trim().toLowerCase();
    if (!name) return;
    try {
      await api.createChannel(serverId, name);
      setNewName(''); setCreating(false); load();
    } catch (e: any) { Alert.alert('Failed to create channel', e.message); }
  }

  async function onInvite() {
    try {
      const { invite } = await api.createInvite(serverId);
      setInviteCode(invite.code);
      await Share.share({ message: `Join ${serverName} on VEXRO: ${invite.code}` });
    } catch (e: any) { Alert.alert('Failed to create invite', e.message); }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>â€¹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{serverName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Members', { serverId, serverName })}>
          <Text style={styles.headerBtn}>Members</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => setCreating(true)} style={styles.actionBtn}>
          <Text style={styles.actionText}>+ Channel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onInvite} style={[styles.actionBtn, styles.inviteBtn]}>
          <Text style={styles.actionText}>Invite</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={channels}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.channelRow}
              onPress={() => navigation.navigate('Chat', { channelId: item.id, channelName: item.name })}
            >
              <Text style={styles.hash}>#</Text>
              <Text style={styles.channelName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={creating} transparent animationType="fade" onRequestClose={() => setCreating(false)}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create channel</Text>
            <TextInput
              style={styles.modalInput} placeholder="channel-name" placeholderTextColor={colors.textDim}
              autoCapitalize="none" value={newName} onChangeText={setNewName} autoFocus
            />
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

      <Modal visible={!!inviteCode} transparent animationType="fade" onRequestClose={() => setInviteCode(null)}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Invite code</Text>
            <Text style={styles.inviteCode}>{inviteCode}</Text>
            <Text style={styles.hint}>Share this code. Others can redeem it from their dashboard.</Text>
            <TouchableOpacity onPress={() => setInviteCode(null)} style={styles.confirmBtn}>
              <Text style={styles.confirmText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  back: { color: colors.accent, fontSize: 24, width: 30 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700', flex: 1 },
  headerBtn: { color: colors.accent, fontSize: 14 },
  actions: { flexDirection: 'row', gap: 8, padding: 16 },
  actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  inviteBtn: { backgroundColor: colors.accent, borderColor: colors.accent },
  actionText: { color: '#fff', fontWeight: '700' },
  channelRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10 },
  hash: { color: colors.textDim, fontSize: 20, marginRight: 8 },
  channelName: { color: colors.text, fontSize: 16 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: colors.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalInput: { backgroundColor: colors.bg, color: colors.text, padding: 14, borderRadius: 10,
    borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 10 },
  cancelText: { color: colors.textDim },
  confirmBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.accent, alignItems: 'center' },
  confirmText: { color: '#fff', fontWeight: '700' },
  inviteCode: { color: colors.accent, fontSize: 32, fontWeight: '800', textAlign: 'center', letterSpacing: 4, marginVertical: 12 },
  hint: { color: colors.textDim, fontSize: 12, textAlign: 'center', marginBottom: 16 },
});