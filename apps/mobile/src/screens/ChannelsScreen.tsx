import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert, TextInput, Modal, Share, SectionList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { api, type Channel, type Category } from '../lib/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Channels'>;

interface Section { title: string; categoryId: string | null; data: Channel[]; }

export default function ChannelsScreen({ route, navigation }: Props) {
  const { serverId, serverName } = route.params;
  const [channels, setChannels] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [unread, setUnread] = useState<Record<string, number>>({});
  const [myRole, setMyRole] = useState('member');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [creatingCat, setCreatingCat] = useState(false);
  const [newName, setNewName] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const load = useCallback(async () => {
    try {
      const r = await api.getServer(serverId);
      setChannels(r.server.channels);
      setCategories(r.server.categories);
      setUnread(r.unread);
      setMyRole(r.myRole);
    } catch (e: any) { Alert.alert('Failed', e.message); }
    finally { setLoading(false); }
  }, [serverId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function onCreate() {
    const name = newName.trim().toLowerCase();
    if (!name) return;
    try { await api.createChannel(serverId, name); setNewName(''); setCreating(false); load(); }
    catch (e: any) { Alert.alert('Failed', e.message); }
  }
  async function onCreateCat() {
    const name = newName.trim();
    if (!name) return;
    try { await api.createCategory(serverId, name); setNewName(''); setCreatingCat(false); load(); }
    catch (e: any) { Alert.alert('Failed', e.message); }
  }
  async function onInvite() {
    try {
      const { invite } = await api.createInvite(serverId);
      await Share.share({ message: `Join ${serverName} on VEXRO: ${invite.code}` });
    } catch (e: any) { Alert.alert('Failed', e.message); }
  }
  async function onSearch() {
    if (searchQuery.trim().length < 2) return;
    try { const r = await api.searchServer(serverId, searchQuery.trim()); setSearchResults(r.results); }
    catch (e: any) { Alert.alert('Search failed', e.message); }
  }

  const sections: Section[] = React.useMemo(() => {
    const byCat = new Map<string | null, Channel[]>();
    for (const c of channels) {
      const key = c.category_id ?? null;
      if (!byCat.has(key)) byCat.set(key, []);
      byCat.get(key)!.push(c);
    }
    const result: Section[] = [];
    for (const cat of categories) {
      const data = byCat.get(cat.id) ?? [];
      if (data.length > 0) result.push({ title: cat.name, categoryId: cat.id, data });
    }
    const uncat = byCat.get(null) ?? [];
    if (uncat.length > 0) result.push({ title: 'Channels', categoryId: null, data: uncat });
    return result;
  }, [channels, categories]);

  const canManage = ['owner', 'admin'].includes(myRole);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>â€¹</Text></TouchableOpacity>
        <Text style={styles.title}>{serverName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Members', { serverId, serverName })}>
          <Text style={styles.headerBtn}>Members</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onInvite} style={styles.actionBtn}><Text style={styles.actionText}>Invite</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setSearching(true)} style={styles.actionBtn}><Text style={styles.actionText}>Search</Text></TouchableOpacity>
        {canManage && <TouchableOpacity onPress={() => navigation.navigate('ServerSettings', { serverId, serverName })} style={styles.actionBtn}><Text style={styles.actionText}>Settings</Text></TouchableOpacity>}
      </View>

      {loading ? <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} /> : (
        <SectionList
          sections={sections}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ padding: 16 }}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
              {canManage && section.categoryId === null && (
                <TouchableOpacity onPress={() => { setCreating(true); setNewName(''); }}>
                  <Text style={styles.sectionAdd}>+</Text>
                </TouchableOpacity>
              )}
              {canManage && section.categoryId !== null && (
                <TouchableOpacity onPress={() => Alert.alert('Delete category?', undefined, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: async () => { try { await api.deleteCategory(section.categoryId!); load(); } catch {} } },
                ])}>
                  <Text style={styles.sectionAdd}>âˆ’</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          renderItem={({ item }) => {
            const count = unread[item.id] ?? 0;
            return (
              <TouchableOpacity style={styles.channelRow} onPress={() => navigation.navigate('Chat', { channelId: item.id, channelName: item.name })}>
                <Text style={styles.hash}>#</Text>
                <Text style={styles.channelName}>{item.name}</Text>
                {count > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text></View>}
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={canManage ? (
            <TouchableOpacity onPress={() => setCreatingCat(true)} style={styles.addCatBtn}>
              <Text style={styles.addCatText}>+ New category</Text>
            </TouchableOpacity>
          ) : null}
        />
      )}

      <Modal visible={creating || creatingCat} transparent animationType="fade" onRequestClose={() => { setCreating(false); setCreatingCat(false); }}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{creating ? 'Create channel' : 'Create category'}</Text>
            <TextInput style={styles.modalInput} placeholder={creating ? 'channel-name' : 'Category name'} placeholderTextColor={colors.textDim}
              autoCapitalize="none" value={newName} onChangeText={setNewName} autoFocus />
            <View style={styles.modalRow}>
              <TouchableOpacity onPress={() => { setCreating(false); setCreatingCat(false); }} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={creating ? onCreate : onCreateCat} style={styles.confirmBtn}><Text style={styles.confirmText}>Create</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={searching} transparent animationType="slide" onRequestClose={() => setSearching(false)}>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { maxHeight: '75%' }]}>
            <Text style={styles.modalTitle}>Search messages</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput style={[styles.modalInput, { flex: 1 }]} placeholder="Search..." placeholderTextColor={colors.textDim}
                autoFocus value={searchQuery} onChangeText={setSearchQuery} onSubmitEditing={onSearch} />
              <TouchableOpacity onPress={onSearch} style={styles.confirmBtn}><Text style={styles.confirmText}>Go</Text></TouchableOpacity>
            </View>
            <FlatList data={searchResults} keyExtractor={(r) => r.id}
              ListEmptyComponent={searchQuery.length >= 2 ? <Text style={styles.empty}>No matches.</Text> : null}
              renderItem={({ item }) => (
                <View style={styles.searchRow}>
                  <Text style={styles.searchChannel}>#{item.channel_name}</Text>
                  <Text style={styles.searchAuthor}>@{item.username}</Text>
                  <Text style={styles.searchContent} numberOfLines={2}>{item.content}</Text>
                </View>
              )} />
            <TouchableOpacity onPress={() => setSearching(false)} style={styles.confirmBtn}><Text style={styles.confirmText}>Close</Text></TouchableOpacity>
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
  title: { color: colors.text, fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center' },
  headerBtn: { color: colors.accent, fontSize: 14 },
  actions: { flexDirection: 'row', gap: 8, padding: 16 },
  actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  actionText: { color: colors.text, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, paddingBottom: 6 },
  sectionTitle: { color: colors.textDim, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  sectionAdd: { color: colors.accent, fontSize: 20, paddingHorizontal: 8 },
  channelRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10 },
  hash: { color: colors.textDim, fontSize: 20, marginRight: 8 },
  channelName: { color: colors.text, fontSize: 16, flex: 1 },
  badge: { backgroundColor: colors.danger, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  addCatBtn: { paddingVertical: 12, alignItems: 'center' },
  addCatText: { color: colors.textDim, fontSize: 13 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: colors.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalInput: { backgroundColor: colors.bg, color: colors.text, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 10 },
  cancelText: { color: colors.textDim },
  confirmBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.accent, alignItems: 'center' },
  confirmText: { color: '#fff', fontWeight: '700' },
  empty: { color: colors.textDim, textAlign: 'center', marginTop: 20 },
  searchRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchChannel: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  searchAuthor: { color: colors.textDim, fontSize: 12 },
  searchContent: { color: colors.text, fontSize: 14, marginTop: 4 },
});