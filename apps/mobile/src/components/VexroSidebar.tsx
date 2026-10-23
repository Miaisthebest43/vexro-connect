import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Home, Users, MessageSquare, Shield, Settings, CheckCircle2 } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function VexroSidebar({ activeView, onNavigate }: { activeView: string, onNavigate: (view: string) => void }) {
  const NavItem = ({ icon: Icon, label, view, badge }: any) => {
    const active = activeView === view;
    return (
      <TouchableOpacity style={[styles.navItem, active && styles.navItemActive]} onPress={() => onNavigate(view)}>
        <Icon size={22} color={active ? colors.accent : colors.textDim} />
        <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
        {badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoWrap}>
        <View style={styles.logoIcon}><Text style={styles.logoV}>V</Text></View>
        <View>
          <Text style={styles.logoText}>VEXRO</Text>
          <Text style={styles.logoSub}>CONNECT</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <NavItem icon={Home} label="Home" view="home" />
        <NavItem icon={Users} label="Communities" view="communities" />
        <NavItem icon={MessageSquare} label="Messages" view="messages" badge="3" />
        <NavItem icon={Shield} label="Safety" view="safety" />
        <NavItem icon={Settings} label="Settings" view="settings" />
      </ScrollView>

      {/* Bottom Banner */}
      <View style={styles.bottomBanner}>
        <CheckCircle2 size={28} color={colors.success} />
        <Text style={styles.bannerTitle}>Safer Communities.</Text>
        <Text style={styles.bannerTitle}>Stronger Together.</Text>
        <Text style={styles.bannerDesc}>Your privacy. Your control.{'\n'}Always.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 260, backgroundColor: colors.bg, padding: 20, borderRightWidth: 1, borderRightColor: colors.border },
  logoWrap: { flexDirection: 'row', alignItems: 'center', marginBottom: 40, marginTop: 10 },
  logoIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  logoV: { color: '#fff', fontSize: 24, fontWeight: '900', fontStyle: 'italic' },
  logoText: { color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: 1 },
  logoSub: { color: colors.accent, fontSize: 10, fontWeight: '700', letterSpacing: 3, marginTop: -2 },
  
  navItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, marginBottom: 8 },
  navItemActive: { backgroundColor: 'rgba(106, 92, 255, 0.15)' },
  navText: { color: colors.textDim, fontSize: 16, fontWeight: '600', marginLeft: 16, flex: 1 },
  navTextActive: { color: colors.text },
  badge: { backgroundColor: colors.accent, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  bottomBanner: { backgroundColor: '#0A0D16', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginTop: 'auto' },
  bannerTitle: { color: '#fff', fontSize: 14, fontWeight: '700', marginTop: 12 },
  bannerDesc: { color: colors.textDim, fontSize: 12, marginTop: 8, lineHeight: 18 },
});