import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, useWindowDimensions } from 'react-native';
import { Search, Bell, HelpCircle, Users, MessageSquare, Shield, User, TrendingUp, Plus, Zap, Radio, Headphones, Gamepad2, Music, Play, Video } from 'lucide-react-native';
import { colors } from '../theme/colors';

const LIVE_NOW = [
  { id: '1', name: 'NovaDreamer', title: 'Chill Roblox Stream', viewers: '1.2k', color: '#E91E63', icon: <Gamepad2 size={16} color="#fff" /> },
  { id: '2', name: 'ZeroRush', title: 'Listening to Lofi', viewers: '840', color: '#23A559', icon: <Headphones size={16} color="#fff" /> },
  { id: '3', name: 'LunaCode', title: 'Building a UI', viewers: '420', color: '#6A5CFF', icon: <Video size={16} color="#fff" /> },
  { id: '4', name: 'Pixel', title: 'Gaming with Subs', viewers: '2.1k', color: '#F0B232', icon: <Gamepad2 size={16} color="#fff" /> },
];

const ACTIVITY = [
  { id: '1', user: 'DØR †☆', action: 'started playing Roblox', time: '2m ago', color: '#E91E63', avatar: 'D' },
  { id: '2', user: 'Nova', action: 'joined the VEXRO Beta community', time: '15m ago', color: '#6A5CFF', avatar: 'N' },
  { id: '3', user: 'ZeroRush', action: 'shared a new track: Photograph', time: '1h ago', color: '#23A559', avatar: 'Z' },
  { id: '4', user: 'LunaCode', action: 'reacted to your message in #general', time: '2h ago', color: '#F0B232', avatar: 'L' },
];

const TRENDING = [
  { id: '1', name: 'Game Devs United', members: '8.2k', color: '#E91E63', cover: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=400&auto=format&fit=crop' },
  { id: '2', name: 'Anime & Manga', members: '15.1k', color: '#F0B232', cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop' },
];

export default function HomeScreen({ onNavigate }: { onNavigate: (view: string) => void }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.container}>
      {/* Top Nav */}
      <View style={styles.topNav}>
        <View style={styles.searchBar}>
          <Search size={16} color={colors.textMuted} />
          <TextInput style={styles.searchInput} placeholder="Search VEXRO..." placeholderTextColor={colors.textMuted} />
        </View>
        <View style={styles.topIcons}>
          <Bell size={20} color={colors.textDim} style={{ marginRight: 16 }} />
          <HelpCircle size={20} color={colors.textDim} style={{ marginRight: 16 }} />
          <View style={styles.betaBadge}><Text style={styles.betaText}>BETA</Text></View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <Text style={styles.greeting}>Welcome back, NovaDreamer 👋</Text>
            <Text style={styles.subGreeting}>Here's what's happening in your world today.</Text>
            <View style={styles.heroStats}>
              <View style={styles.statPill}><Users size={14} color="#fff" /><Text style={styles.statPillText}>5 Communities</Text></View>
              <View style={styles.statPill}><Zap size={14} color="#fff" /><Text style={styles.statPillText}>18 Friends</Text></View>
            </View>
          </View>
          <View style={styles.heroGlow} />
        </View>

        {/* Live Now (Horizontal Scroll) */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Radio size={20} color={colors.danger} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Live Now</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', gap: 16, paddingRight: 32 }}>
            {LIVE_NOW.map((live) => (
              <TouchableOpacity key={live.id} style={styles.liveCard}>
                <View style={styles.liveCover}>
                  <View style={[styles.liveAvatar, { backgroundColor: live.color }]}>
                    <Text style={styles.liveAvatarText}>{live.name[0]}</Text>
                  </View>
                  <View style={styles.liveBadge}><Text style={styles.liveBadgeText}>LIVE</Text></View>
                  <View style={styles.viewerBadge}>
                    <Users size={12} color="#fff" />
                    <Text style={styles.viewerText}>{live.viewers}</Text>
                  </View>
                </View>
                <View style={styles.liveInfo}>
                  <Text style={styles.liveName}>{live.name}</Text>
                  <Text style={styles.liveTitle} numberOfLines={1}>{live.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.mainGrid, isMobile && { flexDirection: 'column' }]}>
          
          {/* Left Column: Activity & Trending */}
          <View style={styles.leftCol}>
            {/* Recent Activity */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Friend Activity</Text>
              <TouchableOpacity><Text style={styles.viewAll}>View all →</Text></TouchableOpacity>
            </View>
            <View style={styles.activityList}>
              {ACTIVITY.map((a) => (
                <View key={a.id} style={styles.activityItem}>
                  <View style={[styles.avatar, { backgroundColor: a.color }]}><Text style={styles.avatarText}>{a.avatar}</Text></View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.activityText}>
                      <Text style={{ color: '#fff', fontWeight: '700' }}>{a.user}</Text> {a.action}
                    </Text>
                    <Text style={styles.activityTime}>{a.time}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Trending Communities */}
            <View style={[styles.sectionHeader, { marginTop: 32 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TrendingUp size={20} color={colors.accent} style={{ marginRight: 8 }} />
                <Text style={styles.sectionTitle}>Trending Communities</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {TRENDING.map((t) => (
                <TouchableOpacity key={t.id} style={styles.trendingCard}>
                  <Image source={{ uri: t.cover }} style={styles.trendingCover} />
                  <View style={styles.trendingOverlay} />
                  <View style={styles.trendingInfo}>
                    <View style={[styles.commIconSmall, { backgroundColor: t.color }]}>
                      <Text style={{ color: '#fff', fontWeight: '800' }}>{t.name[0]}</Text>
                    </View>
                    <View>
                      <Text style={styles.trendingName}>{t.name}</Text>
                      <Text style={styles.trendingMembers}>{t.members} Members</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Right Column: Safety & Discover */}
          <View style={styles.rightCol}>
            <View style={styles.safetyCard}>
              <Shield size={28} color={colors.success} />
              <Text style={styles.safetyTitle}>You're protected.</Text>
              <Text style={styles.safetyDesc}>All safety features are active. Manage your privacy in the Safety Center.</Text>
              <TouchableOpacity style={styles.safetyBtn} onPress={() => onNavigate('safety')}>
                <Text style={styles.safetyBtnText}>Go to Safety Center</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.discoverCard} onPress={() => onNavigate('communities')}>
              <View style={styles.discoverIcon}><Plus size={24} color="#fff" /></View>
              <Text style={styles.discoverTitle}>Find Your People</Text>
              <Text style={styles.discoverDesc}>Discover new communities, make friends, and join the conversation.</Text>
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
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg2, borderRadius: 8, paddingHorizontal: 12, height: 36, flex: 0.4 },
  searchInput: { flex: 1, color: colors.text, fontSize: 13, marginLeft: 8 },
  topIcons: { flexDirection: 'row', alignItems: 'center' },
  betaBadge: { backgroundColor: 'rgba(106, 92, 255, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  betaText: { color: colors.accent, fontSize: 10, fontWeight: '800', letterSpacing: 1 },

  scrollContent: { padding: 32 },
  
  heroBanner: { backgroundColor: '#111320', borderRadius: 20, padding: 32, marginBottom: 32, overflow: 'hidden', borderWidth: 1, borderColor: '#1F2235', position: 'relative' },
  heroContent: { zIndex: 10 },
  greeting: { color: '#fff', fontSize: 28, fontWeight: '800' },
  subGreeting: { color: colors.textDim, fontSize: 15, marginTop: 8, marginBottom: 24 },
  heroStats: { flexDirection: 'row', gap: 12 },
  statPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  statPillText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  heroGlow: { position: 'absolute', top: -50, right: -50, width: 200, height: 200, backgroundColor: colors.accent, borderRadius: 100, opacity: 0.15, filter: 'blur(50px)' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  viewAll: { color: colors.accent, fontSize: 13, fontWeight: '600' },

  liveCard: { width: 220, backgroundColor: colors.bg2, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  liveCover: { height: 120, backgroundColor: '#1A1D27', justifyContent: 'center', alignItems: 'center' },
  liveAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  liveAvatarText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  liveBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: colors.danger, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  liveBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  viewerBadge: { position: 'absolute', bottom: 12, right: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, gap: 4 },
  viewerText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  liveInfo: { padding: 16 },
  liveName: { color: colors.text, fontSize: 14, fontWeight: '700' },
  liveTitle: { color: colors.textDim, fontSize: 12, marginTop: 4 },

  mainGrid: { flexDirection: 'row', gap: 32 },
  leftCol: { flex: 2 },
  rightCol: { flex: 1 },

  activityList: { backgroundColor: colors.bg2, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  activityText: { color: colors.textDim, fontSize: 14, lineHeight: 20 },
  activityTime: { color: colors.textMuted, fontSize: 12, marginTop: 4 },

  trendingCard: { flex: 1, height: 120, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  trendingCover: { width: '100%', height: '100%' },
  trendingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  trendingInfo: { position: 'absolute', bottom: 16, left: 16, flexDirection: 'row', alignItems: 'center' },
  commIconSmall: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  trendingName: { color: '#fff', fontSize: 15, fontWeight: '700' },
  trendingMembers: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },

  safetyCard: { backgroundColor: 'rgba(35, 165, 89, 0.1)', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: 'rgba(35, 165, 89, 0.2)', marginBottom: 24, alignItems: 'center' },
  safetyTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 16, marginBottom: 8 },
  safetyDesc: { color: colors.textDim, fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  safetyBtn: { backgroundColor: colors.success, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  safetyBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  discoverCard: { backgroundColor: colors.bg2, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  discoverIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  discoverTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  discoverDesc: { color: colors.textDim, fontSize: 13, textAlign: 'center', lineHeight: 20 },
});