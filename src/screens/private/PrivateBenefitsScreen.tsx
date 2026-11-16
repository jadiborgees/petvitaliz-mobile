import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  Dimensions,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';
import PrivateHeader from '../../components/PrivateHeader';
import PetAvatar from '../../components/PetAvatar';
import { theme } from '../../theme/privateTheme';
import type { Pet } from './PrivatePetsFlowScreen';
import type { ConsultationAppointment } from './PrivateConsultationsScreen';
import {
  SERVICES,
  PLAN_ORDER,
  PLAN_NAMES,
  PLAN_COVERAGE,
  PLAN_FEATURES,
  PLAN_MEDICINE_DISCOUNT,
  getPlanId,
  type PlanId,
} from '../../data/planCoverage';

interface PrivateBenefitsScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToAddPet?: () => void;
  onSchedule?: (petId: string) => void;
  onContractPlan?: (petId: string | null, planId: PlanId) => void;
  onChangePlan?: (petId: string, planId: PlanId) => void;
  pets?: Pet[];
  appointments?: ConsultationAppointment[];
}

// Largura do banner: a tela menos as margens laterais (18 + 18).
const BANNER_WIDTH = Dimensions.get('window').width - 36;

const C = theme.colors;
const F = theme.fonts;

const BANNERS: Record<PlanId, ImageSourcePropType> = {
  bronze: require('../../assets/Plano-Bronze.png'),
  prata: require('../../assets/Plano-Prata.png'),
  ouro: require('../../assets/Plano-Ouro.png'),
  diamante: require('../../assets/Plano-Diamante.png'),
};

export default function PrivateBenefitsScreen({
  onBack,
  onNavigateToHome,
  onNavigateToPlans,
  onNavigateToProfile,
  onNavigateToAddPet,
  onSchedule,
  onContractPlan,
  onChangePlan,
  pets = [],
  appointments = [],
}: PrivateBenefitsScreenProps) {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(pets[0]?.id ?? null);
  const selectedPet = pets.find((pet) => pet.id === selectedPetId) ?? pets[0] ?? null;
  const petPlan = selectedPet?.hasActivePlan ? getPlanId(selectedPet.plan) : null;

  const [tabPlan, setTabPlan] = useState<PlanId>(petPlan ?? 'ouro');

  // Uso do mês de cada serviço coberto pelo plano do pet.
  const usage = useMemo(() => {
    if (!selectedPet || !petPlan) return [];
    const now = new Date();
    const coverage = PLAN_COVERAGE[petPlan];
    return SERVICES.filter((service) => coverage[service.id] !== undefined).map((service) => {
      const quota = coverage[service.id]!;
      const used = appointments.filter((item) => {
        if (item.petId !== selectedPet.id || item.status === 'cancelled') return false;
        const [year, month] = item.date.split('-').map(Number);
        return (
          (item.serviceId ?? 'consulta') === service.id &&
          year === now.getFullYear() &&
          month === now.getMonth() + 1
        );
      }).length;
      return { id: service.id, name: service.name, quota, used };
    });
  }, [selectedPet, petPlan, appointments]);

  // Botão de cada plano na vitrine, conforme o pet escolhido.
  const planAction = (() => {
    if (!selectedPet) return { label: `Conhecer o ${PLAN_NAMES[tabPlan]}`, kind: 'contract' as const };
    if (petPlan === tabPlan) return { label: `Plano atual ${selectedPet.gender === 'Macho' ? 'do' : 'da'} ${selectedPet.name}`, kind: 'current' as const };
    if (petPlan) return { label: 'Mudar para este plano', kind: 'change' as const };
    return { label: `Contratar para ${selectedPet.gender === 'Macho' ? 'o' : 'a'} ${selectedPet.name}`, kind: 'contract' as const };
  })();

  const runPlanAction = () => {
    if (planAction.kind === 'current') return;
    if (planAction.kind === 'change' && selectedPet) onChangePlan?.(selectedPet.id, tabPlan);
    else onContractPlan?.(selectedPet?.id ?? null, tabPlan);
  };

  return (
    <SafeAreaView style={styles.container}>
      <PrivateHeader title="Benefícios" onBack={onBack ?? onNavigateToHome} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ---------- USO DO MÊS ---------- */}
        {pets.length === 0 ? (
          <View style={[styles.card, styles.emptyCard]}>
            <PetAvatar size={60} />
            <Text style={styles.emptyTitle}>Cadastre seu pet</Text>
            <Text style={styles.emptyText}>Os benefícios do plano aparecem aqui assim que seu pet tiver um.</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={onNavigateToAddPet} activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>Adicionar pet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Seus pets</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.petList}>
              {pets.map((pet) => {
                const isSelected = pet.id === selectedPet?.id;
                const plan = pet.hasActivePlan ? getPlanId(pet.plan) : null;
                return (
                  <TouchableOpacity
                    key={pet.id}
                    style={[styles.petPill, isSelected && styles.petPillActive]}
                    onPress={() => {
                      setSelectedPetId(pet.id);
                      if (plan) setTabPlan(plan);
                    }}
                    activeOpacity={0.8}
                  >
                    <PetAvatar
                      species={pet.species}
                      avatar={pet.avatar}
                      size={32}
                      background={isSelected ? C.card : C.primarySoft}
                    />
                    <View>
                      <Text style={styles.petPillName} numberOfLines={1}>{pet.name}</Text>
                      <Text style={[styles.petPillPlan, { color: plan ? C.success : C.warning }]}>
                        {plan ? PLAN_NAMES[plan].replace('Plano ', '') : 'Sem plano'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {petPlan && selectedPet ? (
              <View style={styles.usageCard}>
                <View style={styles.usageCircle} />
                <View style={styles.usageHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.usageEyebrow}>Uso do mês · {selectedPet.name}</Text>
                    <Text style={styles.usageTitle}>{PLAN_NAMES[petPlan]}</Text>
                  </View>
                  <MaterialCommunityIcons name="crown" size={26} color={C.brandYellow} />
                </View>

                <View style={styles.usageGrid}>
                  {usage.map((item) => {
                    const exhausted = typeof item.quota === 'number' && item.used >= item.quota;
                    return (
                      <View key={item.id} style={styles.usageTile}>
                        <Text style={styles.usageTileLabel} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.usageTileValue}>
                          {item.quota === 'ilimitado' ? 'Ilimitado' : `${Math.min(item.used, item.quota)} de ${item.quota}`}
                        </Text>
                        {exhausted && <Text style={styles.usageTileWarning}>Cota esgotada</Text>}
                      </View>
                    );
                  })}
                </View>

                <TouchableOpacity
                  style={styles.scheduleButton}
                  onPress={() => onSchedule?.(selectedPet.id)}
                  activeOpacity={0.85}
                >
                  <Feather name="calendar" size={16} color={C.navy} />
                  <Text style={styles.scheduleText}>Agendar serviço</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.card, styles.noPlanCard]}>
                <Text style={styles.noPlanTitle}>{selectedPet?.name} ainda não tem plano</Text>
                <Text style={styles.noPlanText}>Escolha um plano abaixo para liberar consultas, banho e tosa e mais.</Text>
              </View>
            )}

            {petPlan && (
              <Text style={styles.discountNote}>
                + {PLAN_MEDICINE_DISCOUNT[petPlan]}% de desconto em medicamentos na rede credenciada
              </Text>
            )}
          </>
        )}

        {/* ---------- CONHEÇA OS PLANOS ---------- */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Conheça os planos</Text>
        <View style={styles.tabs}>
          {PLAN_ORDER.map((id) => (
            <TouchableOpacity
              key={id}
              style={[styles.tab, tabPlan === id && styles.tabActive]}
              onPress={() => setTabPlan(id)}
            >
              <Text style={[styles.tabText, tabPlan === id && styles.tabTextActive]}>
                {PLAN_NAMES[id].replace('Plano ', '')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.92} onPress={runPlanAction} disabled={planAction.kind === 'current'}>
          <Image source={BANNERS[tabPlan]} style={styles.banner} resizeMode="cover" />
        </TouchableOpacity>

        <View style={[styles.card, styles.featureCard]}>
          {PLAN_FEATURES[tabPlan].map((feature, index) => (
            <View
              key={feature.text}
              style={[styles.featureRow, index < PLAN_FEATURES[tabPlan].length - 1 && styles.divider]}
            >
              <Feather name="check-circle" size={16} color={C.success} />
              <Text style={styles.featureText}>{feature.text}</Text>
              <Text style={styles.featureCount}>{feature.count}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.planButton, planAction.kind === 'current' && styles.planButtonCurrent]}
          onPress={runPlanAction}
          disabled={planAction.kind === 'current'}
          activeOpacity={0.85}
        >
          {planAction.kind === 'current' && <Feather name="check-circle" size={16} color={C.primary} />}
          <Text style={[styles.planButtonText, planAction.kind === 'current' && { color: C.primary }]}>
            {planAction.label}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <PrivateBottomNav
        currentRoute="PrivateBenefits"
        onNavigateToHome={onNavigateToHome}
        onNavigateToPlans={onNavigateToPlans}
        onNavigateToBenefits={() => {}}
        onNavigateToProfile={onNavigateToProfile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scrollContent: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 130 },
  sectionTitle: { fontSize: 16, fontFamily: F.bold, color: C.navy },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: theme.radius.card },
  divider: { borderBottomWidth: 1, borderBottomColor: C.divider },

  // Pets
  petList: { gap: 8, paddingTop: 10, paddingBottom: 14 },
  petPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 24,
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 14,
  },
  petPillActive: { backgroundColor: C.primarySoft, borderColor: C.primary, borderWidth: 1.5 },
  petPillName: { fontSize: 13, fontFamily: F.bold, color: C.navy, maxWidth: 110 },
  petPillPlan: { fontSize: 11, fontFamily: F.semibold, marginTop: 1 },

  // Uso do mês
  usageCard: { backgroundColor: C.primary, borderRadius: 20, padding: 14, overflow: 'hidden' },
  usageCircle: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#2148AA',
  },
  usageHeader: { flexDirection: 'row', alignItems: 'center' },
  usageEyebrow: { fontSize: 11, fontFamily: F.medium, color: '#B9C8E6' },
  usageTitle: { fontSize: 17, fontFamily: F.bold, color: '#FFFFFF', marginTop: 1 },
  usageGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 8, marginTop: 12 },
  usageTile: { width: '48.5%', backgroundColor: '#2148AA', borderRadius: 11, padding: 9 },
  usageTileLabel: { fontSize: 11, fontFamily: F.regular, color: '#C9D6EE' },
  usageTileValue: { fontSize: 14, fontFamily: F.bold, color: '#FFFFFF', marginTop: 2 },
  usageTileWarning: { fontSize: 10, fontFamily: F.semibold, color: C.brandYellow, marginTop: 1 },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.brandYellow,
    borderRadius: 12,
    minHeight: 44,
    marginTop: 12,
  },
  scheduleText: { fontSize: 14, fontFamily: F.bold, color: C.navy },
  discountNote: { fontSize: 11, fontFamily: F.medium, color: C.muted, textAlign: 'center', marginTop: 9 },

  noPlanCard: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', padding: 14 },
  noPlanTitle: { fontSize: 14, fontFamily: F.bold, color: C.navy },
  noPlanText: { fontSize: 12, fontFamily: F.regular, color: C.textSecondary, marginTop: 4, lineHeight: 18 },

  emptyCard: { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16 },
  emptyTitle: { fontSize: 16, fontFamily: F.bold, color: C.navy, marginTop: 12 },
  emptyText: { fontSize: 12, fontFamily: F.regular, color: C.muted, textAlign: 'center', marginTop: 5, lineHeight: 18 },
  primaryButton: {
    alignSelf: 'stretch',
    minHeight: 46,
    borderRadius: theme.radius.button,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontFamily: F.bold },

  // Vitrine dos planos
  tabs: { flexDirection: 'row', backgroundColor: C.divider, borderRadius: 12, padding: 4, marginTop: 10, marginBottom: 12 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 9 },
  tabActive: { backgroundColor: C.card },
  tabText: { fontSize: 12, fontFamily: F.semibold, color: C.muted },
  tabTextActive: { color: C.navy, fontFamily: F.bold },
  banner: { width: BANNER_WIDTH, height: BANNER_WIDTH / 2, borderRadius: 16 },
  featureCard: { paddingHorizontal: 14, marginTop: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 11 },
  featureText: { flex: 1, fontSize: 13, fontFamily: F.medium, color: C.navy },
  featureCount: { fontSize: 12, fontFamily: F.semibold, color: C.muted },
  planButton: {
    flexDirection: 'row',
    gap: 8,
    minHeight: 48,
    borderRadius: theme.radius.button,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  planButtonCurrent: { backgroundColor: C.primarySoft },
  planButtonText: { color: '#FFFFFF', fontSize: 14, fontFamily: F.bold },
});