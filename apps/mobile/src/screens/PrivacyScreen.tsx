import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Lock, Eye, Shield } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function PrivacyScreen() {
  const [dmSetting, setDmSetting] = useState('Friends');
  const [readReceipts, setReadReceipts] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const Toggle = ({ value, onToggle }: { value: boolean, onToggle: () => void }) => (
    <TouchableOpacity onPress={onToggle} style={[styles.toggleWrap, value && styles.toggleWrapActive]}>
      <View style={[styles.toggleDot, value && styles.toggleDotActive]} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Privacy</Text>
      <Text style={styles.headerDesc}>Control who can see your info and how your data is used.</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconBox}><Lock size={20} color={colors.accent} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Direct Messages</Text>
            <Text style={styles.rowDesc}>Who can send you a direct message.</Text>
          </View>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>{dmSetting}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View style={styles.iconBox}><Eye size={20} color={colors.accent} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Read Receipts</Text>
            <Text style={styles.rowDesc}>Let others know when you've read their messages.</Text>
          </View>
          <Toggle value={readReceipts} onToggle={() => setReadReceipts(!readReceipts)} />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View style={styles.iconBox}><Shield size={20} color={colors.accent} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Data Sharing</Text>
            <Text style={styles.rowDesc}>Allow VEXRO to use your data for personalized ads.</Text>
          </View>
          <Toggle value={dataSharing} onToggle={() => setDataSharing(!dataSharing)} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 32, maxWidth: 800 },
  headerTitle: { color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 8 },
  headerDesc: { color: colors.textDim, fontSize: 14, marginBottom: 32 },
  card: { backgroundColor: colors.bg2, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  rowTitle: { color: colors.text, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  rowDesc: { color: colors.textDim, fontSize: 13 },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 56 },
  dropdown: { backgroundColor: colors.bg3, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  dropdownText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  toggleWrap: { width: 44, height: 24, borderRadius: 12, backgroundColor: colors.bg4, justifyContent: 'center', padding: 2 },
  toggleWrapActive: { backgroundColor: colors.success },
  toggleDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  toggleDotActive: { alignSelf: 'flex-end' },
});