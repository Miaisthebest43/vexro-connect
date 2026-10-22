import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !username || !password) return setError('Please fill in all fields');
    setLoading(true);
    setError('');
    try {
      await register(email, username, password);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' }} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.center}>
          
          <View style={styles.card}>
            <View style={styles.logoWrap}>
              <ShieldCheck size={48} color={colors.success} />
              <Text style={styles.logo}>JOIN VEXRO</Text>
              <Text style={styles.subtitle}>Create your identity. Encrypted by default.</Text>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputGroup}>
              <Mail size={20} color={colors.textDim} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            </View>

            <View style={styles.inputGroup}>
              <User size={20} color={colors.textDim} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Username" placeholderTextColor={colors.textMuted} value={username} onChangeText={setUsername} autoCapitalize="none" />
            </View>

            <View style={styles.inputGroup}>
              <Lock size={20} color={colors.textDim} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Password (Min 8 chars)" placeholderTextColor={colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={handleRegister} disabled={loading}>
              <Text style={styles.loginBtnText}>{loading ? 'Creating Account...' : 'Register'}</Text>
              {!loading && <ArrowRight size={18} color="#fff" />}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.registerLink}>
              <Text style={styles.registerText}>Already have an account? <Text style={{ color: colors.accent, fontWeight: '700' }}>Log In</Text></Text>
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(10, 11, 16, 0.85)', justifyContent: 'center', alignItems: 'center' },
  center: { width: '100%', maxWidth: 440, padding: 20 },
  card: { backgroundColor: 'rgba(18, 20, 29, 0.95)', padding: 40, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(106, 92, 255, 0.3)' },
  logoWrap: { alignItems: 'center', marginBottom: 32 },
  logo: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 2, marginTop: 12 },
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