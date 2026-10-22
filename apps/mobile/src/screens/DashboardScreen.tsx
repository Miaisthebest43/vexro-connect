import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useWindowDimensions } from 'react-native';
import { Users, UserPlus, Search, MessageSquare, MoreVertical, Gamepad2, Mic } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const FRIENDS = [
  { id: '1', name: 'apollogaming_yt', status: 'Online', activity: 'Rocket League', color: colors.accent },
  { id: '2', name: 'EzzY_539', status: 'Online', activity: 'Grand Theft Auto Online', color: colors.secondary },
  { id: '3', name: 'Falm', status: 'Online', activity: 'Roblox with Medal', color: colors.warning },
  { id: '4', name: 'Hope', status: 'Online', activity: 'To be or not to be?', color: colors.danger },
  { id: '5', name: 'Kaleb', status: 'Online', activity: 'Playing Valorant', color: colors.accentDim },
];

const ACTIVE_NOW = [
  { id: '1', name: 'gravy', activity: 'Rocket League - 40m', color: colors.accent },
  { id: '2', name: 'gsoul crew', activity: 'chill', color: colors.warning },
  { id: '3', name: 'Rocket League', activity: '2 People', color: colors.secondary },
  { id: '4', name: 'Undead-Ghost', activity: 'VR Chat - 1h', color: colors.danger },
];

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const showActiveNow = width > 1000; // Hide active now column on smaller screens

  return (
    <View style={styles.container}>
      {/* Main Left Area */}
      <View style={styles.mainArea}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Users size={24} color={colors.textDim} />
            <Text style={styles.headerTitle}>Friends</Text>
            <View style={styles.dividerVertical} />
            <TouchableOpacity style={[styles.tab, styles.tabActive]}><Text style={[styles.tabText, styles.tabTextActive]}>Online</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>All</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Pending</Text></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addFriendBtn}>
            <Text style={styles.addFriendText}>Add Friend</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor={colors.textMuted} />
            <Search size={18} color={colors.textMuted} />
          </View>
        </View>

        {/* Friends List */}
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={styles.sectionTitle}>Online — {FRIENDS.length}</Text>
          
          {FRIENDS.map((friend) => (
            <TouchableOpacity key={friend.id} style={styles.friendRow}>
              <View style={styles.avatarWrap}>
                <View style={[styles.avatar, { backgroundColor: friend.color }]}>
                  <Text style={styles.avatarText}>{friend.name[0].toUpperCase()}</Text>
                </View>
                <View style={styles.statusDot} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.friendName}>{friend.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <Gamepad2 size={14} color={colors.textMuted} style={{ marginRight: 4 }} />
                  <Text style={styles.friendActivity}>{friend.activity}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn}><MessageSquare size={20} color={colors.textDim} /></TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}><MoreVertical size={20} color={colors.textDim} /></TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Right Sidebar (Active Now) */}
      {showActiveNow && (
        <View style={styles.activeNowArea}>
          <Text style={styles.activeNowTitle}>Active Now</Text>
          <ScrollView>
            {ACTIVE_NOW.map((user) => (
              <View key={user.id} style={styles.activeCard}>
                <View style={styles.activeHeader}>
                  <View style={[styles.avatar, { width: 32, height: 32, backgroundColor: user.color }]}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{user.name[0].toUpperCase()}</Text>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.activeName}>{user.name}</Text>
                    <Text style={styles.activeActivity}>{user.activity}</Text>
                  </View>
                </View>
                {/* Fake Game Art / Voice Channel Card */}
                <View style={styles.activeCardBody}>
                  <Gamepad2 size={32} color="rgba(255,255,255,0.2)" />
                  <View style={styles.activeCardFooter}>
                    <Text style={{ color: colors.textDim, fontSize: 12 }}>Playing a game</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: colors.bg },
  mainArea: { flex: 1, backgroundColor: colors.bg },
  
  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginLeft: 8 },
  dividerVertical: { width: 1, height: 24, backgroundColor: colors.border, marginHorizontal: 12 },
  tabs: { flexDirection: 'row' },
  tab: { paddingVertical: 4, paddingHorizontal: 8, marginRight: 8, borderRadius: 4 },
  tabActive: { backgroundColor: colors.bg3 },
  tabText: { color: colors.textDim, fontSize: 14, fontWeight: '500' },
  tabTextActive: { color: colors.text, fontWeight: '600' },
  addFriendBtn: { backgroundColor: colors.success, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4 },
  addFriendText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  // Search
  searchContainer: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1F22', borderRadius: 4, paddingHorizontal: 10, height: 32 },
  searchInput: { flex: 1, color: colors.text, fontSize: 14, paddingVertical: 0 },

  // Friends List
  sectionTitle: { color: colors.textDim, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 12 },
  friendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  avatarWrap: { position: 'relative', marginRight: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  statusDot: { position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.success, borderWidth: 3, borderColor: colors.bg },
  friendName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  friendActivity: { color: colors.textDim, fontSize: 13 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center' },

  // Active Now Right Sidebar
  activeNowArea: { width: 340, backgroundColor: colors.bg, borderLeftWidth: 1, borderLeftColor: colors.border, padding: 16 },
  activeNowTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 16 },
  activeCard: { backgroundColor: '#1E1F22', borderRadius: 8, overflow: 'hidden', marginBottom: 16 },
  activeHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: colors.bg2 },
  activeName: { color: colors.text, fontSize: 14, fontWeight: '600' },
  activeActivity: { color: colors.textDim, fontSize: 12 },
  activeCardBody: { height: 120, backgroundColor: '#111214', alignItems: 'center', justifyContent: 'center', padding: 12 },
  activeCardFooter: { position: 'absolute', bottom: 8, left: 8 },
});