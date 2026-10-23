import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Search, Bell, ChevronDown, Pencil, MoreHorizontal, Gamepad2, Sword, Flame, Plus, Play, CheckCircle2, Shield, MessageSquare, Ban } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Top Navbar */}
      <View style={styles.topNav}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textDim} />
          <TextInput style={styles.searchInput} placeholder="Search communities, users, or topics..." placeholderTextColor={colors.textDim} />
          <View style={styles.searchShortcut}><Text style={styles.shortcutText}>/</Text></View>
        </View>
        
        <View style={styles.topRight}>
          <TouchableOpacity style={styles.bellBtn}><Bell size={20} color={colors.textDim} /></TouchableOpacity>
          <View style={styles.userMenu}>
            <Image source={{ uri: 'https://i.pravatar.cc/100?img=11' }} style={styles.avatarSmall} />
            <View style={styles.statusDot} />
            <Text style={styles.userName}>Your profile</Text>
            <ChevronDown size={16} color={colors.textDim} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainGrid}>
          
          {/* CENTER COLUMN */}
          <View style={styles.centerCol}>
            
            {/* Main Profile Card */}
            <View style={styles.card}>
              <View style={styles.banner}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop' }} style={StyleSheet.absoluteFill} />
                <TouchableOpacity style={styles.editCoverBtn}>
                  <Pencil size={14} color="#fff" />
                  <Text style={styles.editCoverText}>Edit Cover</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.profileHeader}>
                <View style={styles.avatarWrap}>
                  <Image source={{ uri: 'https://i.pravatar.cc/200?img=11' }} style={styles.mainAvatar} />
                  <View style={styles.statusDotLarge} />
                </View>
                <View style={styles.headerInfo}>
                  <Text style={styles.displayName}>FairyTales</Text>
                  <Text style={styles.handle}>@fairytales</Text>
                  <Text style={styles.bio}>Just a girl with big dreams, better vibes, and a love for gaming, anime, and creating. ✨</Text>
                </View>
                <View style={styles.headerActions}>
                  <TouchableOpacity style={styles.editProfileBtn}>
                    <Pencil size={16} color="#fff" />
                    <Text style={styles.editProfileText}>Edit Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.moreBtn}><MoreHorizontal size={20} color="#fff" /></TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Games I Play */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Games I Play</Text>
                  <TouchableOpacity><Text style={styles.viewAll}>View all →</Text></TouchableOpacity>
                </View>
                <View style={styles.gamesRow}>
                  <View style={styles.gameCard}>
                    <View style={[styles.gameIcon, { backgroundColor: 'rgba(106, 92, 255, 0.2)' }]}><Gamepad2 size={20} color={colors.accent} /></View>
                    <View><Text style={styles.gameName}>Roblox</Text><Text style={styles.gameRole}>Main Game</Text></View>
                  </View>
                  <View style={styles.gameCard}>
                    <View style={[styles.gameIcon, { backgroundColor: 'rgba(35, 165, 89, 0.2)' }]}><Sword size={20} color={colors.success} /></View>
                    <View><Text style={styles.gameName}>Minecraft</Text><Text style={styles.gameRole}>Building</Text></View>
                  </View>
                  <View style={styles.gameCard}>
                    <View style={[styles.gameIcon, { backgroundColor: 'rgba(218, 55, 60, 0.2)' }]}><Flame size={20} color={colors.danger} /></View>
                    <View><Text style={styles.gameName}>Fortnite</Text><Text style={styles.gameRole}>Battle Royale</Text></View>
                  </View>
                  <TouchableOpacity style={styles.addGameCard}>
                    <Plus size={18} color={colors.textDim} />
                    <Text style={styles.addGameText}>Add Interest</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Connected Accounts */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Connected Accounts</Text>
              <Text style={styles.sectionDesc}>Link your accounts to share your activity (optional).</Text>
              <View style={styles.accountsRow}>
                <View style={styles.accountCard}>
                  <Play size={24} color="#FF0000" />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.accountName}>Play</Text>
                    <Text style={styles.accountHandle}>@FairyTales</Text>
                  </View>
                  <CheckCircle2 size={16} color={colors.success} style={{ marginLeft: 'auto' }} />
                </View>
                <View style={styles.accountCard}>
                  <Gamepad2 size={24} color="#fff" />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.accountName}>Roblox</Text>
                    <Text style={styles.accountHandle}>@FairyTales</Text>
                  </View>
                  <CheckCircle2 size={16} color={colors.success} style={{ marginLeft: 'auto' }} />
                </View>
                <View style={styles.accountCard}>
                  <MessageSquare size={24} color="#5865F2" />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.accountName}>Discord</Text>
                    <Text style={styles.accountHandle}>@fairytales</Text>
                  </View>
                  <CheckCircle2 size={16} color={colors.success} style={{ marginLeft: 'auto' }} />
                </View>
                <TouchableOpacity style={styles.manageBtn}>
                  <Text style={styles.manageText}>Manage</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Profile Preview */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Profile Preview</Text>
              <Text style={styles.sectionDesc}>This is how others will see your profile.</Text>
              
              <View style={styles.previewGrid}>
                <View style={styles.previewLeft}>
                  <Image source={{ uri: 'https://i.pravatar.cc/100?img=11' }} style={styles.previewAvatar} />
                  <View style={{ marginLeft: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.previewName}>FairyTales</Text>
                      <View style={styles.onlineDotSmall} />
                    </View>
                    <Text style={styles.previewHandle}>@fairytales</Text>
                    <Text style={styles.previewBio} numberOfLines={2}>Just a girl with big dreams, better vibes, and a love for gaming...</Text>
                    <View style={styles.previewTags}>
                      <View style={styles.tag}><Gamepad2 size={12} color={colors.textDim} /><Text style={styles.tagText}>Roblox</Text></View>
                      <View style={styles.tag}><Sword size={12} color={colors.textDim} /><Text style={styles.tagText}>Minecraft</Text></View>
                      <View style={styles.tag}><Flame size={12} color={colors.textDim} /><Text style={styles.tagText}>Fortnite</Text></View>
                    </View>
                  </View>
                </View>
                <View style={styles.previewRight}>
                  <View style={styles.previewStats}>
                    <View style={styles.statItem}><Text style={styles.statVal}>12</Text><Text style={styles.statLabel}>Communities</Text></View>
                    <View style={styles.statItem}><Text style={styles.statVal}>1.4K</Text><Text style={styles.statLabel}>Members</Text></View>
                    <View style={styles.statItem}><Text style={styles.statVal}>3</Text><Text style={styles.statLabel}>Friends</Text></View>
                  </View>
                  <Text style={styles.previewQuote}>"Good energy. Better communities."</Text>
                </View>
              </View>
            </View>

          </View>

          {/* RIGHT COLUMN */}
          <View style={styles.rightCol}>
            
            {/* Profile Controls */}
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Shield size={24} color={colors.accent} style={{ marginRight: 12 }} />
                <View>
                  <Text style={styles.sectionTitle}>Profile controls</Text>
                  <Text style={styles.sectionDesc}>Manage how others see and interact with you.</Text>
                </View>
              </View>
              
              <View style={styles.controlItem}>
                <Text style={styles.controlLabel}>Profile visibility</Text>
                <TouchableOpacity style={styles.dropdown}>
                  <Text style={styles.dropdownText}>Everyone</Text>
                  <ChevronDown size={16} color={colors.textDim} />
                </TouchableOpacity>
                <Text style={styles.controlDesc}>Anyone on VEXRO Connect can view your profile.</Text>
              </View>

              <View style={styles.controlItem}>
                <Text style={styles.controlLabel}>Message permissions</Text>
                <TouchableOpacity style={styles.dropdown}>
                  <Text style={styles.dropdownText}>Friends & Communities</Text>
                  <ChevronDown size={16} color={colors.textDim} />
                </TouchableOpacity>
                <Text style={styles.controlDesc}>Only friends and community members can message you.</Text>
              </View>

              <View style={styles.controlItem}>
                <Text style={styles.controlLabel}>Blocked users</Text>
                <View style={styles.blockInputWrap}>
                  <TextInput style={styles.blockInput} placeholder="Add username or ID..." placeholderTextColor={colors.textMuted} />
                  <TouchableOpacity style={styles.blockAddBtn}><Plus size={16} color="#fff" /></TouchableOpacity>
                </View>
                <Text style={styles.controlDesc}>No blocked users yet.</Text>
              </View>

              <View style={styles.controlItem}>
                <Text style={styles.controlLabel}>Safety status</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <View style={styles.onlineDotSmall} />
                  <Text style={{ color: colors.success, fontSize: 14, fontWeight: '600', marginLeft: 8 }}>All good</Text>
                </View>
                <Text style={styles.controlDesc}>Your account is secure and following our safety guidelines.</Text>
              </View>
            </View>

            {/* Your Interests */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Your interests</Text>
              <Text style={styles.sectionDesc}>Games, topics, and communities you love.</Text>
              
              <TouchableOpacity style={styles.interestItem}>
                <View style={[styles.interestIcon, { backgroundColor: '#1A1D27' }]}><Gamepad2 size={24} color="#fff" /></View>
                <View style={{ marginLeft: 16 }}>
                  <Text style={styles.interestName}>Roblox</Text>
                  <Text style={styles.interestType}>Game</Text>
                </View>
                <ChevronDown size={16} color={colors.textDim} style={{ marginLeft: 'auto', transform: [{ rotate: '-90deg' }] }} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.interestItem}>
                <View style={[styles.interestIcon, { backgroundColor: '#1A1D27' }]}><Sword size={24} color={colors.success} /></View>
                <View style={{ marginLeft: 16 }}>
                  <Text style={styles.interestName}>Minecraft</Text>
                  <Text style={styles.interestType}>Game</Text>
                </View>
                <ChevronDown size={16} color={colors.textDim} style={{ marginLeft: 'auto', transform: [{ rotate: '-90deg' }] }} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.interestItem}>
                <View style={[styles.interestIcon, { backgroundColor: '#1A1D27' }]}><Flame size={24} color="#00E5FF" /></View>
                <View style={{ marginLeft: 16 }}>
                  <Text style={styles.interestName}>Fortnite</Text>
                  <Text style={styles.interestType}>Game</Text>
                </View>
                <ChevronDown size={16} color={colors.textDim} style={{ marginLeft: 'auto', transform: [{ rotate: '-90deg' }] }} />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  
  // Top Nav
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 32, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg2, borderRadius: 12, paddingHorizontal: 16, height: 44, flex: 0.5, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, color: colors.text, fontSize: 14, marginLeft: 12 },
  searchShortcut: { backgroundColor: colors.bg3, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  shortcutText: { color: colors.textDim, fontSize: 12, fontWeight: '700' },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  bellBtn: { padding: 8, backgroundColor: colors.bg2, borderRadius: 50, borderWidth: 1, borderColor: colors.border },
  userMenu: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg2, padding: 6, paddingRight: 16, borderRadius: 30, borderWidth: 1, borderColor: colors.border },
  avatarSmall: { width: 32, height: 32, borderRadius: 16 },
  statusDot: { position: 'absolute', bottom: 6, left: 28, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.bg2 },
  userName: { color: colors.text, fontSize: 14, fontWeight: '600', marginHorizontal: 12 },

  scrollContent: { padding: 32 },
  mainGrid: { flexDirection: 'row', gap: 32, maxWidth: 1400, alignSelf: 'center', width: '100%' },
  centerCol: { flex: 2 },
  rightCol: { flex: 1 },
  card: { backgroundColor: colors.bg2, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: colors.border, marginBottom: 24 },
  
  // Main Profile Card
  banner: { height: 200, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  editCoverBtn: { position: 'absolute', top: 16, right: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 8 },
  editCoverText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  
  profileHeader: { flexDirection: 'row', marginTop: -60, paddingHorizontal: 16 },
  avatarWrap: { position: 'relative' },
  mainAvatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 6, borderColor: colors.bg2, backgroundColor: colors.bg3 },
  statusDotLarge: { position: 'absolute', bottom: 8, right: 8, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.success, borderWidth: 4, borderColor: colors.bg2 },
  headerInfo: { flex: 1, marginLeft: 24, marginTop: 64 },
  displayName: { color: '#fff', fontSize: 32, fontWeight: '800' },
  handle: { color: colors.textDim, fontSize: 14, marginTop: 4 },
  bio: { color: colors.textDim, fontSize: 15, marginTop: 12, lineHeight: 22, maxWidth: 400 },
  headerActions: { flexDirection: 'row', marginTop: 64, gap: 12 },
  editProfileBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg3, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, gap: 8 },
  editProfileText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  moreBtn: { width: 40, height: 40, borderRadius: 8, backgroundColor: colors.bg3, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 24 },
  
  section: { marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  sectionDesc: { color: colors.textDim, fontSize: 13, marginTop: 4, marginBottom: 20 },
  viewAll: { color: colors.accent, fontSize: 13, fontWeight: '600' },
  
  gamesRow: { flexDirection: 'row', gap: 16 },
  gameCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg3, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, flex: 1 },
  gameIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  gameName: { color: '#fff', fontSize: 14, fontWeight: '600' },
  gameRole: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  addGameCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg3, paddingHorizontal: 20, borderRadius: 12, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', gap: 8 },
  addGameText: { color: colors.textDim, fontSize: 13, fontWeight: '600' },

  // Connected Accounts
  accountsRow: { flexDirection: 'row', gap: 16 },
  accountCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg3, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border, flex: 1 },
  accountName: { color: '#fff', fontSize: 14, fontWeight: '600' },
  accountHandle: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  manageBtn: { backgroundColor: colors.bg3, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 20, justifyContent: 'center', borderRadius: 12 },
  manageText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  // Profile Preview
  previewGrid: { flexDirection: 'row', backgroundColor: colors.bg, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 24 },
  previewLeft: { flex: 2, flexDirection: 'row' },
  previewAvatar: { width: 80, height: 80, borderRadius: 40 },
  previewName: { color: '#fff', fontSize: 20, fontWeight: '700' },
  onlineDotSmall: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success, marginLeft: 8 },
  previewHandle: { color: colors.textDim, fontSize: 13, marginTop: 2 },
  previewBio: { color: colors.textDim, fontSize: 13, marginTop: 8, lineHeight: 18 },
  previewTags: { flexDirection: 'row', gap: 8, marginTop: 12 },
  tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg3, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, gap: 6 },
  tagText: { color: colors.textDim, fontSize: 11, fontWeight: '600' },
  previewRight: { flex: 1, justifyContent: 'center', paddingLeft: 24, borderLeftWidth: 1, borderLeftColor: colors.border },
  previewStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statItem: { alignItems: 'center' },
  statVal: { color: '#fff', fontSize: 20, fontWeight: '700' },
  statLabel: { color: colors.textDim, fontSize: 11, marginTop: 4 },
  previewQuote: { color: colors.textDim, fontSize: 12, fontStyle: 'italic', textAlign: 'center' },

  // Right Column
  controlItem: { marginBottom: 24 },
  controlLabel: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  dropdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.bg, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  dropdownText: { color: '#fff', fontSize: 14 },
  controlDesc: { color: colors.textMuted, fontSize: 12, marginTop: 8 },
  blockInputWrap: { flexDirection: 'row', gap: 8 },
  blockInput: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.border, color: '#fff' },
  blockAddBtn: { width: 44, height: 44, borderRadius: 8, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },

  interestItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg3, padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  interestIcon: { width: 48, height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  interestName: { color: '#fff', fontSize: 15, fontWeight: '700' },
  interestType: { color: colors.textDim, fontSize: 12, marginTop: 2 },
});