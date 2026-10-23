import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Users, Mail, Store, Inbox, Plus, Compass, Home } from 'lucide-react-native';
import { colors } from '../theme/colors';
import ProfilePopout from './ProfilePopout';

const DMS = [
  { id: '1', name: 'DØR †☆', status: 'I only have eyes for her<3', color: '#808080' },
  { id: '2', name: '2 barbies', status: '3 Members', color: '#3498DB' },
  { id: '3', name: 'exoish', status: 'Z\'s', color: '#9B59B6' },
  { id: '4', name: 'Yak', status: 'DH', color: '#2ECC71' },
];

export default function DMSidebar({ activeView, onNavigate }: { activeView: string, onNavigate: (view: string) => void }) {
  const [showPopout, setShowPopout] = useState(false);

  const NavItem = ({ icon: Icon, label, view, badge }: any) => {
    const active = activeView === view;
    return (
      <TouchableOpacity style={[styles.navItem, active && styles.navItemActive]} onPress={() => onNavigate(view)}>
        <Icon size={20} color={active ? colors.text : colors.textDim} style={{ marginRight: 12 }} />
        <Text style={[styles.navText, active && { color: colors.text }]}>{label}</Text>
        {badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <TextInput style={styles.searchInput} placeholder="Find or start a conversation" placeholderTextColor={colors.textMuted} />
      </View>
      
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <NavItem icon={Home} label="Home" view="home" />
        <NavItem icon={Users} label="Friends" view="friends" />
        <NavItem icon={Mail} label="Message Requests" view="notifications" badge="14" />
        <NavItem icon={Store} label="Nitro" view="home" />
        <NavItem icon={Inbox} label="Shop" view="home" />
        <NavItem icon={Compass} label="Explore" view="communities" />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>DIRECT MESSAGES</Text>
          <Plus size={14} color={colors.textDim} />
        </View>

        {DMS.map((dm) => (
          <TouchableOpacity key={dm.id} style={styles.dmItem} onPress={() => onNavigate('messages')}>
            <View style={[styles.avatar, { backgroundColor: dm.color }]}>
              <Text style={styles.avatarText}>{dm.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dmName} numberOfLines={1}>{dm.name}</Text>
              {dm.status && <Text style={styles.dmStatus} numberOfLines={1}>{dm.status}</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Floating Popout Trigger */}
      <ProfilePopout 
        visible={showPopout} 
        onClose={() => setShowPopout(false)} 
        onOpenSettings={() => { setShowPopout(false); onNavigate('settings'); }} 
        onNavigate={onNavigate}
      />

      <TouchableOpacity style={styles.userPanel} onPress={() => setShowPopout(true)}>
        <View style={styles.avatarWrap}>
          <View style={[styles.avatar, { width: 32, height: 32, backgroundColor: colors.accent }]}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>F</Text>
          </View>
          <View style={styles.statusDot} />
        </View>
        <View style={{ marginLeft: 8, flex: 1 }}>
          <Text style={styles.userName}>FairyTales</Text>
          <Text style={styles.userStatus}>Invisible</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 260, backgroundColor: colors.bg2, borderRightWidth: 1, borderRightColor: colors.border, paddingTop: 12 },
  searchWrap: { paddingHorizontal: 12, marginBottom: 12 },
  searchInput: { backgroundColor: colors.bg3, padding: 8, borderRadius: 4, color: colors.text, fontSize: 13 },
  navItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, marginBottom: 2 },
  navItemActive: { backgroundColor: colors.bg3 },
  navText: { color: colors.textDim, fontSize: 15, fontWeight: '500', flex: 1 },
  badge: { backgroundColor: colors.danger, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 24, marginBottom: 8 },
  sectionTitle: { color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  dmItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, marginHorizontal: 8, borderRadius: 4 },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  dmName: { color: colors.text, fontSize: 14, fontWeight: '600' },
  dmStatus: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  userPanel: { height: 52, backgroundColor: colors.bg3, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  avatarWrap: { position: 'relative' },
  statusDot: { position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#23A559', borderWidth: 2, borderColor: colors.bg3 },
  userName: { color: colors.text, fontSize: 13, fontWeight: '700' },
  userStatus: { color: colors.textDim, fontSize: 11 },
});