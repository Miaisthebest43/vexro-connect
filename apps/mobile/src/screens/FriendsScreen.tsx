import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useWindowDimensions } from 'react-native';
import { Users, UserPlus, Search, MessageSquare, MoreVertical, Gamepad2, X } from 'lucide-react-native';
import { colors } from '../theme/colors';

const FRIENDS = [
  { id: '1', name: '>_< ♡', status: 'im sorry', color: '#808080' },
  { id: '2', name: 'apollogaming_yt', status: 'Rocket League', color: '#5865F2' },
  { id: '3', name: 'EzzY_539', status: 'Grand Theft Auto Online', color: '#23A559' },
  { id: '4', name: 'Falm', status: 'Roblox with Medal', color: '#F0B232' },
  { id: '5', name: 'Hope', status: 'To be or not to be?', color: '#DA373C' },
];

const PENDING = [
  { id: '1', name: '! zenix', status: 'zenixbuilds', color: '#808080' },
  { id: '2', name: '0_0', status: 'catilogi', color: '#808080' },
  { id: '3', name: 'Ace', status: 'ace134120', color: '#5865F2' },
];

const ACTIVE_NOW = [
  { id: '1', name: 'gravy', activity: 'Rocket League - 42m', color: '#5865F2' },
  { id: '2', name: 'gsoul crew', activity: 'chill', color: '#DA373C' },
  { id: '3', name: 'Rocket League', activity: '2 People', color: '#23A559' },
];

export default function FriendsScreen() {
  const { width } = useWindowDimensions();
  const showActiveNow = width > 1000;
  const [activeTab, setActiveTab] = useState<'online' | 'all' | 'pending' | 'add'>('online');

  const renderContent = () => {
    if (activeTab === 'add') {
      return (
        <View style={{ padding: 24 }}>
          <Text style={styles.addFriendTitle}>Add Friend</Text>
          <Text style={styles.addFriendDesc}>You can add friends with their Discord username.</Text>
          <View style={styles.addInputWrap}>
            <TextInput style={styles.addInput} placeholder="Enter a username" placeholderTextColor={colors.textMuted} />
            <TouchableOpacity style={styles.sendBtn}><Text style={styles.sendBtnText}>Send Friend Request</Text></TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.addFriendTitle}>Other Places to Make Friends</Text>
          <Text style={styles.addFriendDesc}>Don't have a username on hand? Check out our list of public servers.</Text>
          <TouchableOpacity style={styles.exploreBtn}>
            <Gamepad2 size={20} color="#fff" />
            <Text style={styles.exploreBtnText}>Explore Discoverable Servers</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (activeTab === 'pending') {
      return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={styles.sectionTitle}>Sent — 3</Text>
          {PENDING.map((user) => (
            <View key={user.id} style={styles.friendRow}>
              <View style={[styles.avatar, { backgroundColor: user.color }]}><Text style={styles.avatarText}>{user.name[0]}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.friendName}>{user.name}</Text>
                <Text style={styles.friendActivity}>{user.status}</Text>
              </View>
              <TouchableOpacity style={styles.actionBtn}><X size={20} color={colors.textDim} /></TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      );
    }

    return (
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>{activeTab === 'online' ? 'Online' : 'All Friends'} — {FRIENDS.length}</Text>
        {FRIENDS.map((friend) => (
          <TouchableOpacity key={friend.id} style={styles.friendRow}>
            <View style={styles.avatarWrap}>
              <View style={[styles.avatar, { backgroundColor: friend.color }]}><Text style={styles.avatarText}>{friend.name[0]}</Text></View>
              <View style={styles.statusDot} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendActivity}>{friend.status}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn}><MessageSquare size={20} color={colors.textDim} /></TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}><MoreVertical size={20} color={colors.textDim} /></TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainArea}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Users size={24} color={colors.textMuted} />
            <Text style={styles.headerTitle}>Friends</Text>
            <View style={styles.dividerVertical} />
            
            <TouchableOpacity onPress={() => setActiveTab('online')} style={[styles.tab, activeTab === 'online' && styles.tabActive]}><Text style={[styles.tabText, activeTab === 'online' && styles.tabTextActive]}>Online</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('all')} style={[styles.tab, activeTab === 'all' && styles.tabActive]}><Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>All</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('pending')} style={[styles.tab, activeTab === 'pending' && styles.tabActive]}><Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>Pending</Text></TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.tab, activeTab === 'add' && styles.tabActive]} onPress={() => setActiveTab('add')}>
            <Text style={[styles.tabText, activeTab === 'add' && { color: colors.text }]}>Add Friend</Text>
          </TouchableOpacity>
        </View>
        
        {activeTab !== 'add' && (
          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor={colors.textMuted} />
              <Search size={16} color={colors.textMuted} />
            </View>
          </View>
        )}

        {renderContent()}
      </View>

      {showActiveNow && (
        <View style={styles.activeNowArea}>
          <Text style={styles.activeNowTitle}>Active Now</Text>
          {ACTIVE_NOW.map((user) => (
            <View key={user.id} style={styles.activeCard}>
              <View style={styles.activeHeader}>
                <View style={[styles.avatar, { width: 32, height: 32, backgroundColor: user.color }]}><Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{user.name[0]}</Text></View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.activeName}>{user.name}</Text>
                  <Text style={styles.activeActivity}>{user.activity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: colors.bg },
  mainArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginLeft: 8 },
  dividerVertical: { width: 1, height: 24, backgroundColor: colors.border, marginHorizontal: 12 },
  tabs: { flexDirection: 'row' },
  tab: { paddingVertical: 4, paddingHorizontal: 8, marginRight: 8, borderRadius: 4 },
  tabActive: { backgroundColor: '#404249' },
  tabText: { color: colors.textDim, fontSize: 14, fontWeight: '500' },
  tabTextActive: { color: colors.text, fontWeight: '600' },
  
  searchContainer: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg3, borderRadius: 4, paddingHorizontal: 10, height: 30 },
  searchInput: { flex: 1, color: colors.text, fontSize: 14, paddingVertical: 0 },

  sectionTitle: { color: colors.textDim, fontSize: 12, fontWeight: '700', marginBottom: 12 },
  friendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  avatarWrap: { position: 'relative', marginRight: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  statusDot: { position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.success, borderWidth: 3, borderColor: colors.bg },
  friendName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  friendActivity: { color: colors.textDim, fontSize: 13 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bg2, alignItems: 'center', justifyContent: 'center' },

  addFriendTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  addFriendDesc: { color: colors.textDim, fontSize: 14, marginBottom: 16 },
  addInputWrap: { flexDirection: 'row', backgroundColor: colors.bg3, borderRadius: 8, padding: 4 },
  addInput: { flex: 1, color: colors.text, paddingHorizontal: 12 },
  sendBtn: { backgroundColor: colors.accent, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 4 },
  sendBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 24 },
  exploreBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg2, padding: 12, borderRadius: 8, marginTop: 8 },
  exploreBtnText: { color: colors.text, fontSize: 14, fontWeight: '600', marginLeft: 12 },

  activeNowArea: { width: 340, backgroundColor: colors.bg, borderLeftWidth: 1, borderLeftColor: colors.border, padding: 16 },
  activeNowTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 16 },
  activeCard: { backgroundColor: colors.bg2, borderRadius: 8, overflow: 'hidden', marginBottom: 16, padding: 12 },
  activeHeader: { flexDirection: 'row', alignItems: 'center' },
  activeName: { color: colors.text, fontSize: 14, fontWeight: '600' },
  activeActivity: { color: colors.textDim, fontSize: 12 },
});