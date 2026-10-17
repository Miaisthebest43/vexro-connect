import React, { useCallback, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  ActivityIndicator, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { api, type Member } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Members'>;

export default function MembersScreen({ route, navigation }: Props) {
  const { serverId, serverName } = route.params;
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const load = useCallback(async () => {
    try {
      const [m, s] = await Promise.all([api.listMembers(serverId), api.getServer(serverId)]);
      setMembers(m.members);
      setIsOwner(s.server.owner_id === user?.id);
    } catch (e: any) { Alert.alert('Failed', e.message); }
    finally { setLoading(false); }
  }, [serverId, user?.id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  function onMemberPress(m: Member) {
    if (!isOwner || m.id === user?.id) return;
    Alert.alert(m.username, 'Kick this member?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Kick', style: 'destructive',
        onPress: async () => {
          try { await api.kickMember(serverId, m.id); load(); }
          catch (e: any) { Alert.alert('Failed', e.message); }
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>â€¹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{serverName} Â· Members</Text>
        <View style={{ width: 30 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => onMemberPress(item)}
              disabled={!isOwner || item.id === user?.id}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.username[0].toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.username}>@{item.username}</Text>
                <Text style={styles.role}>{item.role}</Text>
              </View>
              {item.id === user?.id && <Text style={styles.you}>you</Text>}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  back: { color: colors.accent, fontSize: 24, width: 30 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  username: { color: colors.text, fontSize: 15, fontWeight: '600' },
  role: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  you: { color: colors.textDim, fontSize: 12, fontStyle: 'italic' },
});