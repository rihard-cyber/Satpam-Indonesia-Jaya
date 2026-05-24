import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password wajib diisi');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Login Gagal', error.message);
    } else {
      navigation.replace('Main');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🛡️</Text>
          </View>
          <Text style={styles.title}>Satpam Indonesia</Text>
          <Text style={styles.subtitle}>JAYA</Text>
          <Text style={styles.tagline}>Platform Digital Satpam Nasional</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan email"
            placeholderTextColor={COLORS.text.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan password"
            placeholderTextColor={COLORS.text.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title="Masuk"
            onPress={handleLogin}
            loading={loading}
            variant="gold"
            style={styles.loginButton}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.registerLink}
          >
            <Text style={styles.registerText}>
              Belum punya akun?{' '}
              <Text style={styles.registerHighlight}>Daftar</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy[900],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  logoIcon: {
    fontSize: 36,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gold,
    marginTop: 2,
  },
  tagline: {
    ...FONTS.caption,
    marginTop: SPACING.sm,
  },
  form: {
    width: '100%',
  },
  label: {
    ...FONTS.medium,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    color: COLORS.white,
    fontSize: 15,
  },
  loginButton: {
    marginTop: SPACING.xxl,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  registerText: {
    ...FONTS.regular,
    color: COLORS.text.tertiary,
  },
  registerHighlight: {
    color: COLORS.gold,
    fontWeight: '600',
  },
});
