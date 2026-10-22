import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { X, Upload } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function CreateCommunityScreen({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Create a Community</Text>
          <TouchableOpacity onPress={onClose}><X size={24} color={colors.textDim} /></TouchableOpacity>
        </View>
        <Text style={styles.desc}>Your community is where you and your friends hang out. Make yours and start talking.</Text>
        
        <View style={styles.uploadArea}>
          <Upload size={32} color={colors.textMuted} />
          <Text style={styles.uploadText}>Upload Icon</Text>
        </View>

        <Text style={styles.label}>COMMUNITY NAME</Text>
        <TextInput style={styles.input} placeholder="Enter community name" placeholderTextColor={colors.textMuted} />

        <TouchableOpacity style={styles.createBtn}>
          <Text style={styles.createBtnText}>Create Community</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '100%', maxWidth: 440, backgroundColor: colors.bg2, borderRadius: 16, padding: 32, borderWidth: 1, borderColor: colors.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { color: colors.text, fontSize: 20, fontWeight: '800' },
  desc: { color: colors.textDim, fontSize: 13, lineHeight: 20, marginBottom: 24 },
  uploadArea: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24 },
  uploadText: { color: colors.textMuted, fontSize: 10, marginTop: 4 },
  label: { color: colors.textDim, fontSize: 11, fontWeight: '700', marginBottom: 8 },
  input: { backgroundColor: colors.bg, borderRadius: 8, padding: 12, color: colors.text, fontSize: 15, marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  createBtn: { backgroundColor: colors.accent, padding: 16, borderRadius: 8, alignItems: 'center' },
  createBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});