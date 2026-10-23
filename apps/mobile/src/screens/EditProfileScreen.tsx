import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { X, ChevronDown, ChevronRight, Lock, Plus, MessageSquare, UserPlus, MoreHorizontal, Gamepad2, Link as LinkIcon } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function EditProfileScreen({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('Board');

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <X size={24} color={colors.textDim} />
      </TouchableOpacity>

      <View style={styles.layout}>
        {/* LEFT PANEL: Customization */}
        <View style={styles.leftPanel}>
          <View style={styles.leftHeader}>
            <Text style={styles.leftTitle}>Main Profile</Text>
            <ChevronDown size={16} color={colors.text} />
            <View style={{ flex: 1 }} />
            <ChevronRight size={16} color={colors.textDim} />
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {/* Nameplate */}
            <Text style={styles.sectionLabel}>Nameplate</Text>
            <View style={styles.nameplatePreview}>
              <View style={styles.nameplateAvatar}><Text style={{ fontSize: 10 }}>💀</Text></View>
              <View style={styles.nameplateLine} />
            </View>

            {/* Avatar & Decoration */}
            <Text style={styles.sectionLabel}>Avatar & Decoration</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
              <View style={[styles.squareBox, { borderColor: '#3B82F6', borderWidth: 2 }]}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1580518337843-f959e992563b?q=80&w=200&auto=format&fit=crop' }} style={StyleSheet.absoluteFill} />
                <View style={styles.editIcon}><Plus size={12} color="#fff" /></View>
              </View>
              <TouchableOpacity style={[styles.squareBox, { borderStyle: 'dashed' }]}>
                <Plus size={24} color={colors.textDim} />
              </TouchableOpacity>
            </View>

            {/* Banner Color */}
            <Text style={styles.sectionLabel}>Banner Color</Text>
            <View style={styles.colorBox} />

            {/* Profile Effect */}
            <Text style={styles.sectionLabel}>Profile Effect & Frame</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
              <View style={styles.squareBox}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop' }} style={StyleSheet.absoluteFill} />
                <View style={styles.editIcon}><Plus size={12} color="#fff" /></View>
              </View>
              <TouchableOpacity style={[styles.squareBox, { borderStyle: 'dashed' }]}>
                <Plus size={24} color={colors.textDim} />
              </TouchableOpacity>
            </View>

            {/* Nitro Promo */}
            <View style={styles.nitroBox}>
              <View style={styles.nitroLock}><Lock size={16} color={colors.textDim} /></View>
              <Text style={styles.nitroTitle}>Level up your look, only with Nitro</Text>
              <TouchableOpacity style={styles.nitroBtn}>
                <Text style={styles.nitroBtnText}>Preview Nitro</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* MIDDLE PANEL: Live Preview */}
        <View style={styles.middlePanel}>
          <ScrollView>
            {/* Banner */}
            <View style={styles.banner} />
            
            {/* Avatar */}
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1580518337843-f959e992563b?q=80&w=200&auto=format&fit=crop' }} style={{ width: '100%', height: '100%', borderRadius: 48 }} />
              </View>
              <View style={styles.statusBubble}>
                <Text style={styles.statusText}>📱 https://beacons.ai/lastd...</Text>
              </View>
            </View>

            {/* User Info */}
            <View style={styles.infoWrap}>
              <Text style={styles.displayName}>FairyTales</Text>
              
              <View style={styles.tagRow}>
                <Text style={styles.username}>ifwyobody</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.username}>He/him/</Text>
                <View style={styles.serverTag}><Text style={styles.serverTagText}>Server Tag ∨</Text></View>
              </View>

              <View style={styles.badgesRow}>
                <View style={[styles.badge, { backgroundColor: '#5865F2' }]}><Text style={{ fontSize: 10 }}>🖥️</Text></View>
                <View style={[styles.badge, { backgroundColor: '#EB459E' }]}><Text style={{ fontSize: 10 }}>🎮</Text></View>
                <View style={[styles.badge, { backgroundColor: '#23A559' }]}><Text style={{ fontSize: 10 }}>🦊</Text></View>
                <View style={[styles.badge, { backgroundColor: '#9B59B6' }]}><Text style={{ fontSize: 10 }}>⚙️</Text></View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.msgBtn}>
                  <MessageSquare size={16} color="#fff" />
                  <Text style={styles.msgBtnText}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}><UserPlus size={16} color={colors.text} /></TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}><MoreHorizontal size={16} color={colors.text} /></TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bio</Text>
                <Text style={styles.sectionContent}>What's your villain origin story?</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Member Since</Text>
                <Text style={styles.sectionContent}>Jul 27, 2023</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Connections</Text>
                <View style={styles.connectionRow}>
                  <View style={styles.connectIcon}><Text style={{fontSize:10}}>🎮</Text></View>
                  <Text style={styles.connectText}>Dev_Studios</Text>
                </View>
                <View style={styles.connectionRow}>
                  <View style={[styles.connectIcon, {backgroundColor:'#23A559'}]}><Text style={{fontSize:10}}>💔</Text></View>
                  <Text style={styles.connectText}>heartbroken ♥ ↗</Text>
                </View>
                <View style={styles.connectionRow}>
                  <View style={[styles.connectIcon, {backgroundColor:'#E74C3C'}]}><Text style={{fontSize:10}}>▶</Text></View>
                  <Text style={styles.connectText}>Kelly Kelly ↗</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* RIGHT PANEL: Widgets */}
        <View style={styles.rightPanel}>
          <View style={styles.tabsRow}>
            {['Board', 'Activity', 'Wishlist'].map((tab) => (
              <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                {activeTab === tab && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.widgetHeader}>
            <Text style={styles.widgetTitle}>Your Widgets</Text>
            <TouchableOpacity style={styles.addWidgetBtn}>
              <Text style={styles.addWidgetText}>+ Add Widget</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Games in Rotation Widget */}
            <View style={styles.widgetCard}>
              <View style={styles.widgetCardHeader}>
                <View>
                  <Text style={styles.widgetName}>Games in Rotation</Text>
                  <Text style={styles.widgetDesc}>Add up to 5 games</Text>
                </View>
                <TouchableOpacity style={styles.widgetAddBtn}><Plus size={16} color={colors.text} /></TouchableOpacity>
              </View>
              
              <View style={styles.gameRow}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3e/Roblox_Logo_2022.svg/1200px-Roblox_Logo_2022.svg.png' }} style={styles.gameCover} />
                <View style={styles.gameInfo}>
                  <Text style={styles.gameTitle}>ROBLOX</Text>
                  <Text style={styles.gameTags}>+ Tags</Text>
                </View>
              </View>

              <View style={styles.gameRow}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Minecraft_cover.png/220px-Minecraft_cover.png' }} style={styles.gameCover} />
                <View style={styles.gameInfo}>
                  <Text style={styles.gameTitle}>Minecraft</Text>
                  <Text style={styles.gameTags}>+ Tags</Text>
                </View>
              </View>
            </View>

            {/* Games I Like Widget */}
            <View style={styles.widgetCard}>
              <View style={styles.widgetCardHeader}>
                <View>
                  <Text style={styles.widgetName}>Games I Like</Text>
                  <Text style={styles.widgetDesc}>Add up to 20 games</Text>
                </View>
                <TouchableOpacity style={styles.widgetAddBtn}><Plus size={16} color={colors.text} /></TouchableOpacity>
              </View>
              
              <View style={styles.gameRow}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/67/Fortnite_cover_art.png/220px-Fortnite_cover_art.png' }} style={styles.gameCover} />
                <View style={styles.gameInfo}>
                  <Text style={styles.gameTitle}>FORTNITE</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  closeBtn: { position: 'absolute', top: 24, right: 24, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bg2, alignItems: 'center', justifyContent: 'center' },
  layout: { width: '95%', maxWidth: 1200, height: '90%', backgroundColor: colors.bg, borderRadius: 16, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  
  // Left Panel
  leftPanel: { width: 280, backgroundColor: colors.bg2, borderRightWidth: 1, borderRightColor: colors.border },
  leftHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 8 },
  leftTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  sectionLabel: { color: colors.text, fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 16 },
  nameplatePreview: { height: 40, backgroundColor: colors.bg3, borderRadius: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  nameplateAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.textDim, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  nameplateLine: { flex: 1, height: 8, backgroundColor: colors.bg4, borderRadius: 4 },
  squareBox: { width: 80, height: 80, borderRadius: 12, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  editIcon: { position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  colorBox: { height: 40, backgroundColor: '#1A1D3A', borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  nitroBox: { backgroundColor: '#2A1B3D', borderRadius: 12, padding: 16, marginTop: 24, alignItems: 'center' },
  nitroLock: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  nitroTitle: { color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  nitroBtn: { backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, width: '100%', alignItems: 'center' },
  nitroBtnText: { color: '#000', fontSize: 14, fontWeight: '700' },

  // Middle Panel
  middlePanel: { flex: 1, backgroundColor: colors.bg },
  banner: { height: 160, backgroundColor: '#1A1D3A' },
  avatarWrap: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 32, marginTop: -48 },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 6, borderColor: colors.bg, backgroundColor: colors.bg3 },
  statusBubble: { backgroundColor: colors.bg3, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 16, marginBottom: 8 },
  statusText: { color: colors.text, fontSize: 12 },
  infoWrap: { padding: 32 },
  displayName: { color: colors.text, fontSize: 24, fontWeight: '800' },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  username: { color: colors.textDim, fontSize: 14 },
  dot: { color: colors.textDim },
  serverTag: { backgroundColor: colors.bg2, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: colors.border },
  serverTagText: { color: colors.textDim, fontSize: 11, fontWeight: '600' },
  badgesRow: { flexDirection: 'row', gap: 4, marginTop: 12 },
  badge: { width: 24, height: 24, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  msgBtn: { flexDirection: 'row', backgroundColor: colors.accent, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', gap: 8 },
  msgBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  iconBtn: { width: 40, height: 40, borderRadius: 8, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center' },
  section: { marginTop: 24 },
  sectionTitle: { color: colors.text, fontSize: 12, fontWeight: '700', marginBottom: 8 },
  sectionContent: { color: colors.textDim, fontSize: 14 },
  connectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  connectIcon: { width: 20, height: 20, borderRadius: 4, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  connectText: { color: colors.text, fontSize: 14 },

  // Right Panel
  rightPanel: { width: 340, backgroundColor: colors.bg2, borderLeftWidth: 1, borderLeftColor: colors.border, padding: 24 },
  tabsRow: { flexDirection: 'row', gap: 20, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 24 },
  tab: { paddingBottom: 12 },
  tabActive: { position: 'relative' },
  tabText: { color: colors.textDim, fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: colors.text, fontWeight: '700' },
  tabIndicator: { position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, backgroundColor: colors.text },
  widgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  widgetTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  addWidgetBtn: { backgroundColor: colors.bg3, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  addWidgetText: { color: colors.text, fontSize: 12, fontWeight: '600' },
  widgetCard: { backgroundColor: colors.bg3, borderRadius: 12, padding: 16, marginBottom: 16 },
  widgetCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  widgetName: { color: colors.text, fontSize: 14, fontWeight: '700' },
  widgetDesc: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  widgetAddBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.bg4, alignItems: 'center', justifyContent: 'center' },
  gameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  gameCover: { width: 56, height: 72, borderRadius: 8, marginRight: 16 },
  gameInfo: { flex: 1 },
  gameTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  gameTags: { color: colors.textDim, fontSize: 12, marginTop: 4 },
});