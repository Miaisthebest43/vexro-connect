import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, Modal, ActivityIndicator } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { colors } from '../theme/colors';

const GIPHY_API_KEY = 'dc6zaTOxFJmzC'; // Public Beta Key (For production, get your own at developers.giphy.com)

export default function GifPicker({ visible, onClose, onSelectGif }: { visible: boolean, onClose: () => void, onSelectGif: (url: string) => void }) {
  const [query, setQuery] = useState('');
  const [gifs, setGifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGifs = async (searchQuery: string) => {
    setLoading(true);
    const endpoint = searchQuery.trim() 
      ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=20&rating=pg-13`
      : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=20&rating=pg-13`;

    try {
      const res = await fetch(endpoint);
      const json = await res.json();
      setGifs(json.data || []);
    } catch (err) {
      console.error('Failed to fetch GIFs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) fetchGifs('');
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>GIFs</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.textDim} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchWrap}>
            <Search size={16} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Giphy..."
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={(text) => { setQuery(text); fetchGifs(text); }}
            />
          </View>

          {/* Grid */}
          {loading ? (
            <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={gifs}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={{ padding: 8 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.gifItem} onPress={() => { onSelectGif(item.images.fixed_height.url); onClose(); }}>
                  <Image source={{ uri: item.images.fixed_height.url }} style={styles.gifImage} resizeMode="cover" />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modal: { height: '80%', backgroundColor: colors.bg2, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderColor: colors.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  closeBtn: { padding: 4 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, margin: 16, paddingHorizontal: 12, height: 40, borderRadius: 8 },
  searchInput: { flex: 1, color: colors.text, fontSize: 14, marginLeft: 8 },
  gifItem: { flex: 1, margin: 6, aspectRatio: 1.2, borderRadius: 8, overflow: 'hidden' },
  gifImage: { width: '100%', height: '100%' },
});