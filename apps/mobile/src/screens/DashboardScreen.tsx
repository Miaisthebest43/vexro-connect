import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function DashboardScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>VEXRO</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.welcome}>Welcome back,</Text>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sprint 3 complete</Text>
          <Text style={styles.cardText}>
            You're signed in from a real mobile client with a real session.
            Next up: channels, messaging, and communities.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24,
  },
  brand: { color: colors.text, fontSize: 20, fontWeight: '800', letterSpacing: 2 },
  logout: { color: colors.danger, fontSize: 14 },
  body: { flex: 1, paddingHorizontal: 24 },
  welcome: { color: colors.textDim, fontSize: 16 },
  username: { color: colors.text, fontSize: 32, fontWeight: '700', marginTop: 4 },
  email: { color: colors.textDim, fontSize: 14, marginTop: 4 },
  card: {
    backgroundColor: colors.card, padding: 20, borderRadius: 16,
    marginTop: 40, borderWidth: 1, borderColor: colors.border,
  },
  cardTitle: { color: colors.success, fontSize: 14, fontWeight: '700', marginBottom: 8 },
  cardText: { color: colors.text, lineHeight: 22 },
});