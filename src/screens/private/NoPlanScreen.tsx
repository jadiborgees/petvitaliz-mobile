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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NoPlanScreenProps {
  onBack?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

export default function NoPlanScreen({
  onBack,
  onNavigateToPlans,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToBenefits,
  onNavigateToProfile,
}: NoPlanScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack || onNavigateToHome} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Plano</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner principal do estado sem plano */}
        <View style={styles.emptyCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-outline" size={40} color="#21479B" />
          </View>
          <Text style={styles.emptyTitle}>Seu pet ainda não tem um plano</Text>
          <Text style={styles.emptySubtitle}>
            Garanta atendimento veterinário, vacinas, exames e banho com descontos e cobertura completa.
          </Text>

          <TouchableOpacity
            style={styles.hireButton}
            onPress={onNavigateToPlans}
            activeOpacity={0.85}
          >
            <Text style={styles.hireButtonText}>CONTRATAR AGORA</Text>
          </TouchableOpacity>
        </View>

        {/* Vantagens em destaque */}
        <Text style={styles.sectionTitle}>Por que contratar um plano?</Text>

        <View style={styles.advantagesList}>
          <View style={styles.advantageItem}>
            <View style={styles.advantageIconBadge}>
              <Ionicons name="medkit-outline" size={20} color="#21479B" />
            </View>
            <View style={styles.advantageTextContainer}>
              <Text style={styles.advantageTitle}>Rede Credenciada</Text>
              <Text style={styles.advantageDescription}>
                Acesso às melhores clínicas e veterinários parceiros.
              </Text>
            </View>
          </View>

          <View style={styles.advantageItem}>
            <View style={styles.advantageIconBadge}>
              <Ionicons name="wallet-outline" size={20} color="#21479B" />
            </View>
            <View style={styles.advantageTextContainer}>
              <Text style={styles.advantageTitle}>Economia Garantida</Text>
              <Text style={styles.advantageDescription}>
                Descontos em procedimentos, exames e vacinas anuais.
              </Text>
            </View>
          </View>

          <View style={styles.advantageItem}>
            <View style={styles.advantageIconBadge}>
              <Ionicons name="heart-outline" size={20} color="#21479B" />
            </View>
            <View style={styles.advantageTextContainer}>
              <Text style={styles.advantageTitle}>Tranquilidade 24h</Text>
              <Text style={styles.advantageDescription}>
                Suporte emergencial sempre disponível quando seu pet precisar.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToHome} activeOpacity={0.7}>
          <Ionicons name="home-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToExplore} activeOpacity={0.7}>
          <Ionicons name="search-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Explorar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTabCenter} onPress={onNavigateToPlans} activeOpacity={0.85}>
          <Image
            source={require('../../assets/coroa.png')}
            style={styles.crownIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToBenefits} activeOpacity={0.7}>
          <Ionicons name="gift-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Benefícios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToProfile} activeOpacity={0.7}>
          <Ionicons name="person-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
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
  emptyCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
    marginBottom: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F0F5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  hireButton: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#1B4298',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hireButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 14,
  },
  advantagesList: {
    gap: 12,
  },
  advantageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  advantageIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0F5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  advantageTextContainer: {
    flex: 1,
  },
  advantageTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  advantageDescription: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  bottomBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  bottomTab: { alignItems: 'center', justifyContent: 'center' },
  bottomTabText: { fontSize: 10, color: '#94A3B8', marginTop: 2, fontWeight: '500' },
  bottomTabCenter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1B4298',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    elevation: 4,
    shadowColor: '#1B4298',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  crownIcon: { width: 24, height: 24, tintColor: '#FFFFFF' },
});