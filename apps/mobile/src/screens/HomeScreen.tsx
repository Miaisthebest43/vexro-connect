import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, Bell, HelpCircle, Plus, ShieldCheck, ChevronRight, Users, Globe, Lock, UserPlus, Settings, TrendingUp } from 'lucide-react-native';
import { colors } from '../theme/colors';

const COMMUNITIES = [
  { id: '1', name: 'Roblox Developers', members: '128 members', color: '#3498DB', icon: 'R' },
  { id: '2', name: 'Creator Lounge', members: '56 members', color: '#9B59B6', icon: 'C' },
  { id: '3', name: 'VEXRO Beta', members: '24 members', color: '#6A5CFF', icon: 'V' },
];

const ACTIVITY = [
  { id: '1', title: 'New message in Creator Lounge', desc: '@Nova: Check out this new asset I found!', time: '2m ago', color: '#9B59B6' },
  { id: '2', title: 'Roblox Developers', desc: 'A new poll was added to the #showcase channel', time: '15m ago', color: '#3498DB' },
  { id: '3', title: 'System', desc: 'Welcome to VEXRO! Your account is all set up.', time: '1h ago', color: colors.bg4 },
];

export default function HomeScreen({ onNavigate }: { onNavigate: (view: string) => void }) {
  return (
    <View style={styles.container}>
      {/* Top Nav */}
      <View style={styles.topNav}>
        <View style={styles.searchBar}>
          <Search size={16} color={colors.textMuted} />
          <TextInput style={styles.searchInput} placeholder="Search anything..." placeholderTextColor={colors.textMuted} />
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
          <Text style={styles.title}>Good morning, Alex 👋</Text>
          <Text style={styles.subtitle}>Your communities, your control.</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <View style={styles.heroIconWrap}>
              <ShieldCheck size={28} color={colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Your safety matters</Text>
              <Text style={styles.heroDesc}>You're in control. Manage your privacy, security, and reporting settings from one place.</Text>
              <TouchableOpacity style={styles.openSafetyBtn} onPress={() => onNavigate('safety')}>
                <Text style={styles.openSafetyText}>Open Safety Center</Text>
                <ChevronRight size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.heroRight}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>3</Text>
              <Text style={styles.statLabel}>Communities</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>24</Text>
              <Text style={styles.statLabel}>Online</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>128</Text>
              <Text style={styles.statLabel}>Total Members</Text>
            </View>
          </View>
        </View>

        {/* Communities Row */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Communities</Text>
          <TouchableOpacity><Text style={styles.viewAllText}>View all →</Text></TouchableOpacity>
        </View>
        <View style={styles.communitiesRow}>
          {COMMUNITIES.map((c) => (
            <TouchableOpacity key={c.id} style={styles.commCard}>
              <View style={[styles.commIcon, { backgroundColor: c.color }]}><Text style={styles.commIconText}>{c.icon}</Text></View>
              <Text style={styles.commName}>{c.name}</Text>
              <Text style={styles.commMembers}>{c.members}</Text>
              
              <View style={styles.avatarRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online</Text>
                <View style={styles.avatarStack}>
                  <View style={[styles.avatarSmall, { backgroundColor: '#E74C3C', zIndex: 3 }]} />
                  <View style={[styles.avatarSmall, { backgroundColor: '#F1C40F', zIndex: 2, marginLeft: -8 }]} />
                  <View style={[styles.avatarSmall, { backgroundColor: '#2ECC71', zIndex: 1, marginLeft: -8 }]} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Grid (Activity & Quick Actions) */}
        <View style={styles.bottomGrid}>
          
          {/* Left: Recent Activity */}
          <View style={styles.bottomLeft}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity><Text style={styles.viewAllText}>View all →</Text></TouchableOpacity>
            </View>
            <View style={styles.activityCard}>
              {ACTIVITY.map((act, i) => (
                <View key={act.id} style={[styles.activityRow, i !== ACTIVITY.length - 1 && styles.borderBottom]}>
                  <View style={[styles.actIconWrap, { backgroundColor: act.color + '20' }]}>
                    <TrendingUp size={16} color={act.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.actTitle}>{act.title}</Text>
                    <Text style={styles.actDesc} numberOfLines={1}>{act.desc}</Text>
                  </View>
                  <Text style={styles.actTime}>{act.time}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Right: Quick Actions */}
          <View style={styles.bottomRight}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>
            <View style={styles.quickActionsCard}>
              <TouchableOpacity style={styles.actionItem}>
                <View style={styles.actionIcon}><Globe size={18} color={colors.accent} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.actionTitle}>Explore Communities</Text>
                  <Text style={styles.actionDesc}>Discover new spaces</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem}>
                <View style={styles.actionIcon}><UserPlus size={18} color={colors.accent} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.actionTitle}>Invite Friends</Text>
                  <Text style={styles.actionDesc}>Grow your circle</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem}>
                <View style={styles.actionIcon}><Settings size={18} color={colors.accent} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.actionTitle}>Update Privacy Settings</Text>
                  <Text style={styles.actionDesc}>Stay in control</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.safetyMiniCard} onPress={() => onNavigate('safety')}>
              <ShieldCheck size={32} color={colors.success} />
              <View style={{ marginLeft: 16 }}>
                <Text style={styles.safetyMiniTitle}>Better safety.</Text>
                <Text style={styles.safetyMiniTitle}>Better communities.</Text>
                <Text style={styles.safetyMiniDesc}>Built for real people, not just bots.</Text>
              </View>
            </TouchableOpacity>
          </View>
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
  heroCard: { flexDirection: 'row', backgroundColor: '#0D1021', borderRadius: 16, padding: 24, marginBottom: 32, borderWidth: 1, borderColor: '#1B2044' },
  heroLeft: { flex: 1.5, flexDirection: 'row', alignItems: 'flex-start' },
  heroIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(35, 165, 89, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  heroTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  heroDesc: { color: colors.textDim, fontSize: 13, lineHeight: 18, marginBottom: 12, maxWidth: 300 },
  openSafetyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accent, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  openSafetyText: { color: '#fff', fontSize: 12, fontWeight: '600', marginRight: 4 },
  heroRight: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 16 },
  statItem: { alignItems: 'center' },
  statVal: { color: colors.text, fontSize: 20, fontWeight: '700' },
  statLabel: { color: colors.textDim, fontSize: 11, marginTop: 4 },
  statDivider: { width: 1, height: 30, backgroundColor: colors.border },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  viewAllText: { color: colors.accent, fontSize: 12, fontWeight: '600' },
  communitiesRow: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  commCard: { flex: 1, backgroundColor: colors.bg2, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  commIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  commIconText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  commName: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  commMembers: { color: colors.textDim, fontSize: 12, marginBottom: 16 },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success, marginRight: 6 },
  onlineText: { color: colors.success, fontSize: 11, fontWeight: '600', marginRight: 12 },
  avatarStack: { flexDirection: 'row', alignItems: 'center' },
  avatarSmall: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.bg2 },
  bottomGrid: { flexDirection: 'row', gap: 24 },
  bottomLeft: { flex: 1.5 },
  bottomRight: { flex: 1 },
  activityCard: { backgroundColor: colors.bg2, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 8 },
  activityRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: colors.border },
  actIconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  actTitle: { color: colors.text, fontSize: 13, fontWeight: '600' },
  actDesc: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  actTime: { color: colors.textMuted, fontSize: 11, marginLeft: 12 },
  quickActionsCard: { backgroundColor: colors.bg2, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 8, marginBottom: 16 },
  actionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8 },
  actionIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(106, 92, 255, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  actionTitle: { color: colors.text, fontSize: 13, fontWeight: '600' },
  actionDesc: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  safetyMiniCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#172B24', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#233D33' },
  safetyMiniTitle: { color: colors.text, fontSize: 13, fontWeight: '700' },
  safetyMiniDesc: { color: colors.textDim, fontSize: 11, marginTop: 4 },
});