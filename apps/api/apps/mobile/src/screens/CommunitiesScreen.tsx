import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Users, Search } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { api } from '../lib/api';

export default function CommunitiesScreen() {
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/data/communities')
      .then((res: any) => setCommunities(res.communities))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator color={colors.accent} size="large" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Communities</Text>
        <Text style={styles.subtitle}>Find your people. Join the conversation.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {communities.map((c, i) => (
            <TouchableOpacity key={c.id} style={styles.card}>
              <View style={[styles.iconBox, { backgroundColor: ['#3498DB','#9B59B6','#E91E63','#F1C40F'][i % 4] + '20' }]}>
                <Text style={[styles.iconText, { color: ['#3498DB','#9B59B6','#E91E63','#F1C40F'][i % 4] }]}>{c.name[0]}</Text>
              </View>
              <Text style={styles.cardTitle}>{c.name}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{c.description}</Text>
              <View style={styles.cardBottom}>
                <View style={styles.statRow}><Users size={14} color={colors.textDim} /><Text style={styles.statText}>1,240 members</Text></View>
                <TouchableOpacity style={styles.joinBtn}><Text style={styles.joinBtnText}>Join</Text></TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  header: { padding: 32, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { color: colors.text, fontSize: 24, fontWeight: '800' },
  subtitle: { color: colors.textDim, fontSize: 14, marginTop: 4 },
  scrollContent: { padding: 32 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
  card: { width: '31%', minWidth: 280, backgroundColor: colors.bg2, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  iconText: { fontSize: 24, fontWeight: '800' },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  cardDesc: { color: colors.textDim, fontSize: 13, marginBottom: 20 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { color: colors.textDim, fontSize: 12 },
  joinBtn: { backgroundColor: colors.accent, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6 },
  joinBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});