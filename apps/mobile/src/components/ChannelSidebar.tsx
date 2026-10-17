import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, TextInput, Modal, Alert } from 'react-native';
import ServerRail from './ServerRail';
import UserPanel from './UserPanel';
import { colors } from '../theme/colors';

interface Channel { id: string; name: string; category_id: string | null; position: number; }
interface Category { id: string; name: string; position: number; }
interface Server { id: string; name: string; icon_url: string | null; }

interface Props {
  servers: Server[];
  activeServerId: string | null;
  activeChannelId: string | null;
  channels: Channel[];
  categories: Category[];
  unread: Record<string, number>;
  loading: boolean;
  myRole: string;
  serverName: string;
  onSelectServer: (id: string) => void;
  onSelectChannel: (c: Channel) => void;
  onHome: () => void;
  onOpenFriends: () => void;
  onOpenMembers: () => void;
  onOpenServerSettings: () => void;
  onOpenSettings: () => void;
  onCreateChannel: (name: string) => Promise<void>;
  onCreateCategory: (name: string) => Promise<void>;
}

export default function ChannelSidebar(props: Props) {
  const [addChannelVisible, setAddChannelVisible] = useState(false);
  const [addCategoryVisible, setAddCategoryVisible] = useState(false);
  const [newName, setNewName] = useState('');

  const canManage = ['owner', 'admin'].includes(props.myRole);

  async function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    try {
      if (addChannelVisible) await props.onCreateChannel(name.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
      else await props.onCreateCategory(name);
      setNewName(''); setAddChannelVisible(false); setAddCategoryVisible(false);
    } catch (e: any) { Alert.alert('Failed', e.message); }
  }

  const sections = useMemo(() => {
    const map = new Map<string | null, Channel[]>();
    for (const c of props.channels) {
      const k = c.category_id ?? null;
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(c);
    }
    const out: Array<{ title: string; data: Channel[] }> = [];
    for (const cat of props.categories) {
      const d = map.get(cat.id) ?? [];
      if (d.length > 0) out.push({ title: cat.name, data: d });
    }
    const uncat = map.get(null) ?? [];
    if (uncat.length > 0) out.push({ title: 'Text Channels', data: uncat });
    return out;
  }, [props.channels, props.categories]);

  return (
    <View style={styles.container}>
      <ServerRail
        servers={props.servers}
        activeId={props.activeServerId}
        onSelect={props.onSelectServer}
        onHome={props.onHome}
      />
      <View style={styles.sidebar}>
        <View style={styles.header}>
          <Text style={styles.serverName} numberOfLines={1}>{props.serverName}</Text>
          {canManage && (
            <TouchableOpacity onPress={props.onOpenServerSettings} style={{ padding: 4 }}>
              <Text style={styles.chevron}>⌄</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={{ flex: 1 }}>
          {props.loading ? (
            <ActivityIndicator color={colors.accent} style={{ marginTop: 20 }} />
          ) : (
            <>
              {sections.map((section) => (
                <View key={section.title} style={{ marginTop: 12 }}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
                    {canManage && (
                      <TouchableOpacity onPress={() => { setAddChannelVisible(true); setNewName(''); }}>
                        <Text style={styles.sectionAdd}>+</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {section.data.map((ch) => {
                    const count = props.unread[ch.id] ?? 0;
                    const active = ch.id === props.activeChannelId;
                    return (
                      <TouchableOpacity
                        key={ch.id}
                        style={[styles.channelRow, active && styles.channelActive]}
                        onPress={() => props.onSelectChannel(ch)}
                      >
                        <Text style={[styles.hash, active && styles.hashActive]}>#</Text>
                        <Text style={[styles.channelName, active && styles.channelNameActive]} numberOfLines={1}>{ch.name}</Text>
                        {count > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text></View>}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}

              {canManage && (
                <TouchableOpacity style={styles.addRow} onPress={() => { setAddCategoryVisible(true); setNewName(''); }}>
                  <Text style={styles.addRowText}>+ New Category</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.addRow} onPress={props.onOpenFriends}>
                <Text style={styles.addRowText}>👥 Friends</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addRow} onPress={props.onOpenMembers}>
                <Text style={styles.addRowText}>👤 Members</Text>
              </TouchableOpacity>
              <View style={{ height: 24 }} />
            </>
          )}
        </ScrollView>

        <UserPanel onOpenSettings={props.onOpenSettings} />
      </View>

      <Modal visible={addChannelVisible || addCategoryVisible} transparent animationType="fade"
        onRequestClose={() => { setAddChannelVisible(false); setAddCategoryVisible(false); }}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{addChannelVisible ? 'New Channel' : 'New Category'}</Text>
            <TextInput style={styles.modalInput} placeholder={addChannelVisible ? 'channel-name' : 'Category Name'}
              placeholderTextColor={colors.textDim} autoCapitalize="none" value={newName} onChangeText={setNewName} autoFocus />
            <View style={styles.modalRow}>
              <TouchableOpacity onPress={() => { setAddChannelVisible(false); setAddCategoryVisible(false); }} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAdd} style={styles.confirmBtn}>
                <Text style={styles.confirmText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: colors.bg2 },
  sidebar: { flex: 1, backgroundColor: colors.bg2 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 44, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  serverName: { color: colors.text, fontSize: 15, fontWeight: '700', flex: 1 },
  chevron: { color: colors.textDim, fontSize: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 4 },
  sectionTitle: { color: colors.textDim, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  sectionAdd: { color: colors.textDim, fontSize: 18, paddingHorizontal: 4 },
  channelRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, marginHorizontal: 8, borderRadius: 6 },
  channelActive: { backgroundColor: colors.bg3 },
  hash: { color: colors.textMuted, fontSize: 16, marginRight: 6 },
  hashActive: { color: colors.text },
  channelName: { color: colors.textDim, fontSize: 15, flex: 1 },
  channelNameActive: { color: colors.text, fontWeight: '600' },
  badge: { backgroundColor: colors.danger, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8, marginLeft: 6 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  addRow: { paddingHorizontal: 16, paddingVertical: 10 },
  addRowText: { color: colors.textDim, fontSize: 13 },
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