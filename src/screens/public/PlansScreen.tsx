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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../../components/BottomNavigation';

interface PlansScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToProfile?: () => void;
}

export default function PlansScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToLogin,
  onNavigateToProfile,
}: PlansScreenProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const plansData = {
    monthly: [
      {
        id: 'bronze',
        tag: 'BÁSICO',
        title: 'Plano Bronze',
        price: 'R$139,90',
        period: '/mês',
        features: [
          { text: 'Banho e Tosa', count: '2/mês' },
          { text: 'Atendimento Veterinário Básico', count: '1/mês' },
        ],
        extraFeatures: [
          { text: 'Desconto em Medicamentos', count: '10%' },
          { text: 'Histórico de Vacinas Digital', count: 'Incluí' },
        ],
      },
      {
        id: 'prata',
        tag: 'POPULAR',
        title: 'Plano Prata',
        price: 'R$219,90',
        period: '/mês',
        features: [
          { text: 'Banho e Tosa', count: '2/mês' },
          { text: 'Consultas Presenciais', count: 'Limitado' },
        ],
        extraFeatures: [
          { text: 'Vacinas Anuais Inclusas', count: 'Todas' },
          { text: 'Desconto em Medicamentos', count: '15%' },
          { text: 'Atendimento de Emergência', count: '24h' },
        ],
      },
      {
        id: 'ouro',
        tag: 'MAIS COMPLETO',
        title: 'Plano Ouro',
        price: 'R$399,90',
        period: '/mês',
        features: [
          { text: 'Banho e Tosa', count: '2/mês' },
          { text: 'Exames de rotina', count: '2/mês' },
        ],
        extraFeatures: [
          { text: 'Consultas Presenciais Ilimitadas', count: 'Sim' },
          { text: 'Leva & Traz Pet', count: '2/mês' },
          { text: 'Rede Credenciada VIP', count: 'Sim' },
          { text: 'Desconto em Medicamentos', count: '20%' },
        ],
      },
      {
        id: 'diamante',
        tag: 'VIP',
        title: 'Plano Diamante',
        price: 'R$649,90',
        period: '/mês',
        features: [
          { text: 'Consultas Presenciais', count: 'Ilimitadas' },
          { text: 'Exames e Cirurgias', count: 'Inclusos' },
        ],
        extraFeatures: [
          { text: 'Leva & Traz Pet Ilimitado', count: 'Sim' },
          { text: 'Hospedagem e Creche', count: '3 dias/mês' },
          { text: 'Especialistas e Odontologia', count: 'Incluso' },
        ],
      },
    ],
    yearly: [
      {
        id: 'bronze',
        tag: 'BÁSICO',
        title: 'Plano Bronze',
        price: 'R$119,90',
        period: '/mês',
        features: [
          { text: 'Banho e Tosa', count: '2/mês' },
          { text: 'Atendimento Veterinário Básico', count: '1/mês' },
        ],
        extraFeatures: [
          { text: 'Desconto em Medicamentos', count: '10%' },
          { text: 'Histórico de Vacinas Digital', count: 'Incluí' },
        ],
      },
      {
        id: 'prata',
        tag: 'POPULAR',
        title: 'Plano Prata',
        price: 'R$179,90',
        period: '/mês',
        features: [
          { text: 'Banho e Tosa', count: '2/mês' },
          { text: 'Consultas Presenciais', count: 'Limitado' },
        ],
        extraFeatures: [
          { text: 'Vacinas Anuais Inclusas', count: 'Todas' },
          { text: 'Desconto em Medicamentos', count: '15%' },
          { text: 'Atendimento de Emergência', count: '24h' },
        ],
      },
      {
        id: 'ouro',
        tag: 'MAIS COMPLETO',
        title: 'Plano Ouro',
        price: 'R$349,90',
        period: '/mês',
        features: [
          { text: 'Banho e Tosa', count: '2/mês' },
          { text: 'Exames de rotina', count: '2/mês' },
        ],
        extraFeatures: [
          { text: 'Consultas Presenciais Ilimitadas', count: 'Sim' },
          { text: 'Leva & Traz Pet', count: '2/mês' },
          { text: 'Rede Credenciada VIP', count: 'Sim' },
          { text: 'Desconto em Medicamentos', count: '20%' },
        ],
      },
      {
        id: 'diamante',
        tag: 'VIP',
        title: 'Plano Diamante',
        price: 'R$549,90',
        period: '/mês',
        features: [
          { text: 'Consultas Presenciais', count: 'Ilimitadas' },
          { text: 'Exames e Cirurgias', count: 'Inclusos' },
        ],
        extraFeatures: [
          { text: 'Leva & Traz Pet Ilimitado', count: 'Sim' },
          { text: 'Hospedagem e Creche', count: '3 dias/mês' },
          { text: 'Especialistas e Odontologia', count: 'Incluso' },
        ],
      },
    ],
  };

  const currentPlans = plansData[billingCycle];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Topo / Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack || onNavigateToHome}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contratar Plano</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs de Seleção de Ciclo (Mensal / Anual) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, billingCycle === 'monthly' && styles.tabButtonActive]}
          onPress={() => setBillingCycle('monthly')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, billingCycle === 'monthly' && styles.tabTextActive]}>
            Mensal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, billingCycle === 'yearly' && styles.tabButtonActive]}
          onPress={() => setBillingCycle('yearly')}
          activeOpacity={0.8}
        >
          <View style={styles.yearlyTabContent}>
            <Text style={[styles.tabText, billingCycle === 'yearly' && styles.tabTextActive]}>
              Anual
            </Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>10% OFF</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Lista de Planos */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {currentPlans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const allFeatures = isSelected
            ? [...plan.features, ...plan.extraFeatures]
            : plan.features;

          return (
            <TouchableOpacity
              key={plan.id}
              activeOpacity={0.9}
              onPress={() => setSelectedPlanId(isSelected ? null : plan.id)}
              style={[styles.card, isSelected && styles.selectedCard]}
            >
              <Text style={[styles.cardTag, isSelected && styles.selectedCardTag]}>
                {plan.tag}
              </Text>

              <View style={styles.cardHeaderRow}>
                <View style={styles.cardTitleContainer}>
                  <View style={[styles.iconCircle, isSelected && styles.selectedIconCircle]} />
                  <Text style={[styles.cardTitle, isSelected && styles.selectedCardTitle]}>
                    {plan.title}
                  </Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={[styles.cardPrice, isSelected && styles.selectedCardPrice]}>
                    {plan.price}
                  </Text>
                  <Text style={[styles.cardPeriod, isSelected && styles.selectedCardPeriod]}>
                    {plan.period}
                  </Text>
                </View>
              </View>

              {/* Lista de Benefícios */}
              <View style={styles.featuresList}>
                {allFeatures.map((feat, idx) => (
                  <View key={idx} style={styles.featureItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={isSelected ? '#A3C0F5' : '#10B981'}
                    />
                    <Text
                      style={[
                        styles.featureText,
                        isSelected && styles.selectedFeatureText,
                      ]}
                    >
                      {feat.text}
                    </Text>
                    <Text
                      style={[
                        styles.featureCount,
                        isSelected && styles.selectedFeatureCount,
                      ]}
                    >
                      {feat.count}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Botão de Ação -> Redireciona para o Login */}
              <TouchableOpacity
                style={[styles.primaryButton, isSelected && styles.selectedButton]}
                onPress={onNavigateToLogin}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    isSelected && styles.selectedButtonText,
                  ]}
                >
                  CONTRATAR
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Componente Global de Navegação */}
      <BottomNavigation
        currentRoute="Plans"
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: { borderBottomColor: '#21479B' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#21479B', fontWeight: '800' },
  yearlyTabContent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  discountBadge: {
    backgroundColor: '#84CC16',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24, gap: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedCard: {
    backgroundColor: '#1B4298',
    borderColor: '#1B4298',
  },
  cardTag: { fontSize: 10, fontWeight: '700', color: '#64748B', marginBottom: 8 },
  selectedCardTag: { color: '#A3C0F5' },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E2E8F0' },
  selectedIconCircle: { backgroundColor: '#FFFFFF' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  selectedCardTitle: { color: '#FFFFFF' },
  priceContainer: { alignItems: 'flex-end' },
  cardPrice: { fontSize: 16, fontWeight: '800', color: '#21479B' },
  selectedCardPrice: { color: '#FFFFFF' },
  cardPeriod: { fontSize: 10, color: '#64748B' },
  selectedCardPeriod: { color: '#A3C0F5' },
  featuresList: { gap: 8, marginBottom: 16 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { flex: 1, fontSize: 11, color: '#475569', fontWeight: '500' },
  selectedFeatureText: { color: '#FFFFFF' },
  featureCount: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  selectedFeatureCount: { color: '#A3C0F5' },
  primaryButton: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1B4298',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  selectedButton: { backgroundColor: '#FFFFFF' },
  selectedButtonText: { color: '#1B4298' },
});