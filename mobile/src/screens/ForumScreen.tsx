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

const categories = [
  'Semua', 'Tanya Jawab', 'Berbagi Pengalaman', 'Training', 'Loker', 'Keamanan',
];

const posts = [
  {
    author: 'Budi Santoso',
    badge: '✓ Verified',
    category: 'Berbagi Pengalaman',
    title: 'Pengalaman Lulus Gada Madya',
    likes: 45,
    comments: 12,
    time: '2 jam',
  },
  {
    author: 'Ahmad Rizki',
    badge: '✓ Danru',
    category: 'Tanya Jawab',
    title: 'Cara Menangani Tamu Agresif?',
    likes: 23,
    comments: 8,
    time: '5 jam',
  },
  {
    author: 'Dedi Kurniawan',
    badge: '✓ Instructor',
    category: 'Training',
    title: 'Jadwal Pelatihan Juni 2026',
    likes: 67,
    comments: 23,
    time: '1 hari',
  },
];

export default function ForumScreen() {
  const [activeCat, setActiveCat] = React.useState('Semua');

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.categories}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCat(cat)}
              style={[styles.catButton, activeCat === cat && styles.activeCat]}
            >
              <Text style={[styles.catText, activeCat === cat && styles.activeCatText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {posts.map((post, i) => (
          <Card key={i} style={styles.postCard} variant="glass">
            <View style={styles.postHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{post.author[0]}</Text>
              </View>
              <View style={styles.postAuthor}>
                <View style={styles.authorRow}>
                  <Text style={styles.authorName}>{post.author}</Text>
                  <Text style={styles.badge}>{post.badge}</Text>
                </View>
                <Text style={styles.postTime}>{post.time} lalu</Text>
              </View>
            </View>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{post.category}</Text>
            </View>
            <Text style={styles.postTitle}>{post.title}</Text>
            <View style={styles.postStats}>
              <Text style={styles.statItem}>❤️ {post.likes}</Text>
              <Text style={styles.statItem}>💬 {post.comments}</Text>
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
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.lg,
  },
  catButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.navy[800],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  activeCat: {
    backgroundColor: COLORS.gold + '20',
    borderColor: COLORS.gold + '40',
  },
  catText: {
    ...FONTS.regular,
    color: COLORS.text.tertiary,
    fontSize: 13,
  },
  activeCatText: {
    color: COLORS.gold,
  },
  postCard: {
    marginBottom: SPACING.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: COLORS.black,
    fontWeight: '700',
    fontSize: 14,
  },
  postAuthor: {
    flex: 1,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    ...FONTS.medium,
    color: COLORS.white,
  },
  badge: {
    color: COLORS.gold,
    fontSize: 11,
  },
  postTime: {
    ...FONTS.caption,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accent.blue + '20',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  categoryTagText: {
    color: COLORS.accent.blue,
    fontSize: 11,
  },
  postTitle: {
    ...FONTS.semibold,
    color: COLORS.white,
    fontSize: 15,
    marginBottom: SPACING.sm,
  },
  postStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    ...FONTS.caption,
    color: COLORS.text.tertiary,
  },
});
