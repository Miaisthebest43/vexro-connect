import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Hash, Volume2, ChevronDown } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function ChannelSidebar({ onSelectChannel, activeChannel }: { onSelectChannel?: (ch: string) => void, activeChannel?: string }) {
  const ChannelItem = ({ name, icon: Icon }: { name: string, icon: any }) => {
    const isActive = activeChannel === name;
    return (
      <TouchableOpacity style={[styles.channel, isActive && styles.channelActive]} onPress={() => onSelectChannel && onSelectChannel(name)}>
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.category}>
          <Text style={styles.categoryText}>TEXT CHANNELS</Text>
        </View>
        <ChannelItem name="general" icon={Hash} />
        <ChannelItem name="announcements" icon={Hash} />
        <ChannelItem name="dev-talk" icon={Hash} />

        <View style={[styles.category, { marginTop: 24 }]}>
          <Text style={styles.categoryText}>VOICE CHANNELS</Text>
        </View>
        <ChannelItem name="Lounge" icon={Volume2} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: { width: 240, backgroundColor: colors.bg2, borderRightWidth: 1, borderRightColor: colors.border },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.bg3 },
  headerText: { ...typography.h3, color: colors.text },
  scrollContent: { padding: 12 },
  category: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 8 },
  categoryText: { ...typography.label, color: colors.textDim, flex: 1 },
  channel: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginBottom: 4 },
  channelActive: { backgroundColor: colors.bg3 },
  channelTextActive: { color: colors.text, fontWeight: '600' },
  channelText: { ...typography.body, color: colors.textMuted, fontWeight: '500' },
});