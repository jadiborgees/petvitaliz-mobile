import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';
import PrivateHeader from '../../components/PrivateHeader';
import PetAvatar from '../../components/PetAvatar';
import { theme } from '../../theme/privateTheme';
import type { Pet } from './PrivatePetsFlowScreen';
import type { ConsultationAppointment } from './PrivateConsultationsScreen';
import {
  SERVICES,
  PLAN_COVERAGE,
  PLAN_NAMES,
  getPlanId,
  type ServiceId,
} from '../../data/planCoverage';

type PaymentMethod = 'card' | 'pix' | 'boleto';
type BillingCycle = 'monthly' | 'yearly';
type PaymentStatus = 'paid' | 'pending';

type PlanSubscription = {
  planId: string;
  planName: string;
  petName: string;
  billingCycle: BillingCycle;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  installments: number;
  status: PaymentStatus;
  startedAt?: string; // data da contratação (ISO)
  scheduledChange?: {
    planName: string;
    billingCycle: BillingCycle;
    effectiveDate: string;
  } | null;
};

type Invoice = {
  id: string;
  description: string;
  dueDate: string;
  amount: number;
  status: 'Paga' | 'Pendente';
};

interface Props {
  onBack?: () => void;
  onNavigateToHome: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans: () => void;
  onNavigateToBenefits: () => void;
  onNavigateToProfile: () => void;
  onNavigateToManagePlan?: () => void;
  onNavigateToPaymentMethods?: () => void;
  onNavigateToPets?: () => void;
  onNavigateToInvoices?: () => void;
  onNavigateToSchedule?: (petId: string) => void;
  onNavigateToChangePlan?: (petId: string) => void;
  subscription?: PlanSubscription | null;
  invoices?: Invoice[];
  appointments?: ConsultationAppointment[];
  onCancelSubscription?: () => void;
  pets: Pet[];
}

const C = theme.colors;
const F = theme.fonts;

const money = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const paymentLabel = (method: PaymentMethod) => {
  if (method === 'pix') return 'Pix';
  if (method === 'boleto') return 'Boleto';
  return 'Cartão de crédito';
};

const shortDate = (date: Date) =>
  date
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace(/\./g, '')
    .replace(/ de /g, ' ');

const SERVICE_ICONS: Record<ServiceId, keyof typeof Feather.glyphMap> = {
  banho_tosa: 'scissors',
  exames: 'activity',
  vacinacao: 'shield',
  emergencia: 'alert-circle',
  leva_busca: 'truck',
  consulta: 'heart',
};

function ActionRow({
  icon,
  title,
  onPress,
  danger,
  last,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  onPress?: () => void;
  danger?: boolean;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionRow, !last && styles.rowDivider]}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <Feather name={icon} size={19} color={danger ? C.danger : C.primary} />
      <Text style={[styles.actionTitle, danger && { color: C.danger }]}>{title}</Text>
      <Feather name="chevron-right" size={19} color="#9AA6B8" />
    </TouchableOpacity>
  );
}

export default function PrivateMyPlanScreen({
  onBack,
  onNavigateToHome,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  onNavigateToManagePlan,
  onNavigateToPets,
  onNavigateToInvoices,
  onNavigateToSchedule,
  onNavigateToChangePlan,
  subscription,
  appointments = [],
  onCancelSubscription,
  pets,
}: Props) {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(pets[0]?.id ?? null);

  // Se a lista mudar, mantém o pet selecionado se ele ainda existir.
  useEffect(() => {
    if (pets.length === 0) {
      setSelectedPetId(null);
    } else if (!pets.some((pet) => pet.id === selectedPetId)) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets, selectedPetId]);

  const selectedPet = useMemo(
    () => pets.find((pet) => pet.id === selectedPetId) ?? null,
    [pets, selectedPetId],
  );

  // O plano é por pet (N1).
  const planId = selectedPet?.hasActivePlan ? getPlanId(selectedPet.plan) : null;

  // Detalhes da cobrança, quando a assinatura salva é deste pet.
  const details =
    selectedPet &&
    subscription &&
    subscription.petName.trim().toLowerCase() === selectedPet.name.trim().toLowerCase()
      ? subscription
      : null;

  const isActive = !details || details.status === 'paid';

  // Uso do mês: agendamentos deste pet no mês atual, sem os cancelados.
  const usage = useMemo(() => {
    const now = new Date();
    const counts: Partial<Record<ServiceId, number>> = {};
    appointments.forEach((item) => {
      if (item.petId !== selectedPet?.id || item.status === 'cancelled') return;
      const [year, month] = item.date.split('-').map(Number);
      if (year !== now.getFullYear() || month !== now.getMonth() + 1) return;
      const id = item.serviceId ?? 'consulta';
      counts[id] = (counts[id] ?? 0) + 1;
    });
    return counts;
  }, [appointments, selectedPet?.id]);

  const coverage = planId ? PLAN_COVERAGE[planId] : {};
  const coveredServices = SERVICES.filter((service) => coverage[service.id] !== undefined);
  const lockedServices = SERVICES.filter((service) => coverage[service.id] === undefined);

  const consultaQuota = coverage.consulta;
  const consultaUsed = usage.consulta ?? 0;
  const consultaExhausted = typeof consultaQuota === 'number' && consultaUsed >= consultaQuota;

  // Preço exibido sempre por mês.
  const monthlyPrice = details
    ? details.billingCycle === 'yearly'
      ? details.totalPrice / 12
      : details.totalPrice
    : null;

  const paymentText = details
    ? details.paymentMethod === 'card'
      ? details.installments > 1
        ? `em ${details.installments}x no cartão`
        : 'no cartão'
      : `no ${paymentLabel(details.paymentMethod)}`
    : '';

  const renewalDate = useMemo(() => {
    if (!details?.startedAt) return null;
    const date = new Date(details.startedAt);
    if (details.billingCycle === 'yearly') date.setFullYear(date.getFullYear() + 1);
    else date.setMonth(date.getMonth() + 1);
    return shortDate(date);
  }, [details?.startedAt, details?.billingCycle]);

  const lockedText =
    lockedServices.length > 2
      ? `${lockedServices[0].name}, ${lockedServices[1].name.toLowerCase()} e mais`
      : lockedServices.map((service) => service.name).join(' e ');

  const goToChangePlan = () => {
    if (selectedPet && onNavigateToChangePlan) onNavigateToChangePlan(selectedPet.id);
    else onNavigateToPlans();
  };

  const confirmCancel = () => {
    Alert.alert(
      'Cancelar plano',
      'O cancelamento encerra a renovação. O acesso aos benefícios continua até o fim do ciclo já pago. Deseja continuar?',
      [
        { text: 'Manter plano', style: 'cancel' },
        { text: 'Continuar', style: 'destructive', onPress: () => onCancelSubscription?.() },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <PrivateHeader title="Meu Plano" onBack={onBack || onNavigateToHome} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {pets.length === 0 ? (
          <View style={[styles.card, styles.emptyCard]}>
            <PetAvatar size={72} />
            <Text style={styles.emptyTitle}>Você ainda não tem pets cadastrados</Text>
            <Text style={styles.emptyText}>
              Para consultar ou contratar um plano, primeiro cadastre seu pet.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={onNavigateToPets} activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>Cadastrar meu pet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Seletor de pets */}
            <Text style={styles.sectionTitle}>Seus pets</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.petList}
            >
              {pets.map((pet) => {
                const isSelected = pet.id === selectedPetId;
                const petPlan = pet.hasActivePlan ? getPlanId(pet.plan) : null;
                return (
                  <TouchableOpacity
                    key={pet.id}
                    style={[styles.petPill, isSelected && styles.petPillActive]}
                    onPress={() => setSelectedPetId(pet.id)}
                    activeOpacity={0.8}
                  >
                    <PetAvatar
                      species={pet.species}
                      avatar={pet.avatar}
                      size={32}
                      background={isSelected ? C.card : C.primarySoft}
                    />
                    <View>
                      <Text style={styles.petPillName} numberOfLines={1}>
                        {pet.name}
                      </Text>
                      <Text style={[styles.petPillPlan, { color: petPlan ? C.success : C.warning }]}>
                        {petPlan ? PLAN_NAMES[petPlan].replace('Plano ', '') : 'Sem plano'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {selectedPet && !planId && (
              /* Pet sem plano (E8) */
              <View style={[styles.card, styles.emptyCard]}>
                <PetAvatar species={selectedPet.species} avatar={selectedPet.avatar} size={72} />
                <View style={styles.noPlanBadge}>
                  <Text style={styles.noPlanBadgeText}>Sem plano</Text>
                </View>
                <Text style={styles.emptyTitle}>{selectedPet.name} ainda não tem plano</Text>
                <Text style={styles.emptyText}>
                  Contrate um plano para usar consultas, exames e banho e tosa.
                </Text>
                <TouchableOpacity style={styles.primaryButton} onPress={onNavigateToPlans} activeOpacity={0.85}>
                  <Text style={styles.primaryButtonText}>Contratar plano</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.textButton} onPress={onNavigateToPlans}>
                  <Text style={styles.textButtonLabel}>Comparar planos</Text>
                </TouchableOpacity>
              </View>
            )}

            {selectedPet && planId && (
              <>
                {/* Card do plano */}
                <View style={styles.card}>
                  <View style={styles.planTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.eyebrow}>Plano de {selectedPet.name}</Text>
                      <Text style={styles.planName}>{PLAN_NAMES[planId]}</Text>
                    </View>
                    <View style={[styles.statusBadge, !isActive && styles.pendingBadge]}>
                      <Text style={[styles.statusText, !isActive && { color: C.warning }]}>
                        {isActive ? 'Ativo' : 'Pendente'}
                      </Text>
                    </View>
                  </View>

                  {monthlyPrice !== null && details && (
                    <>
                      <Text style={styles.price}>
                        {money(monthlyPrice)}
                        <Text style={styles.priceUnit}> /mês</Text>
                      </Text>
                      <Text style={styles.priceNote}>
                        {details.billingCycle === 'yearly'
                          ? `Plano anual · ${money(details.totalPrice)} cobrado ${paymentText}`
                          : `Plano mensal · cobrado ${paymentText}`}
                      </Text>

                      <View style={styles.planInfo}>
                        {renewalDate && (
                          <View style={{ flex: 1 }}>
                            <Text style={styles.infoLabel}>Renova em</Text>
                            <Text style={styles.infoValue}>{renewalDate}</Text>
                          </View>
                        )}
                        <View style={{ flex: 1 }}>
                          <Text style={styles.infoLabel}>Pagamento</Text>
                          <Text style={styles.infoValue}>{paymentLabel(details.paymentMethod)}</Text>
                        </View>
                      </View>
                    </>
                  )}

                  {details?.scheduledChange && (
                    <View style={styles.scheduledBox}>
                      <Feather name="clock" size={14} color={C.navy} />
                      <Text style={styles.scheduledText}>
                        Muda para o {details.scheduledChange.planName} em{' '}
                        {shortDate(new Date(details.scheduledChange.effectiveDate))}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[styles.primaryButton, styles.scheduleButton, consultaExhausted && styles.disabledButton]}
                    onPress={() => onNavigateToSchedule?.(selectedPet.id)}
                    disabled={consultaExhausted}
                    activeOpacity={0.85}
                  >
                    <Feather name="calendar" size={17} color="#FFFFFF" />
                    <Text style={styles.primaryButtonText}>
                      {consultaExhausted ? 'Cota de consultas esgotada' : 'Agendar consulta'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Uso do mês */}
                <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Uso do mês</Text>
                <Text style={styles.sectionSubtitle}>As cotas renovam todo dia 1º</Text>
                <View style={[styles.card, styles.listCard]}>
                  {coveredServices.map((service, index) => {
                    const quota = coverage[service.id]!;
                    const used = usage[service.id] ?? 0;
                    const exhausted = typeof quota === 'number' && used >= quota;
                    const isLast = index === coveredServices.length - 1 && lockedServices.length === 0;
                    return (
                      <View key={service.id} style={[styles.usageRow, !isLast && styles.rowDivider]}>
                        <View style={styles.usageTop}>
                          <Feather name={SERVICE_ICONS[service.id]} size={15} color={C.primary} />
                          <Text style={styles.usageName}>{service.name}</Text>
                          <Text style={styles.usageCount}>
                            {quota === 'ilimitado' ? 'Ilimitado' : `${Math.min(used, quota)} de ${quota}`}
                          </Text>
                        </View>
                        {typeof quota === 'number' && (
                          <View style={styles.barTrack}>
                            <View
                              style={[
                                styles.barFill,
                                {
                                  width: `${Math.max(Math.min(used / quota, 1) * 100, 4)}%` as `${number}%`,
                                  backgroundColor: exhausted ? C.warning : C.primary,
                                },
                              ]}
                            />
                          </View>
                        )}
                        {exhausted && <Text style={styles.exhaustedText}>Cota esgotada este mês</Text>}
                      </View>
                    );
                  })}

                  {lockedServices.length > 0 && (
                    <TouchableOpacity style={styles.lockedRow} onPress={goToChangePlan} activeOpacity={0.75}>
                      <Feather name="lock" size={15} color={C.muted} />
                      <Text style={styles.lockedText} numberOfLines={1}>
                        {lockedText}
                      </Text>
                      <Text style={styles.lockedLink}>Mudar de plano</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Gerenciar assinatura */}
                <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Gerenciar assinatura</Text>
                <View style={[styles.card, styles.listCard]}>
                  <ActionRow icon="repeat" title="Mudar de plano" onPress={goToChangePlan} />
                  <ActionRow icon="sliders" title="Ciclo e forma de pagamento" onPress={onNavigateToManagePlan} />
                  <ActionRow icon="file-text" title="Ver faturas" onPress={onNavigateToInvoices} />
                  <ActionRow icon="x-circle" title="Cancelar plano" onPress={confirmCancel} danger last />
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>

      <PrivateBottomNav
        currentRoute="PrivateMyPlan"
        onNavigateToHome={onNavigateToHome}
        onNavigateToPlans={() => {}}
        onNavigateToBenefits={onNavigateToBenefits}
        onNavigateToProfile={onNavigateToProfile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  // Espaço no fim para nada ficar escondido atrás da barra inferior.
  scrollContent: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 130 },

  sectionTitle: { fontSize: 16, fontFamily: F.bold, color: C.navy },
  sectionSubtitle: { fontSize: 11, fontFamily: F.regular, color: C.muted, marginTop: 3, marginBottom: 10 },
  sectionSpacing: { marginTop: 24 },

  card: {
    backgroundColor: C.card,
    borderRadius: theme.radius.bigCard,
    borderWidth: 1,
    borderColor: C.border,
    padding: 18,
    elevation: 2,
    shadowColor: '#15294B',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  listCard: { paddingVertical: 2, paddingHorizontal: 15, borderRadius: theme.radius.card, marginTop: 10 },

  // Seletor de pets
  petList: { gap: 8, paddingTop: 10, paddingBottom: 18 },
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

  // Card do plano
  planTop: { flexDirection: 'row', alignItems: 'center' },
  eyebrow: { fontSize: 11, fontFamily: F.medium, color: C.muted },
  planName: { fontSize: 22, fontFamily: F.bold, color: C.navy, marginTop: 2 },
  statusBadge: { backgroundColor: '#E7F6EF', borderRadius: 12, paddingHorizontal: 11, paddingVertical: 4 },
  pendingBadge: { backgroundColor: '#FFF4DE' },
  statusText: { fontSize: 11, fontFamily: F.bold, color: C.success },
  price: { fontSize: 26, fontFamily: F.bold, color: C.primary, marginTop: 14 },
  priceUnit: { fontSize: 13, fontFamily: F.regular, color: C.muted },
  priceNote: { fontSize: 11, fontFamily: F.regular, color: C.muted, marginTop: 2 },
  planInfo: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: C.divider,
    marginTop: 14,
    paddingTop: 12,
  },
  infoLabel: { fontSize: 11, fontFamily: F.regular, color: C.muted },
  infoValue: { fontSize: 13, fontFamily: F.bold, color: C.navy, marginTop: 3 },

  scheduledBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.primarySoft,
    borderRadius: 10,
    padding: 10,
    marginTop: 14,
  },
  scheduledText: { flex: 1, fontSize: 12, fontFamily: F.medium, color: C.navy },

  // Botões
  primaryButton: {
    alignSelf: 'stretch',
    minHeight: 48,
    borderRadius: theme.radius.button,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  scheduleButton: { flexDirection: 'row', gap: 8 },
  disabledButton: { backgroundColor: '#A7B1C2' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 13, fontFamily: F.bold },
  textButton: { marginTop: 12, paddingVertical: 6 },
  textButtonLabel: { color: C.primary, fontSize: 13, fontFamily: F.bold },

  // Uso do mês
  usageRow: { paddingVertical: 12 },
  usageTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  usageName: { flex: 1, fontSize: 13, fontFamily: F.semibold, color: C.navy },
  usageCount: { fontSize: 12, fontFamily: F.medium, color: C.muted },
  barTrack: { height: 6, borderRadius: 3, backgroundColor: C.divider, marginTop: 8, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3 },
  exhaustedText: { fontSize: 11, fontFamily: F.medium, color: C.warning, marginTop: 5 },
  lockedRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 13 },
  lockedText: { flex: 1, fontSize: 12, fontFamily: F.regular, color: C.muted },
  lockedLink: { fontSize: 12, fontFamily: F.bold, color: C.primary },

  // Lista de ações
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15 },
  actionTitle: { flex: 1, fontSize: 13, fontFamily: F.semibold, color: C.navy },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: C.divider },

  // Estados vazios
  emptyCard: { alignItems: 'center', paddingVertical: 26 },
  emptyTitle: { fontSize: 17, fontFamily: F.bold, color: C.navy, textAlign: 'center', marginTop: 14 },
  emptyText: {
    fontSize: 12,
    fontFamily: F.regular,
    color: C.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    paddingHorizontal: 8,
  },
  noPlanBadge: { backgroundColor: '#FFF4DE', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3, marginTop: 10 },
  noPlanBadgeText: { fontSize: 10, fontFamily: F.bold, color: C.warning },
});