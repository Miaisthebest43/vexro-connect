import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Phone, Video, UserPlus, MoreHorizontal, Plus, Smile, Send, Gift, Hash } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export default function VexroChatScreen({ channelName = 'general', onStartCall }: { channelName?: string, onStartCall?: () => void }) {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const ws = useRef<WebSocket | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!user) return; // Don't fetch if not logged in

    setLoading(true);
    api.get(`/data/messages/${channelName}`)
      .then((res: any) => setMessages(res.messages))
      .catch(console.error)
      .finally(() => setLoading(false));

    const wsUrl = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001').replace('http', 'ws') + '/ws/chat';
    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'chat') {
        setMessages(prev => [...prev, data.message]);
        setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
      }
    };

    return () => ws.current?.close();
  }, [channelName, user]);

  const sendMessage = (content: string) => {
    if (!content.trim() || !ws.current || !user) return;
    ws.current.send(JSON.stringify({ type: 'chat', channelId: channelName, userId: user.id, content: content.trim() }));
    setInput('');
  };

  if (!user) return <View style={styles.center}><Text style={{ color: colors.textDim }}>Loading...</Text></View>;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Hash size={24} color={colors.textDim} style={{ marginRight: 8 }} />
          <Text style={styles.headerName}>{channelName}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <TouchableOpacity onPress={onStartCall}><Phone size={20} color={colors.textDim} /></TouchableOpacity>
          <TouchableOpacity onPress={onStartCall}><Video size={20} color={colors.textDim} /></TouchableOpacity>
          <UserPlus size={20} color={colors.textDim} />
          <MoreHorizontal size={20} color={colors.textDim} />
        </View>
      </View>

      {loading ? (
        <View style={styles.center}><Text style={{ color: colors.textDim }}>Loading history...</Text></View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={{ padding: 24 }}
          renderItem={({ item }) => {
            const isMe = item.username === user?.username;
            return (
              <View style={[styles.msgRow, isMe && { justifyContent: 'flex-end' }]}>
                {!isMe && <View style={styles.msgAvatar}><Text style={styles.msgAvatarText}>{item.username[0].toUpperCase()}</Text></View>}
                <View style={{ alignItems: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                  {!isMe && <Text style={styles.username}>{item.username}</Text>}
                  <View style={[styles.bubble, isMe ? styles.bubbleSent : styles.bubbleReceived]}>
                    {item.content.startsWith('http') && item.content.includes('.gif') ? (
                      <Image source={{ uri: item.content }} style={{ width: 200, height: 150, borderRadius: 8 }} />
                    ) : (
                      <Text style={styles.msgText}>{item.content}</Text>
                    )}
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachBtn}><Plus size={20} color={colors.textDim} /></TouchableOpacity>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={`Message #${channelName}`}
          placeholderTextColor={colors.textMuted}
          onSubmitEditing={() => sendMessage(input)}
        />
        <View style={{ flexDirection: 'row', gap: 12, paddingRight: 16, alignItems: 'center' }}>
          <Gift size={20} color={colors.textDim} />
          <Smile size={20} color={colors.textDim} />
          <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(input)}><Send size={16} color="#fff" /></TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerName: { color: colors.text, fontSize: 16, fontWeight: '700' },
  msgRow: { flexDirection: 'row', marginBottom: 20 },
  msgAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 4 },
  msgAvatarText: { color: colors.text, fontWeight: '700' },
  username: { color: colors.textDim, fontSize: 12, marginBottom: 4, marginLeft: 4 },
  bubble: { padding: 12, borderRadius: 16 },
  bubbleReceived: { backgroundColor: colors.bg2, borderTopLeftRadius: 4 },
  bubbleSent: { backgroundColor: colors.accent, borderTopRightRadius: 4 },
  msgText: { color: colors.text, fontSize: 14, lineHeight: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: colors.bg, margin: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  attachBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.bg2, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  input: { flex: 1, color: colors.text, fontSize: 14, paddingHorizontal: 12 },
  sendBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});