import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, useWindowDimensions } from 'react-native';
import { Phone, Video, Pin, Users, Search, Plus, Gift, Sticker, Smile, SmilePlus, PhoneCall, UserPlus } from 'lucide-react-native';
import { colors } from '../theme/colors';

const MEMBERS = [
  { name: 'Yak', status: 'DH', color: '#F59E0B' },
  { name: 'exoish', status: 'Z\'s', color: '#A855F7' },
  { name: 'Fairy', status: '', color: '#5865F2', active: true },
  { name: 'Chase', status: '', color: '#3B82F6' },
  { name: 'Bre.', status: 'WEED', color: '#10B981' },
  { name: 'GNatty', status: '👑', color: '#EF4444' },
  { name: 'Marii', status: '', color: '#F472B6' },
  { name: 'Elii', status: '', color: '#FCD34D' },
];

export default function VexroChatScreen({ channelName = 'Goats', onStartCall }: { channelName?: string, onStartCall?: () => void }) {
  const { width } = useWindowDimensions();
  const showMembers = width > 1000;
  const [input, setInput] = useState('');

  return (
    <View style={styles.container}>
      {/* Main Chat Area */}
      <View style={styles.chatArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginRight: 8 }}>🐐</Text>
            <Text style={styles.headerName}>{channelName}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn} onPress={onStartCall}><Phone size={20} color={colors.textDim} /></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={onStartCall}><Video size={20} color={colors.textDim} /></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}><Pin size={20} color={colors.textDim} /></TouchableOpacity>
            {!showMembers && <TouchableOpacity style={styles.iconBtn}><Users size={20} color={colors.textDim} /></TouchableOpacity>}
            
            <View style={styles.searchBar}>
              <TextInput style={styles.searchInput} placeholder="Search Goats" placeholderTextColor="#949BA4" />
              <Search size={16} color="#949BA4" style={{ marginRight: 8 }} />
            </View>
          </View>
        </View>

        {/* Chat History */}
        <ScrollView style={styles.chatHistory} contentContainerStyle={{ paddingBottom: 20 }}>
          
          {/* Call Banner */}
          <View style={styles.callBanner}>
            <View style={styles.callAvatars}>
              <View style={[styles.largeAvatar, { backgroundColor: '#10B981', left: 20 }]}><Text style={{fontSize: 40}}>🐐</Text></View>
              <View style={[styles.largeAvatar, { backgroundColor: '#313338', right: 20 }]}><Text style={{fontSize: 40}}>🐶</Text></View>
            </View>
            <View style={styles.callButtons}>
              <TouchableOpacity style={styles.videoBtn}><Video size={24} color="#fff" /></TouchableOpacity>
              <TouchableOpacity style={styles.videoBtn}><PhoneCall size={24} color="#fff" /></TouchableOpacity>
            </View>
          </View>

          {/* Image Grid (Mock) */}
          <View style={styles.imageGrid}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop' }} style={styles.gridImage} />
            <Image source={{ uri: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop' }} style={styles.gridImage} />
            <Image source={{ uri: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400&auto=format&fit=crop' }} style={styles.gridImage} />
            <Image source={{ uri: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=400&auto=format&fit=crop' }} style={styles.gridImage} />
            <Image source={{ uri: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop' }} style={styles.gridImage} />
          </View>

          {/* Call Log */}
          <View style={styles.callLog}>
            <PhoneCall size={20} color="#23A559" style={{ marginRight: 12 }} />
            <Text style={styles.callText}>
              <Text style={{ color: '#F2F3F5', fontWeight: '500' }}>Chase</Text> started a call. — <Text style={{ color: '#00A8FC' }}>Join the call</Text>
            </Text>
            <Text style={styles.timeText}>11:15 PM</Text>
          </View>

          {/* Messages */}
          <View style={styles.messageRow}>
            <View style={styles.msgAvatar}><Text>💀</Text></View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={styles.msgName}>Bre. <Text style={{ fontSize: 10, backgroundColor: '#23A559', paddingHorizontal: 4, borderRadius: 4, color: '#fff' }}>WEED</Text></Text>
                <Text style={styles.timeText}>11:15 PM</Text>
              </View>
              <Text style={styles.msgText}>Oh em gee</Text>
              <Text style={styles.msgText}>Damn when yall call</Text>
              <Text style={styles.msgText}>Oh I'm slow</Text>
            </View>
          </View>

          <View style={styles.newMessageDivider}>
            <View style={styles.dividerLine} />
            <View style={styles.newBadge}><Text style={styles.newText}>NEW</Text></View>
          </View>
        </ScrollView>

        {/* Input Box */}
        <View style={styles.inputWrap}>
          <TouchableOpacity style={styles.plusBtn}><Plus size={24} color={colors.textDim} /></TouchableOpacity>
          <TextInput 
            style={styles.input} 
            placeholder={`Message ${channelName}`} 
            placeholderTextColor="#949BA4"
            value={input}
            onChangeText={setInput}
          />
          <View style={styles.inputActions}>
            <TouchableOpacity style={styles.inputIcon}><Gift size={20} color="#949BA4" /></TouchableOpacity>
            <TouchableOpacity style={styles.inputIcon}><Text style={{ color: '#949BA4', fontWeight: '700', fontSize: 12 }}>GIF</Text></TouchableOpacity>
            <TouchableOpacity style={styles.inputIcon}><Sticker size={20} color="#949BA4" /></TouchableOpacity>
            <TouchableOpacity style={styles.inputIcon}><Smile size={20} color="#949BA4" /></TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Right Sidebar (Members) */}
      {showMembers && (
        <View style={styles.memberList}>
          <ScrollView>
            <Text style={styles.memberHeader}>Members—8</Text>
            {MEMBERS.map((m, i) => (
              <TouchableOpacity key={i} style={[styles.memberRow, m.active && styles.memberRowActive]}>
                <View style={[styles.memberAvatar, { backgroundColor: m.color }]}>
                  <Text style={{ fontSize: 16 }}>👤</Text>
                </View>
                <View>
                  <Text style={[styles.memberName, m.active && { color: '#fff' }]}>{m.name} {m.status ? <Text style={{ color: '#F59E0B' }}>{m.status}</Text> : null}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity style={styles.inviteBtn}>
            <UserPlus size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.inviteText}>Invite to Group DM</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#313338' },
  
  // Main Chat
  chatArea: { flex: 1, backgroundColor: '#313338' },
  header: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#26272B' },
  headerName: { color: '#F2F3F5', fontSize: 16, fontWeight: '700' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBtn: { padding: 4 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1F22', borderRadius: 4, width: 144, height: 24 },
  searchInput: { flex: 1, color: '#F2F3F5', fontSize: 12, paddingHorizontal: 8 },

  chatHistory: { flex: 1 },
  
  // Call Banner
  callBanner: { height: 280, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  callAvatars: { flexDirection: 'row', marginBottom: 20 },
  largeAvatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  callButtons: { flexDirection: 'row', gap: 16 },
  videoBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#23A559', alignItems: 'center', justifyContent: 'center' },

  // Image Grid
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, padding: 16, justifyContent: 'center' },
  gridImage: { width: '48%', height: 120, borderRadius: 4 },

  // Messages
  callLog: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginVertical: 12 },
  callText: { color: '#949BA4', fontSize: 14, flex: 1 },
  timeText: { color: '#949BA4', fontSize: 12, marginLeft: 8 },
  
  messageRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16 },
  msgAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E1F22', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  msgName: { color: '#F2F3F5', fontSize: 15, fontWeight: '500', marginRight: 8 },
  msgText: { color: '#DBDEE1', fontSize: 15, lineHeight: 22 },

  newMessageDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#DA373C' },
  newBadge: { backgroundColor: '#DA373C', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: -4 },
  newText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  // Input Box
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#383A40', marginHorizontal: 16, marginBottom: 24, borderRadius: 8, paddingHorizontal: 16 },
  plusBtn: { marginRight: 16 },
  input: { flex: 1, color: '#F2F3F5', fontSize: 15, height: 44 },
  inputActions: { flexDirection: 'row', gap: 12 },
  inputIcon: { padding: 4 },

  // Member List
  memberList: { width: 240, backgroundColor: '#2B2D31', paddingTop: 16 },
  memberHeader: { color: '#949BA4', fontSize: 12, fontWeight: '600', marginLeft: 16, marginBottom: 12 },
  memberRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 6, marginHorizontal: 8, borderRadius: 4 },
  memberRowActive: { backgroundColor: '#404249' },
  memberAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  memberName: { color: '#949BA4', fontSize: 14, fontWeight: '500' },
  
  inviteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4E5058', margin: 16, paddingVertical: 10, borderRadius: 4 },
  inviteText: { color: '#fff', fontSize: 14, fontWeight: '500' },
});