import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Switch } from 'react-native';
import { X, User, Search, Shield, Bell, CreditCard, Gift, MonitorSmartphone, ChevronRight, Info, MessageCircle, Users, CheckCircle2, ChevronDown, Eye, EyeOff, Activity } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import FamilyCenterScreen from './FamilyCenterScreen';
import MessagingPermissionsScreen from './MessagingPermissionsScreen';

export default function SettingsScreen({ onClose, onOpenSessions, onOpenEditProfile }: { onClose: () => void, onOpenSessions: () => void, onOpenEditProfile: () => void }) {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('Account');
  const [activeTab, setActiveTab] = useState('Account Info');
  const [dataTab, setDataTab] = useState('How VEXRO Uses My Data');
  const [messagingTab, setMessagingTab] = useState('Content Filters'); // NEW STATE FOR MESSAGING

  const [revealEmail, setRevealEmail] = useState(false);
  const [revealPhone, setRevealPhone] = useState(false);

  const [improveData, setImproveData] = useState(true);
  const [personalizeData, setPersonalizeData] = useState(true);
  const [voiceRecord, setVoiceRecord] = useState(true);
  const [sponsoredActivity, setSponsoredActivity] = useState(true);
  const [thirdPartyData, setThirdPartyData] = useState(true);
  const [profileUpdates, setProfileUpdates] = useState(true);
  const [persistentE2EE, setPersistentE2EE] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('all');

  const CategoryBtn = ({ icon: Icon, label, active, onPress }: any) => (
    <TouchableOpacity style={[styles.categoryBtn, active && styles.categoryBtnActive]} onPress={onPress}>
      <Icon size={18} color={active ? colors.text : colors.textDim} />
      <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const SubNavItem = ({ label, active, onPress }: any) => (
    <TouchableOpacity style={styles.subNavItem} onPress={onPress}>
      {active && <View style={styles.activeIndicator} />}
      <Text style={[styles.subNavText, active && styles.subNavTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const Divider = () => <View style={styles.divider} />;

  const ToggleRow = ({ title, desc, value, onValueChange }: any) => (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1, paddingRight: 20 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {desc && <Text style={styles.rowDesc}>{desc}</Text>}
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: colors.bg4, true: colors.accent }} thumbColor="#fff" />
    </View>
  );

  const RadioRow = ({ title, desc, value, selected, onSelect }: any) => (
    <TouchableOpacity style={styles.radioRow} onPress={() => onSelect(value)}>
      <View style={[styles.radioOuter, selected && { borderColor: colors.accent }]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {desc && <Text style={styles.rowDesc}>{desc}</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderDataContent = () => {
    switch (dataTab) {
      case 'How VEXRO Uses My Data':
        return (
          <ScrollView contentContainerStyle={styles.contentScroll}>
            <Text style={styles.pageTitle}>How VEXRO Uses My Data</Text>
            <Text style={[styles.rowTitle, { marginBottom: 4 }]}>Use data to make VEXRO work</Text>
            <Text style={[styles.rowDesc, { marginBottom: 24 }]}>VEXRO needs to store and process some data in order to provide you the basic service.</Text>
            <ToggleRow title="Use data to improve VEXRO" desc="Allow VEXRO to use and process my information to understand and improve the service." value={improveData} onValueChange={setImproveData} />
            <ToggleRow title="Use data to personalize my experience" desc="Allows us to use information, such as who you talk to and what games you play, to personalize VEXRO." value={personalizeData} onValueChange={setPersonalizeData} />
            <ToggleRow title="Allow my voice to be recorded in Clips" desc="Allows your voice to be included when someone in the same voice channel uses Clips." value={voiceRecord} onValueChange={setVoiceRecord} />
            <View style={{ marginTop: 24 }}>
              <Text style={styles.rowTitle}>Request my data</Text>
              <Text style={styles.rowDesc}>If you need a copy of your personal data, you can get it here.</Text>
              <TouchableOpacity style={styles.actionBtn}><Text style={styles.actionBtnText}>Request Data</Text></TouchableOpacity>
            </View>
          </ScrollView>
        );
      case 'Sponsored Content':
        return (
          <ScrollView contentContainerStyle={styles.contentScroll}>
            <Text style={styles.pageTitle}>Sponsored Content</Text>
            <ToggleRow title="Use my VEXRO activity to personalize Sponsored Content" desc="Allows us to personalize Sponsored Content using your activity." value={sponsoredActivity} onValueChange={setSponsoredActivity} />
            <ToggleRow title="Use third-party data to personalize Sponsored Content" desc="Allows us to personalize Sponsored Content using data from advertisers." value={thirdPartyData} onValueChange={setThirdPartyData} />
          </ScrollView>
        );
      case 'Profile Privacy':
        return (
          <ScrollView contentContainerStyle={styles.contentScroll}>
            <Text style={styles.pageTitle}>Profile Privacy</Text>
            <Text style={[styles.rowDesc, { marginBottom: 24 }]}>Control who can see your profile info.</Text>
            <Text style={[styles.rowTitle, { marginBottom: 12 }]}>Share my full profile with</Text>
            <RadioRow title="Friends & All Servers" desc="Your full profile is visible to friends and any server you join." value="all" selected={profileVisibility === 'all'} onSelect={setProfileVisibility} />
            <RadioRow title="Friends Only" desc="Your full profile is visible to friends. Everyone else sees a limited version." value="friends" selected={profileVisibility === 'friends'} onSelect={setProfileVisibility} />
            <View style={{ height: 24 }} />
            <ToggleRow title="Share when I update my profile" desc="Allow friends to receive a push notification when you update your profile." value={profileUpdates} onValueChange={setProfileUpdates} />
          </ScrollView>
        );
      case 'Voice End-to-end Encryption':
        return (
          <ScrollView contentContainerStyle={styles.contentScroll}>
            <Text style={styles.pageTitle}>Voice End-to-end Encryption</Text>
            <ToggleRow title="Enable persistent verification codes" desc="Gives your current device persistent verification codes. If this setting is on, your friends only have to verify your device once." value={persistentE2EE} onValueChange={setPersistentE2EE} />
          </ScrollView>
        );
      default:
        return <View />;
    }
  };

  const renderContent = () => {
    if (activeCategory === 'Data') return renderDataContent();
    
    // Pass the active messaging tab into the content component
    if (activeCategory === 'Messaging') return <MessagingPermissionsScreen activeTab={messagingTab} />; 
    
    if (activeTab === 'Family Center') return <FamilyCenterScreen />;

    if (activeTab === 'Account Info') {
      return (
        <ScrollView contentContainerStyle={styles.contentScroll}>
          <Text style={styles.pageTitle}>Account Info</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowTitle}>Username</Text>
              <View style={styles.rowRight}>
                <Text style={styles.valueText}>{user?.username || 'ifwyobody'}</Text>
                <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>Edit</Text></TouchableOpacity>
              </View>
            </View>
            <Divider />
            <View style={styles.row}>
              <Text style={styles.rowTitle}>Email</Text>
              <View style={styles.rowRight}>
                <Text style={styles.valueText}>{revealEmail ? 'ifwyobody@gmail.com' : '***************@gmail.com'}</Text>
                <TouchableOpacity onPress={() => setRevealEmail(!revealEmail)}><Text style={styles.revealText}>Reveal</Text></TouchableOpacity>
                <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>Edit</Text></TouchableOpacity>
              </View>
            </View>
            <Divider />
            <View style={styles.row}>
              <Text style={styles.rowTitle}>Phone Number</Text>
              <View style={styles.rowRight}>
                <Text style={styles.valueText}>{revealPhone ? '+1 (555) 019-9709' : '********9709'}</Text>
                <TouchableOpacity onPress={() => setRevealPhone(!revealPhone)}><Text style={styles.revealText}>Reveal</Text></TouchableOpacity>
                <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>Edit</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      );
    }

    if (activeTab === 'Password & Security') {
      return (
        <ScrollView contentContainerStyle={styles.contentScroll}>
          <Text style={styles.pageTitle}>Password & Security</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowTitle}>Password</Text>
              <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>Edit</Text></TouchableOpacity>
            </View>
            <Divider />
            <View style={styles.row}>
              <Text style={styles.rowTitle}>Multi-Factor Authentication</Text>
              <TouchableOpacity style={styles.rowRight}><Text style={styles.enabledText}>Enabled</Text><ChevronRight size={18} color={colors.textDim} /></TouchableOpacity>
            </View>
            <Divider />
            <View style={styles.row}>
              <Text style={styles.rowTitle}>Logged-in Devices</Text>
              <TouchableOpacity style={styles.rowRight} onPress={onOpenSessions}><Text style={styles.valueText}>Manage Devices</Text><ChevronRight size={18} color={colors.textDim} /></TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      );
    }

    if (activeTab === 'Account Status') {
      return (
        <ScrollView contentContainerStyle={styles.contentScroll}>
          <Text style={styles.pageTitle}>Account Status</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusIconWrap}><User size={24} color={colors.text} /></View>
            <View style={{ flex: 1, paddingRight: 16 }}>
              <Text style={styles.rowTitle}>Age Group</Text>
              <Text style={styles.rowDesc}>You're in the adult age group (18+) and have access to age-restricted content.</Text>
            </View>
            <Text style={[styles.rowTitle, { color: colors.textDim }]}>Adult</Text>
          </View>
          <View style={styles.statusRow}>
            <View style={[styles.statusIconWrap, { backgroundColor: 'rgba(35, 165, 89, 0.15)' }]}>
              <CheckCircle2 size={24} color={colors.success} />
            </View>
            <View style={{ flex: 1, paddingRight: 16 }}>
              <Text style={styles.rowTitle}>Account Standing</Text>
              <Text style={styles.rowDesc}>Thank you for upholding VEXRO's Terms of Service.</Text>
            </View>
            <TouchableOpacity style={styles.rowRight}>
              <Text style={styles.rowTitle}>All good</Text>
              <ChevronRight size={20} color={colors.textDim} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    return <View />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <View style={styles.sidebarLogoWrap}>
          <Image source={require('../../assets/logo.png')} style={styles.sidebarLogo} resizeMode="contain" />
        </View>

        <TouchableOpacity style={styles.profileHeader} onPress={onOpenEditProfile}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}><Text style={styles.avatarText}>F</Text></View>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.profileName}>{user?.username || 'Fairy'}</Text>
            <Text style={styles.editProfileText}>Edit Profiles ✎</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.searchWrap}>
          <Search size={16} color={colors.textMuted} />
          <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor={colors.textMuted} />
        </View>

        <ScrollView>
          <CategoryBtn icon={User} label="Account" active={activeCategory === 'Account'} onPress={() => { setActiveCategory('Account'); setActiveTab('Account Info'); }} />
          {activeCategory === 'Account' && (
            <View style={styles.subNavGroup}>
              <SubNavItem label="Account Info" active={activeTab === 'Account Info'} onPress={() => setActiveTab('Account Info')} />
              <SubNavItem label="Password & Security" active={activeTab === 'Password & Security'} onPress={() => setActiveTab('Password & Security')} />
              <SubNavItem label="Account Status" active={activeTab === 'Account Status'} onPress={() => setActiveTab('Account Status')} />
              <SubNavItem label="Family Center" active={activeTab === 'Family Center'} onPress={() => setActiveTab('Family Center')} />
            </View>
          )}

          <CategoryBtn icon={Shield} label="Data & Privacy" active={activeCategory === 'Data'} onPress={() => { setActiveCategory('Data'); setDataTab('How VEXRO Uses My Data'); }} />
          {activeCategory === 'Data' && (
            <View style={styles.subNavGroup}>
              <SubNavItem label="How VEXRO Uses My Data" active={dataTab === 'How VEXRO Uses My Data'} onPress={() => setDataTab('How VEXRO Uses My Data')} />
              <SubNavItem label="Sponsored Content" active={dataTab === 'Sponsored Content'} onPress={() => setDataTab('Sponsored Content')} />
              <SubNavItem label="Profile Privacy" active={dataTab === 'Profile Privacy'} onPress={() => setDataTab('Profile Privacy')} />
              <SubNavItem label="Voice End-to-end Encryption" active={dataTab === 'Voice End-to-end Encryption'} onPress={() => setDataTab('Voice End-to-end Encryption')} />
            </View>
          )}

          {/* Messaging Permissions Category */}
          <CategoryBtn icon={MessageCircle} label="Messaging Permissions" active={activeCategory === 'Messaging'} onPress={() => { setActiveCategory('Messaging'); setMessagingTab('Content Filters'); }} />
          
          {/* Sub Nav added directly into the left sidebar for Messaging Permissions */}
          {activeCategory === 'Messaging' && (
            <View style={styles.subNavGroup}>
              <SubNavItem label="Content Filters" active={messagingTab === 'Content Filters'} onPress={() => setMessagingTab('Content Filters')} />
              <SubNavItem label="Spam Filters" active={messagingTab === 'Spam Filters'} onPress={() => setMessagingTab('Spam Filters')} />
              <SubNavItem label="Direct Messages" active={messagingTab === 'Direct Messages'} onPress={() => setMessagingTab('Direct Messages')} />
              <SubNavItem label="Friend Requests" active={messagingTab === 'Friend Requests'} onPress={() => setMessagingTab('Friend Requests')} />
              <SubNavItem label="Connected Games" active={messagingTab === 'Connected Games'} onPress={() => setMessagingTab('Connected Games')} />
              <SubNavItem label="Ignore & Block" active={messagingTab === 'Ignore & Block'} onPress={() => setMessagingTab('Ignore & Block')} />
            </View>
          )}

          <View style={styles.categorySpacer} />
          <Text style={styles.categoryLabel}>Billing</Text>
          <CategoryBtn icon={CreditCard} label="Nitro" active={activeCategory === 'Nitro'} onPress={() => { setActiveCategory('Nitro'); setActiveTab('Nitro'); }} />
          <CategoryBtn icon={Gift} label="Gift Inventory" active={activeCategory === 'Gifts'} onPress={() => { setActiveCategory('Gifts'); setActiveTab('Gift Inventory'); }} />
        </ScrollView>
      </View>

      <View style={styles.content}>
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>{activeCategory === 'Data' ? 'Data & Privacy' : activeCategory === 'Messaging' ? 'Messaging Permissions' : activeTab}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}><X size={24} color={colors.textDim} /></TouchableOpacity>
        </View>
        {renderContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: colors.bg2 },
  sidebar: { width: 280, backgroundColor: colors.bg2, padding: 20, borderRightWidth: 1, borderRightColor: colors.border },
  sidebarLogoWrap: { alignItems: 'flex-start', marginBottom: 16 },
  sidebarLogo: { width: 100, height: 100 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg3, padding: 12, borderRadius: 12, marginBottom: 16 },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  profileName: { color: colors.text, fontSize: 15, fontWeight: '700' },
  editProfileText: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, paddingHorizontal: 12, height: 40, borderRadius: 8, marginBottom: 16 },
  searchInput: { flex: 1, color: colors.text, marginLeft: 8, fontSize: 14 },
  categoryLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8, marginLeft: 8 },
  
  categoryBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8, marginBottom: 4 },
  categoryBtnActive: { backgroundColor: colors.bg3 },
  categoryText: { color: colors.textDim, fontSize: 15, fontWeight: '600', marginLeft: 12 },
  categoryTextActive: { color: colors.text },
  categorySpacer: { height: 24 },

  subNavGroup: { borderLeftWidth: 1, borderLeftColor: colors.bg4, marginLeft: 21, paddingLeft: 0, marginBottom: 16, marginTop: 4 },
  subNavItem: { paddingVertical: 10, paddingLeft: 16, position: 'relative' },
  activeIndicator: { position: 'absolute', left: -2, top: 10, bottom: 10, width: 3, backgroundColor: '#fff', borderRadius: 2 },
  subNavText: { color: colors.textDim, fontSize: 15, fontWeight: '500' },
  subNavTextActive: { color: colors.text, fontWeight: '600' },

  content: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: colors.border },
  topBarTitle: { color: colors.text, fontSize: 20, fontWeight: '700' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bg2, alignItems: 'center', justifyContent: 'center' },
  contentScroll: { padding: 40, maxWidth: 800 },
  pageTitle: { color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 32 },
  card: { backgroundColor: colors.bg2, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingVertical: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 24 },
  rowTitle: { color: colors.text, fontSize: 16, fontWeight: '600' },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 24 },
  rowDesc: { color: colors.textDim, fontSize: 14, lineHeight: 20 },
  actionGroup: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  valueText: { color: colors.text, fontSize: 15 },
  revealText: { color: '#3b82f6', fontSize: 14, fontWeight: '600' },
  editBtn: { backgroundColor: colors.bg3, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6 },
  editBtnText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  enabledText: { color: colors.success, fontSize: 14, fontWeight: '600' },
  statusRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: colors.border },
  statusIconWrap: { width: 52, height: 52, borderRadius: 12, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center', marginRight: 20 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  radioRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.textMuted, alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2 },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  actionBtn: { backgroundColor: colors.bg3, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6, alignSelf: 'flex-start', marginTop: 12 },
  actionBtnText: { color: colors.text, fontSize: 14, fontWeight: '600' },
});