import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Modal, Pressable, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useChannel } from '../lib/useChannel';
import { api, uploadFile, absUrl, type Message, type Member } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import MemberSidebar from '../components/MemberSidebar';
import EmojiPicker from '../components/EmojiPicker';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export default function ChatScreen({ route, navigation }: Props) {
  const { serverId, channelId, channelName } = route.params;
  const { user } = useAuth();
  const { messages, connected, loading, typingUsers, sendTyping, updateReactions } = useChannel(channelId, user?.id);
  
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Message | null>(null);
  const [editText, setEditText] = useState('');
  const [pickerFor, setPickerFor] = useState<Message | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [pinsVisible, setPinsVisible] = useState(false);
  const [pins, setPins] = useState<{ id: string; content: string; created_at: string; username: string }[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [showMembers, setShowMembers] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!serverId) return;
      try {
        const { members } = await api.listMembers(serverId);
        if (!cancelled) setMembers(members);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [serverId]);

  const mentionQuery = useMemo(() => {
    const m = text.match(/@([a-zA-Z0-9_.-]*)$/);
    return m ? m[1] : null;
  }, [text]);

  const mentionSuggestions = useMemo(() => {
    if (mentionQuery === null) return [];
    const q = mentionQuery.toLowerCase();
    return members
      .filter((m) => m.id !== user?.id && (m.username.toLowerCase().startsWith(q) || (m.nickname ?? '').toLowerCase().startsWith(q)))
      .slice(0, 5);
  }, [mentionQuery, members, user?.id]);

  async function onSend() {
    const content = text.trim();
    if (!content || sending) return;
    setSending(true); setText('');
    const replyId = replyTo?.id;
    setReplyTo(null);
    try {
      await api.sendMessage(channelId, { content, reply_to_id: replyId });
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e: any) {
      Alert.alert('Failed', e.message);
      setText(content);
    } finally { setSending(false); }
  }

  async function onPickImage() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert('Permission needed'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85 });
    if (result.canceled) return;
    const asset = result.assets[0]!;
    setUploading(true);
    try {
      const uploaded = await uploadFile('/upload/attachment', asset.uri, asset.mimeType ?? 'image/jpeg');
      await api.sendMessage(channelId, {
        content: text.trim(),
        attachment_url: uploaded.url,
        attachment_type: 'image',
        attachment_width: asset.width ?? undefined,
        attachment_height: asset.height ?? undefined,
        reply_to_id: replyTo?.id,
      });
      setText(''); setReplyTo(null);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 200);
    } catch (e: any) { Alert.alert('Upload failed', e.message); }
    finally { setUploading(false); }
  }

  async function onPickFile() {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (res.canceled) return;
      const file = res.assets[0];
      setUploading(true);
      const uploaded = await uploadFile('/upload/attachment', file.uri, file.mimeType ?? 'application/octet-stream');
      await api.sendMessage(channelId, {
        content: text.trim(),
        attachment_url: uploaded.url,
        attachment_type: 'file',
      });
      setText('');
    } catch (e: any) { Alert.alert('Upload failed', e.message); }
    finally { setUploading(false); }
  }

  function onLongPress(msg: Message) {
    const mine = msg.author_id === user?.id;
    const opts: any[] = [
      { text: 'Reply', onPress: () => setReplyTo(msg) },
      { text: 'Reply in Thread', onPress: () => navigation.navigate('Thread', { channelId, parentId: msg.id, parentContent: msg.content }) },
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

  async function openPins() {
    try { const r = await api.listPins(channelId); setPins(r.pins); setPinsVisible(true); }
    catch (e: any) { Alert.alert('Failed', e.message); }
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

  const typingLabel = typingUsers.length === 0 ? null
    : typingUsers.length === 1 ? `${typingUsers[0].username} is typing…`
    : `${typingUsers.length} people are typing…`;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.mainCol}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></TouchableOpacity>
          <Text style={styles.title}>#{channelName}</Text>
          <TouchableOpacity onPress={() => setShowMembers(!showMembers)}><Text style={styles.headerBtn}>👥</Text></TouchableOpacity>
          <TouchableOpacity onPress={openPins}><Text style={styles.headerBtn}>Pins</Text></TouchableOpacity>
          <View style={[styles.dot, { backgroundColor: connected ? colors.success : colors.danger }]} />
        </View>

        {loading ? <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} /> : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ padding: 16 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            renderItem={({ item }) => {
              const mine = item.author_id === user?.id;
              const imgUrl = item.attachment_type === 'image' ? absUrl(item.attachment_url) : null;
              const fileUrl = item.attachment_type === 'file' ? absUrl(item.attachment_url) : null;
              const aspect = item.attachment_width && item.attachment_height ? item.attachment_width / item.attachment_height : 1.5;
              const display = item.display_name ?? item.username;
              return (
                <View style={[styles.msgRow, mine && styles.msgRowMine]}>
                  {item.pinned && <Text style={styles.pinFlag}>📌 pinned</Text>}
                  {item.reply_to && (
                    <View style={styles.replyBox}>
                      <Text style={styles.replyAuthor}>@{item.reply_to.username}</Text>
                      <Text style={styles.replyContent} numberOfLines={1}>{item.reply_to.content}</Text>
                    </View>
                  )}
                  <Pressable onLongPress={() => onLongPress(item)} delayLongPress={300} style={[styles.bubble, mine && styles.bubbleMine]}>
                    {!mine && (
                      <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: item.author_id })}>
                        <Text style={styles.author}>@{display}</Text>
                      </TouchableOpacity>
                    )}
                    {imgUrl && <Image source={{ uri: imgUrl }} style={[styles.attachment, { aspectRatio: aspect }]} resizeMode="cover" />}
                    {fileUrl && (
                      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg4, padding: 12, borderRadius: 8, marginBottom: 6 }}>
                        <Text style={{ fontSize: 24, marginRight: 8 }}>📎</Text>
                        <Text style={{ color: colors.text, textDecorationLine: 'underline' }} numberOfLines={1}>Download File</Text>
                      </TouchableOpacity>
                    )}
                    {item.content ? <Text style={styles.content}>{renderContent(item.content)}</Text> : null}
                    {item.edited_at && <Text style={styles.edited}>(edited)</Text>}
                  </Pressable>
                  {item.reactions && item.reactions.length > 0 && (
                    <View style={styles.reactionsRow}>
                      {(item.reactions || []).map((r) => {
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
              );
            }}
            ListEmptyComponent={<Text style={styles.empty}>No messages yet. Say hi 👋</Text>}
          />
        )}

        {typingLabel && <View style={styles.typingBar}><Text style={styles.typingText}>{typingLabel}</Text></View>}

        {replyTo && (
          <View style={styles.replyComposer}>
            <Text style={styles.replyComposerText} numberOfLines={1}>Replying to @{replyTo.username}: {replyTo.content}</Text>
            <TouchableOpacity onPress={() => setReplyTo(null)}><Text style={styles.replyClose}>✕</Text></TouchableOpacity>
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
            {uploading ? <ActivityIndicator color={colors.accent} size="small" /> : <Text style={styles.attachIcon}>🖼️</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={onPickFile} disabled={uploading} style={styles.attachBtn}>
            <Text style={styles.attachIcon}>📎</Text>
          </TouchableOpacity>
          <TextInput style={styles.input} placeholder={`Message #${channelName}`} placeholderTextColor={colors.textDim}
            value={text} onChangeText={(v) => { setText(v); if (v) sendTyping(); }} multiline maxLength={4000} />
          <TouchableOpacity style={[styles.sendBtn, (!text.trim() || sending) && styles.sendBtnDisabled]} onPress={onSend} disabled={!text.trim() || sending}>
            <Text style={styles.sendText}>↑</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showMembers && serverId && <MemberSidebar serverId={serverId} onClose={() => setShowMembers(false)} />}

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

      <EmojiPicker
        visible={!!pickerFor}
        onClose={() => setPickerFor(null)}
        onSelect={async (emoji) => {
          if (pickerFor) {
            try {
              const res = await api.toggleReaction(pickerFor.id, emoji);
              updateReactions(pickerFor.id, res.reactions);
            } catch {}
            setPickerFor(null);
          }
        }}
      />

      <Modal visible={pinsVisible} transparent animationType="slide" onRequestClose={() => setPinsVisible(false)}>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { maxHeight: '70%' }]}>
            <Text style={styles.modalTitle}>Pinned messages</Text>
            <FlatList
              data={pins}
              keyExtractor={(p) => p.id}
              ListEmptyComponent={<Text style={styles.empty}>No pins yet.</Text>}
              renderItem={({ item }) => (
                <View style={styles.pinRow}>
                  <Text style={styles.pinAuthor}>@{item.username}</Text>
                  <Text style={styles.pinContent} numberOfLines={2}>{item.content}</Text>
                </View>
              )}
            />
            <TouchableOpacity onPress={() => setPinsVisible(false)} style={[styles.confirmBtn, { marginTop: 12 }]}>
              <Text style={styles.confirmText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: colors.bg },
  mainCol: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { color: colors.accent, fontSize: 24, width: 30 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700', flex: 1 },
  headerBtn: { color: colors.accent, fontSize: 14, marginRight: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  msgRow: { marginBottom: 12, alignItems: 'flex-start' },
  msgRowMine: { alignItems: 'flex-end' },
  pinFlag: { color: colors.accent, fontSize: 10, marginBottom: 2 },
  bubble: { backgroundColor: colors.card, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, maxWidth: '80%', borderWidth: 1, borderColor: colors.border },
  bubbleMine: { backgroundColor: colors.accent, borderColor: colors.accent },
  author: { color: colors.accent, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  content: { color: colors.text, fontSize: 15, lineHeight: 20 },
  mention: { color: colors.accent, fontWeight: '700' },
  attachment: { width: 220, borderRadius: 10, marginBottom: 6, backgroundColor: '#000' },
  edited: { color: colors.textDim, fontSize: 10, marginTop: 4, fontStyle: 'italic' },
  replyBox: { borderLeftWidth: 3, borderLeftColor: colors.accent, paddingLeft: 8, marginBottom: 4, opacity: 0.7, maxWidth: '80%' },
  replyAuthor: { color: colors.accent, fontSize: 11, fontWeight: '700' },
  replyContent: { color: colors.textDim, fontSize: 12 },
  reactionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  reactionChip: { backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: colors.border },
  reactionChipMine: { borderColor: colors.accent, backgroundColor: '#1e1a3a' },
  reactionText: { color: colors.text, fontSize: 13 },
  empty: { color: colors.textDim, textAlign: 'center', marginTop: 40 },
  typingBar: { paddingHorizontal: 20, paddingVertical: 6 },
  typingText: { color: colors.textDim, fontSize: 12, fontStyle: 'italic' },
  replyComposer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.card },
  replyComposerText: { flex: 1, color: colors.textDim, fontSize: 12 },
  replyClose: { color: colors.textDim, fontSize: 16, paddingLeft: 8 },
  mentionBox: { backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 12, paddingVertical: 6 },
  mentionRow: { paddingVertical: 8, paddingHorizontal: 8, borderRadius: 6 },
  mentionName: { color: colors.text },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: colors.border },
  attachBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  attachIcon: { fontSize: 20 },
  input: { flex: 1, backgroundColor: colors.card, color: colors.text, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 20, borderWidth: 1, borderColor: colors.border, maxHeight: 120 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.4 },
  sendText: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: -2 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: colors.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalInput: { backgroundColor: colors.bg, color: colors.text, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: colors.border, marginBottom: 16, minHeight: 80 },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 10 },
  cancelText: { color: colors.textDim },
  confirmBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.accent, alignItems: 'center' },
  confirmText: { color: '#fff', fontWeight: '700' },
  pinRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  pinAuthor: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  pinContent: { color: colors.text, fontSize: 14, marginTop: 4 },
});