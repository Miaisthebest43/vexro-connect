import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Store, Sparkles, ChevronLeft } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function ComingSoonScreen({ title, onBack }: { title: string, onBack: () => void }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <ChevronLeft size={20} color={colors.accent} />
        <Text style={styles.backText}>Back to Home</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconWrap}>
          {title === 'Nitro' ? <Sparkles size={48} color={colors.accent} /> : <Store size={48} color={colors.accent} />}
        </View>
        <Text style={styles.title}>{title} is coming soon!</Text>
        <Text style={styles.desc}>
          We are working hard to bring you the best {title.toLowerCase()} experience. Stay tuned for updates!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 32 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 40, alignSelf: 'flex-start' },
  backText: { color: colors.accent, fontSize: 14, fontWeight: '600' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconWrap: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(88, 101, 242, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginBottom: 12 },
  desc: { color: colors.textDim, fontSize: 15, textAlign: 'center', maxWidth: 400, lineHeight: 22 },
});