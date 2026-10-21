import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Activity, Shield, Zap } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back,</Text>
          <Text style={styles.subtitle}>Here's what's happening in VEXRO.</Text>
        </View>

        <View style={styles.grid}>
          {/* Stat Card 1 */}
          <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(130,133,255,0.1)' }]}>
              <Users size={24} color={colors.accent} />
            </View>
            <Text style={styles.cardTitle}>Active Members</Text>
            <Text style={styles.cardValue}>1,248</Text>
            <Text style={styles.cardTrend}>+12% this week</Text>
          </View>

          {/* Stat Card 2 */}
          <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(85,214,194,0.1)' }]}>
              <Activity size={24} color={colors.secondary} />
            </View>
            <Text style={styles.cardTitle}>Messages Sent</Text>
            <Text style={styles.cardValue}>8,432</Text>
            <Text style={styles.cardTrend}>+5% this week</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <Zap size={20} color={colors.warning} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Boost Server</Text>
            <Text style={styles.actionDesc}>Unlock higher audio quality and more emoji slots.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <Shield size={20} color={colors.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Security Center</Text>
            <Text style={styles.actionDesc}>Enable 2FA and review active sessions.</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: 32 },
  header: { marginBottom: 32 },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.textDim, marginTop: 4 },
  grid: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  card: { flex: 1, backgroundColor: colors.bg2, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  cardTitle: { ...typography.body, color: colors.textDim, marginBottom: 8 },
  cardValue: { ...typography.h1, color: colors.text, marginBottom: 8 },
  cardTrend: { ...typography.caption, color: colors.success },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: 16 },
  actionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg2, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  actionIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  actionTitle: { ...typography.bodyBold, color: colors.text, marginBottom: 2 },
  actionDesc: { ...typography.caption, color: colors.textDim },
});