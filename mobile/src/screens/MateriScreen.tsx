import React, { useState } from 'react';
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

const tabs = [
  { key: 'pratama', label: 'Gada Pratama' },
  { key: 'madya', label: 'Gada Madya' },
  { key: 'utama', label: 'Gada Utama' },
];

const materiData: Record<string, { judul: string; durasi: string; selesai?: boolean }[]> = {
  pratama: [
    { judul: 'Sejarah Satpam Indonesia', durasi: '15 menit', selesai: true },
    { judul: 'Tupoksi Satpam', durasi: '20 menit', selesai: true },
    { judul: 'Turjawali', durasi: '25 menit' },
    { judul: 'Bela Diri Dasar', durasi: '30 menit' },
    { judul: 'Penggunaan Borgol & Tongkat', durasi: '20 menit' },
  ],
  madya: [
    { judul: 'Leadership', durasi: '30 menit' },
    { judul: 'Manajemen Risiko', durasi: '35 menit' },
    { judul: 'Investigasi Internal', durasi: '40 menit' },
  ],
  utama: [
    { judul: 'Strategic Security', durasi: '45 menit' },
    { judul: 'Crisis Management', durasi: '40 menit' },
  ],
};

export default function MateriScreen() {
  const [activeTab, setActiveTab] = useState('pratama');

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tab,
                activeTab === tab.key && styles.activeTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {materiData[activeTab]?.map((item, i) => (
          <Card key={i} style={styles.materiCard} variant={item.selesai ? 'default' : 'glass'}>
            <View style={styles.materiRow}>
              <View style={styles.iconBox}>
                <Text style={styles.iconText}>📖</Text>
              </View>
              <View style={styles.materiInfo}>
                <Text style={styles.materiTitle}>{item.judul}</Text>
                <Text style={styles.materiDurasi}>{item.durasi}</Text>
              </View>
              {item.selesai ? (
                <View style={styles.selesaiBadge}>
                  <Text style={styles.selesaiText}>✓</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.mulaiButton}>
                  <Text style={styles.mulaiText}>Mulai</Text>
                </TouchableOpacity>
              )}
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
  content: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.navy[800],
    borderRadius: RADIUS.md,
    padding: 3,
    marginBottom: SPACING.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },
  activeTab: {
    backgroundColor: COLORS.gold + '20',
  },
  tabText: {
    ...FONTS.medium,
    color: COLORS.text.tertiary,
    fontSize: 13,
  },
  activeTabText: {
    color: COLORS.gold,
  },
  materiCard: {
    marginBottom: SPACING.sm,
  },
  materiRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.navy[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  iconText: {
    fontSize: 20,
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
  selesaiBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.accent.green + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selesaiText: {
    color: COLORS.accent.green,
    fontWeight: '700',
    fontSize: 16,
  },
  mulaiButton: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
  },
  mulaiText: {
    color: COLORS.black,
    fontWeight: '600',
    fontSize: 13,
  },
});
