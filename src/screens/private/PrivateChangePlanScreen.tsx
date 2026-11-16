import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import PrivateHeader from '../../components/PrivateHeader';
import PetAvatar from '../../components/PetAvatar';
import { theme } from '../../theme/privateTheme';
import type { Pet } from './PrivatePetsFlowScreen';
import {
  PLAN_ORDER,
  PLAN_NAMES,
  getPlanId,
  getMonthlyPrice,
  getCyclePrice,
  getCoverageChanges,
  type PlanId,
  type BillingCycle,
} from '../../data/planCoverage';

type PaymentMethod = 'card' | 'pix' | 'boleto';

export type ChangePlanResult = {
  planId: PlanId;
  billingCycle: BillingCycle;
  appliesNow: boolean; // upgrade: vale hoje | plano menor: na renovação
  chargeNow: number;
  effectiveDate: string; // ISO
};

interface Props {
  pet: Pet;
  currentCycle?: BillingCycle;
  paymentMethod?: PaymentMethod;
  startedAt?: string;
  // Já abre com um plano/ciclo escolhido (ex.: troca de ciclo vinda de Gerenciar plano)
  initialPlanId?: PlanId;
  initialCycle?: BillingCycle;
  onBack?: () => void;
  onNavigateToPaymentMethods?: () => void;
  onConfirm: (result: ChangePlanResult) => void;
}

const C = theme.colors;
const F = theme.fonts;
const RECOMMENDED: PlanId = 'ouro';

const money = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const shortDate = (date: Date) =>
  date
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace(/\./g, '')
    .replace(/ de /g, ' ');

const paymentLabel = (method?: PaymentMethod) => {
  if (method === 'pix') return 'Pix';
  if (method === 'boleto') return 'Boleto';
  return 'Cartão de crédito';
};

export default function PrivateChangePlanScreen({
  pet,
  currentCycle = 'monthly',
  paymentMethod,
  startedAt,
  initialPlanId,
  initialCycle,
  onBack,
  onNavigateToPaymentMethods,
  onConfirm,
}: Props) {
  const currentPlan = getPlanId(pet.plan) ?? 'bronze';
  const currentIndex = PLAN_ORDER.indexOf(currentPlan);

  const hasPreset = !!initialPlanId && !!initialCycle;
  const [step, setStep] = useState<'choose' | 'confirm'>(hasPreset ? 'confirm' : 'choose');
  const [cycle, setCycle] = useState<BillingCycle>(initialCycle ?? currentCycle);
  const [selected, setSelected] = useState<PlanId>(
    initialPlanId ??
      (PLAN_ORDER[Math.min(currentIndex + 1, PLAN_ORDER.length - 1)] === currentPlan
        ? PLAN_ORDER[currentIndex - 1]
        : PLAN_ORDER[currentIndex + 1]),
  );

  const isSameAsCurrent = selected === currentPlan && cycle === currentCycle;
  const isUpgrade = PLAN_ORDER.indexOf(selected) > currentIndex;

  // Fim do ciclo atual e quanto dele ainda falta (0 a 1).
  const { renewalDate, remaining } = useMemo(() => {
    if (!startedAt) {
      const next = new Date();
      if (currentCycle === 'yearly') next.setFullYear(next.getFullYear() + 1);
      else next.setMonth(next.getMonth() + 1);
      return { renewalDate: next, remaining: 1 };
    }
    const start = new Date(startedAt);
    const end = new Date(startedAt);
    if (currentCycle === 'yearly') end.setFullYear(end.getFullYear() + 1);
    else end.setMonth(end.getMonth() + 1);
    const total = end.getTime() - start.getTime();
    const left = Math.min(Math.max(end.getTime() - Date.now(), 0), total);
    return { renewalDate: end, remaining: total > 0 ? left / total : 1 };
  }, [startedAt, currentCycle]);

  // Upgrade vale hoje e cobra só a diferença proporcional.
  // Plano menor (ou só troca de ciclo) vale na próxima renovação, sem cobrança agora.
  const chargeNow = useMemo(() => {
    if (!isUpgrade) return 0;
    const currentTotal = getCyclePrice(currentPlan, currentCycle);
    const newTotal = getCyclePrice(selected, cycle);
    const value =
      cycle === currentCycle
        ? (newTotal - currentTotal) * remaining
        : newTotal - currentTotal * remaining; // novo ciclo começa hoje, com crédito do que sobrou
    return Math.max(Math.round(value * 100) / 100, 0);
  }, [isUpgrade, currentPlan, currentCycle, selected, cycle, remaining]);

  const confirm = () => {
    onConfirm({
      planId: selected,
      billingCycle: cycle,
      appliesNow: isUpgrade,
      chargeNow,
      effectiveDate: (isUpgrade ? new Date() : renewalDate).toISOString(),
    });
  };

  const currentMonthly = getMonthlyPrice(currentPlan, cycle);

  return (
    <SafeAreaView style={styles.container}>
      <PrivateHeader
        title={step === 'choose' ? 'Mudar de plano' : 'Confirmar mudança'}
        onBack={step === 'confirm' && !hasPreset ? () => setStep('choose') : onBack}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {step === 'choose' ? (
          <>
            <View style={styles.petLine}>
              <PetAvatar species={pet.species} avatar={pet.avatar} size={30} />
              <Text style={styles.petLineText}>
                Plano de <Text style={styles.petLineName}>{pet.name}</Text>
              </Text>
            </View>

            {/* Mensal / Anual */}
            <View style={styles.toggle}>
              {(['monthly', 'yearly'] as BillingCycle[]).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.toggleOption, cycle === option && styles.toggleOptionActive]}
                  onPress={() => setCycle(option)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.toggleText, cycle === option && styles.toggleTextActive]}>
                    {option === 'monthly' ? 'Mensal' : 'Anual · até 18% off'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Planos */}
            {PLAN_ORDER.map((planId) => {
              const isCurrent = planId === currentPlan;
              const isSelected = planId === selected;
              const monthly = getMonthlyPrice(planId, cycle);
              const diff = monthly - currentMonthly;
              const { gains, losses } = getCoverageChanges(currentPlan, planId);

              return (
                <TouchableOpacity
                  key={planId}
                  style={[styles.planCard, isSelected && styles.planCardSelected]}
                  onPress={() => setSelected(planId)}
                  activeOpacity={0.85}
                >
                  <View style={styles.planRow}>
                    <View style={styles.planTitleRow}>
                      <Text style={styles.planName}>{PLAN_NAMES[planId].replace('Plano ', '')}</Text>
                      {planId === RECOMMENDED && !isCurrent && (
                        <View style={styles.recommendedBadge}>
                          <Text style={styles.recommendedText}>Recomendado</Text>
                        </View>
                      )}
                    </View>
                    {isCurrent ? (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>Plano atual</Text>
                      </View>
                    ) : (
                      <Text style={[styles.diffText, diff < 0 && { color: C.muted }]}>
                        {diff >= 0 ? '+ ' : '− '}
                        {money(Math.abs(diff))}/mês
                      </Text>
                    )}
                  </View>

                  <Text style={styles.planPrice}>
                    {money(monthly)}/mês
                    {cycle === 'yearly' ? ` · ${money(getCyclePrice(planId, 'yearly'))} por ano` : ''}
                  </Text>

                  {!isCurrent && gains.length > 0 && (
                    <Text style={styles.gainText}>+ {gains.join(' · ')}</Text>
                  )}
                  {!isCurrent && losses.length > 0 && (
                    <Text style={styles.lossText}>− {losses.join(' · ')}</Text>
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={[styles.primaryButton, isSameAsCurrent && styles.disabledButton]}
              disabled={isSameAsCurrent}
              onPress={() => setStep('confirm')}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>
                {isSameAsCurrent
                  ? 'Este já é o seu plano'
                  : selected === currentPlan
                    ? `Mudar para ${cycle === 'yearly' ? 'anual' : 'mensal'}`
                    : `Mudar para ${PLAN_NAMES[selected].replace('Plano ', '')}`}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* De → Para */}
            <View style={styles.card}>
              <View style={styles.fromTo}>
                <View style={styles.fromToSide}>
                  <Text style={styles.fromToLabel}>De</Text>
                  <Text style={styles.fromToPlan}>{PLAN_NAMES[currentPlan].replace('Plano ', '')}</Text>
                  <Text style={styles.fromToPrice}>{money(getMonthlyPrice(currentPlan, currentCycle))}/mês</Text>
                </View>
                <Feather name="arrow-right" size={22} color={C.primary} />
                <View style={styles.fromToSide}>
                  <Text style={styles.fromToLabel}>Para</Text>
                  <Text style={styles.fromToPlan}>{PLAN_NAMES[selected].replace('Plano ', '')}</Text>
                  <Text style={styles.fromToPrice}>{money(getMonthlyPrice(selected, cycle))}/mês</Text>
                </View>
              </View>

              <View style={styles.summary}>
                <SummaryRow label="Pet" value={pet.name} />
                <SummaryRow label="Ciclo" value={cycle === 'yearly' ? 'Anual' : 'Mensal'} />
                <SummaryRow label="Vale a partir de" value={isUpgrade ? 'Hoje' : shortDate(renewalDate)} />
                <SummaryRow label="Cobrado agora" value={money(chargeNow)} bold />
                <SummaryRow
                  label="Próximas cobranças"
                  value={
                    cycle === 'yearly'
                      ? `${money(getCyclePrice(selected, 'yearly'))}/ano`
                      : `${money(getCyclePrice(selected, 'monthly'))}/mês`
                  }
                />
              </View>
            </View>

            <View style={styles.infoBox}>
              <Feather name="info" size={15} color={C.navy} />
              <Text style={styles.infoText}>
                {isUpgrade
                  ? 'A mudança vale na hora: você paga só a diferença dos dias que faltam no ciclo atual.'
                  : `Você continua com o plano atual até ${shortDate(renewalDate)}. A troca acontece na próxima renovação, sem cobrança agora.`}
              </Text>
            </View>

            {chargeNow > 0 && (
              <>
                <Text style={styles.paymentLabel}>Pagamento</Text>
                <View style={styles.paymentRow}>
                  <Feather name="credit-card" size={17} color={C.primary} />
                  <Text style={styles.paymentText}>{paymentLabel(paymentMethod)}</Text>
                  <TouchableOpacity onPress={onNavigateToPaymentMethods}>
                    <Text style={styles.linkText}>Trocar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <TouchableOpacity style={styles.primaryButton} onPress={confirm} activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>Confirmar mudança</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.textButton} onPress={onBack}>
              <Text style={styles.linkText}>Manter plano atual</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, bold && { fontFamily: F.bold }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scrollContent: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 40 },

  petLine: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  petLineText: { fontSize: 13, fontFamily: F.regular, color: C.muted },
  petLineName: { fontFamily: F.bold, color: C.navy },

  toggle: { flexDirection: 'row', backgroundColor: C.divider, borderRadius: 12, padding: 4, marginBottom: 14 },
  toggleOption: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 9 },
  toggleOptionActive: { backgroundColor: C.card },
  toggleText: { fontSize: 12, fontFamily: F.semibold, color: C.muted },
  toggleTextActive: { color: C.navy, fontFamily: F.bold },

  planCard: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: theme.radius.card,
    padding: 14,
    marginBottom: 10,
  },
  planCardSelected: { borderColor: C.primary, borderWidth: 2 },
  planRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  planTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  planName: { fontSize: 16, fontFamily: F.bold, color: C.navy },
  recommendedBadge: { backgroundColor: '#FFF4DE', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  recommendedText: { fontSize: 10, fontFamily: F.bold, color: C.warning },
  currentBadge: { backgroundColor: C.primarySoft, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 3 },
  currentBadgeText: { fontSize: 11, fontFamily: F.bold, color: C.primary },
  diffText: { fontSize: 13, fontFamily: F.bold, color: C.primary },
  planPrice: { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 3 },
  gainText: { fontSize: 11, fontFamily: F.medium, color: C.success, marginTop: 7, lineHeight: 16 },
  lossText: { fontSize: 11, fontFamily: F.medium, color: C.danger, marginTop: 4, lineHeight: 16 },

  card: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: theme.radius.bigCard,
    padding: 16,
  },
  fromTo: { flexDirection: 'row', alignItems: 'center' },
  fromToSide: { flex: 1, alignItems: 'center' },
  fromToLabel: { fontSize: 11, fontFamily: F.regular, color: C.muted },
  fromToPlan: { fontSize: 17, fontFamily: F.bold, color: C.navy, marginTop: 2 },
  fromToPrice: { fontSize: 11, fontFamily: F.regular, color: C.muted, marginTop: 2 },
  summary: { borderTopWidth: 1, borderTopColor: C.divider, marginTop: 14, paddingTop: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  summaryLabel: { fontSize: 12, fontFamily: F.regular, color: C.muted },
  summaryValue: { fontSize: 12, fontFamily: F.semibold, color: C.navy },

  infoBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: C.primarySoft,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  infoText: { flex: 1, fontSize: 12, fontFamily: F.regular, color: C.navy, lineHeight: 18 },

  paymentLabel: { fontSize: 12, fontFamily: F.medium, color: C.muted, marginTop: 16, marginBottom: 6 },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 12,
  },
  paymentText: { flex: 1, fontSize: 13, fontFamily: F.semibold, color: C.navy },

  primaryButton: {
    minHeight: 48,
    borderRadius: theme.radius.button,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  disabledButton: { backgroundColor: '#A7B1C2' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 13, fontFamily: F.bold },
  textButton: { alignItems: 'center', paddingVertical: 14 },
  linkText: { fontSize: 13, fontFamily: F.bold, color: C.primary },
});