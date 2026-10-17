import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    if (!email || !password) return;
    setBusy(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      Alert.alert('Login failed', e.message ?? 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>VEXRO</Text>
        <Text style={styles.tagline}>Your people. Your space. Your rules.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textDim}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textDim}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, busy && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={busy}
        >
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>No account? Create one</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  inner: { flex: 1, padding: 24, justifyContent: 'center' },
  logo: { fontSize: 48, fontWeight: '800', color: colors.text, letterSpacing: 4, textAlign: 'center' },
  tagline: { color: colors.textDim, textAlign: 'center', marginTop: 8, marginBottom: 40 },
  input: {
    backgroundColor: colors.card, color: colors.text,
    padding: 16, borderRadius: 12, marginBottom: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.accent, padding: 16, borderRadius: 12,
    alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { backgroundColor: colors.accentDim },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { color: colors.accent, textAlign: 'center', marginTop: 24 },
});