import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { api } from '../lib/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Safety'>;

export default function SafetyScreen({ navigation }: Props) {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try { const r = await api.listBlocks(); setBlocks(Array.isArray(r.blocks) ? r.blocks : []); }
    catch {}
    finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function unblock(userId: string) {
    try { await api.unblockUser(userId); load(); }
    catch (e: any) { Alert.alert('Failed', e.message); }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></TouchableOpacity>
        <Text style={styles.title}>Safety Center</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.intro}>
        <Text style={styles.introTitle}>Your safety, your control</Text>
        <Text style={styles.introText}>
          VEXRO Connect puts safety first. Manage who can contact you, review blocked accounts, and access reporting tools.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <Row label="Profile visibility" value="Friends & communities" />
        <Row label="Who can DM you" value="Friends only" />
        <Row label="Who can friend request" value="Everyone" />
        <Row label="Online status" value="Visible" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Blocked accounts ({blocks.length})</Text>
        {loading ? <ActivityIndicator color={colors.accent} /> : blocks.length === 0 ? (
          <Text style={styles.emptyText}>You haven't blocked anyone.</Text>
        ) : (
          blocks.map(b => (
            <View key={b.blocked_id} style={styles.blockRow}>
              <View style={styles.blockAvatar}>
                <Text style={styles.blockAvatarText}>{(b.username || '?')[0].toUpperCase()}</Text>
              </View>
              <Text style={styles.blockName}>@{b.username}</Text>
              <TouchableOpacity onPress={() => unblock(b.blocked_id)} style={styles.unblockBtn}>
                <Text style={styles.unblockText}>Unblock</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reporting</Text>
        <Text style={styles.sectionText}>
          To report a message, user, or community, long-press the content and select "Report". All reports are reviewed by moderators.
        </Text>
      </View>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { color: colors.accent, fontSize: 24, width: 30 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  intro: { padding: 24, borderBottomWidth: 1, borderBottomColor: colors.border },
  introTitle: { color: colors.text, fontSize: 22, fontWeight: '800', marginBottom: 8 },
  introText: { color: colors.textDim, lineHeight: 22 },
  section: { padding: 24, borderBottomWidth: 1, borderBottomColor: colors.border },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  sectionText: { color: colors.textDim, lineHeight: 22 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { color: colors.text, fontSize: 15 },
  rowValue: { color: colors.textDim, fontSize: 14 },
  emptyText: { color: colors.textDim, fontStyle: 'italic' },
  blockRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  blockAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  blockAvatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  blockName: { color: colors.text, fontSize: 15, flex: 1 },
  unblockBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  unblockText: { color: colors.textDim, fontSize: 13 },
});