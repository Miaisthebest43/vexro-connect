import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { api, absUrl, type Member } from '../lib/api';
import { colors } from '../theme/colors';

const statusColors: Record<string, string> = { online: colors.success, idle: colors.warning, dnd: colors.danger, offline: colors.textDim };

export default function MemberSidebar({ serverId, onClose }: { serverId: string; onClose: () => void }) {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    (async () => {
      try { const r = await api.listMembers(serverId); setMembers(r.members); }
      catch {}
    })();
  }, [serverId]);

  const online = members.filter(m => m.status !== 'offline');
  const offline = members.filter(m => m.status === 'offline');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Members</Text>
        <TouchableOpacity onPress={onClose}><Text style={styles.close}>✕</Text></TouchableOpacity>
      </View>
      <ScrollView>
        {online.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>ONLINE — {online.length}</Text>
            {online.map(m => <MemberRow key={m.id} member={m} />)}
          </>
        )}
        {offline.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>OFFLINE — {offline.length}</Text>
            {offline.map(m => <MemberRow key={m.id} member={m} />)}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function MemberRow({ member }: { member: Member }) {
  const avatar = absUrl(member.avatar_url);
  return (
    <View style={styles.row}>
      <View style={styles.avatarWrap}>
        {avatar ? <Image source={{ uri: avatar }} style={styles.avatar} /> : <View style={[styles.avatar, styles.avatarFallback]}><Text style={styles.avatarText}>{member.username[0].toUpperCase()}</Text></View>}
        <View style={[styles.dot, { backgroundColor: statusColors[member.status] ?? colors.textDim }]} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>{member.nickname ?? member.username}</Text>
        {member.role !== 'member' && <Text style={styles.role}>{member.role.toUpperCase()}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 240, backgroundColor: colors.bg2, borderLeftWidth: 1, borderLeftColor: colors.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { color: colors.text, fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  close: { color: colors.textDim, fontSize: 16 },
  sectionHeader: { color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  avatarWrap: { position: 'relative', marginRight: 10 },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  avatarFallback: { backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  dot: { position: 'absolute', right: -2, bottom: -2, width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: colors.bg2 },
  name: { color: colors.text, fontSize: 14 },
  role: { color: colors.accent, fontSize: 9, fontWeight: '800', marginTop: 1 },
});