import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, Bell, HelpCircle, Plus, ShieldCheck, ChevronRight, Lightbulb, Flag } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function SafetyScreen() {
  const [readReceipts, setReadReceipts] = useState(true);
  const [activityStatus, setActivityStatus] = useState(true);
  const [activeTab, setActiveTab] = useState('Privacy');

  const tabs = ['Privacy', 'Blocking', 'Reporting', 'Account Security'];

  const Toggle = ({ value, onToggle }: { value: boolean, onToggle: () => void }) => (
    <TouchableOpacity onPress={onToggle} style={[styles.toggleWrap, value && styles.toggleWrapActive]}>
      <View style={[styles.toggleDot, value && styles.toggleDotActive]} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Main Content Area */}
      <View style={styles.mainContent}>
        
        {/* Top Nav */}
        <View style={styles.topNav}>
          <View style={styles.searchBar}>
            <Search size={16} color={colors.textMuted} />
            <TextInput style={styles.searchInput} placeholder="Search anything..." placeholderTextColor={colors.textMuted} />
          </View>
          <View style={styles.topIcons}>
            <Bell size={20} color={colors.textDim} style={{ marginRight: 16 }} />
            <HelpCircle size={20} color={colors.textDim} style={{ marginRight: 16 }} />
            <View style={styles.plusBtn}><Plus size={16} color="#fff" /></View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Safety Center</Text>
            <Text style={styles.subtitle}>Your privacy. Your rules.</Text>
          </View>

          {/* Banner */}
          <View style={styles.banner}>
            <View style={styles.bannerIconWrap}>
              <ShieldCheck size={32} color={colors.success} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.bannerTitle}>Stay safe, stay in control.</Text>
              <Text style={styles.bannerDesc}>Manage your privacy, blocking, reporting, and account security from one place.</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsRow}>
            {tabs.map(tab => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.tabActive]}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Settings List */}
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          <Text style={styles.sectionDesc}>Control who can see your information and how you're seen on VEXRO.</Text>
          
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingName}>Profile Visibility</Text>
                <Text style={styles.settingDesc}>Choose who can see your profile, activity, and friends.</Text>
              </View>
              <View style={styles.settingAction}>
                <Text style={styles.settingActionText}>Friends</Text>
                <ChevronRight size={16} color={colors.textMuted} />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingName}>Direct Messages</Text>
                <Text style={styles.settingDesc}>Decide who can message you.</Text>
              </View>
              <View style={styles.settingAction}>
                <Text style={styles.settingActionText}>Friends</Text>
                <ChevronRight size={16} color={colors.textMuted} />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingName}>Read Receipts</Text>
                <Text style={styles.settingDesc}>Let others know when you've seen their messages.</Text>
              </View>
              <Toggle value={readReceipts} onToggle={() => setReadReceipts(!readReceipts)} />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingName}>Activity Status</Text>
                <Text style={styles.settingDesc}>Show when you're online or active.</Text>
              </View>
              <Toggle value={activityStatus} onToggle={() => setActivityStatus(!activityStatus)} />
            </View>
          </View>

          {/* Blocked Users */}
          <View style={styles.blockedCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingName}>Blocked Users</Text>
              <Text style={styles.settingDesc}>Manage people you've blocked from contacting you or seeing your content.</Text>
            </View>
            <TouchableOpacity style={styles.manageBtn}>
              <Text style={styles.manageBtnText}>Manage</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>

      {/* Right Panel (Quick Tips) */}
      <View style={styles.rightPanel}>
        <Text style={styles.rightTitle}>Quick Safety Tips</Text>
        
        <View style={styles.tipRow}>
          <ShieldCheck size={16} color={colors.accent} style={{ marginTop: 2 }} />
          <Text style={styles.tipText}>Don't share personal information.</Text>
        </View>
        <View style={styles.tipRow}>
          <ShieldCheck size={16} color={colors.accent} style={{ marginTop: 2 }} />
          <Text style={styles.tipText}>Be careful with links and files.</Text>
        </View>
        <View style={styles.tipRow}>
          <ShieldCheck size={16} color={colors.accent} style={{ marginTop: 2 }} />
          <Text style={styles.tipText}>Report suspicious behavior.</Text>
        </View>
        <View style={styles.tipRow}>
          <ShieldCheck size={16} color={colors.accent} style={{ marginTop: 2 }} />
          <Text style={styles.tipText}>You're not alone. Our team is here to help.</Text>
        </View>

        <TouchableOpacity style={styles.reportBtn}>
          <Text style={styles.reportBtnText}>Report Something</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: colors.bg },
  mainContent: { flex: 1, backgroundColor: colors.bg },
  
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg2, borderRadius: 8, paddingHorizontal: 12, height: 36, flex: 0.6 },
  searchInput: { flex: 1, color: colors.text, fontSize: 13, marginLeft: 8 },
  topIcons: { flexDirection: 'row', alignItems: 'center' },
  plusBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },

  scrollContent: { padding: 32 },
  header: { marginBottom: 24 },
  title: { color: colors.text, fontSize: 24, fontWeight: '700' },
  subtitle: { color: colors.textDim, fontSize: 14, marginTop: 4 },

  banner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#172B24', borderRadius: 12, padding: 20, marginBottom: 32, borderWidth: 1, borderColor: '#233D33' },
  bannerIconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(35, 165, 89, 0.1)', alignItems: 'center', justifyContent: 'center' },
  bannerTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  bannerDesc: { color: colors.textDim, fontSize: 13, lineHeight: 18 },

  tabsRow: { flexDirection: 'row', gap: 24, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 24 },
  tab: { paddingBottom: 12 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.accent },
  tabText: { color: colors.textDim, fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: colors.text },

  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  sectionDesc: { color: colors.textDim, fontSize: 13, marginBottom: 16 },

  settingsCard: { backgroundColor: colors.bg2, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  settingName: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 2 },
  settingDesc: { color: colors.textDim, fontSize: 12 },
  settingAction: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg3, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  settingActionText: { color: colors.accent, fontSize: 12, fontWeight: '600', marginRight: 4 },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 16 },

  toggleWrap: { width: 44, height: 24, borderRadius: 12, backgroundColor: colors.bg4, justifyContent: 'center', padding: 2 },
  toggleWrapActive: { backgroundColor: colors.success },
  toggleDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  toggleDotActive: { alignSelf: 'flex-end' },

  blockedCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg2, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, marginTop: 16 },
  manageBtn: { backgroundColor: colors.bg3, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  manageBtnText: { color: colors.accent, fontSize: 13, fontWeight: '600' },

  rightPanel: { width: 320, backgroundColor: colors.bg2, borderLeftWidth: 1, borderLeftColor: colors.border, padding: 24 },
  rightTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 20 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  tipText: { color: colors.textDim, fontSize: 13, marginLeft: 12, lineHeight: 18, flex: 1 },
  reportBtn: { borderWidth: 1, borderColor: colors.accent, borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 16 },
  reportBtnText: { color: colors.accent, fontSize: 14, fontWeight: '600' },
});