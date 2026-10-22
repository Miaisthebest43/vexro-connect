import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, Plus } from 'lucide-react-native';
import { colors } from '../theme/colors';

const CHATS = [
  { id: '1', name: 'Nova', preview: 'Sounds good! I\'ll be there.', time: '10:28 AM', active: true, color: colors.accent },
  { id: '2', name: 'Roblox Developers', preview: '✨ Apartment - 12 new messages', time: '5m', color: '#F0B232' },
  { id: '3', name: 'Creator Lounge', preview: '@Lunar: This is so cool!', time: '12m', color: '#23A559' },
  { id: '4', name: 'Alex, Riya, Nova', preview: 'Group chat • 4 new messages', time: '25m', color: '#9B59B6' },
  { id: '5', name: 'Lunar', preview: 'Check this out!', time: '1h', color: '#3498DB' },
  { id: '6', name: 'System', preview: 'Welcome to VEXRO!', time: '2h', color: colors.bg4, icon: 'S' },
];

export default function MessageList() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.newBtn}><Plus size={16} color="#fff" /></TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>All</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}><Text style={[styles.tabText, styles.tabTextActive]}>DMs</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Channels</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Communities</Text></TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <Search size={16} color={colors.textMuted} />
        <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor={colors.textMuted} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 8 }}>
        {CHATS.map((chat) => (
          <TouchableOpacity key={chat.id} style={[styles.chatItem, chat.active && styles.chatItemActive]}>
            <View style={[styles.avatar, { backgroundColor: chat.color }]}>
              <Text style={styles.avatarText}>{chat.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={[styles.chatName, chat.active && { color: '#fff' }]} numberOfLines={1}>{chat.name}</Text>
                <Text style={styles.chatTime}>{chat.time}</Text>
              </View>
              <Text style={[styles.chatPreview, chat.active && { color: colors.textDim }]} numberOfLines={1}>{chat.preview}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 280, backgroundColor: colors.bg, borderRightWidth: 1, borderRightColor: colors.border },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 24 },
  title: { color: colors.text, fontSize: 20, fontWeight: '700' },
  newBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center' },
  tabs: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  tab: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: colors.bg2 },
  tabActive: { backgroundColor: colors.accent },
  tabText: { color: colors.textDim, fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg2, marginHorizontal: 16, paddingHorizontal: 12, height: 36, borderRadius: 8, marginBottom: 16 },
  searchInput: { flex: 1, color: colors.text, fontSize: 13, marginLeft: 8 },
  chatItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 4 },
  chatItemActive: { backgroundColor: colors.bg3 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  chatName: { color: colors.textDim, fontSize: 14, fontWeight: '600' },
  chatTime: { color: colors.textMuted, fontSize: 11 },
  chatPreview: { color: colors.textMuted, fontSize: 12 },
});