import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, ScrollView, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import { uploadFile, absUrl, api } from '../lib/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const STATUSES: Array<{ key: 'online' | 'idle' | 'dnd' | 'offline'; label: string; color: string }> = [
  { key: 'online', label: 'Online', color: colors.success },
  { key: 'idle', label: 'Idle', color: '#f5a623' },
  { key: 'dnd', label: 'Do not disturb', color: colors.danger },
  { key: 'offline', label: 'Invisible', color: colors.textDim },
];

export default function SettingsScreen({ navigation }: Props) {
  const { user, refreshUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [bio, setBio] = useState(user?.bio ?? '');
  const [saving, setSaving] = useState(false);

  async function onPickAvatar() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert('Permission needed'); return; }
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (r.canceled) return;
    const asset = r.assets[0]!;
    setUploading(true);
    try { await uploadFile('/upload/avatar', asset.uri, asset.mimeType ?? 'image/jpeg'); await refreshUser(); }
    catch (e: any) { Alert.alert('Failed', e.message); }
    finally { setUploading(false); }
  }

  async function onSaveBio() {
    setSaving(true);
    try { await api.updateMe({ bio }); await refreshUser(); Alert.alert('Saved'); }
    catch (e: any) { Alert.alert('Failed', e.message); }
    finally { setSaving(false); }
  }

  async function onSetStatus(status: 'online' | 'idle' | 'dnd' | 'offline') {
    try { await api.updateMe({ status }); await refreshUser(); }
    catch (e: any) { Alert.alert('Failed', e.message); }
  }

  const avatarUrl = absUrl(user?.avatar_url);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>â€¹</Text></TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.profileBlock}>
        <TouchableOpacity onPress={onPickAvatar} disabled={uploading}>
          {avatarUrl ? <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            : <View style={[styles.avatar, styles.avatarFallback]}><Text style={styles.avatarText}>{user?.username[0].toUpperCase()}</Text></View>}
          {uploading && <View style={styles.avatarOverlay}><ActivityIndicator color="#fff" /></View>}
        </TouchableOpacity>
        <Text style={styles.username}>@{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bio</Text>
        <TextInput style={styles.input} value={bio} onChangeText={setBio} placeholder="Tell people about yourself" placeholderTextColor={colors.textDim} maxLength={200} multiline />
        <TouchableOpacity onPress={onSaveBio} disabled={saving} style={styles.saveBtn}>
          <Text style={styles.saveText}>{saving ? 'Savingâ€¦' : 'Save bio'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>
        {STATUSES.map((s) => (
          <TouchableOpacity key={s.key} style={styles.statusRow} onPress={() => onSetStatus(s.key)}>
            <View style={[styles.statusDot, { backgroundColor: s.color }]} />
            <Text style={styles.statusLabel}>{s.label}</Text>
            {user?.status === s.key && <Text style={styles.check}>âœ“</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { color: colors.accent, fontSize: 24, width: 30 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  profileBlock: { alignItems: 'center', marginTop: 32, paddingHorizontal: 24 },
  avatar: { width: 120, height: 120, borderRadius: 36 },
  avatarFallback: { backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 52, fontWeight: '800' },
  avatarOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: 36, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  username: { color: colors.text, fontSize: 22, fontWeight: '700', marginTop: 16 },
  email: { color: colors.textDim, marginTop: 4 },
  section: { marginTop: 32, paddingHorizontal: 24 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: colors.card, color: colors.text, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: colors.border, minHeight: 80 },
  saveBtn: { marginTop: 12, backgroundColor: colors.accent, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, backgroundColor: colors.card, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  statusDot: { width: 14, height: 14, borderRadius: 7, marginRight: 12 },
  statusLabel: { color: colors.text, fontSize: 15, flex: 1 },
  check: { color: colors.accent, fontSize: 18, fontWeight: '800' },
});