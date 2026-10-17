import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Pressable } from 'react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { absUrl, api } from '../lib/api';
import { statusColor } from '../lib/usePresence';

const STATUS_OPTIONS: Array<{ key: 'online' | 'idle' | 'dnd' | 'offline'; label: string }> = [
  { key: 'online', label: 'Online' },
  { key: 'idle', label: 'Idle' },
  { key: 'dnd', label: 'Do Not Disturb' },
  { key: 'offline', label: 'Invisible' },
];

export default function UserPanel({ onOpenSettings }: { onOpenSettings?: () => void }) {
  const { user, logout, refreshUser, setUserLocal } = useAuth();
  const [statusModal, setStatusModal] = useState(false);

  const avatar = absUrl(user?.avatar_url);
  const currentStatus = (user?.status as any) ?? 'online';

  async function setStatus(s: 'online' | 'idle' | 'dnd' | 'offline') {
    setStatusModal(false);
    if (user) setUserLocal({ ...user, status: s });
    try { await api.updateMe({ status: s }); } catch {}
  }

  return (
    <>
      <View style={styles.panel}>
        <TouchableOpacity style={styles.left} onPress={() => onOpenSettings && onOpenSettings()}>
          <View style={styles.avatarWrap}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarText}>{user?.username?.[0]?.toUpperCase() ?? '?'}</Text>
              </View>
            )}
            <View style={[styles.statusDot, { backgroundColor: statusColor(currentStatus) }]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>{user?.username}</Text>
            <TouchableOpacity onPress={() => setStatusModal(true)}>
              <Text style={styles.status} numberOfLines={1}>{currentStatus}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>⇥</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={statusModal} transparent animationType="fade" onRequestClose={() => setStatusModal(false)}>
        <Pressable style={styles.modalBg} onPress={() => setStatusModal(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Status</Text>
            {STATUS_OPTIONS.map((s) => (
              <TouchableOpacity key={s.key} style={styles.statusRow} onPress={() => setStatus(s.key)}>
                <View style={[styles.statusRowDot, { backgroundColor: statusColor(s.key) }]} />
                <Text style={styles.statusLabel}>{s.label}</Text>
                {currentStatus === s.key && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  panel: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bg, paddingHorizontal: 8, paddingVertical: 8,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  left: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  avatarWrap: { position: 'relative', marginRight: 8 },
  avatar: { width: 34, height: 34, borderRadius: 17 },
  avatarFallback: { backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  statusDot: {
    position: 'absolute', right: -2, bottom: -2, width: 12, height: 12,
    borderRadius: 6, borderWidth: 2, borderColor: colors.bg,
  },
  name: { color: colors.text, fontSize: 14, fontWeight: '700' },
  status: { color: colors.textDim, fontSize: 11, textTransform: 'capitalize', marginTop: 1 },
  logoutBtn: { paddingHorizontal: 8, paddingVertical: 6 },
  logoutText: { color: colors.textDim, fontSize: 18 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', paddingBottom: 60, paddingHorizontal: 24 },
  modalCard: { backgroundColor: colors.card, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: colors.border },
  modalTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 8, paddingHorizontal: 8 },
  statusRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8 },
  statusRowDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  statusLabel: { color: colors.text, fontSize: 15, flex: 1 },
  check: { color: colors.accent, fontWeight: '800' },
});