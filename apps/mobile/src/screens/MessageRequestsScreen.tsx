import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Mail, Shield, ChevronRight } from 'lucide-react-native';
import { colors } from '../theme/colors';

const REQUESTS = [
  { id: '1', name: 'Kelsey', username: 'jubilant_swan_62203', time: '6d ago', mutuals: '1 Mutual Server', avatar: 'K', color: '#F0B232' },
  { id: '2', name: 'jovial_dolphin_2408', username: '', time: '7d ago', mutuals: '1 Mutual Server', avatar: 'J', color: '#DA373C' },
  { id: '3', name: 'prime_monkey_05660', username: '', time: '8d ago', mutuals: '2 Mutual Servers', avatar: 'P', color: '#9B59B6' },
  { id: '4', name: 'Charlie chaplin', username: 'united_dragon_52614', time: '>30d ago', mutuals: '1 Mutual Server', avatar: 'C', color: '#3498DB' },
  { id: '5', name: 'Queens Alexander', username: 'queensalexander', time: '>30d ago', mutuals: '2 Mutual Servers', avatar: 'Q', color: '#E74C3C' },
  { id: '6', name: 'Servant231', username: 'valiant_fawn_63194', time: '>30d ago', mutuals: '1 Mutual Server', avatar: 'S', color: '#F39C12' },
  { id: '7', name: 'Kennedy', username: 'hureee0185', time: '>30d ago', mutuals: '1 Mutual Server', avatar: 'K', color: '#95A5A6' },
  { id: '8', name: 'zaterskill84', username: '', time: '>30d ago', mutuals: '1 Mutual Server', avatar: 'Z', color: '#7F8C8D' },
  { id: '9', name: 'cute_quail_23860', username: '', time: '>30d ago', mutuals: '1 Mutual Server', avatar: 'C', color: '#2ECC71' },
];

export default function MessageRequestsScreen() {
  const [activeTab, setActiveTab] = useState('Requests');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Mail size={24} color={colors.textDim} />
          <Text style={styles.headerTitle}>Message Requests</Text>
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => setActiveTab('Requests')} style={[styles.tab, activeTab === 'Requests' && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === 'Requests' && styles.tabTextActive]}>Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('Spam')} style={[styles.tab, activeTab === 'Spam' && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === 'Spam' && styles.tabTextActive]}>Spam</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={styles.sectionTitle}>Pending Requests — {REQUESTS.length}</Text>
        
        {REQUESTS.map((req) => (
          <View key={req.id} style={styles.requestRow}>
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: req.color }]}>
              <Text style={styles.avatarText}>{req.avatar}</Text>
            </View>
            
            {/* Info */}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <Text style={styles.name}>{req.name}</Text>
                {req.username ? <Text style={styles.username}> {req.username}</Text> : null}
                <Text style={styles.time}> {req.time}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Shield size={14} color={colors.accent} />
                <Text style={styles.mutualText}>{req.mutuals}</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.ignoreBtn}>
                <Text style={styles.ignoreText}>Ignore</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptBtn}>
                <Text style={styles.acceptText}>Accept DM</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginLeft: 8 },
  divider: { width: 1, height: 24, backgroundColor: colors.border, marginHorizontal: 16 },
  tab: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4, marginRight: 8 },
  tabActive: { backgroundColor: colors.bg3 },
  tabText: { color: colors.textDim, fontSize: 14, fontWeight: '500' },
  tabTextActive: { color: colors.text, fontWeight: '600' },
  
  sectionTitle: { color: colors.textDim, fontSize: 12, fontWeight: '600', marginBottom: 16 },
  
  requestRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: colors.text, fontSize: 16, fontWeight: '700' },
  name: { color: colors.text, fontSize: 15, fontWeight: '700' },
  username: { color: colors.textDim, fontSize: 14 },
  time: { color: colors.textMuted, fontSize: 12 },
  mutualText: { color: colors.textDim, fontSize: 12, marginLeft: 6 },
  
  ignoreBtn: { backgroundColor: colors.bg3, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4, borderWidth: 1, borderColor: colors.border },
  ignoreText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  acceptBtn: { backgroundColor: colors.accent, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4 },
  acceptText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});