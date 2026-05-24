import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';

const menuItems = [
  { icon: '🪪', label: 'KTA Digital', screen: 'Sertifikat' },
  { icon: '🏆', label: 'Sertifikat', screen: 'Sertifikat' },
  { icon: '⭐', label: 'Badge Saya', screen: 'Profile' },
  { icon: '⚙️', label: 'Pengaturan', screen: 'Profile' },
];

export default function ProfileScreen({ navigation }: any) {
  const handleLogout = async () => {
    Alert.alert('Logout', 'Yakin ingin logout?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>BS</Text>
          </View>
          <Text style={styles.name}>Budi Santoso</Text>
          <Text style={styles.badge}>🛡️ Gada Pratama</Text>
          <View style={styles.badgesRow}>
            <View style={styles.badgeItem}>
              <Text style={styles.badgeDot}>✅</Text>
              <Text style={styles.badgeLabel}>Verified Satpam</Text>
            </View>
            <View style={styles.badgeItem}>
              <Text style={styles.badgeDot}>⭐</Text>
              <Text style={styles.badgeLabel}>Anggota Aktif</Text>
            </View>
          </View>
        </View>

        <Card variant="glass" style={styles.infoCard}>
          {[
            { label: 'Email', value: 'budi@email.com' },
            { label: 'WhatsApp', value: '08123456789' },
            { label: 'Domisili', value: 'Jakarta Timur' },
            { label: 'Tinggi/Berat', value: '170 cm / 65 kg' },
          ].map((item, i) => (
            <View key={i} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </Card>

        <Text style={styles.sectionTitle}>Menu</Text>
        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy[900],
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.gold + '40',
  },
  avatarText: {
    color: COLORS.black,
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  badge: {
    ...FONTS.regular,
    color: COLORS.gold,
    marginTop: 4,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: SPACING.md,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  badgeDot: {
    fontSize: 12,
  },
  badgeLabel: {
    ...FONTS.caption,
    color: COLORS.text.secondary,
  },
  infoCard: {
    marginBottom: SPACING.xl,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  infoLabel: {
    ...FONTS.regular,
    color: COLORS.text.tertiary,
  },
  infoValue: {
    ...FONTS.medium,
    color: COLORS.white,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navy[800],
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  menuLabel: {
    ...FONTS.medium,
    color: COLORS.white,
    flex: 1,
  },
  menuArrow: {
    color: COLORS.text.tertiary,
    fontSize: 20,
  },
  logoutButton: {
    marginTop: SPACING.xl,
  },
});
