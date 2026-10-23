import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { colors } from '../theme/colors';

export default function MemberList() {
  return (
    <View style={styles.container}>
      <ScrollView style={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>Members — 9</Text>
        
        <View style={styles.member}>
          <Image source={{ uri: 'https://i.pravatar.cc/100?img=1' }} style={styles.avatar} />
          <View>
            <Text style={styles.name}>NovaDreamer <Text style={styles.tag}>You</Text></Text>
            <Text style={styles.status}>Online</Text>
          </View>
        </View>

        <View style={styles.member}>
          <Image source={{ uri: 'https://i.pravatar.cc/100?img=2' }} style={styles.avatar} />
          <View>
            <Text style={styles.name}>ZeroRush</Text>
            <Text style={styles.status}>Online</Text>
          </View>
        </View>
        
        <View style={styles.member}>
          <Image source={{ uri: 'https://i.pravatar.cc/100?img=3' }} style={styles.avatar} />
          <View>
            <Text style={styles.name}>PixelBuilder</Text>
            <Text style={styles.status}>Online</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Offline — 3</Text>
        <View style={[styles.member, { opacity: 0.5 }]}>
          <Image source={{ uri: 'https://i.pravatar.cc/100?img=4' }} style={styles.avatar} />
          <View>
            <Text style={styles.name}>LunaCode</Text>
            <Text style={styles.status}>Offline</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 240, backgroundColor: colors.bg2, borderLeftWidth: 1, borderLeftColor: colors.border },
  sectionTitle: { color: colors.textDim, fontSize: 12, fontWeight: '700', marginBottom: 16, textTransform: 'uppercase' },
  member: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 12 },
  name: { color: colors.text, fontSize: 14, fontWeight: '600' },
  tag: { color: colors.accent, fontSize: 11 },
  status: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
});