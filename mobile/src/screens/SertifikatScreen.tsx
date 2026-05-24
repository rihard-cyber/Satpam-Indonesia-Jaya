import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { Card } from '../components/Card';

const certificates = [
  {
    nama: 'Ijazah Satpam',
    penerbit: 'Lemdiklat Satpam',
    status: 'verified',
    icon: '📜',
  },
  {
    nama: 'Sertifikat Gada Pratama',
    penerbit: 'Kemenkumham RI',
    status: 'verified',
    icon: '🏆',
  },
  {
    nama: 'Sertifikat First Aid',
    penerbit: 'PMI',
    status: 'verified',
    icon: '🚑',
  },
  {
    nama: 'Sertifikat Bela Diri',
    penerbit: 'KPSI',
    status: 'pending',
    icon: '🥋',
  },
];

export default function SertifikatScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* KTA Digital */}
        <Card variant="gradient" style={styles.ktaCard}>
          <View style={styles.ktaHeader}>
            <Text style={styles.ktaIcon}>🪪</Text>
            <View style={styles.ktaInfo}>
              <Text style={styles.ktaTitle}>KTA Digital</Text>
              <Text style={styles.ktaStatus}>✓ Terverifikasi</Text>
            </View>
          </View>
          <View style={styles.ktaDetails}>
            {[
              { label: 'Nomor KTA', value: 'KTA-2026-001234' },
              { label: 'Tingkatan', value: 'Gada Pratama' },
              { label: 'Masa Berlaku', value: '31 Des 2028' },
            ].map((item, i) => (
              <View key={i} style={styles.ktaRow}>
                <Text style={styles.ktaLabel}>{item.label}</Text>
                <Text style={styles.ktaValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Sertifikat Saya</Text>
        {certificates.map((cert, i) => (
          <Card key={i} style={styles.certCard} variant="glass">
            <View style={styles.certRow}>
              <Text style={styles.certIcon}>{cert.icon}</Text>
              <View style={styles.certInfo}>
                <Text style={styles.certName}>{cert.nama}</Text>
                <Text style={styles.certPenerbit}>{cert.penerbit}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    cert.status === 'verified'
                      ? styles.statusVerified
                      : styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      cert.status === 'verified'
                        ? styles.statusVerifiedText
                        : styles.statusPendingText,
                    ]}
                  >
                    {cert.status === 'verified' ? 'Terverifikasi' : 'Menunggu'}
                  </Text>
                </View>
              </View>
              <Text style={styles.downloadIcon}>⬇</Text>
            </View>
          </Card>
        ))}

        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadText}>+ Upload Sertifikat Baru</Text>
        </TouchableOpacity>
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
  ktaCard: {
    borderColor: COLORS.gold + '30',
    marginBottom: SPACING.xxl,
  },
  ktaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  ktaIcon: {
    fontSize: 36,
    marginRight: SPACING.md,
  },
  ktaInfo: {},
  ktaTitle: {
    ...FONTS.h3,
    color: COLORS.white,
  },
  ktaStatus: {
    color: COLORS.accent.green,
    fontSize: 13,
    fontWeight: '500',
  },
  ktaDetails: {},
  ktaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  ktaLabel: {
    ...FONTS.regular,
    color: COLORS.text.tertiary,
  },
  ktaValue: {
    ...FONTS.medium,
    color: COLORS.white,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  certCard: {
    marginBottom: SPACING.sm,
  },
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  certIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  certInfo: {
    flex: 1,
  },
  certName: {
    ...FONTS.semibold,
    color: COLORS.white,
    fontSize: 15,
  },
  certPenerbit: {
    ...FONTS.caption,
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    marginTop: 4,
  },
  statusVerified: {
    backgroundColor: COLORS.accent.green + '20',
  },
  statusPending: {
    backgroundColor: COLORS.accent.orange + '20',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  statusVerifiedText: {
    color: COLORS.accent.green,
  },
  statusPendingText: {
    color: COLORS.accent.orange,
  },
  downloadIcon: {
    fontSize: 20,
    color: COLORS.text.tertiary,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderStyle: 'dashed',
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  uploadText: {
    color: COLORS.gold,
    fontWeight: '600',
    fontSize: 14,
  },
});
