import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../../components/BottomNavigation';

interface PrivacyScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

export default function PrivacyScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: PrivacyScreenProps) {
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
        <Text style={styles.headerTitle}>Política e Privacidade</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.updateDate}>Última atualização: 24 de maio de 2024</Text>
        <Text style={styles.introText}>
          A sua privacidade é muito importante para nós. Esta Política explica como coletamos, usamos, compartilhamos e protegemos seus dados.
        </Text>

        <Text style={styles.sectionTitle}>Tópicos desta política</Text>

        <View style={styles.topicsContainer}>
          {[
            { title: 'Dados coletados', desc: 'Quais dados coletamos e como coletamos', icon: 'cloud-upload-outline' },
            { title: 'Como usamos seus dados', desc: 'Finalidades e bases legais', icon: 'link-outline' },
            { title: 'Compartilhamento de dados', desc: 'Com quem e quando compartilhamos', icon: 'share-social-outline' },
            { title: 'Segurança da informação', desc: 'Como protegemos seus dados', icon: 'shield-checkmark-outline' },
            { title: 'Contato', desc: 'Como falar com nosso time', icon: 'headset-outline' },
          ].map((topic, index) => (
            <TouchableOpacity key={index} style={styles.topicCard} activeOpacity={0.7}>
              <View style={styles.topicIconBadge}>
                <Ionicons name={topic.icon as any} size={20} color="#21479B" />
              </View>
              <View style={styles.topicInfo}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDesc}>{topic.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.fullButton} activeOpacity={0.8}>
          <Text style={styles.fullButtonText}>Ler política completa</Text>
        </TouchableOpacity>
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
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#21479B' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  updateDate: { fontSize: 11, color: '#94A3B8', marginBottom: 6 },
  introText: { fontSize: 12, color: '#64748B', lineHeight: 18, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12 },
  topicsContainer: { gap: 10, marginBottom: 20 },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  topicIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicInfo: { flex: 1 },
  topicTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  topicDesc: { fontSize: 11, color: '#64748B', marginTop: 2 },
  fullButton: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  fullButtonText: { fontSize: 13, fontWeight: '700', color: '#21479B' },
});