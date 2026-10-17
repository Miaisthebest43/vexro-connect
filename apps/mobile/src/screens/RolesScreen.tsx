import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { api } from '../lib/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Roles'>;

const AVAILABLE_PERMS = [
  { id: 'manage_channels', label: 'Manage Channels' },
  { id: 'manage_roles', label: 'Manage Roles' },
  { id: 'kick_members', label: 'Kick Members' },
  { id: 'ban_members', label: 'Ban Members' },
  { id: 'delete_messages', label: 'Delete Messages' },
  { id: 'manage_reports', label: 'Review Reports' },
];

export default function RolesScreen({ route, navigation }: Props) {
  const { serverId } = route.params;
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#8285FF');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  const load = useCallback(async () => {
    try { const r = await api.getRoles(serverId); setRoles(r.roles); }
    catch (e: any) { Alert.alert('Failed', e.message); }
    finally { setLoading(false); }
  }, [serverId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function onCreate() {
    if (!name.trim()) return;
    try {
      await api.createRole(serverId, name.trim(), color);
      setName(''); setCreating(false); load();
    } catch (e: any) { Alert.alert('Failed', e.message); }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></TouchableOpacity>
        <Text style={styles.title}>Roles</Text>
        <TouchableOpacity onPress={() => setCreating(true)}><Text style={styles.action}>+ Add</Text></TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} /> : (
        <FlatList
          data={roles}
          keyExtractor={r => r.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={styles.empty}>No custom roles.</Text>}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={[styles.colorDot, { backgroundColor: item.color }]} />
              <Text style={styles.roleName}>{item.name}</Text>
              <Text style={styles.rolePermsCount}>{item.permissions?.length || 0} perms</Text>
            </View>
          )}
        />
      )}

      <Modal visible={creating} transparent animationType="fade" onRequestClose={() => setCreating(false)}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create Role</Text>
            <TextInput style={styles.input} placeholder="Role Name" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Hex Color (e.g. #8285FF)" placeholderTextColor={colors.textMuted} value={color} onChangeText={setColor} />
            
            <Text style={styles.sectionLabel}>Permissions</Text>
            {AVAILABLE_PERMS.map(p => (
              <TouchableOpacity
                key={p.id} style={styles.permRow}
                onPress={() => setSelectedPerms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
              >
                <View style={[styles.checkbox, selectedPerms.includes(p.id) && styles.checkboxOn]} />
                <Text style={styles.permLabel}>{p.label}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.modalRow}>
              <TouchableOpacity onPress={() => setCreating(false)} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={async () => {
                if(!name.trim()) return;
                try {
                  await api.createRole(serverId, name.trim(), color);
                  setCreating(false); setName(''); load();
                } catch(e: any) { Alert.alert('Failed', e.message); }
              }} style={styles.confirmBtn}><Text style={styles.confirmText}>Create</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { color: colors.accent, fontSize: 24, width: 30 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  action: { color: colors.accent, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.card, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  colorDot: { width: 16, height: 16, borderRadius: 8, marginRight: 12 },
  roleName: { color: colors.text, fontSize: 16, fontWeight: '600', flex: 1 },
  rolePermsCount: { color: colors.textDim, fontSize: 12 },
  empty: { color: colors.textDim, textAlign: 'center', marginTop: 40 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: colors.bg2, borderRadius: 16, padding: 20 },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 16 },
  input: { backgroundColor: colors.bg4, color: colors.text, padding: 14, borderRadius: 10, marginBottom: 12 },
  sectionLabel: { color: colors.textDim, fontSize: 12, fontWeight: '700', marginTop: 8, marginBottom: 8 },
  permRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: colors.border, marginRight: 12 },
  checkboxOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  permLabel: { color: colors.text, fontSize: 14 },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 24 },
  cancelBtn: { padding: 12 }, cancelText: { color: colors.textDim },
  confirmBtn: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: colors.accent, borderRadius: 10 },
  confirmText: { color: '#fff', fontWeight: '700' }
});