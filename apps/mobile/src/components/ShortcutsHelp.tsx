import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { colors } from '../theme/colors';

const SHORTCUTS = [
  { keys: '⌘ K', action: 'Quick switcher' },
  { keys: '⌘ /', action: 'Show shortcuts' },
  { keys: 'Esc', action: 'Close current modal' },
  { keys: 'Enter', action: 'Send message' },
  { keys: 'Shift + Enter', action: 'New line in message' },
  { keys: 'R', action: 'Reply to selected' },
  { keys: 'E', action: 'Edit selected message' },
];

export default function ShortcutsHelp({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.bg} onPress={onClose}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>Keyboard Shortcuts</Text>
          {SHORTCUTS.map(s => (
            <View key={s.keys} style={styles.row}>
              <Text style={styles.action}>{s.action}</Text>
              <View style={styles.keys}><Text style={styles.keysText}>{s.keys}</Text></View>
            </View>
          ))}
          <Text style={styles.footer}>Press Esc to close</Text>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  title: { color: colors.text, fontSize: 20, fontWeight: '800', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  action: { color: colors.text, fontSize: 14 },
  keys: { backgroundColor: colors.bg4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  keysText: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  footer: { color: colors.textDim, fontSize: 12, textAlign: 'center', marginTop: 20 },
});