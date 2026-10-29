import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../../components/BottomNavigation';

interface SupportScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

export default function SupportScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: SupportScreenProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // Lógica para enviar mensagem de suporte
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Topo / Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack || onNavigateToProfile}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajuda e Suporte</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroCard}>
          <Ionicons name="headset-outline" size={36} color="#FFFFFF" />
          <Text style={styles.heroTitle}>Como podemos ajudar?</Text>
          <Text style={styles.heroSubtitle}>
            Nossa equipe está pronta para tirar suas dúvidas e resolver qualquer questão sobre o PetVitaliz.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Canais de Atendimento</Text>
          
          <TouchableOpacity style={styles.contactItem} activeOpacity={0.7}>
            <View style={styles.contactIconBadge}>
              <Ionicons name="chatbubbles-outline" size={22} color="#21479B" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Chat ao Vivo</Text>
              <Text style={styles.contactDesc}>Atendimento rápido via chat no app</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} activeOpacity={0.7}>
            <View style={styles.contactIconBadge}>
              <Ionicons name="mail-outline" size={22} color="#21479B" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>E-mail de Suporte</Text>
              <Text style={styles.contactDesc}>suporte@petvitaliz.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Envie uma mensagem</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Descreva o seu problema ou dúvida..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} activeOpacity={0.85}>
            <Text style={styles.sendButtonText}>Enviar Mensagem</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Componente Global de Navegação */}
      <BottomNavigation
        currentRoute="Profile"
        onNavigateToHome={onNavigateToHome}
        onNavigateToExplore={onNavigateToExplore}
        onNavigateToPlans={onNavigateToPlans}
        onNavigateToBenefits={onNavigateToBenefits}
        onNavigateToProfile={onNavigateToProfile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#21479B' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  heroCard: {
    backgroundColor: '#1B4298',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginTop: 12, marginBottom: 6 },
  heroSubtitle: { fontSize: 12, color: '#E2E8F0', textAlign: 'center', lineHeight: 18 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12 },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  contactIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: { flex: 1 },
  contactTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  contactDesc: { fontSize: 11, color: '#64748B', marginTop: 2 },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    fontSize: 13,
    color: '#1E293B',
    textAlignVertical: 'top',
    height: 100,
    backgroundColor: '#F8FAFC',
    marginBottom: 12,
  },
  sendButton: {
    backgroundColor: '#1B4298',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
});