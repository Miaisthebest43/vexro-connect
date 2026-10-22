import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Home, Users, MessageSquare, Bell, Compass, Shield, Lock, Ban, Plus, ChevronRight, Mic, Headphones, Settings, MicOff, PhoneOff } from 'lucide-react-native';
import { colors } from '../theme/colors';
import ProfilePopout from './ProfilePopout';

export default function VexroSidebar({ activeView, onNavigate }: { activeView: string, onNavigate: (view: string) => void }) {
  const [showPopout, setShowPopout] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const NavItem = ({ icon: Icon, label, view, badge }: any) => {
    const [hovered, setHovered] = useState(false);
    const active = activeView === view;
    
    return (
      <TouchableOpacity 
        style={[styles.navItem, (active || hovered) && styles.navItemActive]} 
        onPress={() => onNavigate(view)}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
      >
        <Icon size={18} color={active ? colors.accent : hovered ? colors.text : colors.textDim} />
        <Text style={[styles.navText, (active || hovered) && { color: colors.text }]}>{label}</Text>
        {badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}><Text style={styles.logo}>VEXRO</Text></View>
      
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
        <TouchableOpacity style={styles.createBtn} onPress={() => onNavigate('create-community')}>
          <Plus size={16} color={colors.text} />
          <Text style={styles.createBtnText}>Create Community</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Popout Wrapper */}
      {showPopout && (
        <ProfilePopout 
          onClose={() => setShowPopout(false)} 
          onOpenSettings={() => { setShowPopout(false); onNavigate('settings'); }} 
        />
      )}

      {/* User Panel */}
      <View style={styles.userPanelWrap}>
        <TouchableOpacity style={styles.userPanel} onPress={() => setShowPopout(!showPopout)}>
          <View style={styles.avatar}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop' }} style={{ width: '100%', height: '100%', borderRadius: 16 }} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.userName}>FairyTales</Text>
            <Text style={styles.userStatus}>Invisible</Text>
          </View>
        </TouchableOpacity>

        {/* Action Buttons (Mic, Headset, Settings) */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.iconBtn, isMuted && styles.iconBtnDanger]} onPress={() => setIsMuted(!isMuted)}>
            {isMuted ? <MicOff size={14} color={colors.danger} /> : <Mic size={14} color={colors.textDim} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Headphones size={14} color={colors.textDim} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => onNavigate('settings')}>
            <Settings size={14} color={colors.textDim} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 240, backgroundColor: '#0D1019', borderRightWidth: 1, borderRightColor: colors.border, padding: 16 },
  logoWrap: { marginBottom: 24, marginTop: 8 },
  logo: { color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: 1 },
  section: { marginBottom: 24 },
  sectionTitle: { color: colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginLeft: 12 },
  navItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginBottom: 2 },
  navItemActive: { backgroundColor: '#1A1D27' },
  navText: { color: colors.textDim, fontSize: 14, fontWeight: '500', marginLeft: 12, flex: 1 },
  badge: { backgroundColor: colors.accent, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  createBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1D27', borderWidth: 1, borderColor: colors.border, padding: 12, borderRadius: 8, marginTop: 8 },
  createBtnText: { color: colors.text, fontSize: 13, fontWeight: '600', marginLeft: 8 },
  
  userPanelWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#232736', padding: 8, borderRadius: 12, marginTop: 16 },
  userPanel: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  userName: { color: colors.text, fontSize: 13, fontWeight: '600' },
  userStatus: { color: colors.textDim, fontSize: 11, marginTop: 2 },
  
  actions: { flexDirection: 'row', gap: 4 },
  iconBtn: { padding: 6, borderRadius: 6 },
  iconBtnDanger: { backgroundColor: 'rgba(218, 55, 60, 0.15)' },
});