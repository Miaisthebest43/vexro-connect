import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../lib/api';
import { colors } from '../theme/colors';

export default function QuickSwitcher({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const nav = useNavigation<any>();
  const [q, setQ] = useState('');
  const [servers, setServers] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!visible) return;
    (async () => {
      try { const r = await api.listServers(); setServers(r.servers); setResults(r.servers); }
      catch {}
    })();
  }, [visible]);

  useEffect(() => {
    if (!q.trim()) { setResults(servers); return; }
    const lower = q.toLowerCase();
    setResults(servers.filter(s => s.name.toLowerCase().includes(lower)));
  }, [q, servers]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.bg} activeOpacity={1} onPress={onClose}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <TextInput
            style={styles.input}
            placeholder="Jump to a community..."
            placeholderTextColor={colors.textMuted}
            value={q}
            onChangeText={setQ}
            autoFocus
          />
          <FlatList
            data={results}
            keyExtractor={s => s.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => { onClose(); nav.navigate('Channels', { serverId: item.id, serverName: item.name }); }}
              >
                <View style={styles.icon}><Text style={styles.iconText}>{item.name[0].toUpperCase()}</Text></View>
                <Text style={styles.name}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No communities found.</Text>}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-start', paddingTop: 120, paddingHorizontal: 24 },
  card: { backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, maxHeight: 500, overflow: 'hidden' },
  input: { color: colors.text, fontSize: 16, padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  icon: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  iconText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  name: { color: colors.text, fontSize: 15 },
  empty: { color: colors.textDim, textAlign: 'center', padding: 24 },
});