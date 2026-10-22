import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Hash, Volume2, ChevronDown, Users, Mail, Search, Mic, Headphones, Settings, Plus } from 'lucide-react-native';
import { colors } from '../theme/colors';

const DMS = [
  { id: '1', name: 'DØR †☆', status: 'A<3 tloml 💙', color: '#808080' },
  { id: '2', name: 'Bre.', status: 'WEED', color: '#2ecc71' },
  { id: '3', name: 'xMoonRatx', status: 'yoite cariño, solo pienso en ti', color: '#e74c3c' },
  { id: '4', name: 'kurxxed', status: 'WEED', color: '#9b59b6' },
  { id: '5', name: '2 barbies', status: '3 Members', color: '#3498db' },
];

export default function ChannelSidebar({ onSelectChannel, activeChannel, activeView, onSelectDM }: { onSelectChannel: (ch: string) => void, activeChannel: string, activeView: string, onSelectDM: (dm: any) => void }) {
  if (activeView === 'dashboard') {
    return (
      <View style={styles.sidebar}>
        <View style={styles.searchWrap}>
          <TextInput style={styles.searchInput} placeholder="Find or start a conversation" placeholderTextColor={colors.textMuted} />
        </View>
        
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.dmItem}><Users size={20} color={colors.textMuted} style={{marginRight: 12}}/><Text style={styles.dmText}>Friends</Text></TouchableOpacity>
          <TouchableOpacity style={styles.dmItem}><Mail size={20} color={colors.textMuted} style={{marginRight: 12}}/><Text style={styles.dmText}>Message Requests</Text></TouchableOpacity>
          
          <View style={[styles.category, { marginTop: 24 }]}>
            <Text style={styles.categoryText}>DIRECT MESSAGES</Text>
            <Plus size={16} color={colors.textMuted} />
          </View>
          
          {DMS.map((dm) => (
            <TouchableOpacity key={dm.id} style={styles.dmItem} onPress={() => onSelectDM(dm)}>
              <View style={[styles.avatar, { backgroundColor: dm.color }]}><Text style={styles.avatarText}>{dm.name[0]}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dmText}>{dm.name}</Text>
                {dm.status && <Text style={styles.dmStatus} numberOfLines={1}>{dm.status}</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* User Panel */}
        <View style={styles.userPanel}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { width: 32, height: 32, backgroundColor: colors.accent }]}><Text style={styles.avatarText}>F</Text></View>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.userName}>FairyTales</Text>
              <Text style={styles.userStatus}>Invisible</Text>
            </View>
          </View>
          <View style={styles.userActions}>
            <TouchableOpacity style={styles.iconBtn}><Mic size={18} color={colors.textDim} /></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}><Headphones size={18} color={colors.textDim} /></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}><Settings size={18} color={colors.textDim} /></TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Server View (Text Channels)
  const ChannelItem = ({ name, icon: Icon }: { name: string, icon: any }) => {
    const isActive = activeChannel === name;
    return (
      <TouchableOpacity style={[styles.channel, isActive && styles.channelActive]} onPress={() => onSelectChannel(name)}>
        <Icon size={18} color={isActive ? colors.text : colors.textMuted} style={{ marginRight: 8 }} />
        <Text style={[styles.channelText, isActive && styles.channelTextActive]}>{name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.sidebar}>
      <TouchableOpacity style={styles.header}>
        <Text style={styles.headerText}>VEXRO Connect</Text>
        <ChevronDown size={16} color={colors.text} />
      </TouchableOpacity>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        <View style={styles.category}><Text style={styles.categoryText}>TEXT CHANNELS</Text></View>
        <ChannelItem name="general" icon={Hash} />
        <ChannelItem name="announcements" icon={Hash} />
        <ChannelItem name="dev-talk" icon={Hash} />

        <View style={[styles.category, { marginTop: 24 }]}>
          <Text style={styles.categoryText}>VOICE CHANNELS</Text>
        </View>
        <ChannelItem name="Lounge" icon={Volume2} />
      </ScrollView>

      {/* User Panel */}
      <View style={styles.userPanel}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { width: 32, height: 32, backgroundColor: colors.accent }]}><Text style={styles.avatarText}>F</Text></View>
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.userName}>FairyTales</Text>
            <Text style={styles.userStatus}>Invisible</Text>
          </View>
        </View>
        <View style={styles.userActions}>
          <TouchableOpacity style={styles.iconBtn}><Mic size={18} color={colors.textDim} /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Headphones size={18} color={colors.textDim} /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Settings size={18} color={colors.textDim} /></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: { width: 260, backgroundColor: colors.bg2 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.bg2, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, zIndex: 10 },
  headerText: { color: colors.text, fontSize: 15, fontWeight: '700' },
  searchWrap: { padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchInput: { backgroundColor: colors.bg3, padding: 8, borderRadius: 4, color: colors.text, fontSize: 13 },
  scrollContent: { padding: 12 },
  category: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, marginTop: 16 },
  categoryText: { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  channel: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 8, borderRadius: 4, marginBottom: 2 },
  channelActive: { backgroundColor: colors.bg3 },
  channelTextActive: { color: colors.text, fontWeight: '500' },
  channelText: { color: colors.textMuted, fontSize: 15, fontWeight: '500' },
  dmItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 8, borderRadius: 4, marginBottom: 2 },
  dmText: { color: colors.textMuted, fontSize: 15, fontWeight: '500' },
  dmStatus: { color: colors.textMuted, fontSize: 12 },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  userPanel: { height: 52, backgroundColor: colors.bg3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userName: { color: colors.text, fontSize: 13, fontWeight: '700' },
  userStatus: { color: colors.textDim, fontSize: 11 },
  userActions: { flexDirection: 'row' },
  iconBtn: { padding: 6 },
});