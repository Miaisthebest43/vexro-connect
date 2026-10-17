import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Alert, ScrollView, Image, Share } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { api, uploadServerIcon, absUrl, type Member, type Invite } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'ServerSettings'>;

export default function ServerSettingsScreen({ route, navigation }: Props) {
  const { serverId, serverName } = route.params;
  const { user } = useAuth();
  const [server, setServer] = useState<any>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState(serverName);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await api.getServer(serverId);
      setServer(r.server); setName(r.server.name);
      const m = await api.listMembers(serverId); setMembers(m.members);
      const i = await api.listInvites(serverId); setInvites(i.invites);
      const r = await api.getRoles(serverId); setRoles(r.roles);
    } catch (e: any) { Alert.alert('Failed', e.message); }
    finally { setLoading(false); }
  }, [serverId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function onRename() {
    if (!name.trim() || name.trim() === server?.name) return;
    setSaving(true);
    try { await api.updateServer(serverId, { name: name.trim() }); await load(); }
    catch (e: any) { Alert.alert('Failed', e.message); }
    finally { setSaving(false); }
  }

  async function onPickIcon() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (r.canceled) return;
    setUploading(true);
    try { const u = await uploadServerIcon(serverId, r.assets[0].uri, r.assets[0].mimeType ?? 'image/jpeg'); await load(); }
    catch (e: any) { Alert.alert('Failed', e.message); }
    finally { setUploading(false); }
  }

  async function onCreateInvite() {
    try {
      const { invite } = await api.createInvite(serverId);
      await Share.share({ message: `Join ${serverName} on VEXRO: ${invite.code}` });
      load();
    } catch (e: any) { Alert.alert('Failed', e.message); }
  }

  if (loading) return <ActivityIndicator color={colors.accent} style={{ flex: 1, backgroundColor: colors.bg }} />;
  const iconUrl = absUrl(server?.icon_url);
  const isOwner = server?.owner_id === user?.id;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></TouchableOpacity>
        <Text style={styles.title}>Server Settings</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.iconBlock}>
        <TouchableOpacity onPress={onPickIcon} disabled={uploading}>
          {iconUrl ? <Image source={{ uri: iconUrl }} style={styles.icon} /> : <View style={[styles.icon, styles.iconFallback]}><Text style={styles.iconText}>{server?.name[0].toUpperCase()}</Text></View>}
          {uploading && <View style={styles.iconOverlay}><ActivityIndicator color="#fff" /></View>}
        </TouchableOpacity>
        <Text style={styles.hint}>Tap to change icon</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} maxLength={64} />
        <TouchableOpacity onPress={onRename} disabled={saving} style={styles.saveBtn}>
          <Text style={styles.saveText}>{saving ? 'Saving…' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={styles.sectionTitle}>Roles</Text>
          <TouchableOpacity onPress={async () => { await api.createRole(serverId, 'New Role', '#ff0000'); load(); }}><Text style={{ color: colors.accent }}>+ Add Role</Text></TouchableOpacity>
        </View>
        {roles.map(r => (
          <View key={r.id} style={styles.inviteRow}>
            <Text style={[styles.inviteCode, { color: r.color }]}>{r.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={styles.sectionTitle}>Invites</Text>
          <TouchableOpacity onPress={onCreateInvite}><Text style={{ color: colors.accent, fontWeight: '600' }}>+ Generate</Text></TouchableOpacity>
        </View>
        {invites.map(i => (
          <View key={i.code} style={styles.inviteRow}>
            <Text style={styles.inviteCode}>{i.code}</Text>
            <Text style={styles.inviteUses}>{i.uses} uses</Text>
          </View>
        ))}
        {invites.length === 0 && <Text style={styles.hint}>No active invites.</Text>}
      </View>

      {isOwner && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger zone</Text>
          <TouchableOpacity onPress={() => Alert.alert('Delete server?', 'Permanent.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { await api.deleteServer(serverId); navigation.popToTop(); } }])} style={[styles.dangerBtn, { borderColor: colors.danger }]}>
            <Text style={[styles.dangerText, { color: colors.danger }]}>Delete Server</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { color: colors.accent, fontSize: 24, width: 30 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  iconBlock: { alignItems: 'center', marginTop: 32 },
  icon: { width: 100, height: 100, borderRadius: 28 },
  iconFallback: { backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  iconText: { color: '#fff', fontSize: 44, fontWeight: '800' },
  iconOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: 28, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  hint: { color: colors.textDim, marginTop: 8, fontSize: 12 },
  section: { marginTop: 32, paddingHorizontal: 24 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: colors.bg2, color: colors.text, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  saveBtn: { marginTop: 12, backgroundColor: colors.accent, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700' },
  inviteRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.bg2, padding: 16, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  inviteCode: { color: colors.text, fontWeight: '700', fontSize: 16, letterSpacing: 2 },
  inviteUses: { color: colors.textDim },
  dangerBtn: { paddingVertical: 14, borderRadius: 10, borderWidth: 1, alignItems: 'center', marginBottom: 8 },
  dangerText: { fontWeight: '700' },
});