import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import UserProfileModal from './UserProfileModal';

export default function ProfileSidebar({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Banner (No Photos) */}
        <View style={styles.banner} />
        
        {/* Avatar (Solid Color + Initial) */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>D</Text>
          </View>
          <View style={styles.statusBadge}>
             <Text style={{ fontSize: 10 }}>💻</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.displayName}>DØR †☆</Text>
          <Text style={styles.tagline}>2gxxd4y0u • A&lt;3 tloml 💙 • BMW</Text>
          
          <View style={styles.mutuals}>
            <View style={styles.mutualDot} />
            <Text style={styles.mutualText}>1 Mutual Friend • 3 Mutual Servers</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>ABOUT ME</Text>
            <Text style={styles.cardText}>My wifey 💙💙{'\n'}I love her so much she's better...</Text>
            <TouchableOpacity onPress={() => onNavigate('edit-profile')}>
              <Text style={styles.linkText}>View Full Bio</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>MEMBER SINCE</Text>
            <Text style={styles.cardText}>Aug 18, 2025</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Game Collection</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <View style={[styles.gameIcon, { backgroundColor: '#2ecc71' }]} />
              <View style={[styles.gameIcon, { backgroundColor: '#8B4513' }]} />
              <View style={[styles.gameIcon, { backgroundColor: '#3498db' }]} />
              <View style={[styles.gameIcon, { backgroundColor: '#34495e' }]}>
                <Text style={styles.plusText}>+2</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.fullProfileBtn} onPress={() => onNavigate('edit-profile')}>
          <Text style={styles.fullProfileText}>View Full Profile</Text>
        </TouchableOpacity>
      </View>

      <UserProfileModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        user={{ name: 'Izan7777' }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 340, backgroundColor: colors.bg2, borderLeftWidth: 1, borderLeftColor: colors.border },
  banner: { height: 120, backgroundColor: '#E91E63' }, // Brand Color
  avatarWrap: { alignItems: 'center', marginTop: -40, zIndex: 10 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 6, borderColor: colors.bg2, backgroundColor: '#E91E63', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  statusBadge: { position: 'absolute', bottom: 0, right: '35%', backgroundColor: '#23A559', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: colors.bg2 },
  content: { padding: 16 },
  displayName: { color: colors.text, fontSize: 20, fontWeight: '700' },
  tagline: { color: colors.textDim, fontSize: 13, marginTop: 2 },
  mutuals: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  mutualDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#9B59B6', marginRight: 8 },
  mutualText: { color: colors.textDim, fontSize: 12 },
  card: { backgroundColor: colors.bg3, padding: 12, borderRadius: 8, marginTop: 16 },
  cardTitle: { color: colors.text, fontSize: 11, fontWeight: '700', marginBottom: 6 },
  cardText: { color: colors.textDim, fontSize: 13, lineHeight: 18 },
  linkText: { color: colors.text, fontSize: 12, fontWeight: '600', marginTop: 8 },
  gameIcon: { width: 32, height: 32, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  plusText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  footer: { padding: 16, backgroundColor: colors.bg2, borderTopWidth: 1, borderTopColor: colors.border },
  fullProfileBtn: { backgroundColor: colors.bg3, padding: 12, borderRadius: 4, alignItems: 'center' },
  fullProfileText: { color: colors.text, fontSize: 14, fontWeight: '600' },
});