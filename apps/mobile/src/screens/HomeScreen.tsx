import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useWindowDimensions } from 'react-native';
import { Search, Bell, Plus, Users, MessageSquare, Compass, ChevronRight, Activity, Sparkles, Hash } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function HomeScreen({ onNavigate }: { onNavigate: (view: string) => void }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.container}>
      {/* Top Navbar */}
      <View style={styles.topNav}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textDim} />
          <TextInput style={styles.searchInput} placeholder="Search VEXRO..." placeholderTextColor={colors.textMuted} />
        </View>
        <View style={styles.topIcons}>
          <TouchableOpacity style={styles.iconBtn}><Bell size={20} color={colors.textDim} /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => onNavigate('communities')}><Plus size={20} color={colors.textDim} /></TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good evening, FairyTales ✨</Text>
          <Text style={styles.subGreeting}>Here's what's happening in your world today.</Text>
        </View>

        {/* Bento Grid */}
        <View style={[styles.bentoGrid, isMobile && { flexDirection: 'column' }]}>
          
          {/* Left Column (Large Card) */}
          <View style={styles.bentoLeft}>
            <View style={styles.largeCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconWrap}><Activity size={18} color={colors.accent} /></View>
                <Text style={styles.cardTitle}>Recent Activity</Text>
              </View>
              
              <View style={styles.timeline}>
                {[
                  { user: 'Nova', action: 'sent a message in #general', time: '2m ago', color: '#3498DB' },
                  { user: 'ZeroRush', action: 'joined the Design Team server', time: '15m ago', color: '#E91E63' },
                  { user: 'System', action: 'updated VEXRO to version 1.4', time: '1h ago', color: colors.accent },
                ].map((item, i) => (
                  <View key={i} style={styles.timelineItem}>
                    <View style={[styles.timelineDot, { backgroundColor: item.color }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.timelineText}>
                        <Text style={{ fontWeight: '700', color: colors.text }}>{item.user} </Text> 
                        {item.action}
                      </Text>
                      <Text style={styles.timelineTime}>{item.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
              
              <TouchableOpacity style={styles.viewAllBtn} onPress={() => onNavigate('messages')}>
                <Text style={styles.viewAllText}>Open Messages</Text>
                <ChevronRight size={16} color={colors.accent} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Right Column (Two Small Cards) */}
          <View style={styles.bentoRight}>
            <View style={styles.smallCard}>
              <View style={styles.statIconWrap}><Users size={20} color={colors.success} /></View>
              <Text style={styles.statValue}>18</Text>
              <Text style={styles.statLabel}>Friends Online</Text>
            </View>

            <View style={styles.smallCard}>
              <View style={[styles.statIconWrap, { backgroundColor: 'rgba(233, 30, 99, 0.1)' }]}><MessageSquare size={20} color="#E91E63" /></View>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Unread Messages</Text>
            </View>
          </View>
        </View>

        {/* Jump Back In (Horizontal Scroll) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Jump Back In</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            {[
              { name: 'Design Team', icon: '🎨', color: '#E91E63' },
              { name: 'Gaming Hub', icon: '🎮', color: '#3498DB' },
              { name: 'VEXRO Devs', icon: '💻', color: colors.accent },
            ].map((item, i) => (
              <TouchableOpacity key={i} style={styles.jumpCard} onPress={() => onNavigate('messages')}>
                <Text style={{ fontSize: 24, marginBottom: 12 }}>{item.icon}</Text>
                <Text style={styles.jumpName}>{item.name}</Text>
                <Text style={styles.jumpStatus}>Active now</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Discover Communities */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Discover Communities</Text>
          <TouchableOpacity onPress={() => onNavigate('communities')}><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
        </View>
        <View style={styles.discoverList}>
          {[
            { name: 'Roblox Developers', members: '12.4k', tag: 'Gaming', color: '#3498DB' },
            { name: 'Creator Lounge', members: '8.2k', tag: 'Art', color: '#9B59B6' },
            { name: 'Late Night Lofi', members: '4.5k', tag: 'Music', color: '#F0B232' },
          ].map((server, i) => (
            <TouchableOpacity key={i} style={styles.discoverItem} onPress={() => onNavigate('communities')}>
              <View style={[styles.discoverIcon, { backgroundColor: server.color }]}>
                <Text style={styles.discoverIconText}>{server.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.discoverName}>{server.name}</Text>
                <Text style={styles.discoverMembers}>{server.members} Members</Text>
              </View>
              <View style={styles.discoverTag}>
                <Text style={styles.discoverTagText}>{server.tag}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  
  // Top Nav
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 32, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg2, borderRadius: 8, paddingHorizontal: 16, height: 40, flex: 0.4 },
  searchInput: { flex: 1, color: colors.text, fontSize: 14, marginLeft: 12 },
  topIcons: { flexDirection: 'row', gap: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bg2, alignItems: 'center', justifyContent: 'center' },

  scrollContent: { padding: 32 },
  header: { marginBottom: 32 },
  greeting: { color: colors.text, fontSize: 28, fontWeight: '800' },
  subGreeting: { color: colors.textDim, fontSize: 15, marginTop: 8 },

  // Bento Grid
  bentoGrid: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  bentoLeft: { flex: 2 },
  bentoRight: { flex: 1, gap: 16 },
  
  largeCard: { flex: 1, backgroundColor: colors.bg2, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  cardIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(88, 101, 242, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  
  timeline: { flex: 1, gap: 20 },
  timelineItem: { flexDirection: 'row', alignItems: 'flex-start' },
  timelineDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4, marginRight: 12 },
  timelineText: { color: colors.textDim, fontSize: 14, lineHeight: 20 },
  timelineTime: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 24, alignSelf: 'flex-start' },
  viewAllText: { color: colors.accent, fontSize: 14, fontWeight: '600', marginRight: 4 },

  smallCard: { flex: 1, backgroundColor: colors.bg2, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border, justifyContent: 'center' },
  statIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(35, 165, 89, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  statValue: { color: colors.text, fontSize: 28, fontWeight: '800', marginBottom: 4 },
  statLabel: { color: colors.textDim, fontSize: 13, fontWeight: '600' },

  // Sections
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },

  jumpCard: { width: 160, backgroundColor: colors.bg2, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  jumpName: { color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  jumpStatus: { color: colors.success, fontSize: 12, fontWeight: '500' },

  // Discover List
  discoverList: { backgroundColor: colors.bg2, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 8 },
  discoverItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  discoverIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  discoverIconText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  discoverName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  discoverMembers: { color: colors.textDim, fontSize: 13, marginTop: 2 },
  discoverTag: { backgroundColor: colors.bg3, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  discoverTagText: { color: colors.textDim, fontSize: 11, fontWeight: '600' },
});