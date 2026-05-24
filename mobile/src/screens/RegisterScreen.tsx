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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { Button } from '../components/Button';

export default function RegisterScreen({ navigation }: any) {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nama || !email || !password) {
      Alert.alert('Error', 'Lengkapi semua field');
      return;
    }
    setLoading(true);
    // TODO: Implement register via Supabase
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Berhasil', 'Silakan cek email untuk verifikasi');
      navigation.goBack();
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Kembali</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Daftar Akun</Text>
            <Text style={styles.sub}>Bergabung dengan komunitas Satpam Indonesia</Text>
          </View>

          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={styles.input}
            placeholder="Nama lengkap"
            placeholderTextColor={COLORS.text.muted}
            value={nama}
            onChangeText={setNama}
          />

          <Text style={styles.label}>Email Aktif</Text>
          <TextInput
            style={styles.input}
            placeholder="contoh@email.com"
            placeholderTextColor={COLORS.text.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Nomor WhatsApp</Text>
          <TextInput
            style={styles.input}
            placeholder="08xxxxxxxxxx"
            placeholderTextColor={COLORS.text.muted}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Minimal 8 karakter"
            placeholderTextColor={COLORS.text.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title="Daftar Sekarang"
            onPress={handleRegister}
            loading={loading}
            variant="gold"
            style={styles.registerButton}
          />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>
              Sudah punya akun?{' '}
              <Text style={styles.loginHighlight}>Masuk</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
    padding: SPACING.xxl,
  },
  backButton: {
    marginBottom: SPACING.xl,
  },
  backText: {
    color: COLORS.gold,
    fontSize: 15,
  },
  header: {
    marginBottom: SPACING.xxl,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  sub: {
    ...FONTS.regular,
    color: COLORS.text.tertiary,
    marginTop: SPACING.sm,
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
  registerButton: {
    marginTop: SPACING.xxl,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  loginText: {
    ...FONTS.regular,
    color: COLORS.text.tertiary,
  },
  loginHighlight: {
    color: COLORS.gold,
    fontWeight: '600',
  },
});
