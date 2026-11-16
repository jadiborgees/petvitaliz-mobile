import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';
import PrivateHeader from '../../components/PrivateHeader';
import PetAvatar from '../../components/PetAvatar';
import { theme } from '../../theme/privateTheme';
import type { Pet } from './PrivatePetsFlowScreen';
import {
  PLAN_NAMES,
  getPlanId,
  getMonthlyPrice,
  type BillingCycle,
  type PlanId,
} from '../../data/planCoverage';

type PaymentMethod = 'card' | 'pix' | 'boleto';

type PlanSubscription = {
  petId: string;
  planId: string;
  planName: string;
  petName: string;
  billingCycle: BillingCycle;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  installments: number;
  status: 'paid' | 'pending';
  cardLast4?: string;
  startedAt?: string;
  scheduledChange?: { planName: string; effectiveDate: string } | null;
};

interface Props {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans: () => void;
  onNavigateToBenefits: () => void;
  onNavigateToProfile: () => void;
  onNavigateToPaymentMethods: () => void;
  onNavigateToChangePlan?: (petId: string, preset?: { planId: PlanId; cycle: BillingCycle }) => void;
  onCancelSubscription?: () => void;
  subscription?: PlanSubscription | null;
  pets: Pet[];
}

const C = theme.colors;
const F = theme.fonts;

const money = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const shortDate = (date: Date) =>
  date
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace(/\./g, '')
    .replace(/ de /g, ' ');

// Como cada forma de pagamento aparece.
const PAYMENT_INFO: Record<
  PaymentMethod,
  { label: string; icon: 'qrcode' | 'barcode' | 'credit-card-outline'; bg: string; color: string }
> = {
  pix: { label: 'Pix', icon: 'qrcode', bg: '#E7F6EF', color: '#16865B' },
  boleto: { label: 'Boleto', icon: 'barcode', bg: '#FFF4DE', color: '#B45309' },
  card: { label: 'Cartão de crédito', icon: 'credit-card-outline', bg: '#EAF0FF', color: '#183C98' },
};

export default function PrivateManagePlanScreen({
  onBack,
  onNavigateToHome,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  onNavigateToPaymentMethods,
  onNavigateToChangePlan,
  onCancelSubscription,
  subscription,
  pets,
}: Props) {
  const pet =
    pets.find((item) => item.id === subscription?.petId) ??
    pets.find((item) => item.name === subscription?.petName) ??
    null;
  const planId: PlanId | null = getPlanId(pet?.plan ?? subscription?.planName);

  const cycle: BillingCycle = subscription?.billingCycle ?? 'monthly';
  const method: PaymentMethod = subscription?.paymentMethod ?? 'card';
  const payment = PAYMENT_INFO[method];

  const paidAt = subscription?.startedAt ? new Date(subscription.startedAt) : null;
  const nextCharge = (() => {
    if (!paidAt) return null;
    const date = new Date(paidAt);
    if (cycle === 'yearly') date.setFullYear(date.getFullYear() + 1);
    else date.setMonth(date.getMonth() + 1);
    return date;
  })();

  // Linha de detalhe do pagamento usado na contratação.
  const paymentDetail = (() => {
    if (!subscription) return '';
    if (method === 'card') {
      const parts: string[] = [];
      if (subscription.cardLast4) parts.push(`Final ${subscription.cardLast4}`);
      parts.push(
        subscription.installments > 1
          ? `${subscription.installments}x de ${money(subscription.totalPrice / subscription.installments)}`
          : `À vista · ${money(subscription.totalPrice)}`,
      );
      return parts.join(' · ');
    }
    return `${paidAt ? `Pago em ${shortDate(paidAt)} · ` : ''}${money(subscription.totalPrice)}`;
  })();

  const chooseCycle = (option: BillingCycle) => {
    if (!pet || !planId || option === cycle) return;
    onNavigateToChangePlan?.(pet.id, { planId, cycle: option });
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
      <PrivateHeader title="Gerenciar plano" onBack={onBack} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {!pet || !planId || !subscription ? (
          <View style={[styles.card, styles.emptyCard]}>
            <PetAvatar size={64} />
            <Text style={styles.emptyTitle}>Nenhum plano para gerenciar</Text>
            <Text style={styles.emptyText}>Contrate um plano para um dos seus pets e ele aparece aqui.</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={onNavigateToPlans} activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>Ver planos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Resumo */}
            <View style={[styles.card, styles.summaryCard]}>
              <PetAvatar species={pet.species} avatar={pet.avatar} size={46} />
              <View style={{ flex: 1 }}>
                <Text style={styles.eyebrow}>Plano {pet.gender === 'Macho' ? 'do' : 'da'} {pet.name}</Text>
                <Text style={styles.planName}>{PLAN_NAMES[planId]}</Text>
                <Text style={styles.planPrice}>
                  {money(getMonthlyPrice(planId, cycle))}/mês · {cycle === 'yearly' ? 'anual' : 'mensal'}
                </Text>
              </View>
              <View style={[styles.statusBadge, subscription.status !== 'paid' && { backgroundColor: '#FFF4DE' }]}>
                <Text style={[styles.statusText, subscription.status !== 'paid' && { color: C.warning }]}>
                  {subscription.status === 'paid' ? 'Ativo' : 'Pendente'}
                </Text>
              </View>
            </View>

            {subscription.scheduledChange && (
              <View style={styles.infoBox}>
                <Feather name="clock" size={14} color={C.navy} />
                <Text style={styles.infoText}>
                  Muda para o {subscription.scheduledChange.planName} em{' '}
                  {shortDate(new Date(subscription.scheduledChange.effectiveDate))}
                </Text>
              </View>
            )}

            {/* Forma de pagamento usada na contratação */}
            <Text style={styles.sectionTitle}>Forma de pagamento</Text>
            <View style={styles.card}>
              <View style={styles.paymentRow}>
                <View style={[styles.paymentIcon, { backgroundColor: payment.bg }]}>
                  <MaterialCommunityIcons name={payment.icon} size={20} color={payment.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paymentLabel}>{payment.label}</Text>
                  <Text style={styles.paymentDetail}>{paymentDetail}</Text>
                </View>
              </View>
              {nextCharge && (
                <View style={styles.nextCharge}>
                  <Text style={styles.nextChargeLabel}>Próxima cobrança</Text>
                  <Text style={styles.nextChargeValue}>{shortDate(nextCharge)}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.outlineButton} onPress={onNavigateToPaymentMethods} activeOpacity={0.8}>
                <Text style={styles.outlineButtonText}>Alterar para a próxima cobrança</Text>
              </TouchableOpacity>
            </View>

            {/* Ciclo de cobrança */}
            <Text style={styles.sectionTitle}>Ciclo de cobrança</Text>
            <View style={styles.card}>
              <View style={styles.cycleRow}>
                {(['monthly', 'yearly'] as BillingCycle[]).map((option) => {
                  const isCurrent = option === cycle;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[styles.cycleOption, isCurrent && styles.cycleOptionActive]}
                      onPress={() => chooseCycle(option)}
                      activeOpacity={isCurrent ? 1 : 0.8}
                    >
                      {isCurrent && (
                        <View style={styles.currentTag}>
                          <Text style={styles.currentTagText}>Atual</Text>
                        </View>
                      )}
                      <Text style={styles.cycleTitle}>{option === 'yearly' ? 'Anual' : 'Mensal'}</Text>
                      <Text style={styles.cyclePrice}>{money(getMonthlyPrice(planId, option))}/mês</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.cycleNote}>
                <Feather name="info" size={13} color={C.muted} />
                <Text style={styles.cycleNoteText}>A troca de ciclo vale a partir da próxima renovação.</Text>
              </View>
            </View>

            {/* Ações */}
            <View style={[styles.card, styles.listCard]}>
              <TouchableOpacity
                style={[styles.actionRow, styles.rowDivider]}
                onPress={() => onNavigateToChangePlan?.(pet.id)}
                activeOpacity={0.75}
              >
                <Feather name="repeat" size={19} color={C.primary} />
                <Text style={styles.actionTitle}>Mudar de plano</Text>
                <Feather name="chevron-right" size={19} color="#9AA6B8" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionRow} onPress={confirmCancel} activeOpacity={0.75}>
                <Feather name="x-circle" size={19} color={C.danger} />
                <Text style={[styles.actionTitle, { color: C.danger }]}>Cancelar plano</Text>
                <Feather name="chevron-right" size={19} color="#9AA6B8" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <PrivateBottomNav
        currentRoute="PrivateManagePlan"
        onNavigateToHome={onNavigateToHome}
        onNavigateToPlans={onNavigateToPlans}
        onNavigateToBenefits={onNavigateToBenefits}
        onNavigateToProfile={onNavigateToProfile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scrollContent: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 130 },

  card: {
    backgroundColor: C.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
  },
  listCard: { paddingVertical: 2, marginTop: 22 },
  sectionTitle: { fontSize: 16, fontFamily: F.bold, color: C.navy, marginTop: 22, marginBottom: 10 },

  summaryCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: theme.radius.bigCard },
  eyebrow: { fontSize: 11, fontFamily: F.medium, color: C.muted },
  planName: { fontSize: 18, fontFamily: F.bold, color: C.navy, marginTop: 1 },
  planPrice: { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 2 },
  statusBadge: { backgroundColor: '#E7F6EF', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 },
  statusText: { fontSize: 11, fontFamily: F.bold, color: C.success },

  infoBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.primarySoft, borderRadius: 12, padding: 11, marginTop: 12 },
  infoText: { flex: 1, fontSize: 12, fontFamily: F.medium, color: C.navy },

  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  paymentIcon: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  paymentLabel: { fontSize: 14, fontFamily: F.bold, color: C.navy },
  paymentDetail: { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 2 },
  nextCharge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: C.divider,
    marginTop: 12,
    paddingTop: 10,
  },
  nextChargeLabel: { fontSize: 12, fontFamily: F.regular, color: C.muted },
  nextChargeValue: { fontSize: 12, fontFamily: F.bold, color: C.navy },
  outlineButton: {
    minHeight: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  outlineButtonText: { fontSize: 13, fontFamily: F.bold, color: C.primary },

  cycleRow: { flexDirection: 'row', gap: 10 },
  cycleOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  cycleOptionActive: { borderColor: C.primary, borderWidth: 1.5, backgroundColor: C.primarySoft },
  currentTag: {
    position: 'absolute',
    top: -9,
    right: 8,
    backgroundColor: C.primary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  currentTagText: { fontSize: 9, fontFamily: F.bold, color: '#FFFFFF' },
  cycleTitle: { fontSize: 13, fontFamily: F.bold, color: C.navy },
  cyclePrice: { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 2 },
  cycleNote: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  cycleNoteText: { flex: 1, fontSize: 11, fontFamily: F.regular, color: C.muted },

  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15 },
  actionTitle: { flex: 1, fontSize: 13, fontFamily: F.semibold, color: C.navy },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: C.divider },

  emptyCard: { alignItems: 'center', paddingVertical: 26 },
  emptyTitle: { fontSize: 16, fontFamily: F.bold, color: C.navy, marginTop: 12 },
  emptyText: { fontSize: 12, fontFamily: F.regular, color: C.muted, textAlign: 'center', marginTop: 5, lineHeight: 18 },
  primaryButton: {
    alignSelf: 'stretch',
    minHeight: 48,
    borderRadius: theme.radius.button,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontFamily: F.bold },
});