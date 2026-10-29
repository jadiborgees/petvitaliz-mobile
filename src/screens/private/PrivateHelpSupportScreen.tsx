import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';

interface PrivateHelpSupportScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

export default function PrivateHelpSupportScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: PrivateHelpSupportScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack || onNavigateToProfile} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajuda e Suporte</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Banner de Boas-vindas / Dúvida */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerIconCircle}>
            <Ionicons name="headset-outline" size={24} color="#21479B" />
          </View>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Como podemos ajudar você?</Text>
            <Text style={styles.bannerSubtitle}>
              Estamos aqui para te ajudar sempre que precisar[cite: 18].
            </Text>
          </View>
        </View>

        {/* Título da Seção */}
        <Text style={styles.sectionLabel}>ASSUNTOS MAIS ACESSADOS</Text>

        {/* Lista de Assuntos */}
        <View style={styles.optionsList}>
          
          {/* Falar com nossa equipe */}
          <TouchableOpacity style={styles.optionCard} activeOpacity={0.7}>
            <View style={styles.optionIconBox}>
              <Ionicons name="headset-outline" size={20} color="#21479B" />
            </View>
            <Text style={styles.optionText}>Falar com nossa equipe</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          {/* Dúvidas sobre pagamentos */}
          <TouchableOpacity style={styles.optionCard} activeOpacity={0.7}>
            <View style={styles.optionIconBox}>
              <Ionicons name="card-outline" size={20} color="#21479B" />
            </View>
            <Text style={styles.optionText}>Dúvidas sobre pagamentos</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          {/* Problemas com meu plano */}
          <TouchableOpacity style={styles.optionCard} activeOpacity={0.7}>
            <View style={styles.optionIconBox}>
              <Ionicons name="document-text-outline" size={20} color="#21479B" />
            </View>
            <Text style={styles.optionText}>Problemas com meu plano</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          {/* Cadastro e acesso */}
          <TouchableOpacity style={styles.optionCard} activeOpacity={0.7}>
            <View style={styles.optionIconBox}>
              <Ionicons name="person-outline" size={20} color="#21479B" />
            </View>
            <Text style={styles.optionText}>Cadastro e acesso</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          {/* Meu Pet */}
          <TouchableOpacity style={styles.optionCard} activeOpacity={0.7}>
            <View style={styles.optionIconBox}>
              <Ionicons name="paw-outline" size={20} color="#21479B" />
            </View>
            <Text style={styles.optionText}>Meu Pet</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

        </View>

      </ScrollView>

      {/* Navegação Inferior Privada */}
      <PrivateBottomNav
        currentRoute="PrivateProfile"
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
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 110 },

  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  bannerIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextContainer: { flex: 1 },
  bannerTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  bannerSubtitle: { fontSize: 11, color: '#64748B', marginTop: 2, lineHeight: 15 },

  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 12, letterSpacing: 0.5 },

  optionsList: { gap: 12 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  optionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionText: { flex: 1, fontSize: 13, fontWeight: '700', color: '#0F172A' },
});