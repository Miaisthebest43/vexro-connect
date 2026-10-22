import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Phone, Video, UserPlus, MoreHorizontal, Plus, Smile, Gift, Send } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export default function VexroChatScreen({ channelId = 'general' }: { channelId?: string }) {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const ws = useRef<WebSocket | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setLoading(true);
    // 1. Fetch History
    api.get(`/data/messages/${channelId}`)
      .then((res: any) => setMessages(res.messages))
      .catch(console.error)
      .finally(() => setLoading(false));

    // 2. Connect WebSocket
    const wsUrl = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001').replace('http', 'ws') + '/ws/chat';
    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'chat' && data.message.channel_id === channelId) {
        setMessages(prev => [...prev, data.message]);
        setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
      }
    };

    return () => ws.current?.close();
  }, [channelId]);

  const sendMessage = () => {
    if (!input.trim() || !ws.current || !user) return;
    ws.current.send(JSON.stringify({ type: 'chat', channelId, userId: user.id, content: input.trim() }));
    setInput('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.headerIcon}><Text style={styles.headerIconText}>#</Text></View>
          <Text style={styles.headerName}>{channelId}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <Phone size={20} color={colors.textDim} />
          <Video size={20} color={colors.textDim} />
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
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24 }}
          renderItem={({ item }) => {
            const isMe = item.username === user?.username;
            return (
              <View style={[styles.msgRow, isMe && { justifyContent: 'flex-end' }]}>
                {!isMe && <View style={styles.msgAvatar}><Text style={styles.msgAvatarText}>{item.username[0].toUpperCase()}</Text></View>}
                <View style={{ alignItems: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                  {!isMe && <Text style={styles.username}>{item.username}</Text>}
                  <View style={[styles.bubble, isMe ? styles.bubbleSent : styles.bubbleReceived]}>
                    <Text style={styles.msgText}>{item.content}</Text>
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
          placeholder={`Message #${channelId}`}
          placeholderTextColor={colors.textMuted}
          onSubmitEditing={sendMessage}
        />
        <View style={{ flexDirection: 'row', gap: 12, paddingRight: 16, alignItems: 'center' }}>
          <Gift size={20} color={colors.textDim} />
          <Smile size={20} color={colors.textDim} />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}><Send size={16} color="#fff" /></TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  headerIconText: { color: colors.textDim, fontSize: 16, fontWeight: '700' },
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