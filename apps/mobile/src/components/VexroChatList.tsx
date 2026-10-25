import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, Mic, Headphones, Settings, Video } from 'lucide-react-native';
import { colors } from '../theme/colors';

const DMS = [
  { id: '1', name: 'Goats', msg: '8 Members', active: true, avatar: '🐐' },
  { id: '2', name: 'ahna', msg: 'Offline', avatar: '👤' },
  { id: '3', name: 's1eepy', msg: 'Offline', avatar: '🌙' },
  { id: '4', name: '♡~willow~♡', msg: 'Playing ROBLOX', avatar: '🌸' },
  { id: '5', name: 'Stareviee', msg: 'Offline', avatar: '☁️' },
  { id: '6', name: 'Jto_rawforyou', msg: 'Offline', avatar: '💀' },
  { id: '7', name: 'Izan7777', msg: 'Offline', avatar: '🎮' },
  { id: '8', name: 'Sanando ♡', msg: 'Offline', avatar: '🕊️' },
  { id: '9', name: 'Suaty', msg: 'Offline', avatar: '🥀' },
  { id: '10', name: 'King', msg: 'Offline', avatar: '👑' },
  { id: '11', name: 'DonutDice', msg: 'https://glaze.bet', avatar: '🍩' },
  { id: '12', name: 'unknown.', msg: 'Offline', avatar: '👻' },
  { id: '13', name: 'Ezzy_539', msg: 'Offline', avatar: '🧸' },
  { id: '14', name: 'addi', msg: 'Offline', avatar: '🎧' },
];

export default function VexroChatList({ onNavigate }: { onNavigate: (view: string) => void }) {
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.searchText}>Find or start a conversation</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Friends Button (Mock) */}
        <TouchableOpacity style={styles.friendsBtn}>
          <View style={styles.friendsIcon}><Text>👥</Text></View>
          <Text style={styles.friendsText}>Friends</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>DIRECT MESSAGES</Text>

        {DMS.map((dm) => (
          <TouchableOpacity 
            key={dm.id} 
            style={[styles.dmItem, dm.active && styles.dmItemActive]}
            onPress={() => onNavigate('messages')}
          >
            <View style={styles.avatar}>
              <Text style={{ fontSize: 16 }}>{dm.avatar}</Text>
              {dm.active && <View style={styles.activeDot} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.dmName, dm.active && { color: '#fff' }]}>{dm.name}</Text>
              <Text style={styles.dmMsg} numberOfLines={1}>{dm.msg}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* User Panel (Bottom Left) */}
      <View style={styles.userPanel}>
        <TouchableOpacity style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={{ fontSize: 16 }}>👩‍🦰</Text>
          </View>
          <View>
            <Text style={styles.userName}>Fairy</Text>
            <Text style={styles.userStatus}>Invisible</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.userActions}>
          <TouchableOpacity style={styles.actionIcon}><Mic size={18} color={colors.textDim} /></TouchableOpacity>
          <TouchableOpacity style={styles.actionIcon}><Headphones size={18} color={colors.textDim} /></TouchableOpacity>
          <TouchableOpacity style={styles.actionIcon} onPress={() => onNavigate('settings')}><Settings size={18} color={colors.textDim} /></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 240, backgroundColor: '#2B2D31', flex: 1 },
  searchWrap: { padding: 10, paddingBottom: 0 },
  searchBtn: { backgroundColor: '#1E1F22', padding: 6, borderRadius: 4, alignItems: 'center' },
  searchText: { color: '#949BA4', fontSize: 13, fontWeight: '500' },
  
  friendsBtn: { flexDirection: 'row', alignItems: 'center', padding: 10, marginHorizontal: 8, marginTop: 8, borderRadius: 4 },
  friendsIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#313338', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  friendsText: { color: '#F2F3F5', fontSize: 15, fontWeight: '500' },
  
  sectionTitle: { color: '#949BA4', fontSize: 11, fontWeight: '700', marginLeft: 18, marginTop: 16, marginBottom: 4 },
  
  dmItem: { flexDirection: 'row', alignItems: 'center', padding: 8, marginHorizontal: 8, borderRadius: 4, marginBottom: 2 },
  dmItemActive: { backgroundColor: '#404249' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#313338', alignItems: 'center', justifyContent: 'center', marginRight: 12, position: 'relative' },
  activeDot: { position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#23A559', borderWidth: 2, borderColor: '#404249' },
  dmName: { color: '#949BA4', fontSize: 15, fontWeight: '500' },
  dmMsg: { color: '#949BA4', fontSize: 12, marginTop: 2 },

  userPanel: { height: 52, backgroundColor: '#232428', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, justifyContent: 'space-between' },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#5865F2', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  userName: { color: '#F2F3F5', fontSize: 14, fontWeight: '600' },
  userStatus: { color: '#F2F3F5', fontSize: 12 },
  userActions: { flexDirection: 'row', gap: 4 },
  actionIcon: { padding: 6 },
});