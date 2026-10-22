import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Smartphone, Heart, Gamepad2, Play, Music, MoreHorizontal, UserPlus } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function ProfileSidebar({ user }: { user: any }) {
  if (!user) return null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop' }} 
            style={StyleSheet.absoluteFill} 
          />
          <View style={styles.bannerOverlay} />
        </View>

        {/* Avatar & Header */}
        <View style={styles.avatarWrap}>
          <View style={[styles.avatar, { backgroundColor: user.color || colors.accent }]}>
            <Text style={styles.avatarText}>{user.name[0]}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Smartphone size={14} color="#fff" />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.displayName}>{user.name}</Text>
          <Text style={styles.username}>2gxxd4y0u • A&lt;3 tloml 💙 • BMW</Text>

          {/* Mutuals */}
          <View style={styles.mutuals}>
            <View style={styles.mutualDot} />
            <Text style={styles.mutualText}>1 Mutual Friend • 3 Mutual Servers</Text>
          </View>

          {/* About Me */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ABOUT ME</Text>
            <Text style={styles.cardText}>My wifey 💙💙{'\n'}I love her so much she's better...</Text>
            <TouchableOpacity style={{ marginTop: 8 }}>
              <Text style={styles.linkText}>View Full Bio</Text>
            </TouchableOpacity>
          </View>

          {/* Member Since */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>MEMBER SINCE</Text>
            <Text style={styles.cardText}>Aug 18, 2025</Text>
          </View>

          {/* Game Collection */}
          <View style={styles.gameCollection}>
            <Text style={styles.cardTitle}>Game Collection</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={[styles.gameIcon, { backgroundColor: '#2ecc71' }]} />
              <View style={[styles.gameIcon, { backgroundColor: '#8B4513' }]} />
              <View style={[styles.gameIcon, { backgroundColor: '#3498db' }]} />
              <View style={[styles.gameIcon, { backgroundColor: '#34495e' }]}>
                <Text style={styles.plusText}>+2</Text>
              </View>
            </View>
          </View>

          {/* Spotify Card */}
          <View style={styles.spotifyCard}>
            <View style={styles.spotifyHeader}>
              <Music size={16} color={colors.text} />
              <Text style={styles.spotifyHeaderText}>Listening to Spotify</Text>
            </View>
            
            <Text style={styles.songTitle}>Photograph</Text>
            <Text style={styles.artistName}>Ed Sheeran</Text>
            
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
              <View style={styles.progressKnob} />
            </View>
            
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>02:50</Text>
              <Text style={styles.timeText}>04:18</Text>
            </View>

            <TouchableOpacity style={styles.playBtn}>
              <Play size={16} color="#fff" fill="#fff" />
              <Text style={styles.playBtnText}>Play on Spotify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.fullProfileBtn}>
          <Text style={styles.fullProfileText}>View Full Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg2, borderLeftWidth: 1, borderLeftColor: colors.border },
  banner: { height: 120, backgroundColor: '#111214', position: 'relative' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  avatarWrap: { alignItems: 'center', marginTop: -40, zIndex: 10 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 6, borderColor: colors.bg2, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '700' },
  statusBadge: { position: 'absolute', bottom: 0, right: '35%', backgroundColor: '#23A559', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: colors.bg2 },
  
  content: { padding: 16 },
  displayName: { color: colors.text, fontSize: 20, fontWeight: '700' },
  username: { color: colors.textDim, fontSize: 13, marginTop: 2 },
  
  mutuals: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  mutualDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#9B59B6', marginRight: 8 },
  mutualText: { color: colors.textDim, fontSize: 12 },

  card: { backgroundColor: colors.bg3, padding: 12, borderRadius: 8, marginTop: 16 },
  cardTitle: { color: colors.text, fontSize: 11, fontWeight: '700', marginBottom: 6 },
  cardText: { color: colors.textDim, fontSize: 13, lineHeight: 18 },
  linkText: { color: colors.text, fontSize: 12, fontWeight: '600' },

  gameCollection: { backgroundColor: colors.bg3, padding: 12, borderRadius: 8, marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gameIcon: { width: 32, height: 32, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  plusText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  spotifyCard: { backgroundColor: '#1f1f23', padding: 12, borderRadius: 8, marginTop: 16 },
  spotifyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  spotifyHeaderText: { color: colors.text, fontSize: 12, fontWeight: '600', marginLeft: 6 },
  songTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  artistName: { color: colors.textDim, fontSize: 13, marginTop: 2 },
  progressBar: { height: 4, backgroundColor: '#4f545c', borderRadius: 2, marginTop: 12, position: 'relative', justifyContent: 'center' },
  progressFill: { width: '65%', height: '100%', backgroundColor: '#fff', borderRadius: 2 },
  progressKnob: { position: 'absolute', left: '65%', width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  timeText: { color: colors.textDim, fontSize: 11 },
  playBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2B2D31', padding: 10, borderRadius: 4, marginTop: 12, justifyContent: 'center' },
  playBtnText: { color: '#fff', fontSize: 13, fontWeight: '600', marginLeft: 8 },

  footer: { padding: 16, backgroundColor: colors.bg2, borderTopWidth: 1, borderTopColor: colors.border },
  fullProfileBtn: { backgroundColor: colors.bg3, padding: 12, borderRadius: 4, alignItems: 'center' },
  fullProfileText: { color: colors.text, fontSize: 14, fontWeight: '600' },
});