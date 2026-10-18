import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { api, type Message } from '../lib/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Thread'>;

export default function ThreadScreen({ route, navigation }: Props) {
  const { channelId, parentId, parentContent } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getThread(channelId, parentId);
        setMessages(Array.isArray(res.messages) ? res.messages : []);
      } catch {}
      finally { setLoading(false); }
    })();
  }, [channelId, parentId]);

  async function onSend() {
    if (!text.trim()) return;
    try {
      const res = await api.sendMessage(channelId, { content: text.trim(), parent_message_id: parentId });
      setMessages(prev => [...(Array.isArray(prev) ? prev : []), res.message]);
      setText('');
    } catch {}
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></TouchableOpacity>
        <Text style={styles.title}>Thread</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.parentBox}>
        <Text style={styles.parentLabel}>Replying to thread</Text>
        <Text style={styles.parentContent} numberOfLines={2}>{parentContent}</Text>
      </View>

      {loading ? <ActivityIndicator color={colors.accent} /> : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          contentContainerStyle={{ padding: 16 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd()}
          renderItem={({ item }) => (
            <View style={styles.msgRow}>
              <Text style={styles.author}>@{item.username}</Text>
              <Text style={styles.content}>{item.content}</Text>
            </View>
          )}
        />
      )}

      <View style={styles.composer}>
        <TextInput style={styles.input} placeholder="Reply in thread..." placeholderTextColor={colors.textDim} value={text} onChangeText={setText} />
        <TouchableOpacity style={styles.sendBtn} onPress={onSend}><Text style={styles.sendText}>↑</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { color: colors.accent, fontSize: 24, width: 30 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  parentBox: { padding: 16, backgroundColor: colors.bg2, borderBottomWidth: 1, borderBottomColor: colors.border },
  parentLabel: { color: colors.accent, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  parentContent: { color: colors.textDim, fontStyle: 'italic' },
  msgRow: { marginBottom: 12 },
  author: { color: colors.text, fontWeight: '700', fontSize: 13, marginBottom: 2 },
  content: { color: colors.text, fontSize: 15 },
  composer: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, backgroundColor: colors.bg2, color: colors.text, padding: 12, borderRadius: 20, marginRight: 8 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: '#fff', fontSize: 20, fontWeight: '800' },
});