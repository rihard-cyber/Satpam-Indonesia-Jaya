import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';

const suggestions = [
  'Apa tugas Danru?',
  'Cara membuat incident report?',
  'Apa itu Turjawali?',
  'SOP kehilangan barang?',
];

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Halo! Saya AI Assistant Satpam Indonesia. Ada yang bisa saya bantu?' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: getResponse(userMsg) },
      ]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollRef}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd()}
          contentContainerStyle={styles.messagesContainer}
        >
          {messages.map((msg, i) => (
            <View
              key={i}
              style={[
                styles.messageRow,
                msg.role === 'user' && styles.userRow,
              ]}
            >
              {msg.role === 'assistant' && (
                <View style={styles.assistantAvatar}>
                  <Text style={styles.assistantAvatarText}>🤖</Text>
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.role === 'user' && styles.userText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.suggestions}>
          {suggestions.map((s) => (
            <TouchableOpacity key={s} onPress={() => setInput(s)} style={styles.suggestionChip}>
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Tanya apapun tentang keamanan..."
            placeholderTextColor={COLORS.text.muted}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={styles.sendText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function getResponse(q: string): string {
  const query = q.toLowerCase();
  if (query.includes('danru')) {
    return 'Danru (Komandan Regu) adalah pemimpin regu satpam yang bertanggung jawab mengkoordinasikan anggota, memastikan SOP, dan melaporkan situasi ke atasan.';
  }
  if (query.includes('incident') || query.includes('laporan')) {
    return 'Incident Report mencakup: 1) Identifikasi waktu/lokasi, 2) Kronologi kejadian, 3) Tindakan yang diambil, 4) Dampak, 5) Rekomendasi. Gunakan format 5W+1H.';
  }
  if (query.includes('turjawali')) {
    return 'Turjawali = TUR (Pengaturan) + JA (Penjagaan) + WA (Pengawalan) + LI (Patroli). Ini adalah tugas pokok Satpam.';
  }
  if (query.includes('sop') || query.includes('kehilangan')) {
    return 'SOP Kehilangan Barang: 1) Amankan TKP, 2) Laporkan atasan, 3) Dokumentasi, 4) Kumpulkan info (CCTV/saksi), 5) Buat laporan, 6) Koordinasi pihak berwajib.';
  }
  return 'Terima kasih atas pertanyaannya. Untuk informasi lebih detail, silakan cek modul Materi Satpam atau diskusi di Forum Komunitas.';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy[900],
  },
  messagesContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    alignItems: 'flex-end',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  assistantAvatarText: {
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  assistantBubble: {
    backgroundColor: COLORS.navy[700],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  userBubble: {
    backgroundColor: COLORS.gold + '15',
    borderWidth: 1,
    borderColor: COLORS.gold + '25',
  },
  messageText: {
    ...FONTS.regular,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  userText: {
    color: COLORS.white,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  suggestionChip: {
    backgroundColor: COLORS.navy[800],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  suggestionText: {
    color: COLORS.text.tertiary,
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.navy[800],
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    color: COLORS.white,
    fontSize: 14,
    marginRight: SPACING.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    color: COLORS.black,
    fontSize: 18,
  },
});
