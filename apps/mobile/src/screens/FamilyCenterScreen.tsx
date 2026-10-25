import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { UserPlus, Server, Users, Phone, CreditCard, Gift, Flag, Clock, PiggyBank, Settings, X, Shield, Eye, QrCode } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function FamilyCenterScreen() {
  const [activeTab, setActiveTab] = useState('Activity');
  const [enableTab, setEnableTab] = useState(false);
  const [emailSummary, setEmailSummary] = useState(true);

  const TabButton = ({ label, active, onPress }: any) => (
    <TouchableOpacity style={styles.tabBtn} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
      {active && <View style={styles.tabIndicator} />}
    </TouchableOpacity>
  );

  const InfoRow = ({ icon: Icon, title, desc, color }: any) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Icon size={20} color={color || colors.textDim} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoDesc}>{desc}</Text>
      </View>
    </View>
  );

  const renderActivityTab = () => (
    <ScrollView contentContainerStyle={styles.contentScroll}>
      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <View style={{ flex: 1, paddingRight: 24 }}>
          <Text style={styles.heroTitle}>Stay informed about how your teen is using VEXRO.</Text>
          <Text style={styles.heroDesc}>
            We built Family Center to provide you with more context on how your teen uses VEXRO so you can work together on building positive online behaviors. <Text style={{ color: '#3b82f6' }}>Learn more</Text>
          </Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setActiveTab('My Family')}>
            <Text style={styles.primaryBtnText}>Get Started</Text>
          </TouchableOpacity>
        </View>
        {/* Placeholder for the illustration in the screenshot */}
        <View style={styles.heroIllustration}>
          <Shield size={80} color="rgba(255,255,255,0.05)" />
        </View>
      </View>

      {/* 3 Feature Cards */}
      <View style={styles.featureGrid}>
        <View style={styles.featureCard}>
          <View style={styles.featureIconWrap}><Eye size={24} color={colors.text} /></View>
          <Text style={styles.featureTitle}>Messages stay private</Text>
          <Text style={styles.featureDesc}>You can see who your teen is talking to, while still respecting their privacy.</Text>
        </View>
        <View style={styles.featureCard}>
          <View style={styles.featureIconWrap}><Eye size={24} color={colors.text} /></View>
          <Text style={styles.featureTitle}>Transparent sharing</Text>
          <Text style={styles.featureDesc}>You and your teen see the exact same information, so you're on the same page.</Text>
        </View>
        <View style={styles.featureCard}>
          <View style={styles.featureIconWrap}><QrCode size={24} color={colors.text} /></View>
          <Text style={styles.featureTitle}>Easily connect</Text>
          <Text style={styles.featureDesc}>Setup is as simple as using your phone to scan the QR code your teen shows you.</Text>
        </View>
      </View>

      {/* What guardians can see */}
      <Text style={styles.sectionTitle}>What connected guardians can see</Text>
      <Text style={styles.sectionDesc}>
        Our goal is to help you stay informed about your teen's VEXRO activity so you can have meaningful conversations and support them as they navigate digital spaces.
      </Text>
      <View style={styles.infoList}>
        <InfoRow icon={UserPlus} title="New friends" desc="New friends that your teen added or accepted" />
        <InfoRow icon={Server} title="Servers joined or participated in" desc="Includes servers your teen has recently created, joined, sent messages in, or participated in a voice and video call" />
        <InfoRow icon={Users} title="Users messaged or called" desc="This includes direct messages and group chats" />
        <InfoRow icon={Phone} title="Total time spent in voice or video" desc="Minutes spent in calls across direct messages group chats, and servers" />
        <InfoRow icon={CreditCard} title="Total purchases" desc="All purchases your teen made including Shop and subscriptions" />
        <InfoRow icon={Gift} title="Gifts received" desc="All gifts your teen received in the last week, including who sent them and how much they spent" />
        <InfoRow icon={Flag} title="Reports shared by your teen" desc="If they choose to share a report they filed, you'll be notified via email" />
      </View>

      {/* What guardians can manage */}
      <Text style={[styles.sectionTitle, { marginTop: 32 }]}>What guardians can manage</Text>
      <Text style={styles.sectionDesc}>Guardians can set up safeguards to give their teens the best experience on VEXRO while being safe.</Text>
      <View style={styles.infoList}>
        <InfoRow icon={Clock} title="Screen Time Limits" desc="Give your teen a break by choosing the hours and days when VEXRO won't be accessible." />
        <InfoRow icon={PiggyBank} title="Spending cap" desc="Set a monthly budget for your teen's VEXRO purchases, including shop items, gifting, and more. Does not include subscriptions." />
        <InfoRow icon={Settings} title="Teen Account Settings" desc="You can manage certain settings for your teen's account that they can't edit on their own." />
      </View>

      {/* What guardians will not see */}
      <Text style={[styles.sectionTitle, { marginTop: 32 }]}>What guardians will not see</Text>
      <View style={[styles.infoList, { borderColor: 'rgba(218, 55, 60, 0.3)' }]}>
        <InfoRow icon={X} color={colors.danger} title="What your teen writes or says" desc="You will not see the contents of your teens' messages or calls." />
      </View>
    </ScrollView>
  );

  const renderMyFamilyTab = () => (
    <ScrollView contentContainerStyle={styles.contentScroll}>
      <View style={styles.heroBanner}>
        <View style={{ flex: 1, paddingRight: 24 }}>
          <Text style={styles.heroTitle}>Download the VEXRO app to connect with your teens!</Text>
          <Text style={styles.heroDesc}>
            In order to connect with your teen, you'll need to download the VEXRO app on your phone. You can then complete setup by going to Family Center in user settings.
          </Text>
          
          <View style={styles.stepRow}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Ask your teen for their QR code</Text>
              <Text style={styles.stepDesc}>Your teen can find this by going to Family Center in user settings and clicking My Family.</Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Scan the QR code with your VEXRO app</Text>
              <Text style={styles.stepDesc}>This will send a connection request to your teen, like magic!</Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Have your teen accept the connection request</Text>
              <Text style={styles.stepDesc}>Once they give consent for you to view their activity data, you're good to go.</Text>
            </View>
          </View>
        </View>
        <View style={styles.heroIllustration}>
          <QrCode size={80} color="rgba(255,255,255,0.05)" />
        </View>
      </View>

      <Text style={styles.connectedHeader}>CONNECTED TEENS — 0 OF 8</Text>
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No family members connected yet.</Text>
      </View>
    </ScrollView>
  );

  const renderSettingsTab = () => (
    <ScrollView contentContainerStyle={styles.contentScroll}>
      <Text style={styles.sectionTitle}>General Settings</Text>
      
      <View style={styles.toggleRow}>
        <View style={{ flex: 1, paddingRight: 20 }}>
          <Text style={styles.infoTitle}>Enable Family Center tab</Text>
          <Text style={styles.infoDesc}>This will show you the Family Center tab. Here you can pair with your family members to create a safe, yet privacy conscious environment for your family!</Text>
        </View>
        <Switch value={enableTab} onValueChange={setEnableTab} trackColor={{ false: colors.bg4, true: colors.accent }} thumbColor="#fff" />
      </View>

      <View style={styles.toggleRow}>
        <View style={{ flex: 1, paddingRight: 20 }}>
          <Text style={styles.infoTitle}>Receive Activity Summary emails</Text>
          <Text style={styles.infoDesc}>You will receive a weekly email summarizing your teen(s)' recent activity. We recommend keeping this setting on.</Text>
        </View>
        <Switch value={emailSummary} onValueChange={setEmailSummary} trackColor={{ false: colors.bg4, true: colors.accent }} thumbColor="#fff" />
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Top Tabs */}
      <View style={styles.tabsRow}>
        <TabButton label="Activity" active={activeTab === 'Activity'} onPress={() => setActiveTab('Activity')} />
        <TabButton label="My Family" active={activeTab === 'My Family'} onPress={() => setActiveTab('My Family')} />
        <TabButton label="Settings" active={activeTab === 'Settings'} onPress={() => setActiveTab('Settings')} />
      </View>

      {/* Content Area */}
      <View style={{ flex: 1 }}>
        {activeTab === 'Activity' && renderActivityTab()}
        {activeTab === 'My Family' && renderMyFamilyTab()}
        {activeTab === 'Settings' && renderSettingsTab()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  tabsRow: { flexDirection: 'row', paddingHorizontal: 40, borderBottomWidth: 1, borderBottomColor: colors.border },
  tabBtn: { marginRight: 32, paddingVertical: 16, position: 'relative' },
  tabText: { color: colors.textDim, fontSize: 15, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  tabIndicator: { position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, backgroundColor: colors.accent },

  contentScroll: { padding: 40, maxWidth: 900 },
  
  heroBanner: { flexDirection: 'row', backgroundColor: colors.bg2, borderRadius: 16, padding: 32, borderWidth: 1, borderColor: colors.border, marginBottom: 32, overflow: 'hidden' },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 12 },
  heroDesc: { color: colors.textDim, fontSize: 14, lineHeight: 22, marginBottom: 24 },
  primaryBtn: { backgroundColor: colors.accent, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, alignSelf: 'flex-start' },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  heroIllustration: { justifyContent: 'center', alignItems: 'center' },

  featureGrid: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  featureCard: { flex: 1, backgroundColor: colors.bg2, borderRadius: 12, padding: 24, borderWidth: 1, borderColor: colors.border },
  featureIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  featureTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  featureDesc: { color: colors.textDim, fontSize: 13, lineHeight: 20 },

  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  sectionDesc: { color: colors.textDim, fontSize: 14, lineHeight: 20, marginBottom: 20 },
  
  infoList: { backgroundColor: colors.bg2, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoIconWrap: { width: 32, alignItems: 'center', marginRight: 12, marginTop: 2 },
  infoTitle: { color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 4 },
  infoDesc: { color: colors.textDim, fontSize: 13, lineHeight: 18 },

  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  stepNumText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  stepTitle: { color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 4 },
  stepDesc: { color: colors.textDim, fontSize: 13, lineHeight: 18 },

  connectedHeader: { color: colors.textDim, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginTop: 16, marginBottom: 24 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyStateText: { color: colors.textMuted, fontSize: 15 },

  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, paddingVertical: 8 },
});