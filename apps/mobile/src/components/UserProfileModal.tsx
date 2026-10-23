import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X, MessageSquare, UserPlus, MoreHorizontal, ShieldCheck } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function UserProfileModal({ visible, onClose, user }: { visible: boolean, onClose: () => void, user: any }) {
  if (!user) return null;
  const name = user.name || 'Izan7777';
  const initial = name[0].toUpperCase();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={20} color={colors.textDim} />
          </TouchableOpacity>

          {/* Left Panel */}
          <View style={styles.leftPanel}>
            {/* Banner (Solid Brand Color) */}
            <View style={styles.banner} />
            
            {/* Avatar (Solid Brand Color + Initial) */}
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initial}</Text>
              </View>
              <View style={styles.statusBadge}>
                <ShieldCheck size={12} color={colors.accent} />
              </View>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.displayName}>{name}</Text>
              <Text style={styles.username}>{name.toLowerCase()}. .</Text>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.msgBtn}>
                  <MessageSquare size={16} color="#fff" />
                  <Text style={styles.msgBtnText}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                  <UserPlus size={16} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                  <MoreHorizontal size={16} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Metadata */}
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Member Since</Text>
                <Text style={styles.metaValue}>May 17, 2026</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Friends Since</Text>
                <Text style={styles.metaValue}>Sep 1, 2026</Text>
              </View>

              {/* Notes */}
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Note (only visible to you)</Text>
                <Text style={styles.noteText}>Click to add a note</Text>
              </View>
            </View>
          </View>

          {/* Right Panel */}
          <View style={styles.rightPanel}>
            {/* Tabs */}
            <View style={styles.tabsRow}>
              <TouchableOpacity style={[styles.tab, styles.tabActive]}>
                <Text style={styles.tabTextActive}>Activity</Text>
                <View style={styles.tabIndicator} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text style={styles.tabText}>No Mutual Friends</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text style={styles.tabText}>No Mutual Servers</Text>
              </TouchableOpacity>
            </View>

            {/* Empty State */}
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>{name} doesn't have any activity to share here</Text>
              <Text style={styles.emptyDesc}>They're shy 👉👈 ...say hey to break the ice</Text>
              <TouchableOpacity style={styles.emptyMsgBtn}>
                <MessageSquare size={16} color="#fff" />
                <Text style={styles.emptyMsgText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '90%', maxWidth: 900, height: 600, backgroundColor: colors.bg, borderRadius: 16, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20 },
  
  closeBtn: { position: 'absolute', top: 16, right: 16, zIndex: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bg2, alignItems: 'center', justifyContent: 'center' },

  // Left Panel
  leftPanel: { flex: 0.45, backgroundColor: colors.bg2, borderRightWidth: 1, borderRightColor: colors.border },
  banner: { height: 120, backgroundColor: '#E91E63', width: '100%' }, // Solid VEXRO Pink/Magenta
  avatarWrap: { paddingHorizontal: 24, marginTop: -48, position: 'relative' },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#E91E63', alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: colors.bg2 },
  avatarText: { color: '#fff', fontSize: 40, fontWeight: '800' },
  statusBadge: { position: 'absolute', bottom: 4, right: 28, width: 24, height: 24, borderRadius: 12, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  
  infoSection: { padding: 24 },
  displayName: { color: colors.text, fontSize: 24, fontWeight: '800' },
  username: { color: colors.textDim, fontSize: 14, marginTop: 4, marginBottom: 20 },

  actionRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  msgBtn: { flex: 1, flexDirection: 'row', backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8, gap: 8 },
  msgBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  iconBtn: { width: 40, height: 40, borderRadius: 8, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center' },

  metaRow: { marginBottom: 16 },
  metaLabel: { color: colors.textDim, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  metaValue: { color: colors.text, fontSize: 14 },
  noteText: { color: colors.textMuted, fontSize: 14, fontStyle: 'italic' },

  // Right Panel
  rightPanel: { flex: 0.55, backgroundColor: colors.bg, padding: 32 },
  tabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, gap: 24, marginBottom: 40 },
  tab: { paddingBottom: 12 },
  tabActive: { position: 'relative' },
  tabText: { color: colors.textDim, fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: colors.text, fontSize: 14, fontWeight: '700' },
  tabIndicator: { position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, backgroundColor: colors.text },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  emptyDesc: { color: colors.textDim, fontSize: 14, textAlign: 'center', marginBottom: 24 },
  emptyMsgBtn: { flexDirection: 'row', backgroundColor: colors.bg3, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', gap: 8 },
  emptyMsgText: { color: colors.text, fontSize: 14, fontWeight: '600' },
});