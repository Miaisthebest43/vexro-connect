import React, { useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useChannel } from '../lib/useChannel';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export default function ChatScreen({ route, navigation }: Props) {
  const { channelId, channelName } = route.params;
  const { user } = useAuth();
  const { messages, connected, loading } = useChannel(channelId);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  async function onSend() {
    const content = text.trim();
    if (!content || sending) return;
    setSending(true);
    setText('');
    try {
      await api.sendMessage(channelId, content);
      // message will arrive via WS, but scroll anyway
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e: any) {
      Alert.alert('Failed to send', e.message);
      setText(content);
    } finally {
      setSending(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>â€¹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>#{channelName}</Text>
        <View style={[styles.dot, { backgroundColor: connected ? colors.success : colors.danger }]} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 16 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => {
            const mine = item.author_id === user?.id;
            return (
              <View style={[styles.msgRow, mine && styles.msgRowMine]}>
                <View style={[styles.bubble, mine && styles.bubbleMine]}>
                  {!mine && <Text style={styles.author}>@{item.username}</Text>}
                  <Text style={styles.content}>{item.content}</Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.empty}>No messages yet. Say hi ðŸ‘‹</Text>
          }
        />
      )}

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder={`Message #${channelName}`}
          placeholderTextColor={colors.textDim}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={4000}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!text.trim() || sending) && styles.sendBtnDisabled]}
          onPress={onSend}
          disabled={!text.trim() || sending}
        >
          <Text style={styles.sendText}>â†‘</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 60, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  back: { color: colors.accent, fontSize: 24, width: 30 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700', flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  msgRow: { marginBottom: 8, alignItems: 'flex-start' },
  msgRowMine: { alignItems: 'flex-end' },
  bubble: {
    backgroundColor: colors.card, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 14, maxWidth: '80%', borderWidth: 1, borderColor: colors.border,
  },
  bubbleMine: { backgroundColor: colors.accent, borderColor: colors.accent },
  author: { color: colors.accent, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  content: { color: colors.text, fontSize: 15, lineHeight: 20 },
  empty: { color: colors.textDim, textAlign: 'center', marginTop: 40 },
  composer: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    padding: 12, borderTopWidth: 1, borderTopColor: colors.border,
  },
  input: {
    flex: 1, backgroundColor: colors.card, color: colors.text,
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 20,
    borderWidth: 1, borderColor: colors.border, maxHeight: 120,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendText: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: -2 },
});