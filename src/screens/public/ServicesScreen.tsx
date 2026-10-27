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

interface ServicesScreenProps {
  onBack?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToExplore?: () => void;
}

export default function ServicesScreen({
  onBack,
  onNavigateToPlans,
  onNavigateToLogin,
  onNavigateToExplore,
}: ServicesScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Topo / Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nossos Serviços</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Conteúdo com Rolagem Vertical */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Título e Subtítulo Principal */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Cuide do seu Pet com a PetVitaliz</Text>
          <Text style={styles.mainSubtitle}>Conheça nossos planos completos.</Text>
        </View>

        {/* Seção PLANOS */}
        <Text style={styles.sectionLabel}>PLANOS</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          <View style={styles.planBadgeCard}>
            <Text style={styles.planCardTitle}>Plano Bronze</Text>
            <Text style={styles.planCardPrice}>R$ 139/mês</Text>
          </View>

          <View style={styles.planBadgeCard}>
            <Text style={styles.planCardTitle}>Plano Bronze</Text>
            <Text style={styles.planCardPrice}>R$ 139/mês</Text>
          </View>

          <View style={[styles.planBadgeCard, styles.planBadgeCardActive]}>
            <Text style={[styles.planCardTitle, styles.planCardTitleActive]}>Plano Ouro</Text>
            <Text style={[styles.planCardPrice, styles.planCardPriceActive]}>R$ 399,90/mês</Text>
          </View>
        </ScrollView>

        {/* Seção BENEFÍCIOS INCLUSOS */}
        <Text style={styles.sectionLabel}>BENEFÍCIOS INCLUSOS</Text>
        <View style={styles.benefitsRow}>
          <View style={styles.benefitItem}>
            <View style={[styles.benefitCircle, { backgroundColor: '#80D8B6' }]} />
            <Text style={styles.benefitLabel}>Banho e Tosa</Text>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitCircle, { backgroundColor: '#7FB3E8' }]} />
            <Text style={styles.benefitLabel}>Exames</Text>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitCircle, { backgroundColor: '#F0937A' }]} />
            <Text style={styles.benefitLabel}>Vacina</Text>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitCircle, { backgroundColor: '#E88DA3' }]} />
            <Text style={styles.benefitLabel}>Emerg.</Text>
          </View>
        </View>

        {/* Seção COMO FUNCIONA */}
        <Text style={styles.sectionLabel}>COMO FUNCIONA</Text>
        <View style={styles.stepsRow}>
          <View style={styles.stepPill}>
            <Text style={styles.stepPillText}>1. Escolha o plano</Text>
          </View>
          <View style={styles.stepPill}>
            <Text style={styles.stepPillText}>2. Agende</Text>
          </View>
          <View style={styles.stepPill}>
            <Text style={styles.stepPillText}>3. Aproveite</Text>
          </View>
        </View>

        {/* Seção Por que escolher o PetVitaliz */}
        <View style={styles.whyUsSection}>
          <Text style={styles.whyUsTitle}>Por que escolher o PetVitaliz</Text>
          <Text style={styles.whyUsSubtitle}>
            Rede credenciada ampla, atendimento 24h e planos sem carência.
          </Text>
        </View>

        {/* Botão Conheça os planos */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onNavigateToPlans}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Conheça os planos</Text>
        </TouchableOpacity>

        {/* Link Dúvidas */}
        <TouchableOpacity style={styles.helpLinkContainer} activeOpacity={0.7}>
          <Ionicons name="time-outline" size={16} color="#7B8497" />
          <Text style={styles.helpLinkText}>Ficou com dúvidas? Fale conosco</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Menu de Navegação Inferior (Bottom Bar) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomTab} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="home-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Início</Text>
        </TouchableOpacity>

        {/* Botão Explorar chama a função de navegação para a tela de Explorar */}
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={onNavigateToExplore}
          activeOpacity={0.7}
        >
          <Ionicons name="search-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Explorar</Text>
        </TouchableOpacity>

        {/* Botão Central com coroa.png */}
        <TouchableOpacity style={styles.bottomTabCenter} activeOpacity={0.85}>
          <Image
            source={require('../../assets/coroa.png')}
            style={styles.crownIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} activeOpacity={0.7}>
          <Ionicons name="gift-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Benefícios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToLogin} activeOpacity={0.7}>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#21479B',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  titleSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  mainSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
  },
  horizontalScroll: {
    gap: 12,
    paddingBottom: 12,
  },
  planBadgeCard: {
    width: 120,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  planBadgeCardActive: {
    borderColor: '#21479B',
    borderWidth: 1.5,
  },
  planCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  planCardTitleActive: {
    color: '#21479B',
  },
  planCardPrice: {
    fontSize: 11,
    fontWeight: '800',
    color: '#21479B',
  },
  planCardPriceActive: {
    color: '#21479B',
  },
  benefitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  benefitItem: {
    alignItems: 'center',
    width: 70,
  },
  benefitCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 6,
  },
  benefitLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  stepsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  stepPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
  },
  stepPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  whyUsSection: {
    marginBottom: 28,
  },
  whyUsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  whyUsSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  primaryButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#1B4298',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  helpLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  helpLinkText: {
    fontSize: 12,
    color: '#7B8497',
    fontWeight: '500',
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
  bottomTab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTabText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
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
  crownIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
});