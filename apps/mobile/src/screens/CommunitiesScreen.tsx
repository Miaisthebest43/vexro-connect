import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useWindowDimensions } from 'react-native';
import { Search, Bell, HelpCircle, Plus, Users, Globe } from 'lucide-react-native';
import { colors } from '../theme/colors';

const CATEGORIES = ['All', 'Gaming', 'Creators', 'Development', 'Education', 'Other'];

const COMMUNITIES = [
  { id: '1', name: 'Roblox Developers', desc: 'Build, learn, and create amazing experiences together.', members: 128, online: 24, color: '#3498DB', icon: 'R' },
  { id: '2', name: 'Creator Lounge', desc: 'For creators, streamers, and content makers.', members: 56, online: 16, color: '#9B59B6', icon: 'C' },
  { id: '3', name: 'VEXRO Beta', desc: 'Be part of the VEXRO journey. Get early access and updates.', members: 24, online: 12, color: '#00BCD4', icon: 'V' },
  { id: '4', name: 'Game Night', desc: 'Casual games, good vibes, new friends.', members: 64, online: 18, color: '#E91E63', icon: 'G' },
  { id: '5', name: 'Dev Community', desc: 'Code, build, share, grow.', members: 102, online: 28, color: '#6A5CFF', icon: 'D' },
  { id: '6', name: 'Anime & Chill', desc: 'Talk anime, share art, and hang out.', members: 91, online: 22, color: '#FF5722', icon: 'A' },
];

export default function CommunitiesScreen() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState('All');
  
  // Calculate card width for the grid (2 columns on desktop, 1 on mobile)
  const isMobile = width < 768;
  const cardWidth = isMobile ? '100%' : '48%';

  return (
    <View style={styles.container}>
      {/* Top Nav */}
      <View style={styles.topNav}>
        <View style={styles.searchBar}>
          <Search size={16} color={colors.textMuted} />
          <TextInput style={styles.searchInput} placeholder="Search communities..." placeholderTextColor={colors.textMuted} />
        </View>
        <View style={styles.topIcons}>
          <Bell size={20} color={colors.textDim} style={{ marginRight: 16 }} />
          <HelpCircle size={20} color={colors.textDim} style={{ marginRight: 16 }} />
          <View style={styles.plusBtn}><Plus size={16} color="#fff" /></View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Communities</Text>
          <Text style={styles.subtitle}>Find your people. Join the conversation.</Text>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsRow}>
          {CATEGORIES.map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Grid */}
        <View style={styles.grid}>
          {COMMUNITIES.map((c) => (
            <View key={c.id} style={[styles.card, { width: cardWidth }]}>
              <View style={styles.cardTop}>
                <View style={[styles.iconBox, { backgroundColor: c.color + '20' }]}>
                  <Text style={[styles.iconText, { color: c.color }]}>{c.icon}</Text>
                </View>
                <TouchableOpacity style={styles.joinBtn}>
                  <Text style={styles.joinBtnText}>Join</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.cardTitle}>{c.name}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{c.desc}</Text>
              
              <View style={styles.cardBottom}>
                <View style={styles.statRow}>
                  <Users size={14} color={colors.textDim} />
                  <Text style={styles.statText}>{c.members} members</Text>
                </View>
                <View style={styles.statRow}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.statText}>{c.online} online</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg2, borderRadius: 8, paddingHorizontal: 12, height: 36, flex: 0.5 },
  searchInput: { flex: 1, color: colors.text, fontSize: 13, marginLeft: 8 },
  topIcons: { flexDirection: 'row', alignItems: 'center' },
  plusBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  
  scrollContent: { padding: 32 },
  header: { marginBottom: 24 },
  title: { color: colors.text, fontSize: 24, fontWeight: '700' },
  subtitle: { color: colors.textDim, fontSize: 14, marginTop: 4 },
  
  tabsRow: { flexDirection: 'row', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  tab: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  tabText: { color: colors.textDim, fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#fff' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
  card: { backgroundColor: colors.bg2, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 24, fontWeight: '800' },
  joinBtn: { backgroundColor: colors.bg3, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: colors.border },
  joinBtnText: { color: colors.text, fontSize: 12, fontWeight: '600' },
  
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  cardDesc: { color: colors.textDim, fontSize: 13, lineHeight: 18, marginBottom: 20 },
  
  cardBottom: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { color: colors.textDim, fontSize: 12, fontWeight: '500' },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
});