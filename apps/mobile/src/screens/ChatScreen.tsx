import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Modal, Pressable, Image, Animated, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useChannel } from '../lib/useChannel';
import { usePresence, statusColor } from '../lib/usePresence';
import { api, uploadFile, absUrl, type Message, type Member } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import ChannelSidebar from '../components/ChannelSidebar';
import { colors } from '../theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = Math.min(340, SCREEN_WIDTH * 0.88);

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;
const QUICK_REACTIONS = ['ðŸ‘', 'â¤ï¸', 'ðŸ˜‚', 'ðŸ”¥', 'ðŸ‘€', 'ðŸ˜®', 'ðŸ˜¢', 'ðŸŽ‰'];

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    const today = new Date();
    const sameDay = d.toDateString() === today.toDateString();
    const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (sameDay) return `Today at ${time}`;
    return d.toLocaleDateString() + ' ' + time;
  } catch { return ''; }
}

export default function ChatScreen({ route, navigation }: Props) {
  const { serverId, channelId, channelName } = route.params;
  const { user } = useAuth();
  const { messages, connected, loading, typingUsers, sendTyping, updateReactions } = useChannel(channelId, user?.id);
  const { getStatus } = usePresence();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  const [servers, setServers] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [unread, setUnread] = useState<Record<string, number>>({});
  const [myRole, setMyRole] = useState('member');
  const [serverName, setServerName] = useState('');
  const [serverLoading, setServerLoading] = useState(true);

  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Message | null>(null);
  const [editText, setEditText] = useState('');
  const [pickerFor, setPickerFor] = useState<Message | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const listRef = useRef<FlatList>(null);

  const loadServers = useCallback(async () => {
    try { const r = await api.listServers(); setServers(r.servers); } catch {}
  }, []);

  const loadServer = useCallback(async () => {
    if (!serverId) { setServerLoading(false); return; }
    try {
      setServerLoading(true);
      const r = await api.getServer(serverId);
      setChannels(r.server.channels);
      setCategories(r.server.categories);
      setUnread(r.unread);
      setMyRole(r.myRole);
      setServerName(r.server.name);
    } catch {}
    finally { setServerLoading(false); }
  }, [serverId]);

  useEffect(() => { loadServers(); }, [loadServers]);
  useEffect(() => { loadServer(); }, [loadServer]);

  useEffect(() => {
    if (!serverId) return;
    (async () => { try { const r = await api.listMembers(serverId); setMembers(r.members); } catch {} })();
  }, [serverId]);

  useEffect(() => {
    Animated.timing(sidebarAnim, { toValue: sidebarOpen ? 0 : -SIDEBAR_WIDTH, duration: 220, useNativeDriver: true }).start();
  }, [sidebarOpen, sidebarAnim]);

  const mentionQuery = useMemo(() => { const m = text.match(/@([a-zA-Z0-9_.-]*)$/); return m ? m[1] : null; }, [text]);
  const mentionSuggestions = useMemo(() => {
    if (mentionQuery === null) return [];
    const q = mentionQuery.toLowerCase();
    return members.filter((m) => m.id !== user?.id && (m.username.toLowerCase().startsWith(q) || (m.nickname ?? '').toLowerCase().startsWith(q))).slice(0, 5);
  }, [mentionQuery, members, user?.id]);

  async function onSend() {
    const content = text.trim();
    if (!content || sending) return;
    setSending(true); setText('');
    const replyId = replyTo?.id; setReplyTo(null);
    try {
      await api.sendMessage(channelId, { content, reply_to_id: replyId });
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e: any) { Alert.alert('Failed', e.message); setText(content); }
    finally { setSending(false); }
  }

  async function onPickImage() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert('Permission needed'); return; }
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85 });
    if (r.canceled) return;
    const asset = r.assets[0]!;
    setUploading(true);
    try {
      const up = await uploadFile('/upload/attachment', asset.uri, asset.mimeType ?? 'image/jpeg');
      await api.sendMessage(channelId, { content: text.trim(), attachment_url: up.url, attachment_type: 'image', attachment_width: asset.width ?? undefined, attachment_height: asset.height ?? undefined, reply_to_id: replyTo?.id });
      setText(''); setReplyTo(null);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 200);
    } catch (e: any) { Alert.alert('Upload failed', e.message); }
    finally { setUploading(false); }
  }

  function onLongPress(msg: Message) {
    const mine = msg.author_id === user?.id;
    const opts: any[] = [
      { text: 'Reply', onPress: () => setReplyTo(msg) },
      { text: 'React', onPress: () => setPickerFor(msg) },
      { text: 'View profile', onPress: () => navigation.navigate('Profile', { userId: msg.author_id }) },
      { text: msg.pinned ? 'Unpin' : 'Pin', onPress: async () => { try { await api.togglePin(msg.id); } catch (e: any) { Alert.alert('Failed', e.message); } } },
    ];
    if (mine) opts.push({ text: 'Edit', onPress: () => { setEditing(msg); setEditText(msg.content); } });
    opts.push({ text: 'Delete', style: 'destructive', onPress: async () => { try { await api.deleteMessage(msg.id); } catch (e: any) { Alert.alert('Failed', e.message); } } });
    opts.push({ text: 'Cancel', style: 'cancel' });
    Alert.alert('Message', undefined, opts);
  }

  async function onSaveEdit() {
    if (!editing || !editText.trim()) return;
    try { await api.editMessage(editing.id, editText.trim()); setEditing(null); setEditText(''); }
    catch (e: any) { Alert.alert('Failed', e.message); }
  }

  async function onReact(emoji: string) {
    if (!pickerFor) return;
    try { const res = await api.toggleReaction(pickerFor.id, emoji); updateReactions(pickerFor.id, res.reactions); }
    catch (e: any) { Alert.alert('Failed', e.message); }
    finally { setPickerFor(null); }
  }

  function renderContent(content: string) {
    const parts = content.split(/(@[a-zA-Z0-9_.-]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        const uname = part.slice(1);
        const m = members.find((x) => x.username === uname || x.nickname === uname);
        if (m) return <Text key={i} style={styles.mention} onPress={() => navigation.navigate('Profile', { userId: m.id })}>{part}</Text>;
      }
      return <Text key={i}>{part}</Text>;
    });
  }

  async function selectServer(id: string) {
    setSidebarOpen(false);
    if (id === serverId) return;
    try {
      const r = await api.getServer(id);
      const first = r.server.channels[0];
      if (first) navigation.replace('Chat', { serverId: id, channelId: first.id, channelName: first.name });
      else navigation.navigate('Channels', { serverId: id, serverName: r.server.name });
    } catch (e: any) { Alert.alert('Failed', e.message); }
  }

  const typingLabel = typingUsers.length === 0 ? null
    : typingUsers.length === 1 ? `${typingUsers[0].username} is typingâ€¦`
    : `${typingUsers.length} people are typingâ€¦`;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSidebarOpen(true)} style={styles.hamburger}>
            <Text style={styles.hamburgerText}>â˜°</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>#{channelName}</Text>
            {serverName ? <Text style={styles.headerSub}>{serverName}</Text> : null}
          </View>
          <View style={[styles.dot, { backgroundColor: connected ? colors.success : colors.danger }]} />
        </View>

        {loading ? <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} /> : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 12 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            renderItem={({ item }) => {
              const mine = item.author_id === user?.id;
              const imgUrl = item.attachment_type === 'image' ? absUrl(item.attachment_url) : null;
              const aspect = item.attachment_width && item.attachment_height ? item.attachment_width / item.attachment_height : 1.5;
              const display = item.display_name ?? item.username;
              const authorStatus = getStatus(item.author_id);
              const authorAvatar = absUrl(item.avatar_url);
              return (
                <View style={styles.messageRow}>
                  <View style={styles.avatarWrap}>
                    {authorAvatar ? (
                      <Image source={{ uri: authorAvatar }} style={styles.messageAvatar} />
                    ) : (
                      <View style={[styles.messageAvatar, styles.messageAvatarFallback]}>
                        <Text style={styles.messageAvatarText}>{display[0]?.toUpperCase()}</Text>
                      </View>
                    )}
                    <View style={[styles.avatarStatus, { backgroundColor: statusColor(authorStatus) }]} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' }}>
                      <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: item.author_id })}>
                        <Text style={styles.messageUsername}>{display}</Text>
                      </TouchableOpacity>
                      <Text style={styles.messageTime}>  {formatTime(item.created_at)}</Text>
                      {item.pinned && <Text style={styles.pinFlag}>  ðŸ“Œ</Text>}
                    </View>
                    {item.reply_to && (
                      <View style={styles.replyBox}>
                        <Text style={styles.replyAuthor}>@{item.reply_to.username}</Text>
                        <Text style={styles.replyContent} numberOfLines={1}>{item.reply_to.content}</Text>
                      </View>
                    )}
                    <Pressable onLongPress={() => onLongPress(item)} delayLongPress={300}>
                      {imgUrl && <Image source={{ uri: imgUrl }} style={[styles.attachment, { aspectRatio: aspect }]} resizeMode="cover" />}
                      {item.content ? <Text style={styles.messageContent}>{renderContent(item.content)}</Text> : null}
                      {item.edited_at && <Text style={styles.edited}>(edited)</Text>}
                    </Pressable>
                    {item.reactions && item.reactions.length > 0 && (
                      <View style={styles.reactionsRow}>
                        {item.reactions.map((r) => {
                          const mineRx = !!user && r.users.includes(user.username);
                          return (
                            <TouchableOpacity key={r.emoji} style={[styles.reactionChip, mineRx && styles.reactionChipMine]}
                              onPress={async () => { try { const res = await api.toggleReaction(item.id, r.emoji); updateReactions(item.id, res.reactions); } catch {} }}>
                              <Text style={styles.reactionText}>{r.emoji} {r.count}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={<Text style={styles.empty}>Welcome to #{channelName}! Say hi ðŸ‘‹</Text>}
          />
        )}

        {typingLabel && <View style={styles.typingBar}><Text style={styles.typingText}>{typingLabel}</Text></View>}

        {replyTo && (
          <View style={styles.replyComposer}>
            <Text style={styles.replyComposerText} numberOfLines={1}>Replying to @{replyTo.username}: {replyTo.content}</Text>
            <TouchableOpacity onPress={() => setReplyTo(null)}><Text style={styles.replyClose}>âœ•</Text></TouchableOpacity>
          </View>
        )}

        {mentionSuggestions.length > 0 && (
          <View style={styles.mentionBox}>
            {mentionSuggestions.map((m) => (
              <TouchableOpacity key={m.id} onPress={() => setText((t) => t.replace(/@([a-zA-Z0-9_.-]*)$/, `@${m.username} `))} style={styles.mentionRow}>
                <Text style={styles.mentionName}>@{m.username}{m.nickname ? ` (${m.nickname})` : ''}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.composer}>
          <TouchableOpacity onPress={onPickImage} disabled={uploading} style={styles.attachBtn}>
            {uploading ? <ActivityIndicator color={colors.accent} size="small" /> : <Text style={styles.attachIcon}>+</Text>}
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder={`Message #${channelName}`}
            placeholderTextColor={colors.textDim}
            value={text}
            onChangeText={(v) => { setText(v); if (v) sendTyping(); }}
            multiline
            maxLength={4000}
          />
          <TouchableOpacity style={[styles.sendBtn, (!text.trim() || sending) && styles.sendBtnDisabled]} onPress={onSend} disabled={!text.trim() || sending}>
            <Text style={styles.sendText}>â†‘</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {sidebarOpen && (
        <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={() => setSidebarOpen(false)} />
      )}

      <Animated.View style={[styles.sidebarWrap, { transform: [{ translateX: sidebarAnim }] }]}>
        <ChannelSidebar
          servers={servers}
          activeServerId={serverId}
          activeChannelId={channelId}
          channels={channels}
          categories={categories}
          unread={unread}
          loading={serverLoading}
          myRole={myRole}
          serverName={serverName}
          onSelectServer={selectServer}
          onSelectChannel={(ch: any) => { setSidebarOpen(false); if (ch.id === channelId) return; if (ch.name.includes('voice')) { navigation.navigate('Voice', { channelId: ch.id, channelName: ch.name }); return; }
            if (ch.name.includes('voice')) navigation.navigate('Voice', { channelId: ch.id, channelName: ch.name });
            else navigation.replace('Chat', { serverId, channelId: ch.id, channelName: ch.name });;
          }}
          onHome={() => { setSidebarOpen(false); navigation.navigate('Dashboard'); }}
          onOpenFriends={() => { setSidebarOpen(false); navigation.navigate('Friends'); }}
          onOpenMembers={() => { setSidebarOpen(false); navigation.navigate('Members', { serverId, serverName }); }}
          onOpenServerSettings={() => { setSidebarOpen(false); navigation.navigate('ServerSettings', { serverId, serverName }); }}
          onOpenSettings={() => { setSidebarOpen(false); navigation.navigate('Settings'); }}
          onCreateChannel={async (name) => { await api.createChannel(serverId, name); loadServer(); }}
          onCreateCategory={async (name) => { await api.createCategory(serverId, name); loadServer(); }}
        />
      </Animated.View>

      <Modal visible={!!editing} transparent animationType="fade" onRequestClose={() => setEditing(null)}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit message</Text>
            <TextInput style={styles.modalInput} value={editText} onChangeText={setEditText} multiline autoFocus placeholderTextColor={colors.textDim} />
            <View style={styles.modalRow}>
              <TouchableOpacity onPress={() => setEditing(null)} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={onSaveEdit} style={styles.confirmBtn}><Text style={styles.confirmText}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!pickerFor} transparent animationType="fade" onRequestClose={() => setPickerFor(null)}>
        <Pressable style={styles.modalBg} onPress={() => setPickerFor(null)}>
          <View style={styles.pickerCard}>
            <View style={styles.pickerGrid}>
              {QUICK_REACTIONS.map((e) => (
                <TouchableOpacity key={e} style={styles.pickerEmoji} onPress={() => onReact(e)}>
                  <Text style={styles.pickerEmojiText}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 52, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  hamburger: { padding: 8, marginRight: 4 },
  hamburgerText: { color: colors.text, fontSize: 22 },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  headerSub: { color: colors.textDim, fontSize: 11, marginTop: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },

  messageRow: { flexDirection: 'row', marginBottom: 16 },
  avatarWrap: { position: 'relative', marginTop: 2 },
  messageAvatar: { width: 36, height: 36, borderRadius: 18 },
  messageAvatarFallback: { backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  messageAvatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  avatarStatus: { position: 'absolute', right: -2, bottom: -2, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: colors.bg },
  messageUsername: { color: colors.text, fontSize: 15, fontWeight: '700' },
  messageTime: { color: colors.textMuted, fontSize: 11 },
  pinFlag: { color: colors.accent, fontSize: 11 },
  messageContent: { color: colors.text, fontSize: 15, lineHeight: 21, marginTop: 2 },
  mention: { color: colors.accent, fontWeight: '700' },
  attachment: { width: 240, borderRadius: 10, marginTop: 6, marginBottom: 4, backgroundColor: '#000' },
  edited: { color: colors.textMuted, fontSize: 10, marginTop: 2, fontStyle: 'italic' },
  replyBox: { borderLeftWidth: 3, borderLeftColor: colors.accent, paddingLeft: 8, marginTop: 4, marginBottom: 2, opacity: 0.75 },
  replyAuthor: { color: colors.accent, fontSize: 11, fontWeight: '700' },
  replyContent: { color: colors.textDim, fontSize: 12 },
  reactionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  reactionChip: { backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: colors.border },
  reactionChipMine: { borderColor: colors.accent, backgroundColor: '#1e1a3a' },
  reactionText: { color: colors.text, fontSize: 12 },
  empty: { color: colors.textDim, textAlign: 'center', marginTop: 60, fontSize: 14 },

  typingBar: { paddingHorizontal: 20, paddingVertical: 4 },
  typingText: { color: colors.textDim, fontSize: 12, fontStyle: 'italic' },
  replyComposer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 6, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.card },
  replyComposerText: { flex: 1, color: colors.textDim, fontSize: 12 },
  replyClose: { color: colors.textDim, fontSize: 16, paddingLeft: 8 },
  mentionBox: { backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 12, paddingVertical: 4 },
  mentionRow: { paddingVertical: 8, paddingHorizontal: 8, borderRadius: 6 },
  mentionName: { color: colors.text },

  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg2 },
  attachBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  attachIcon: { color: colors.accent, fontSize: 22, fontWeight: '800', marginTop: -2 },
  input: { flex: 1, backgroundColor: colors.card, color: colors.text, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.border, maxHeight: 120 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.4 },
  sendText: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: -2 },

  sidebarWrap: { position: 'absolute', top: 0, bottom: 0, left: 0, width: SIDEBAR_WIDTH, backgroundColor: colors.bg2 },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: colors.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalInput: { backgroundColor: colors.bg, color: colors.text, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: colors.border, marginBottom: 16, minHeight: 80 },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 10 },
  cancelText: { color: colors.textDim },
  confirmBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.accent },
  confirmText: { color: '#fff', fontWeight: '700' },
  pickerCard: { backgroundColor: colors.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border },
  pickerGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  pickerEmoji: { padding: 12 },
  pickerEmojiText: { fontSize: 32 },
});