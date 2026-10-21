import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { Send, Hash, Wifi, WifiOff } from 'lucide-react-native';

export default function ChatScreen({ channelName = 'general' }: { channelName?: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setMessages([]); // Clear messages when switching channels
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';
    const wsUrl = apiUrl.replace('http', 'ws') + '/ws/chat';
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => setIsConnected(true);
    ws.current.onclose = () => setIsConnected(false);

    ws.current.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'chat' && data.message.channel_id === channelName) {
          setMessages((prev) => [...prev, data.message]);
          setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
        }
      } catch (err) {}
    };

    return () => { ws.current?.close(); };
  }, [channelName]);

  const sendMessage = () => {
    if (!input.trim() || !ws.current || !user) return;
    ws.current.send(JSON.stringify({
      type: 'chat',
      channelId: channelName,
      userId: user.id,
      content: input.trim()
    }));
    setInput('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Hash size={24} color={colors.textDim} />
          <Text style={styles.headerTitle}>{channelName}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {isConnected ? <Wifi size={16} color={colors.success} /> : <WifiOff size={16} color={colors.danger} />}
          <Text style={{ color: isConnected ? colors.success : colors.danger, fontSize: 12, marginLeft: 6, fontWeight: '600' }}>
            {isConnected ? 'Connected' : 'Reconnecting...'}
          </Text>
        </View>
      </View>
      
      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <View style={styles.messageRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.username?.[0]?.toUpperCase() || '?'}</Text>
            </View>
            <View style={styles.messageContent}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 }}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.timestamp}>
                  {new Date(item.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <Text style={styles.messageText}>{item.content}</Text>
            </View>
          </View>
        )}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={`Message #${channelName}`}
          placeholderTextColor={colors.textDim}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Send size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.bg2 },
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginLeft: 8 },
  messageRow: { flexDirection: 'row', marginBottom: 20 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  messageContent: { flex: 1 },
  username: { color: colors.text, fontSize: 15, fontWeight: '700', marginRight: 8 },
  timestamp: { color: colors.textMuted, fontSize: 11 },
  messageText: { color: colors.textDim, fontSize: 15, lineHeight: 22 },
  inputContainer: { flexDirection: 'row', padding: 16, backgroundColor: colors.bg2, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'center' },
  input: { flex: 1, backgroundColor: colors.bg3, borderRadius: 24, paddingHorizontal: 20, paddingVertical: 12, color: colors.text, fontSize: 15, borderWidth: 1, borderColor: colors.border },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
});