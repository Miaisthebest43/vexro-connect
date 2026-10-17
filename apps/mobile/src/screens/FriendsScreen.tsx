import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { api } from '../lib/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Friends'>;

export default function FriendsScreen({ navigation }: Props) {
  const [data, setData] = useState<{ friends: any[], incoming: any[], outgoing: any[] }>({ friends: [], incoming: [], outgoing: [] });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [username, setUsername] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await api.listFriends();
      setData(res);
    } catch (e: any) { Alert.alert('Failed to load', e.message); }
    finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function sendRequest() {
    if (!username.trim()) return;
    try {
      await api.requestFriend(username.trim());
      setUsername(''); setAdding(false); load();
      Alert.alert('Request Sent', 'Friend request sent successfully.');
    } catch (e: any) { Alert.alert('Failed', e.message); }
  }

  async function acceptRequest(u: string) {
    try { await api.acceptFriend(u); load(); }
    catch (e: any) { Alert.alert('Failed', e.message); }
  }

  async function openDM(userId: string) {
    try {
      const { channel } = await api.openDM(userId);
      navigation.navigate('Chat', { serverId: '', channelId: channel.id, channelName: channel.name });
    } catch (e: any) { Alert.alert('Failed', e.message); }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></TouchableOpacity>
        <Text style={styles.title}>Friends</Text>
        <TouchableOpacity onPress={() => setAdding(true)}><Text style={styles.addBtn}>+ Add</Text></TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} /> : (
        <FlatList
          data={[
            ...data.incoming.map(x => ({ ...x, _type: 'incoming' })),
            ...data.friends.map(x => ({ ...x, _type: 'friend' })),
            ...data.outgoing.map(x => ({ ...x, _type: 'outgoing' })),
          ]}
          keyExtractor={(i) => i._type + i.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={styles.empty}>No friends yet. Add someone!</Text>}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{item.username[0].toUpperCase()}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.username}>@{item.username}</Text>
                <Text style={styles.status}>{item._type === 'incoming' ? 'Wants to be friends' : item._type === 'outgoing' ? 'Request pending' : 'Friend'}</Text>
              </View>
              {item._type === 'friend' && (
                <TouchableOpacity onPress={() => openDM(item.id)} style={styles.btn}><Text style={styles.btnText}>Message</Text></TouchableOpacity>
              )}
              {item._type === 'incoming' && (
                <TouchableOpacity onPress={() => acceptRequest(item.username)} style={[styles.btn, { backgroundColor: colors.success }]}><Text style={styles.btnText}>Accept</Text></TouchableOpacity>
              )}
            </View>
          )}
        />
      )}

      <Modal visible={adding} transparent animationType="fade" onRequestClose={() => setAdding(false)}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Friend</Text>
            <TextInput style={styles.modalInput} placeholder="Username" placeholderTextColor={colors.textDim} autoCapitalize="none" value={username} onChangeText={setUsername} autoFocus />
            <View style={styles.modalRow}>
              <TouchableOpacity onPress={() => setAdding(false)} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={sendRequest} style={styles.confirmBtn}><Text style={styles.confirmText}>Send Request</Text></TouchableOpacity>
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
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  addBtn: { color: colors.accent, fontSize: 16, fontWeight: '600' },
  empty: { color: colors.textDim, textAlign: 'center', marginTop: 40 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 8, backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  username: { color: colors.text, fontSize: 15, fontWeight: '600' },
  status: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: colors.accent },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
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