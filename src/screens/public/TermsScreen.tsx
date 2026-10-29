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

interface TermsScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

export default function TermsScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: TermsScreenProps) {
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
        <Text style={styles.headerTitle}>Termos de Uso</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Índice Card */}
        <View style={styles.indexCard}>
          <Text style={styles.indexTitle}>Índice</Text>
          {[
            '1. Aceitação dos Termos',
            '2. Sobre o PetVitaliz',
            '3. Uso do Aplicativo',
            '4. Planos e Serviços',
            '5. Pagamentos',
            '6. Responsabilidades do Usuário',
            '7. Cancelamento e Reembolso',
            '8. Alterações nos Termos',
            '9. Lei Aplicável',
            '10. Contato',
          ].map((item, index) => (
            <Text key={index} style={styles.indexItem}>{item}</Text>
          ))}
        </View>

        {/* Conteúdo Seções */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeader}>1. Aceitação dos Termos</Text>
          <Text style={styles.sectionBody}>
            Ao acessar e utilizar o aplicativo PetVitaliz, você concorda com os presentes Termos de Uso e com todas as condições aqui estabelecidas.
          </Text>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeader}>2. Sobre o PetVitaliz</Text>
          <Text style={styles.sectionBody}>
            O PetVitaliz é uma plataforma que conecta você a serviços de saúde e bem-estar para o seu pet, oferecendo planos e benefícios exclusivos.
          </Text>
        </View>

        <TouchableOpacity style={styles.moreButton} activeOpacity={0.8}>
          <Text style={styles.moreButtonText}>Ver todos os termos</Text>
          <Ionicons name="chevron-down" size={16} color="#21479B" />
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
  indexCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    gap: 8,
  },
  indexTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  indexItem: { fontSize: 12, fontWeight: '700', color: '#21479B', lineHeight: 18 },
  sectionBlock: { marginBottom: 16 },
  sectionHeader: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  sectionBody: { fontSize: 12, color: '#64748B', lineHeight: 18 },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    height: 48,
    gap: 8,
    marginTop: 8,
  },
  moreButtonText: { fontSize: 13, fontWeight: '700', color: '#21479B' },
});