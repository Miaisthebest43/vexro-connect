import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Phone, Video, UserPlus, MoreHorizontal, Plus, Smile, Gift, Send, FileText } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function VexroChatScreen() {
  const [input, setInput] = useState('');

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.headerAvatar}><Text style={styles.headerAvatarText}>N</Text></View>
          <View>
            <Text style={styles.headerName}>Nova</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <Phone size={20} color={colors.textDim} />
          <Video size={20} color={colors.textDim} />
          <UserPlus size={20} color={colors.textDim} />
          <MoreHorizontal size={20} color={colors.textDim} />
        </View>
      </View>

      <FlatList
        data={[
          { id: '1', type: 'received', text: 'Hey! Are you still coming to the game night tonight? 🎮', time: '10:25 AM' },
          { id: '2', type: 'sent', text: 'Yes! I\'ll be there. Just finishing up some real quick.', time: '10:26 AM' },
          { id: '3', type: 'received', text: 'Perfect. We\'ve saved a spot for you.', time: '10:27 AM' },
          { id: '4', type: 'attachment', time: '10:29 AM' },
          { id: '5', type: 'received', text: 'Sounds good! I\'ll be there. 🎮', time: '10:30 AM' },
        ]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        renderItem={({ item }) => {
          if (item.type === 'received') {
            return (
              <View style={styles.msgRow}>
                <View style={styles.msgAvatar}><Text style={styles.msgAvatarText}>N</Text></View>
                <View>
                  <Text style={styles.timestamp}>{item.time}</Text>
                  <View style={[styles.bubble, styles.bubbleReceived]}>
                    <Text style={styles.msgText}>{item.text}</Text>
                  </View>
                </View>
              </View>
            );
          }
          if (item.type === 'sent') {
            return (
              <View style={[styles.msgRow, { justifyContent: 'flex-end' }]}>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.timestamp}>{item.time}</Text>
                  <View style={[styles.bubble, styles.bubbleSent]}>
                    <Text style={styles.msgText}>{item.text}</Text>
                  </View>
                </View>
              </View>
            );
          }
          if (item.type === 'attachment') {
            return (
              <View style={[styles.msgRow, { marginLeft: 48 }]}>
                <View style={styles.attachmentCard}>
                  <View style={styles.attachmentThumb}>
                    <Text style={{ fontSize: 32 }}>🎮</Text>
                  </View>
                  <View style={{ padding: 12, flex: 1 }}>
                    <Text style={styles.fileName}>game-night-plan.pdf</Text>
                    <Text style={styles.fileSize}>2.4 MB • PDF</Text>
                  </View>
                </View>
              </View>
            );
          }
          return null;
        }}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachBtn}><Plus size={20} color={colors.textDim} /></TouchableOpacity>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
        />
        <View style={{ flexDirection: 'row', gap: 12, paddingRight: 16 }}>
          <Gift size={20} color={colors.textDim} />
          <Smile size={20} color={colors.textDim} />
          <TouchableOpacity style={styles.sendBtn}><Send size={16} color="#fff" /></TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.bg },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  headerAvatarText: { color: '#fff', fontWeight: '700' },
  headerName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  headerStatus: { color: colors.success, fontSize: 12 },
  
  msgRow: { flexDirection: 'row', marginBottom: 20 },
  msgAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  msgAvatarText: { color: colors.text, fontWeight: '700' },
  timestamp: { color: colors.textMuted, fontSize: 11, marginBottom: 4, marginHorizontal: 4 },
  bubble: { padding: 12, borderRadius: 16 },
  bubbleReceived: { backgroundColor: colors.bg3, borderTopLeftRadius: 4 },
  bubbleSent: { backgroundColor: colors.accent, borderTopRightRadius: 4 },
  msgText: { color: colors.text, fontSize: 14, lineHeight: 20 },

  attachmentCard: { flexDirection: 'row', backgroundColor: colors.bg2, borderRadius: 12, overflow: 'hidden', width: 280, borderWidth: 1, borderColor: colors.border },
  attachmentThumb: { width: 80, backgroundColor: '#1A1D27', alignItems: 'center', justifyContent: 'center' },
  fileName: { color: colors.text, fontSize: 14, fontWeight: '600' },
  fileSize: { color: colors.textDim, fontSize: 12, marginTop: 4 },

  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border, margin: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  attachBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.bg2, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  input: { flex: 1, color: colors.text, fontSize: 14, paddingHorizontal: 12 },
  sendBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});