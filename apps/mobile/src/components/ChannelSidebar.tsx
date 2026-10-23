import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Hash, Volume2, Plus, ChevronDown } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function ChannelSidebar() {
  const Channel = ({ name, type }: { name: string, type: 'text' | 'voice' }) => (
    <TouchableOpacity style={[styles.channel, name === 'general' && styles.activeChannel]}>
      {type === 'text' ? <Hash size={18} color={name === 'general' ? colors.text : colors.textDim} /> : <Volume2 size={18} color={name === 'general' ? colors.text : colors.textDim} />}
      <Text style={[styles.channelText, name === 'general' && styles.activeChannelText]}>{name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header}>
        <Text style={styles.headerTitle}>Roblox Developers</Text>
        <ChevronDown size={16} color={colors.text} />
      </TouchableOpacity>
      
      <ScrollView style={{ padding: 12 }}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TEXT CHANNELS</Text>
          <Plus size={14} color={colors.textDim} />
        </View>
        <Channel name="general" type="text" />
        <Channel name="announcements" type="text" />
        <Channel name="resources" type="text" />
        <Channel name="showcase" type="text" />
        <Channel name="support" type="text" />

        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>VOICE CHANNELS</Text>
          <Plus size={14} color={colors.textDim} />
        </View>
        <Channel name="General" type="voice" />
        <Channel name="Game Chat" type="voice" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 240, backgroundColor: colors.bg2, borderRightWidth: 1, borderRightColor: colors.border },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.bg2 },
  headerTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingHorizontal: 8 },
  sectionTitle: { color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  channel: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 8, borderRadius: 6, marginBottom: 2 },
  activeChannel: { backgroundColor: colors.bg3 },
  channelText: { color: colors.textDim, fontSize: 15, fontWeight: '500', marginLeft: 8 },
  activeChannelText: { color: colors.text, fontWeight: '600' },
});