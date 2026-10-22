import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Home, Users, MessageSquare, Bell, Compass, Shield, Lock, Ban, Plus, ChevronRight } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function VexroSidebar({ activeView, onNavigate }: { activeView: string, onNavigate: (view: string) => void }) {
  const NavItem = ({ icon: Icon, label, view, badge }: any) => {
    const active = activeView === view;
    return (
      <TouchableOpacity style={[styles.navItem, active && styles.navItemActive]} onPress={() => onNavigate(view)}>
        <Icon size={18} color={active ? colors.accent : colors.textDim} />
        <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
        {badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <Text style={styles.logo}>VEXRO</Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.section}>
          <NavItem icon={Home} label="Home" view="home" />
          <NavItem icon={Users} label="Communities" view="communities" />
          <NavItem icon={MessageSquare} label="Messages" view="messages" />
          <NavItem icon={Bell} label="Notifications" view="notifications" badge="3" />
          <NavItem icon={Compass} label="Discover" view="discover" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SAFETY</Text>
          <NavItem icon={Shield} label="Safety Center" view="safety" />
          <NavItem icon={Lock} label="Privacy" view="privacy" />
          <NavItem icon={Ban} label="Block List" view="blocklist" />
        </View>

        <TouchableOpacity style={styles.createBtn}>
          <Plus size={16} color={colors.text} />
          <Text style={styles.createBtnText}>Create Community</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.userPanel} onPress={() => onNavigate('settings')}>
        <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.userName}>AlexR</Text>
          <Text style={styles.userStatus}>Online</Text>
        </View>
        <ChevronRight size={16} color={colors.textDim} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 240, backgroundColor: colors.bg2, borderRightWidth: 1, borderRightColor: colors.border, padding: 16 },
  logoWrap: { marginBottom: 24, marginTop: 8 },
  logo: { color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: 1 },
  section: { marginBottom: 24 },
  sectionTitle: { color: colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginLeft: 12 },
  navItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginBottom: 2 },
  navItemActive: { backgroundColor: colors.bg3 },
  navText: { color: colors.textDim, fontSize: 14, fontWeight: '500', marginLeft: 12, flex: 1 },
  navTextActive: { color: colors.text, fontWeight: '600' },
  badge: { backgroundColor: colors.accent, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  createBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg3, borderWidth: 1, borderColor: colors.border, padding: 12, borderRadius: 8, marginTop: 8 },
  createBtnText: { color: colors.text, fontSize: 13, fontWeight: '600', marginLeft: 8 },
  userPanel: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg3, padding: 10, borderRadius: 12, marginTop: 16 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  userName: { color: colors.text, fontSize: 13, fontWeight: '600' },
  userStatus: { color: colors.success, fontSize: 11, marginTop: 2 },
});