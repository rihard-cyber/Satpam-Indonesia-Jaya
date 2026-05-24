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

const jobs = [
  {
    posisi: 'Security Officer',
    perusahaan: 'PT Secure Properti',
    lokasi: 'Jakarta Pusat',
    gaji: 'Rp 4.5 - 5.5 JT',
    tipe: 'Shift 8 Jam',
  },
  {
    posisi: 'Danru Security',
    perusahaan: 'PT Garda Utama',
    lokasi: 'Bandung',
    gaji: 'Rp 5 - 6.5 JT',
    tipe: 'Shift 12 Jam',
  },
  {
    posisi: 'Security Mall',
    perusahaan: 'PT Trisula Security',
    lokasi: 'Surabaya',
    gaji: 'Rp 4 - 5 JT',
    tipe: 'Shift 8 Jam',
  },
  {
    posisi: 'Bodyguard / PAM',
    perusahaan: 'PT Elang Perkasa',
    lokasi: 'Jakarta',
    gaji: 'Rp 6 - 8 JT',
    tipe: '12 Jam',
  },
];

export default function LokerScreen() {
  const [activeFilter, setActiveFilter] = React.useState('Semua');

  const filters = ['Semua', 'Jakarta', 'Bandung', 'Surabaya'];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.filters}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[styles.filter, activeFilter === f && styles.activeFilter]}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.activeFilterText]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {jobs.map((job, i) => (
          <Card key={i} style={styles.jobCard} variant="glass">
            <View style={styles.jobHeader}>
              <View style={styles.companyIcon}>
                <Text style={styles.companyIconText}>🏢</Text>
              </View>
              <View style={styles.jobInfo}>
                <Text style={styles.jobTitle}>{job.posisi}</Text>
                <Text style={styles.companyName}>{job.perusahaan}</Text>
              </View>
            </View>
            <View style={styles.jobDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>📍</Text>
                <Text style={styles.detailText}>{job.lokasi}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>💰</Text>
                <Text style={styles.detailText}>{job.gaji}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>⏰</Text>
                <Text style={styles.detailText}>{job.tipe}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
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
  content: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.lg,
  },
  filter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.navy[800],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  activeFilter: {
    backgroundColor: COLORS.gold + '20',
    borderColor: COLORS.gold + '40',
  },
  filterText: {
    ...FONTS.medium,
    color: COLORS.text.tertiary,
    fontSize: 13,
  },
  activeFilterText: {
    color: COLORS.gold,
  },
  jobCard: {
    marginBottom: SPACING.md,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  companyIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.navy[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  companyIconText: {
    fontSize: 24,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    ...FONTS.semibold,
    color: COLORS.white,
    fontSize: 16,
  },
  companyName: {
    ...FONTS.regular,
    color: COLORS.gold,
    marginTop: 2,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: SPACING.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailIcon: {
    fontSize: 14,
  },
  detailText: {
    ...FONTS.caption,
    color: COLORS.text.secondary,
  },
  applyButton: {
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.sm,
    paddingVertical: 10,
    alignItems: 'center',
  },
  applyText: {
    color: COLORS.black,
    fontWeight: '600',
    fontSize: 14,
  },
});
