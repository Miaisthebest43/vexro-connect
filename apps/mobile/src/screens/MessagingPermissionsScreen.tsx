import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { MessageSquare, Ban, ChevronDown, Eye, EyeOff, Link as LinkIcon, Palette, ChevronRight } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function MessagingPermissionsScreen({ activeTab }: { activeTab: string }) {
  // Toggles
  const [ageRestrictedCommands, setAgeRestrictedCommands] = useState(false);
  const [ageRestrictedServers, setAgeRestrictedServers] = useState(false);
  const [spamFilter, setSpamFilter] = useState('all');
  const [allowDMs, setAllowDMs] = useState(true);
  const [messageRequests, setMessageRequests] = useState(true);
  const [frEveryone, setFrEveryone] = useState(true);
  const [frFriendsOfFriends, setFrFriendsOfFriends] = useState(true);
  const [frServerMembers, setFrServerMembers] = useState(true);
  const [showPersonalized, setShowPersonalized] = useState(true);

  const Divider = () => <View style={styles.divider} />;

  const ToggleRow = ({ title, desc, value, onValueChange }: any) => (
    <View style={styles.row}>
      <View style={{ flex: 1, paddingRight: 20 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {desc && <Text style={styles.rowDesc}>{desc}</Text>}
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: '#80848E', true: colors.accent }} thumbColor="#fff" />
    </View>
  );

  const RadioRow = ({ title, desc, value, selected, onSelect }: any) => (
    <TouchableOpacity style={styles.row} onPress={() => onSelect(value)}>
      <View style={[styles.radioOuter, selected && { borderColor: colors.accent, backgroundColor: colors.accent }]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {desc && <Text style={styles.rowDesc}>{desc}</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Content Filters':
        return (
          <ScrollView contentContainerStyle={styles.contentScroll}>
            <Text style={styles.pageTitle}>Content Filters</Text>

            <Text style={styles.sectionTitle}>Sensitive content filters</Text>
            <Text style={styles.sectionDesc}>Choose how you want to see image-based media detected by VEXRO's sensitive content filters. <Text style={{ color: '#00A8FC' }}>Learn more</Text></Text>

            <View style={styles.card}>
              <View style={[styles.tableRow, { borderLeftWidth: 3, borderLeftColor: colors.accent }]}>
                <Text style={[styles.tableLabel, { color: colors.accent }]}>Mature Sexual Media</Text>
                <Text style={styles.tableValue}>Direct messages from friends</Text>
                <TouchableOpacity style={styles.dropdownBtn}>
                  <Eye size={16} color={colors.text} style={{ marginRight: 6 }} />
                  <Text style={styles.dropdownText}>Show</Text>
                  <ChevronDown size={16} color={colors.textDim} style={{ marginLeft: 12 }} />
                </TouchableOpacity>
              </View>
              <Divider />
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Graphic Media</Text>
                <Text style={styles.tableValue}>Direct messages from others</Text>
                <TouchableOpacity style={styles.dropdownBtn}>
                  <EyeOff size={16} color={colors.text} style={{ marginRight: 6 }} />
                  <Text style={styles.dropdownText}>Block</Text>
                  <ChevronDown size={16} color={colors.textDim} style={{ marginLeft: 12 }} />
                </TouchableOpacity>
              </View>
              <Divider />
              <View style={[styles.tableRow, { paddingVertical: 16 }]}>
                <View style={{ flex: 1 }} />
                <Text style={styles.tableValue}>Messages in server channels</Text>
                <TouchableOpacity style={styles.dropdownBtn}>
                  <Eye size={16} color={colors.text} style={{ marginRight: 6 }} />
                  <Text style={styles.dropdownText}>Show</Text>
                  <ChevronDown size={16} color={colors.textDim} style={{ marginLeft: 12 }} />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.helpText}>Helps detect image-based media that may contain sexually explicit or suggestive material involving adults.</Text>

            <View style={{ marginTop: 24 }}>
              <ToggleRow title="Allow access to age-restricted commands from apps in DMs" desc="Allows people 18+ to access commands marked as age-restricted in DMs. Applies to all apps." value={ageRestrictedCommands} onValueChange={setAgeRestrictedCommands} />
              <ToggleRow title="Allow access to age-restricted servers on iOS" desc="Access age-restricted servers (18+) on iOS devices, after joining them on desktop." value={ageRestrictedServers} onValueChange={setAgeRestrictedServers} />
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 32, fontSize: 12, color: colors.textDim }]}>Related Settings</Text>
            <TouchableOpacity style={styles.relatedCard}>
              <View style={styles.relatedIcon}><Palette size={24} color={colors.text} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>Appearance</Text>
                <Text style={styles.rowDesc}>Show/hide media in chat, spoiler content</Text>
              </View>
              <ChevronRight size={20} color={colors.textDim} />
            </TouchableOpacity>
          </ScrollView>
        );

      case 'Spam Filters':
        return (
          <ScrollView contentContainerStyle={styles.contentScroll}>
            <Text style={styles.pageTitle}>Spam Filters</Text>
            <Text style={[styles.rowTitle, { marginTop: 16, fontSize: 17 }]}>Automatically filter suspected spam messages</Text>
            <Text style={[styles.rowDesc, { marginBottom: 24 }]}>VEXRO can filter out some messages that contain spam. These messages go to your Spam inbox.</Text>

            <RadioRow title="Filter all spam" value="all" selected={spamFilter === 'all'} onSelect={setSpamFilter} />
            <RadioRow title="Filter messages from non-friends (Recommended)" value="non-friends" selected={spamFilter === 'non-friends'} onSelect={setSpamFilter} />
            <RadioRow title="Don't filter spam" value="none" selected={spamFilter === 'none'} onSelect={setSpamFilter} />
          </ScrollView>
        );

      case 'Direct Messages':
        return (
          <ScrollView contentContainerStyle={styles.contentScroll}>
            <Text style={styles.pageTitle}>Direct Message (DM) Permissions</Text>

            <TouchableOpacity style={styles.serverDropdown}>
              <View style={styles.serverIcon}><MessageSquare size={16} color="#fff" /></View>
              <Text style={styles.serverDropdownText}>All servers</Text>
              <ChevronDown size={16} color={colors.textDim} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            <ToggleRow title="Direct Messages" desc="Allow DMs from other server members" value={allowDMs} onValueChange={setAllowDMs} />
            <ToggleRow title="Message requests" desc="Filter messages from server members you may not know. Learn more" value={messageRequests} onValueChange={setMessageRequests} />
          </ScrollView>
        );

      case 'Friend Requests':
        return (
          <ScrollView contentContainerStyle={styles.contentScroll}>
            <Text style={styles.pageTitle}>Friend Request Permissions</Text>
            <Text style={[styles.rowDesc, { marginTop: 8, marginBottom: 24, fontSize: 15 }]}>Control who can send you friend requests and how they appear.</Text>

            <Text style={[styles.rowTitle, { fontSize: 17 }]}>Allow Friend Requests from...</Text>

            <View style={{ marginTop: 16 }}>
              <ToggleRow title="Everyone" value={frEveryone} onValueChange={setFrEveryone} />
              <ToggleRow title="Friend of friends" value={frFriendsOfFriends} onValueChange={setFrFriendsOfFriends} />
              <ToggleRow title="Server members" desc="Server members can only send you friend requests from servers where you also allow Direct Messages." value={frServerMembers} onValueChange={setFrServerMembers} />
            </View>

            <View style={{ height: 20 }} />

            <ToggleRow title="Show personalized messages" desc="Show personalized messages on incoming friend requests. If you accept, the message will still appear in your DMs." value={showPersonalized} onValueChange={setShowPersonalized} />
          </ScrollView>
        );

      case 'Connected Games':
        return (
          <ScrollView contentContainerStyle={styles.contentScroll}>
            <Text style={styles.pageTitle}>Messaging in Connected Games</Text>
            <Text style={[styles.rowDesc, { marginTop: 8, marginBottom: 24, fontSize: 15 }]}>These are settings for games that use VEXRO to power their social experiences.</Text>

            <View style={styles.emptyStateCard}>
              <Text style={styles.emptyStateTitle}>No games Connected</Text>
              <Text style={styles.emptyStateDesc}>Want to connect a game to your account? <Text style={{ color: '#00A8FC' }}>Learn more</Text></Text>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 32, fontSize: 12, color: colors.textDim }]}>Related Settings</Text>
            <TouchableOpacity style={styles.relatedCard}>
              <View style={styles.relatedIcon}><LinkIcon size={24} color={colors.text} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>Authorized Apps</Text>
                <Text style={styles.rowDesc}>Manage your games in Authorized Apps</Text>
              </View>
              <ChevronRight size={20} color={colors.textDim} />
            </TouchableOpacity>
          </ScrollView>
        );

      case 'Ignore & Block':
        return (
          <ScrollView contentContainerStyle={styles.contentScroll}>
            <Text style={styles.pageTitle}>Ignore & Block</Text>
            <Text style={[styles.rowDesc, { marginTop: 8, marginBottom: 24, fontSize: 15 }]}>
              You're in control. To compare your options for reducing unwanted interactions, <Text style={{ color: '#00A8FC' }}>explore our feature guide</Text>.
            </Text>

            <View style={styles.blockedCard}>
              <View style={styles.blockedHeader}>
                <View style={styles.blockedIconWrap}>
                  <Ban size={20} color={colors.textDim} />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.rowTitle}>Blocked accounts</Text>
                  <Text style={styles.rowDesc}>4 accounts</Text>
                </View>
              </View>

              {[
                { name: 'GNatty', username: 'natznx5_', color: '#E74C3C' },
                { name: 'a', username: 'qylm', color: '#F1C40F' },
                { name: 'golden_starfish_63170', username: '', color: '#E91E63' },
                { name: 'tenacious_fox_54118', username: '', color: '#E74C3C' },
              ].map((u, i) => (
                <View key={i} style={styles.blockedRow}>
                  <View style={[styles.avatar, { backgroundColor: u.color }]}>
                    <Text style={styles.avatarText}>{u.name[0].toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.blockedName}>{u.name}</Text>
                    {u.username ? <Text style={styles.blockedUsername}>{u.username}</Text> : null}
                  </View>
                  <TouchableOpacity style={styles.unblockBtn}>
                    <Text style={styles.unblockText}>Unblock</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        );

      default:
        return <View />;
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  contentScroll: { padding: 40, maxWidth: 800 },
  pageTitle: { color: colors.text, fontSize: 24, fontWeight: '800', marginBottom: 24 },

  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  sectionDesc: { color: colors.textDim, fontSize: 14, marginBottom: 16 },

  card: { backgroundColor: colors.bg2, borderRadius: 8, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  divider: { height: 1, backgroundColor: colors.border },

  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 0, marginBottom: 8 },
  rowTitle: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  rowDesc: { color: colors.textDim, fontSize: 14, lineHeight: 20 },

  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, minHeight: 60 },
  tableLabel: { width: 180, color: colors.text, fontSize: 15, fontWeight: '500' },
  tableValue: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '500' },
  dropdownBtn: { flexDirection: 'row', alignItems: 'center' },
  dropdownText: { color: colors.text, fontSize: 14 },
  helpText: { color: colors.textDim, fontSize: 12, marginTop: 12, marginLeft: 20 },

  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#80848E', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },

  serverDropdown: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border, padding: 12, borderRadius: 4, marginBottom: 24 },
  serverIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  serverDropdownText: { color: colors.text, fontSize: 15, fontWeight: '500' },

  relatedCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg2, padding: 16, borderRadius: 8 },
  relatedIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center', marginRight: 16 },

  emptyStateCard: { backgroundColor: colors.bg2, borderRadius: 8, padding: 40, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  emptyStateTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  emptyStateDesc: { color: colors.textDim, fontSize: 14 },

  blockedCard: { backgroundColor: colors.bg2, borderRadius: 8, overflow: 'hidden' },
  blockedHeader: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  blockedIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center' },
  blockedRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  blockedName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  blockedUsername: { color: colors.textDim, fontSize: 14, marginTop: 2 },
  unblockBtn: { backgroundColor: colors.bg3, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 4 },
  unblockText: { color: colors.text, fontSize: 14, fontWeight: '500' },
});