import React, { useState, useRef, useEffect } from 'react';
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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../../components/BottomNavigation';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 40;

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
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalBanners = 2;

  // Estado para controlar qual plano está selecionado
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Efeito para passar o banner sozinho a cada 3 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % totalBanners;
        scrollRef.current?.scrollTo({
          x: nextIndex * (BANNER_WIDTH + 16),
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

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

        {/* Carrossel Automático de Banners */}
        <View style={styles.bannerWrapper}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bannerContainer}
            onMomentumScrollEnd={(event) => {
              const contentOffset = event.nativeEvent.contentOffset.x;
              const index = Math.round(contentOffset / (BANNER_WIDTH + 16));
              setCurrentIndex(index);
            }}
          >
            <Image
              source={require('../../assets/banner.png')}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <Image
              source={require('../../assets/banner2.png')}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </ScrollView>

          {/* Indicadores de Paginação */}
          <View style={styles.paginationDots}>
            {[...Array(totalBanners)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  currentIndex === i ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* 1. Seção Nossos Planos (4 Planos Completos) */}
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
          {/* Card Plano Bronze */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setSelectedPlanId(selectedPlanId === 'bronze' ? null : 'bronze')}
            style={[styles.planCard, selectedPlanId === 'bronze' ? styles.activePlanCard : styles.basicPlanCard]}
          >
            <Text style={selectedPlanId === 'bronze' ? styles.planTag : styles.planTagBasic}>ESSENCIAL</Text>
            <View style={styles.planHeaderRow}>
              <Text style={selectedPlanId === 'bronze' ? styles.planTitleGold : styles.planTitleBasic}>Plano Bronze</Text>
              <View style={styles.planPriceContainer}>
                <Text style={selectedPlanId === 'bronze' ? styles.planPriceGold : styles.planPriceBasic}>R$89,90</Text>
                <Text style={selectedPlanId === 'bronze' ? styles.planPeriodGold : styles.planPeriodBasic}>/mês</Text>
              </View>
            </View>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={selectedPlanId === 'bronze' ? '#A3C0F5' : '#10B981'} />
                <Text style={selectedPlanId === 'bronze' ? styles.featureTextGold : styles.featureTextBasic}>Banho mensal</Text>
                <Text style={selectedPlanId === 'bronze' ? styles.featureCountGold : styles.featureCountBasic}>1/mês</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={selectedPlanId === 'bronze' ? '#A3C0F5' : '#10B981'} />
                <Text style={selectedPlanId === 'bronze' ? styles.featureTextGold : styles.featureTextBasic}>Carteira de vacinação digital</Text>
                <Text style={selectedPlanId === 'bronze' ? styles.featureCountGold : styles.featureCountBasic}>Incluso</Text>
              </View>
            </View>
            <TouchableOpacity style={selectedPlanId === 'bronze' ? styles.btnVerMaisGold : styles.btnVerMaisBasic} onPress={onNavigateToPlans} activeOpacity={0.85}>
              <Text style={selectedPlanId === 'bronze' ? styles.btnVerMaisGoldText : styles.btnVerMaisBasicText}>VER MAIS</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Card Plano Prata */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setSelectedPlanId(selectedPlanId === 'prata' ? null : 'prata')}
            style={[styles.planCard, selectedPlanId === 'prata' ? styles.activePlanCard : styles.basicPlanCard]}
          >
            <Text style={selectedPlanId === 'prata' ? styles.planTag : styles.planTagBasic}>POPULAR</Text>
            <View style={styles.planHeaderRow}>
              <Text style={selectedPlanId === 'prata' ? styles.planTitleGold : styles.planTitleBasic}>Plano Prata</Text>
              <View style={styles.planPriceContainer}>
                <Text style={selectedPlanId === 'prata' ? styles.planPriceGold : styles.planPriceBasic}>R$139,90</Text>
                <Text style={selectedPlanId === 'prata' ? styles.planPeriodGold : styles.planPeriodBasic}>/mês</Text>
              </View>
            </View>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={selectedPlanId === 'prata' ? '#A3C0F5' : '#10B981'} />
                <Text style={selectedPlanId === 'prata' ? styles.featureTextGold : styles.featureTextBasic}>Banho e Tosa</Text>
                <Text style={selectedPlanId === 'prata' ? styles.featureCountGold : styles.featureCountBasic}>2/mês</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={selectedPlanId === 'prata' ? '#A3C0F5' : '#10B981'} />
                <Text style={selectedPlanId === 'prata' ? styles.featureTextGold : styles.featureTextBasic}>Consulta Veterinária</Text>
                <Text style={selectedPlanId === 'prata' ? styles.featureCountGold : styles.featureCountBasic}>1/mês</Text>
              </View>
            </View>
            <TouchableOpacity style={selectedPlanId === 'prata' ? styles.btnVerMaisGold : styles.btnVerMaisBasic} onPress={onNavigateToPlans} activeOpacity={0.85}>
              <Text style={selectedPlanId === 'prata' ? styles.btnVerMaisGoldText : styles.btnVerMaisBasicText}>VER MAIS</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Card Plano Ouro */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setSelectedPlanId(selectedPlanId === 'ouro' ? null : 'ouro')}
            style={[styles.planCard, selectedPlanId === 'ouro' ? styles.activePlanCard : styles.basicPlanCard]}
          >
            <View style={selectedPlanId === 'ouro' ? styles.badgeRecommended : styles.badgeRecommendedBasic}>
              <Text style={styles.badgeText}>RECOMENDADO</Text>
            </View>
            <Text style={selectedPlanId === 'ouro' ? styles.planTag : styles.planTagBasic}>MAIS COMPLETO</Text>
            <View style={styles.planHeaderRow}>
              <Text style={selectedPlanId === 'ouro' ? styles.planTitleGold : styles.planTitleBasic}>Plano Ouro</Text>
              <View style={styles.planPriceContainer}>
                <Text style={selectedPlanId === 'ouro' ? styles.planPriceGold : styles.planPriceBasic}>R$399,90</Text>
                <Text style={selectedPlanId === 'ouro' ? styles.planPeriodGold : styles.planPeriodBasic}>/mês</Text>
              </View>
            </View>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={selectedPlanId === 'ouro' ? '#A3C0F5' : '#10B981'} />
                <Text style={selectedPlanId === 'ouro' ? styles.featureTextGold : styles.featureTextBasic}>Banho e Tosa</Text>
                <Text style={selectedPlanId === 'ouro' ? styles.featureCountGold : styles.featureCountBasic}>4/mês</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={selectedPlanId === 'ouro' ? '#A3C0F5' : '#10B981'} />
                <Text style={selectedPlanId === 'ouro' ? styles.featureTextGold : styles.featureTextBasic}>Exames de rotina</Text>
                <Text style={selectedPlanId === 'ouro' ? styles.featureCountGold : styles.featureCountBasic}>2/mês</Text>
              </View>
            </View>
            <TouchableOpacity style={selectedPlanId === 'ouro' ? styles.btnVerMaisGold : styles.btnVerMaisBasic} onPress={onNavigateToPlans} activeOpacity={0.85}>
              <Text style={selectedPlanId === 'ouro' ? styles.btnVerMaisGoldText : styles.btnVerMaisBasicText}>VER MAIS</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Card Plano Diamante */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setSelectedPlanId(selectedPlanId === 'diamante' ? null : 'diamante')}
            style={[styles.planCard, selectedPlanId === 'diamante' ? styles.activePlanCard : styles.basicPlanCard]}
          >
            <Text style={selectedPlanId === 'diamante' ? styles.planTag : styles.planTagBasic}>VIP PREMIUM</Text>
            <View style={styles.planHeaderRow}>
              <Text style={selectedPlanId === 'diamante' ? styles.planTitleGold : styles.planTitleBasic}>Diamante</Text>
              <View style={styles.planPriceContainer}>
                <Text style={selectedPlanId === 'diamante' ? styles.planPriceGold : styles.planPriceBasic}>R$599,90</Text>
                <Text style={selectedPlanId === 'diamante' ? styles.planPeriodGold : styles.planPeriodBasic}>/mês</Text>
              </View>
            </View>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={selectedPlanId === 'diamante' ? '#A3C0F5' : '#10B981'} />
                <Text style={selectedPlanId === 'diamante' ? styles.featureTextGold : styles.featureTextBasic}>Atendimento VIP & Home Care</Text>
                <Text style={selectedPlanId === 'diamante' ? styles.featureCountGold : styles.featureCountBasic}>Ilimitado</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={selectedPlanId === 'diamante' ? '#A3C0F5' : '#10B981'} />
                <Text style={selectedPlanId === 'diamante' ? styles.featureTextGold : styles.featureTextBasic}>Exames e Vacinas</Text>
                <Text style={selectedPlanId === 'diamante' ? styles.featureCountGold : styles.featureCountBasic}>Completos</Text>
              </View>
            </View>
            <TouchableOpacity style={selectedPlanId === 'diamante' ? styles.btnVerMaisGold : styles.btnVerMaisBasic} onPress={onNavigateToPlans} activeOpacity={0.85}>
              <Text style={selectedPlanId === 'diamante' ? styles.btnVerMaisGoldText : styles.btnVerMaisBasicText}>VER MAIS</Text>
            </TouchableOpacity>
          </TouchableOpacity>
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
            <View style={[styles.serviceCircle, { backgroundColor: '#80D8B6' }]}>
              <Ionicons name="cut-outline" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.serviceLabel}>Banho e Tosa</Text>
          </View>

          <View style={styles.serviceItem}>
            <View style={[styles.serviceCircle, { backgroundColor: '#7FB3E8' }]}>
              <Ionicons name="flask-outline" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.serviceLabel}>Exames</Text>
          </View>

          <View style={styles.serviceItem}>
            <View style={[styles.serviceCircle, { backgroundColor: '#F0937A' }]}>
              <Ionicons name="medical-outline" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.serviceLabel}>Vacinação</Text>
          </View>

          <View style={styles.serviceItem}>
            <View style={[styles.serviceCircle, { backgroundColor: '#E88DA3' }]}>
              <Ionicons name="time-outline" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.serviceLabel}>Emergência 24h</Text>
          </View>

          <View style={styles.serviceItem}>
            <View style={[styles.serviceCircle, { backgroundColor: '#EBE3AA' }]}>
              <Ionicons name="car-sport-outline" size={24} color="#21479B" />
            </View>
            <Text style={styles.serviceLabel}>Leva & Traz Pet</Text>
          </View>
        </ScrollView>

        {/* 3. Seção Como Funciona (Com Imagens .jpg) */}
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
          <TouchableOpacity style={styles.stepImageCard} onPress={onNavigateToHowItWorks} activeOpacity={0.85}>
            <Image
              source={require('../../assets/step1.jpg')}
              style={styles.stepCardImage}
              resizeMode="cover"
            />
            <Text style={styles.stepImageTitle}>1. Escolha seu plano</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.stepImageCard} onPress={onNavigateToHowItWorks} activeOpacity={0.85}>
            <Image
              source={require('../../assets/step2.jpg')}
              style={styles.stepCardImage}
              resizeMode="cover"
            />
            <Text style={styles.stepImageTitle}>2. Agende serviços</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.stepImageCard} onPress={onNavigateToHowItWorks} activeOpacity={0.85}>
            <Image
              source={require('../../assets/step3.jpg')}
              style={styles.stepCardImage}
              resizeMode="cover"
            />
            <Text style={styles.stepImageTitle}>3. Cuide do seu pet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.stepImageCard} onPress={onNavigateToHowItWorks} activeOpacity={0.85}>
            <Image
              source={require('../../assets/step4.jpg')}
              style={styles.stepCardImage}
              resizeMode="cover"
            />
            <Text style={styles.stepImageTitle}>4. Aproveite vantagens</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* 4. Seção Dicas para o seu Pet */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dicas para o seu Pet</Text>
          <TouchableOpacity onPress={onNavigateToExplore} activeOpacity={0.7}>
            <Text style={styles.seeMoreText}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          <TouchableOpacity style={styles.tipCardContainer} onPress={onNavigateToExplore} activeOpacity={0.85}>
            <Image
              source={require('../../assets/Dog1.png')}
              style={styles.tipBannerImage}
              resizeMode="cover"
            />
            <Text style={styles.tipTitle}>Como escovar os dentes do seu pet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tipCardContainer} onPress={onNavigateToExplore} activeOpacity={0.85}>
            <Image
              source={require('../../assets/Dog2.png')}
              style={styles.tipBannerImage}
              resizeMode="cover"
            />
            <Text style={styles.tipTitle}>Sinais de que é hora do banho</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* 5. Seção Ficou com Dúvida? */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ficou com Dúvida?</Text>
        </View>

        <TouchableOpacity style={styles.supportCard} onPress={onNavigateToBenefits} activeOpacity={0.8}>
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

      {/* Componente Global de Navegação */}
      <BottomNavigation
        currentRoute="Home"
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
  scrollContent: { paddingBottom: 20 },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingText: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
  mainTitle: { fontSize: 20, fontWeight: '800', color: '#21479B', marginTop: 2 },
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
  bannerWrapper: {
    marginBottom: 10,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  bannerImage: {
    width: BANNER_WIDTH,
    height: 180,
    borderRadius: 20,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 18,
    backgroundColor: '#21479B',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#CBD5E1',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  seeMoreText: { fontSize: 12, fontWeight: '700', color: '#21479B' },
  horizontalScroll: { paddingHorizontal: 20, gap: 12 },
  planCard: { width: 250, borderRadius: 20, padding: 18, marginRight: 12 },
  activePlanCard: { backgroundColor: '#1B4298' },
  badgeRecommended: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#D97706',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeRecommendedBasic: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
  planTag: { fontSize: 10, fontWeight: '700', color: '#A3C0F5', marginBottom: 8 },
  planTagBasic: { fontSize: 10, fontWeight: '700', color: '#64748B', marginBottom: 8 },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  planTitleGold: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  planTitleBasic: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  planPriceContainer: { alignItems: 'flex-end' },
  planPriceGold: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  planPriceBasic: { fontSize: 16, fontWeight: '800', color: '#21479B' },
  planPeriodGold: { fontSize: 10, color: '#A3C0F5' },
  planPeriodBasic: { fontSize: 10, color: '#64748B' },
  featuresList: { gap: 8, marginBottom: 16 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureTextGold: { flex: 1, fontSize: 11, color: '#FFFFFF', fontWeight: '500' },
  featureTextBasic: { flex: 1, fontSize: 11, color: '#475569', fontWeight: '500' },
  featureCountGold: { fontSize: 11, color: '#A3C0F5', fontWeight: '600' },
  featureCountBasic: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  btnVerMaisGold: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnVerMaisGoldText: { fontSize: 13, fontWeight: '800', color: '#1B4298' },
  basicPlanCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' },
  btnVerMaisBasic: {
    backgroundColor: '#1B4298',
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnVerMaisBasicText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  serviceItem: { alignItems: 'center', width: 70 },
  serviceCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceLabel: { fontSize: 10, fontWeight: '600', color: '#475569', textAlign: 'center' },
  stepImageCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  stepCardImage: {
    width: 144,
    height: 90,
    borderRadius: 12,
    marginBottom: 8,
  },
  stepImageTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  tipCardContainer: { width: 170 },
  tipBannerImage: { width: 170, height: 95, borderRadius: 16, marginBottom: 8 },
  tipTitle: { fontSize: 11, fontWeight: '700', color: '#334155', lineHeight: 15 },
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
  supportInfo: { flex: 1 },
  supportTitle: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  supportSubtitle: { fontSize: 11, color: '#64748B', marginTop: 2 },
});