import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';

type ToastType = 'success' | 'error' | 'info';
interface ToastData { id: number; message: string; type: ToastType }

const ToastContext = createContext<{ showToast: (msg: string, type?: ToastType) => void }>({ showToast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++counter.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.container} pointerEvents="none">
        {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
      </View>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast }: { toast: ToastData }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  const bg = toast.type === 'error' ? colors.danger : toast.type === 'success' ? colors.success : colors.accent;

  return (
    <Animated.View style={[styles.toast, { backgroundColor: bg, opacity, transform: [{ translateY }] }]}>
      <Text style={styles.icon}>{toast.type === 'error' ? '✕' : toast.type === 'success' ? '✓' : 'ℹ'}</Text>
      <Text style={styles.text}>{toast.message}</Text>
    </Animated.View>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 100, left: 0, right: 0, alignItems: 'center', gap: 8 },
  toast: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, maxWidth: '85%', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  icon: { color: '#fff', fontWeight: '800', fontSize: 16, marginRight: 8 },
  text: { color: '#fff', fontSize: 14, fontWeight: '600', flexShrink: 1 },
});