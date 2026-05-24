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

const stats = [
  { label: 'Materi Dipelajari', value: '12', icon: '📖', color: '#4CAF50' },
  { label: 'Progress', value: '45%', icon: '📈', color: '#D4AF37' },
  { label: 'Lamaran', value: '3', icon: '💼', color: '#2196F3' },
  { label: 'Sertifikat', value: '5', icon: '🏆', color: '#9C27B0' },
];

const quickMenu = [
  { label: 'Belajar', icon: '📚', screen: 'Materi', color: '#0F3460' },
  { label: 'Cari Loker', icon: '💼', screen: 'Loker', color: '#0F3460' },
  { label: 'Forum', icon: '💬', screen: 'Forum', color: '#0F3460' },
  { label: 'AI Assistant', icon: '🤖', screen: 'AIAssistant', color: '#0F3460' },
];

export default function DashboardScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.greeting}>Selamat datang,</Text>
        <Text style={styles.username}>Budi Santoso</Text>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={[styles.statCard, { borderColor: stat.color + '30' }]}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Menu Cepat</Text>
        <View style={styles.quickMenu}>
          {quickMenu.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.quickItem, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text style={styles.quickIcon}>{item.icon}</Text>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Lanjutkan Belajar</Text>
        {['Sejarah Satpam', 'Tupoksi Satpam', 'Turjawali'].map((item, i) => (
          <Card key={i} style={styles.materiCard}>
            <View style={styles.materiRow}>
              <Text style={styles.materiIcon}>📖</Text>
              <View style={styles.materiInfo}>
                <Text style={styles.materiTitle}>{item}</Text>
                <Text style={styles.materiDurasi}>15 menit</Text>
              </View>
              <View style={styles.progressBadge}>
                <Text style={styles.progressText}>{i === 0 ? '100%' : i === 1 ? '100%' : '60%'}</Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy[900],
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  greeting: {
    ...FONTS.regular,
    color: COLORS.text.tertiary,
  },
  username: {
    ...FONTS.h2,
    color: COLORS.white,
    marginBottom: SPACING.xl,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: SPACING.xxl,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.navy[800],
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    ...FONTS.caption,
    marginTop: 2,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  quickMenu: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SPACING.xxl,
  },
  quickItem: {
    flex: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  quickIcon: {
    fontSize: 28,
    marginBottom: SPACING.sm,
  },
  quickLabel: {
    ...FONTS.caption,
    color: COLORS.white,
    fontWeight: '500',
  },
  materiCard: {
    marginBottom: SPACING.sm,
  },
  materiRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  materiIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  materiInfo: {
    flex: 1,
  },
  materiTitle: {
    ...FONTS.medium,
    color: COLORS.white,
  },
  materiDurasi: {
    ...FONTS.caption,
  },
  progressBadge: {
    backgroundColor: COLORS.gold + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  progressText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '600',
  },
});
