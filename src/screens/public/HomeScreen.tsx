import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { PLAN_TIER } from '../../components/PlanShowcaseList';
import BottomNavigation from '../../components/BottomNavigation';
import { theme } from '../../theme/privateTheme';
import { SERVICES, PLAN_ORDER, PLAN_NAMES, getMonthlyPrice, type PlanId } from '../../data/planCoverage';

interface HomeScreenProps {
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToRegister?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToSupport?: () => void;
  onNavigateToHowItWorks?: () => void; // mantido por compatibilidade
  onChoosePlan?: (planId: PlanId) => void;
  onOpenPlans?: (planId?: PlanId) => void; // abre a vitrine com o plano aberto
}

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 36;
const BANNER_GAP = 12;
const SERVICE_WIDTH = width * 0.62;

const BANNER_PLANS: PlanId[] = ['bronze', 'prata', 'ouro', 'diamante'];
const BANNERS = [
  require('../../assets/Plano-Bronze.png'),
  require('../../assets/Plano-Prata.png'),
  require('../../assets/Plano-Ouro.png'),
  require('../../assets/Plano-Diamante.png'),
];

const C = theme.colors;
const F = theme.fonts;

export default function HomeScreen({
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  onNavigateToLogin,
  onNavigateToRegister,
  onNavigateToServices,
  onNavigateToSupport,
  onChoosePlan,
  onOpenPlans,
}: HomeScreenProps) {
  const bannerRef = useRef<any>(null);
  const [bannerIndex, setBannerIndex] = useState(0);

  // Troca de banner sozinha a cada 5 segundos.
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((current) => {
        const next = (current + 1) % BANNERS.length;
        bannerRef.current?.scrollTo({ x: next * (BANNER_WIDTH + BANNER_GAP), animated: true });
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Topo */}
        <View style={styles.top}>
          <View style={{ flex: 1 }}>
            <Text style={styles.hello}>Olá! Bem-vindo(a)</Text>
            <Text style={styles.question}>O que você procura hoje?</Text>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={onNavigateToLogin} activeOpacity={0.85}>
            <Text style={styles.loginText}>Entrar</Text>
          </TouchableOpacity>
        </View>

        {/* Banners clicáveis */}
        <ScrollView
          ref={bannerRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={BANNER_WIDTH + BANNER_GAP}
          decelerationRate="fast"
          contentContainerStyle={styles.bannerRow}
          onMomentumScrollEnd={(e) =>
            setBannerIndex(Math.round(e.nativeEvent.contentOffset.x / (BANNER_WIDTH + BANNER_GAP)))
          }
        >
          {BANNERS.map((banner, index) => (
            <TouchableOpacity
              key={BANNER_PLANS[index]}
              activeOpacity={0.92}
              onPress={() => (onChoosePlan ? onChoosePlan(BANNER_PLANS[index]) : onNavigateToPlans?.())}
            >
              <Image source={banner} style={styles.banner} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.dots}>
          {BANNERS.map((_, i) => (
            <View key={i} style={[styles.dot, bannerIndex === i && styles.dotActive]} />
          ))}
        </View>

        {/* Vantagens (rodapé dos banners) */}
        <View style={styles.perks}>
          {[
            { icon: 'clock-check-outline' as const, text: 'Sem carência' },
            { icon: 'hospital-building' as const, text: 'Rede ampla' },
            { icon: 'hours-24' as const, text: 'Atendimento 24h' },
          ].map((perk) => (
            <View key={perk.text} style={styles.perk}>
              <MaterialCommunityIcons name={perk.icon} size={20} color={C.primary} />
              <Text style={styles.perkText}>{perk.text}</Text>
            </View>
          ))}
        </View>

        {/* Planos em resumo */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitleInline}>Nossos planos</Text>
          <TouchableOpacity onPress={() => (onOpenPlans ? onOpenPlans() : onNavigateToPlans?.())}>
            <Text style={styles.link}>Comparar</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.planRow}>
          {PLAN_ORDER.map((id) => (
            <TouchableOpacity
              key={id}
              style={[styles.planCard, id === 'ouro' && styles.planCardFeatured]}
              onPress={() => (onOpenPlans ? onOpenPlans(id) : onNavigateToPlans?.())}
              activeOpacity={0.85}
            >
              {id === 'ouro' && (
                <View style={styles.planRibbon}>
                  <Text style={styles.planRibbonText}>Mais escolhido</Text>
                </View>
              )}
              <View style={[styles.planCrown, { backgroundColor: PLAN_TIER[id].color }]}>
                <MaterialCommunityIcons name="crown" size={17} color="#FFFFFF" />
              </View>
              <Text style={styles.planName}>{PLAN_NAMES[id].replace('Plano ', '')}</Text>
              <Text style={styles.planFrom}>a partir de</Text>
              <Text style={styles.planPrice}>
                {getMonthlyPrice(id, 'yearly').toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Chamada para criar conta */}
        <Text style={styles.sectionTitle}>Comece por aqui</Text>
        <TouchableOpacity style={styles.hero} activeOpacity={0.92} onPress={onNavigateToRegister}>
          <View style={styles.heroCircleBig} />
          <View style={styles.heroCircle} />
          <Image source={require('../../assets/pets-abraco.png')} style={styles.heroImage} resizeMode="contain" />
          <View style={styles.heroText}>
            <Text style={styles.heroEyebrow}>Primeiro passo</Text>
            <Text style={styles.heroTitle}>Crie sua conta e cadastre seu pet</Text>
            <Text style={styles.heroSubtitle}>É grátis e leva 1 minuto.</Text>
            <View style={styles.heroButton}>
              <Text style={styles.heroButtonText}>Criar conta</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Serviços */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitleInline}>Serviços</Text>
          <TouchableOpacity onPress={onNavigateToPlans}>
            <Text style={styles.link}>Ver planos</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.serviceRow}>
          {SERVICES.map((service) => {
            const content = (
              <View style={styles.serviceOverlay}>
                <Text style={styles.serviceTitle}>{service.name}</Text>
                <Text style={styles.serviceText} numberOfLines={2}>{service.description}</Text>
              </View>
            );
            return (
              <TouchableOpacity key={service.id} activeOpacity={0.9} onPress={onNavigateToServices ?? onNavigateToPlans}>
                {service.image ? (
                  <ImageBackground source={service.image} style={styles.serviceCard} imageStyle={styles.serviceImage}>
                    {content}
                  </ImageBackground>
                ) : (
                  <View style={[styles.serviceCard, styles.servicePlain]}>
                    <Feather name="heart" size={40} color={C.primary} style={{ alignSelf: 'center', marginTop: 30 }} />
                    {content}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Suporte */}
        <TouchableOpacity style={styles.support} onPress={onNavigateToSupport ?? onNavigateToProfile} activeOpacity={0.85}>
          <View style={styles.supportIcon}>
            <Feather name="headphones" size={19} color={C.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.supportTitle}>Falar com nossa equipe</Text>
            <Text style={styles.supportText}>Atendimento por chat ou WhatsApp</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>

      <BottomNavigation
        currentRoute="Home"
        onNavigateToHome={() => {}}
        onNavigateToPlans={onNavigateToPlans}
        onNavigateToBenefits={onNavigateToBenefits}
        onNavigateToProfile={onNavigateToProfile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scrollContent: { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 8, paddingBottom: 130 },

  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, marginBottom: 14 },
  hello: { fontSize: 13, fontFamily: F.regular, color: C.muted },
  question: { fontSize: 19, fontFamily: F.bold, color: C.primary, marginTop: 2 },
  loginButton: { backgroundColor: C.brandYellow, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 9 },
  loginText: { fontSize: 13, fontFamily: F.bold, color: C.navy },

  bannerRow: { paddingHorizontal: 18, gap: BANNER_GAP },
  banner: { width: BANNER_WIDTH, height: BANNER_WIDTH / 2, borderRadius: 18 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#C9D3E3' },
  dotActive: { width: 18, backgroundColor: C.primary },

  perks: { flexDirection: 'row', gap: 8, marginHorizontal: 18, marginTop: 14 },
  perk: { flex: 1, alignItems: 'center', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingVertical: 9, gap: 3 },
  perkText: { fontSize: 11, fontFamily: F.bold, color: C.navy, textAlign: 'center' },
  planRow: { paddingHorizontal: 18, gap: 10, paddingTop: 8 },
  planCard: { width: 112, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 12 },
  planCardFeatured: { borderColor: C.primary, borderWidth: 2 },
  planRibbon: { position: 'absolute', top: -9, left: 10, backgroundColor: C.brandYellow, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1 },
  planRibbonText: { fontSize: 9, fontFamily: F.bold, color: C.navy },
  planCrown: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  planName: { fontSize: 15, fontFamily: F.bold, color: C.navy, marginTop: 8 },
  planFrom: { fontSize: 10, fontFamily: F.regular, color: C.muted, marginTop: 2 },
  planPrice: { fontSize: 14, fontFamily: F.bold, color: C.primary },
  sectionTitle: { fontSize: 17, fontFamily: F.bold, color: C.navy, marginHorizontal: 18, marginTop: 22, marginBottom: 12 },
  sectionRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginHorizontal: 18, marginTop: 24, marginBottom: 12 },
  sectionTitleInline: { fontSize: 17, fontFamily: F.bold, color: C.navy },
  link: { fontSize: 13, fontFamily: F.bold, color: C.primary },

  hero: { marginHorizontal: 18, height: 172, borderRadius: 22, backgroundColor: C.primary, overflow: 'hidden' },
  heroCircleBig: { position: 'absolute', right: -50, top: -40, width: 210, height: 210, borderRadius: 105, backgroundColor: '#2148AA' },
  heroCircle: { position: 'absolute', right: -20, top: -10, width: 160, height: 160, borderRadius: 80, backgroundColor: '#2C55BC' },
  heroImage: { position: 'absolute', right: 6, bottom: 8, width: 159, height: 134 },
  heroText: { position: 'absolute', left: 18, top: 18, width: '52%' },
  heroEyebrow: { fontSize: 12, fontFamily: F.medium, color: '#B9C8E6' },
  heroTitle: { fontSize: 17, fontFamily: F.bold, color: '#FFFFFF', lineHeight: 22, marginTop: 4 },
  heroSubtitle: { fontSize: 12, fontFamily: F.regular, color: '#C9D6EE', marginTop: 5 },
  heroButton: { alignSelf: 'flex-start', backgroundColor: C.brandYellow, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9, marginTop: 12 },
  heroButtonText: { fontSize: 13, fontFamily: F.bold, color: C.navy },

  serviceRow: { paddingHorizontal: 18, gap: 12 },
  serviceCard: { width: SERVICE_WIDTH, height: 150, borderRadius: 18, overflow: 'hidden', justifyContent: 'flex-end' },
  serviceImage: { borderRadius: 18 },
  servicePlain: { backgroundColor: C.primarySoft },
  serviceOverlay: { backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: 12 },
  serviceTitle: { fontSize: 15, fontFamily: F.bold, color: '#FFFFFF' },
  serviceText: { fontSize: 11, fontFamily: F.regular, color: '#E2E8F0', marginTop: 2 },

  support: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 18,
    marginTop: 24,
    backgroundColor: C.primary,
    borderRadius: 18,
    padding: 14,
  },
  supportIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: C.brandYellow, alignItems: 'center', justifyContent: 'center' },
  supportTitle: { fontSize: 14, fontFamily: F.bold, color: '#FFFFFF' },
  supportText: { fontSize: 12, fontFamily: F.regular, color: '#C9D6EE', marginTop: 2 },
});