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

interface HomeScreenProps {
  onNavigateToLogin?: () => void;
  onNavigateToRegister?: () => void;
  onNavigateToForgotPassword?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToHowItWorks?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

export default function HomeScreen({
  onNavigateToLogin,
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onNavigateToServices,
  onNavigateToHowItWorks,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Conteúdo Principal com Rolagem Vertical */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Topo / Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Olá! Bem vindo(a) a PetVitaliz,</Text>
            <Text style={styles.mainTitle}>O que você procura hoje?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color="#1E293B" />
          </TouchableOpacity>
        </View>

        {/* 1. Seção Nossos Planos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nossos Planos</Text>
          <TouchableOpacity onPress={onNavigateToPlans} activeOpacity={0.7}>
            <Text style={styles.seeMoreText}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {/* Card Plano Ouro */}
          <View style={[styles.planCard, styles.goldPlanCard]}>
            <View style={styles.badgeRecommended}>
              <Text style={styles.badgeText}>RECOMENDADO</Text>
            </View>

            <Text style={styles.planTag}>MAIS COMPLETO</Text>

            <View style={styles.planHeaderRow}>
              <View style={styles.planTitleContainer}>
                <View style={styles.planIconCircle} />
                <Text style={styles.planTitleGold}>Plano Ouro</Text>
              </View>
              <View style={styles.planPriceContainer}>
                <Text style={styles.planPriceGold}>R$399,90</Text>
                <Text style={styles.planPeriodGold}>/mês</Text>
              </View>
            </View>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#A3C0F5" />
                <Text style={styles.featureTextGold}>Banho e Tosa</Text>
                <Text style={styles.featureCountGold}>2/mês</Text>
              </View>

              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#A3C0F5" />
                <Text style={styles.featureTextGold}>Exames de rotina</Text>
                <Text style={styles.featureCountGold}>2/mês</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.btnVerMaisGold}
              onPress={onNavigateToPlans}
              activeOpacity={0.85}
            >
              <Text style={styles.btnVerMaisGoldText}>VER MAIS</Text>
            </TouchableOpacity>
          </View>

          {/* Card Plano Básico */}
          <View style={[styles.planCard, styles.basicPlanCard]}>
            <Text style={styles.planTagBasic}>BÁSICO</Text>

            <View style={styles.planHeaderRow}>
              <View style={styles.planTitleContainer}>
                <View style={styles.planIconCircleBasic} />
                <Text style={styles.planTitleBasic}>Plano Básico</Text>
              </View>
            </View>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.featureTextBasic}>Banho e Tosa</Text>
              </View>

              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.featureTextBasic}>1 box digital</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.btnVerMaisBasic}
              onPress={onNavigateToPlans}
              activeOpacity={0.85}
            >
              <Text style={styles.btnVerMaisBasicText}>CONTRATAR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 2. Seção Nossos Serviços */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nossos Serviços</Text>
          <TouchableOpacity onPress={onNavigateToServices} activeOpacity={0.7}>
            <Text style={styles.seeMoreText}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          <View style={styles.serviceItem}>
            <View style={[styles.serviceCircle, { backgroundColor: '#80D8B6' }]} />
            <Text style={styles.serviceLabel}>Banho e Tosa</Text>
          </View>

          <View style={styles.serviceItem}>
            <View style={[styles.serviceCircle, { backgroundColor: '#7FB3E8' }]} />
            <Text style={styles.serviceLabel}>Exames</Text>
          </View>

          <View style={styles.serviceItem}>
            <View style={[styles.serviceCircle, { backgroundColor: '#F0937A' }]} />
            <Text style={styles.serviceLabel}>Vacinação</Text>
          </View>

          <View style={styles.serviceItem}>
            <View style={[styles.serviceCircle, { backgroundColor: '#E88DA3' }]} />
            <Text style={styles.serviceLabel}>Emergência 24h</Text>
          </View>

          <View style={styles.serviceItem}>
            <View style={[styles.serviceCircle, { backgroundColor: '#EBE3AA' }]} />
            <Text style={styles.serviceLabel}>Leva & Traz Pet</Text>
          </View>
        </ScrollView>

        {/* 3. Seção Como Funciona */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Como Funciona</Text>
          <TouchableOpacity onPress={onNavigateToHowItWorks} activeOpacity={0.7}>
            <Text style={styles.seeMoreText}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          <View style={styles.stepCard}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>1</Text>
            </View>
            <Text style={styles.stepText}>Escolha seu plano</Text>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>2</Text>
            </View>
            <Text style={styles.stepText}>Agende os serviços</Text>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>3</Text>
            </View>
            <Text style={styles.stepText}>Cuide do seu pet</Text>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>4</Text>
            </View>
            <Text style={styles.stepText}>Aproveite os benefícios</Text>
          </View>
        </ScrollView>

        {/* 4. Seção Dicas para o seu Pet */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dicas para o seu Pet</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeMoreText}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          <View style={styles.tipCardContainer}>
            <View style={[styles.tipBanner, { backgroundColor: '#D4CFC9' }]} />
            <Text style={styles.tipTitle}>Como escovar os dentes do seu pet</Text>
          </View>

          <View style={styles.tipCardContainer}>
            <View style={[styles.tipBanner, { backgroundColor: '#CBDDCB' }]} />
            <Text style={styles.tipTitle}>Sinais de que é hora do banho</Text>
          </View>
        </ScrollView>

        {/* 5. Seção Ficou com Dúvida? */}
        <Text style={[styles.sectionTitle, { marginHorizontal: 20, marginTop: 12, marginBottom: 12 }]}>
          Ficou com Dúvida?
        </Text>

        <TouchableOpacity style={styles.supportCard} activeOpacity={0.8}>
          <View style={styles.supportIconBadge}>
            <Ionicons name="headset-outline" size={20} color="#21479B" />
          </View>
          <View style={styles.supportInfo}>
            <Text style={styles.supportTitle}>Falar com nossa equipe</Text>
            <Text style={styles.supportSubtitle}>Atendimento por chat ou WhatsApp</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </ScrollView>

      {/* Menu de Navegação Inferior (Bottom Bar) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomTab} activeOpacity={0.7}>
          <Ionicons name="home-outline" size={22} color="#21479B" />
          <Text style={[styles.bottomTabText, styles.bottomTabActive]}>Início</Text>
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

        {/* Botão Perfil chamando a ProfileScreen */}
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={onNavigateToProfile}
          activeOpacity={0.7}
        >
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
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#21479B',
    marginTop: 2,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  seeMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#21479B',
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  planCard: {
    width: 250,
    borderRadius: 20,
    padding: 18,
    marginRight: 12,
  },
  goldPlanCard: {
    backgroundColor: '#1B4298',
  },
  badgeRecommended: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#D97706',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  planTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A3C0F5',
    marginBottom: 8,
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  planTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  planTitleGold: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  planPriceContainer: {
    alignItems: 'flex-end',
  },
  planPriceGold: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  planPeriodGold: {
    fontSize: 10,
    color: '#A3C0F5',
  },
  featuresList: {
    gap: 8,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureTextGold: {
    flex: 1,
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  featureCountGold: {
    fontSize: 11,
    color: '#A3C0F5',
    fontWeight: '600',
  },
  btnVerMaisGold: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnVerMaisGoldText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1B4298',
  },
  basicPlanCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  planTagBasic: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  planIconCircleBasic: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  planTitleBasic: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  featureTextBasic: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  btnVerMaisBasic: {
    backgroundColor: '#1B4298',
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnVerMaisBasicText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  serviceItem: {
    alignItems: 'center',
    width: 70,
  },
  serviceCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 6,
  },
  serviceLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  stepCard: {
    width: 100,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1B4298',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  tipCardContainer: {
    width: 170,
  },
  tipBanner: {
    height: 95,
    borderRadius: 16,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    lineHeight: 15,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  supportIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0F5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportInfo: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  supportSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
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
  bottomTabActive: {
    color: '#21479B',
    fontWeight: '700',
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