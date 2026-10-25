import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return setError('Please fill in all fields');
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.center}>
        <View style={styles.card}>
          <View style={styles.logoWrap}>
            <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode='contain' />
            <Text style={styles.logo}>VEXRO</Text>
            <Text style={styles.subtitle}>Your people. Your space. Your rules.</Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.inputGroup}>
            <Mail size={20} color={colors.textDim} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Lock size={20} color={colors.textDim} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
            <Text style={styles.loginBtnText}>{loading ? 'Authenticating...' : 'Secure Login'}</Text>
            {!loading && <ArrowRight size={18} color="#fff" />}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
            <Text style={styles.registerText}>New to VEXRO? <Text style={{ color: colors.accent, fontWeight: '700' }}>Create an account</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { width: '90%', maxWidth: 440, backgroundColor: colors.bg2, padding: 40, borderRadius: 24, borderWidth: 1, borderColor: colors.border },
  logoWrap: { alignItems: 'center', marginBottom: 32 },
  logoImage: { width: 120, height: 120 },
  logo: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: 2, marginTop: 12 },
  subtitle: { color: colors.textDim, fontSize: 13, marginTop: 8 },
  errorText: { color: colors.danger, fontSize: 13, textAlign: 'center', marginBottom: 16, fontWeight: '600' },
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, borderRadius: 12, marginBottom: 16, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: colors.border },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  loginBtn: { flexDirection: 'row', backgroundColor: colors.accent, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8, gap: 8 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  registerLink: { marginTop: 24, alignItems: 'center' },
  registerText: { color: colors.textDim, fontSize: 14 },
});