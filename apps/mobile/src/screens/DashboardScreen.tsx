import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert, TextInput, Modal, Image, ScrollView, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import { api, absUrl, type Server } from '../lib/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [newName, setNewName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const load = useCallback(async () => {
    try { const { servers } = await api.listServers(); setServers(servers); }
    catch (e: any) { Alert.alert('Failed to load', e.message); }
    finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function onCreate() {
    if (!newName.trim()) return;
    try {
      const { server } = await api.createServer(newName.trim());
      setNewName(''); setCreating(false);
      navigation.navigate('Channels', { serverId: server.id, serverName: server.name });
    } catch (e: any) { Alert.alert('Failed', e.message); }
  }

  const avatarUrl = absUrl(user?.avatar_url);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.profileBtn}>
            {avatarUrl ? <Image source={{ uri: avatarUrl }} style={styles.avatar} /> : <View style={[styles.avatar, styles.avatarFallback]}><Text style={styles.avatarText}>{user?.username[0]?.toUpperCase()}</Text></View>}
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.usernameText}>{user?.username}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}><Text style={styles.logoutText}>Log out</Text></TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Friends')} style={styles.actionCard}>
            <LinearGradient colors={['#18181c', '#121215']} style={styles.actionGradient}>
              <Text style={styles.actionIcon}>👥</Text>
              <Text style={styles.actionLabel}>Friends</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setJoining(true)} style={styles.actionCard}>
            <LinearGradient colors={['#18181c', '#121215']} style={styles.actionGradient}>
              <Text style={styles.actionIcon}>🔗</Text>
              <Text style={styles.actionLabel}>Join Server</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Your Servers */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Communities</Text>
          <TouchableOpacity onPress={() => setCreating(true)}>
            <Text style={styles.sectionAction}>+ Create</Text>
          </TouchableOpacity>
        </View>

        {loading ? <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} /> : servers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏝️</Text>
            <Text style={styles.emptyTitle}>No servers yet</Text>
            <Text style={styles.emptyText}>Join a community or create your own to get started.</Text>
            <TouchableOpacity onPress={() => setCreating(true)} style={styles.emptyBtn}>
              <LinearGradient colors={colors.gradient} style={styles.emptyBtnGradient}>
                <Text style={styles.emptyBtnText}>Create a Server</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.serverGrid}>
            {servers.map(item => {
              const icon = absUrl(item.icon_url);
              return (
                <TouchableOpacity key={item.id} style={styles.serverCard} onPress={() => navigation.navigate('Channels', { serverId: item.id, serverName: item.name })}>
                  {icon ? <Image source={{ uri: icon }} style={styles.serverIcon} /> : <View style={[styles.serverIcon, styles.serverIconFallback]}><Text style={styles.serverIconText}>{item.name[0].toUpperCase()}</Text></View>}
                  <Text style={styles.serverName} numberOfLines={1}>{item.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <Modal visible={creating} transparent animationType="fade" onRequestClose={() => setCreating(false)}>
        <View style={styles.modalBg}><View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Create Server</Text>
          <TextInput style={styles.modalInput} placeholder="Server Name" placeholderTextColor={colors.textMuted} value={newName} onChangeText={setNewName} autoFocus />
          <View style={styles.modalRow}>
            <TouchableOpacity onPress={() => setCreating(false)} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
            <TouchableOpacity onPress={onCreate} style={styles.confirmBtn}><Text style={styles.confirmText}>Create</Text></TouchableOpacity>
          </View>
        </View></View>
      </Modal>

      <Modal visible={joining} transparent animationType="fade" onRequestClose={() => setJoining(false)}>
        <View style={styles.modalBg}><View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Join Server</Text>
          <TextInput style={styles.modalInput} placeholder="Invite Code" placeholderTextColor={colors.textMuted} autoCapitalize="none" value={joinCode} onChangeText={setJoinCode} autoFocus />
          <View style={styles.modalRow}>
            <TouchableOpacity onPress={() => setJoining(false)} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
            <TouchableOpacity onPress={async () => {
              if(!joinCode.trim()) return;
              try { const { serverId } = await api.redeemInvite(joinCode.trim()); setJoining(false); load(); navigation.navigate('Channels', { serverId, serverName: 'Joined' }); }
              catch (e: any) { Alert.alert('Failed', e.message); }
            }} style={styles.confirmBtn}><Text style={styles.confirmText}>Join</Text></TouchableOpacity>
          </View>
        </View></View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 72, paddingBottom: 24 },
  profileBtn: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 52, height: 52, borderRadius: 16 },
  avatarFallback: { backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  welcomeText: { color: colors.textDim, fontSize: 13 },
  usernameText: { color: colors.text, fontSize: 20, fontWeight: '800' },
  logoutBtn: { padding: 8 },
  logoutText: { color: colors.danger, fontSize: 13, fontWeight: '600' },
  
  actionsRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 12, marginBottom: 32 },
  actionCard: { flex: 1, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  actionGradient: { padding: 16, alignItems: 'center' },
  actionIcon: { fontSize: 24, marginBottom: 8 },
  actionLabel: { color: colors.text, fontWeight: '600', fontSize: 14 },
  
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 16 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  sectionAction: { color: colors.accent, fontSize: 14, fontWeight: '600' },
  
  emptyState: { alignItems: 'center', padding: 40, marginTop: 20 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '700' },
  emptyText: { color: colors.textDim, fontSize: 14, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  emptyBtn: { borderRadius: 12, overflow: 'hidden', width: '100%' },
  emptyBtnGradient: { padding: 16, alignItems: 'center' },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  
  serverGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 24, gap: 16 },
  serverCard: { width: '47%', backgroundColor: colors.bg2, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  serverIcon: { width: 64, height: 64, borderRadius: 20, marginBottom: 12 },
  serverIconFallback: { backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  serverIconText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  serverName: { color: colors.text, fontSize: 15, fontWeight: '600', textAlign: 'center' },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: colors.bg2, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: colors.border },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 20 },
  modalInput: { backgroundColor: colors.bg4, color: colors.text, padding: 16, borderRadius: 12, marginBottom: 20, fontSize: 16 },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 10 },
  cancelText: { color: colors.textDim, fontWeight: '600' },
  confirmBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.accent },
  confirmText: { color: '#fff', fontWeight: '700' },
});