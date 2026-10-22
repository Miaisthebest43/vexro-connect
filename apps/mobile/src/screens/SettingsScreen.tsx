import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { X, User, Search, Shield, Bell, CreditCard, Gift, MonitorSmartphone, ChevronRight, Smartphone, Mail, Phone } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function SettingsScreen({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.container}>
      {/* Left Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}><Text style={styles.avatarText}>F</Text></View>
          <View>
            <Text style={styles.profileName}>FairyTales</Text>
            <Text style={styles.editProfile}>Edit Profile ✎</Text>
          </View>
        </View>

        <View style={styles.searchWrap}>
          <Search size={16} color={colors.textMuted} />
          <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor={colors.textMuted} />
        </View>

        <ScrollView>
          <Text style={styles.category}>Account</Text>
          <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
            <User size={18} color={colors.text} /><Text style={styles.navTextActive}>Account Info</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Shield size={18} color={colors.textDim} /><Text style={styles.navText}>Password & Security</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Smartphone size={18} color={colors.textDim} /><Text style={styles.navText}>Account Status</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <MonitorSmartphone size={18} color={colors.textDim} /><Text style={styles.navText}>Family Center</Text>
          </TouchableOpacity>

          <Text style={styles.category}>Billing</Text>
          <TouchableOpacity style={styles.navItem}>
            <CreditCard size={18} color={colors.textDim} /><Text style={styles.navText}>Subscriptions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Gift size={18} color={colors.textDim} /><Text style={styles.navText}>Gift Inventory</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Right Content Area */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account</Text>
          <TouchableOpacity onPress={onClose}><X size={24} color={colors.textDim} /></TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Account Info</Text>
          
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.label}>Username</Text>
              <Text style={styles.value}>ifwyobody</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>Edit</Text></TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <View>
              <Text style={styles.label}>Email</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.value}>************@gmail.com</Text>
                <TouchableOpacity><Text style={styles.revealText}>Reveal</Text></TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>Edit</Text></TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <View>
              <Text style={styles.label}>Phone Number</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.value}>********9709</Text>
                <TouchableOpacity><Text style={styles.revealText}>Reveal</Text></TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>Edit</Text></TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Password & Security</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>Edit</Text></TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Multi-Factor Authentication</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: colors.success, fontWeight: '600', marginRight: 8 }}>Enabled</Text>
              <ChevronRight size={18} color={colors.textDim} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Logged-in Devices</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: colors.textDim, marginRight: 8 }}>9 devices</Text>
              <ChevronRight size={18} color={colors.textDim} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: colors.bg2 },
  sidebar: { width: 260, backgroundColor: colors.bg3, padding: 16, borderRightWidth: 1, borderRightColor: colors.border },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: colors.bg2, padding: 12, borderRadius: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  profileName: { color: colors.text, fontSize: 15, fontWeight: '700' },
  editProfile: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, padding: 10, borderRadius: 8, marginBottom: 16 },
  searchInput: { flex: 1, color: colors.text, marginLeft: 8, fontSize: 13 },
  category: { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginTop: 16, marginBottom: 8, marginLeft: 8 },
  navItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 6, marginBottom: 2 },
  navItemActive: { backgroundColor: colors.bg2 },
  navText: { color: colors.textDim, fontSize: 14, fontWeight: '500', marginLeft: 10 },
  navTextActive: { color: colors.text, fontSize: 14, fontWeight: '600', marginLeft: 10 },

  content: { flex: 1, backgroundColor: colors.bg2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { color: colors.text, fontSize: 20, fontWeight: '700' },
  scrollContent: { padding: 40, maxWidth: 800 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 24 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  label: { color: colors.textDim, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  value: { color: colors.text, fontSize: 15 },
  revealText: { color: '#3b82f6', fontSize: 13, fontWeight: '600', marginLeft: 8 },
  editBtn: { backgroundColor: colors.bg3, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  editBtnText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 32 },
});