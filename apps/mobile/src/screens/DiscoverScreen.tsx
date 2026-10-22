import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useWindowDimensions, ImageBackground } from 'react-native';
import { Search, Compass, Filter, Users, Activity, Flame, Star, ChevronRight } from 'lucide-react-native';
import { colors } from '../theme/colors';

const FEATURED = {
  name: 'VEXRO Connect Official',
  desc: 'The official hub for VEXRO. Hang out, get updates, and meet the devs.',
  members: '12,480',
  online: '1,204',
  tags: ['Official', 'Community', 'Chill'],
  color: colors.accent,
};

const TRENDING = [
  { id: '1', name: 'Game Devs United', desc: 'Share your projects, get feedback, and jam.', members: '8.2k', online: '840', color: '#E91E63', tags: ['Gaming', 'Dev'] },
  { id: '2', name: 'Late Night Lounge', desc: 'Can\'t sleep? Grab a coffee and chat with us.', members: '4.5k', online: '312', color: '#9C27B0', tags: ['Chill', 'Voice'] },
  { id: '3', name: 'Anime & Manga', desc: 'Discuss your favorite shows and share fan art.', members: '15.1k', online: '2,100', color: '#FF9800', tags: ['Anime', 'Art'] },
];

const CATEGORIES = ['Gaming', 'Music', 'Science', 'Technology', 'Creators', 'Education'];

export default function DiscoverScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.container}>
      {/* Top Nav */}
      <View style={styles.topNav}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textMuted} />
          <TextInput style={styles.searchInput} placeholder="Explore communities..." placeholderTextColor={colors.textMuted} />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Filter size={18} color={colors.text} />
          <Text style={styles.filterText}>Filters</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Hero Featured Card */}
        <TouchableOpacity style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.tagRow}>
              <Star size={14} color={colors.warning} fill={colors.warning} />
              <Text style={styles.featuredLabel}>FEATURED COMMUNITY</Text>
            </View>
            <Text style={styles.heroTitle}>{FEATURED.name}</Text>
            <Text style={styles.heroDesc}>{FEATURED.desc}</Text>
            
            <View style={styles.heroStats}>
              <View style={styles.statItem}>
                <Users size={16} color={colors.textDim} />
                <Text style={styles.statText}>{FEATURED.members} Members</Text>
              </View>
              <View style={styles.statItem}>
                <Activity size={16} color={colors.success} />
                <Text style={styles.statText}>{FEATURED.online} Online</Text>
              </View>
            </View>
            
            <View style={styles.heroActions}>
              <TouchableOpacity style={styles.joinHeroBtn}>
                <Text style={styles.joinHeroText}>Join Server</Text>
              </TouchableOpacity>
              {FEATURED.tags.map(t => (
                <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
              ))}
            </View>
          </View>
          <View style={styles.heroDecoration}>
            <Compass size={160} color="rgba(255,255,255,0.03)" />
          </View>
        </TouchableOpacity>

        {/* Categories Pill Row */}
        <View style={styles.categoriesRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat} style={styles.categoryPill}>
              <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trending Section */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Flame size={20} color={colors.danger} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Trending Now</Text>
          </View>
          <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
        </View>

        <View style={[styles.grid, isMobile && { flexDirection: 'column' }]}>
          {TRENDING.map((server) => (
            <TouchableOpacity key={server.id} style={[styles.card, isMobile && { width: '100%' }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: server.color + '20' }]}>
                  <Text style={[styles.iconText, { color: server.color }]}>{server.name[0]}</Text>
                </View>
                <TouchableOpacity style={styles.joinBtn}>
                  <Text style={styles.joinBtnText}>Join</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardTitle}>{server.name}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{server.desc}</Text>
              
              <View style={styles.cardBottom}>
                <View style={styles.tagRowSmall}>
                  {server.tags.map(t => (
                    <View key={t} style={styles.tagSmall}><Text style={styles.tagSmallText}>{t}</Text></View>
                  ))}
                </View>
                <View style={styles.cardStats}>
                  <Users size={14} color={colors.textDim} />
                  <Text style={styles.cardStatText}>{server.members}</Text>
                  <View style={styles.onlineDot} />
                  <Text style={styles.cardStatText}>{server.online}</Text>
                </View>
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
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg2, borderRadius: 8, paddingHorizontal: 16, height: 44, flex: 0.5 },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, marginLeft: 12 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg3, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, gap: 8 },
  filterText: { color: colors.text, fontSize: 14, fontWeight: '600' },

  scrollContent: { padding: 24 },
  
  heroCard: { backgroundColor: '#13152A', borderRadius: 20, padding: 32, marginBottom: 32, borderWidth: 1, borderColor: '#2A2D45', overflow: 'hidden', position: 'relative' },
  heroContent: { zIndex: 10, maxWidth: 500 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  featuredLabel: { color: colors.warning, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  heroTitle: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 8 },
  heroDesc: { color: colors.textDim, fontSize: 14, lineHeight: 20, marginBottom: 20 },
  heroStats: { flexDirection: 'row', gap: 24, marginBottom: 24 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  heroActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  joinHeroBtn: { backgroundColor: colors.accent, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  joinHeroText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  tag: { backgroundColor: colors.bg3, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  tagText: { color: colors.textDim, fontSize: 12, fontWeight: '600' },
  heroDecoration: { position: 'absolute', right: -20, bottom: -20 },

  categoriesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  categoryPill: { backgroundColor: colors.bg2, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  categoryText: { color: colors.text, fontSize: 14, fontWeight: '600' },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '700' },
  viewAllText: { color: colors.accent, fontSize: 14, fontWeight: '600' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
  card: { width: '31%', backgroundColor: colors.bg2, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border, minWidth: 280 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 20, fontWeight: '800' },
  joinBtn: { backgroundColor: colors.bg3, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: colors.border },
  joinBtnText: { color: colors.text, fontSize: 12, fontWeight: '600' },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  cardDesc: { color: colors.textDim, fontSize: 13, lineHeight: 18, marginBottom: 20 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagRowSmall: { flexDirection: 'row', gap: 6 },
  tagSmall: { backgroundColor: colors.bg3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  tagSmallText: { color: colors.textMuted, fontSize: 11, fontWeight: '600' },
  cardStats: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardStatText: { color: colors.textDim, fontSize: 12 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success, marginLeft: 4 },
});