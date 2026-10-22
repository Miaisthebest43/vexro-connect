import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { Send, Hash, Phone, Video, Pin, UserPlus, Search, Gift, Sticker, Smile, MoreHorizontal } from 'lucide-react-native';
import { colors } from '../theme/colors';
import ProfileSidebar from '../components/ProfileSidebar';
import { useAuth } from '../context/AuthContext';

export default function ChatScreen({ channelName = 'general', isDM = false, dmUser = null }: { channelName?: string, isDM?: boolean, dmUser?: any }) {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const showProfile = width > 1000 && isDM && dmUser;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { id: '1', user: 'FairyTales', text: 'Hey! Welcome to VEXRO.', time: '11:54 AM' },
    { id: '2', user: 'FairyTales', text: 'This is going to be huge.', time: '11:55 AM' },
  ]);
  const flatListRef = useRef<FlatList>(null);

  // If we had a real WebSocket, it would connect here. For now, mock it.
  const sendMessage = () => {
    if (!input.trim() || !user) return;
    const newMsg = { id: Date.now().toString(), user: user.username, text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        
        {/* Main Chat Area */}
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {isDM ? (
                <View style={[styles.avatar, { width: 24, height: 24, backgroundColor: dmUser?.color || colors.accent, marginRight: 8 }]}><Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{dmUser?.name[0]}</Text></View>
              ) : (
                <Hash size={24} color={colors.textMuted} style={{ marginRight: 8 }} />
              )}
              <Text style={styles.headerTitle}>{isDM ? dmUser?.name : channelName}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Phone size={20} color={colors.textDim} />
              <Video size={20} color={colors.textDim} />
              <Pin size={20} color={colors.textDim} />
              <UserPlus size={20} color={colors.textDim} />
              <Search size={20} color={colors.textDim} />
            </View>
          </View>
          
          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <View style={styles.messageRow}>
                <View style={styles.msgAvatar}><Text style={styles.msgAvatarText}>{item.user[0]}</Text></View>
                <View style={styles.messageContent}>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 }}>
                    <Text style={styles.username}>{item.user}</Text>
                    <Text style={styles.timestamp}>{item.time}</Text>
                  </View>
                  <Text style={styles.messageText}>{item.text}</Text>
                </View>
              </View>
            )}
          />

          {/* Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachBtn}><Text style={{ color: colors.textDim, fontSize: 24 }}>+</Text></TouchableOpacity>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder={`Message ${isDM ? `@${dmUser?.name}` : `#${channelName}`}`}
              placeholderTextColor={colors.textMuted}
              onSubmitEditing={sendMessage}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingRight: 12 }}>
              <Gift size={20} color={colors.textDim} />
              <Sticker size={20} color={colors.textDim} />
              <Smile size={20} color={colors.textDim} />
            </View>
          </View>
        </View>

        {/* Right Profile Sidebar (Only on DM) */}
        {showProfile && (
          <View style={{ width: 340 }}>
            <ProfileSidebar user={dmUser} />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  messageRow: { flexDirection: 'row', marginBottom: 20 },
  msgAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  msgAvatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  messageContent: { flex: 1 },
  username: { color: colors.text, fontSize: 15, fontWeight: '700', marginRight: 8 },
  timestamp: { color: colors.textMuted, fontSize: 11 },
  messageText: { color: colors.textDim, fontSize: 15, lineHeight: 22 },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: colors.bg, alignItems: 'center' },
  attachBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.bg2, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  input: { flex: 1, backgroundColor: colors.bg2, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, color: colors.text, fontSize: 15 },
});