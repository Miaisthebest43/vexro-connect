import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, MoreHorizontal, MessageSquare } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function ProfileScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.banner}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreBtn}>
          <MoreHorizontal size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileHeader}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}><Text style={styles.avatarText}>F</Text></View>
          <View style={styles.statusDot} />
        </View>
        <View style={styles.nameRow}>
          <View>
            <Text style={styles.displayName}>FairyTales</Text>
            <Text style={styles.username}>@ifwyobody</Text>
          </View>
          <TouchableOpacity style={styles.msgBtn}>
            <MessageSquare size={18} color="#fff" />
            <Text style={styles.msgBtnText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.bio}>Just a dev building cool things. Love gaming and UI design.</Text>
        
        <Text style={styles.sectionTitle}>Member Since</Text>
        <Text style={styles.bio}>August 18, 2025</Text>

        <Text style={styles.sectionTitle}>Mutual Friends</Text>
        <View style={styles.mutualRow}>
          <View style={[styles.smallAvatar, { backgroundColor: colors.accent }]}><Text style={styles.smallAvatarText}>A</Text></View>
          <View style={[styles.smallAvatar, { backgroundColor: colors.success, marginLeft: -8 }]}><Text style={styles.smallAvatarText}>B</Text></View>
          <View style={[styles.smallAvatar, { backgroundColor: colors.warning, marginLeft: -8 }]}><Text style={styles.smallAvatarText}>C</Text></View>
          <Text style={styles.mutualText}>3 mutual friends</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  banner: { height: 200, backgroundColor: '#1E1F22', justifyContent: 'space-between', flexDirection: 'row', padding: 24 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  moreBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  profileHeader: { paddingHorizontal: 32, marginTop: -50 },
  avatarWrap: { position: 'relative', width: 100, height: 100 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: colors.bg },
  avatarText: { color: '#fff', fontSize: 40, fontWeight: '700' },
  statusDot: { position: 'absolute', bottom: 6, right: 6, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.success, borderWidth: 4, borderColor: colors.bg },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  displayName: { color: colors.text, fontSize: 24, fontWeight: '800' },
  username: { color: colors.textDim, fontSize: 14, marginTop: 4 },
  msgBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accent, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, gap: 8 },
  msgBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  content: { padding: 32, maxWidth: 800 },
  sectionTitle: { color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 24 },
  bio: { color: colors.textDim, fontSize: 14, lineHeight: 20 },
  mutualRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  smallAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.bg },
  smallAvatarText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  mutualText: { color: colors.textDim, fontSize: 13, marginLeft: 12 },
});