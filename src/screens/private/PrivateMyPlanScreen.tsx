import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';

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
};

type Invoice = {
  id: string;
  description: string;
  dueDate: string;
  amount: number;
  status: 'Paga' | 'Pendente';
};

type BenefitUsage = {
  name: string;
  used: number;
  limit: number | null;
};

interface Props {
  onBack?: () => void;
  onNavigateToHome: () => void;
  onNavigateToExplore: () => void;
  onNavigateToPlans: () => void;
  onNavigateToBenefits: () => void;
  onNavigateToProfile: () => void;
  onNavigateToManagePlan?: () => void;
  onNavigateToPaymentMethods?: () => void;
  onNavigateToPets?: () => void;
  onNavigateToInvoices?: () => void;
  subscription?: PlanSubscription | null;
  invoices?: Invoice[];
  benefitsUsage?: BenefitUsage[];
  nextBillingDate?: string;
  onCancelSubscription?: () => void;
}

const BLUE = '#315BA8';
const NAVY = '#183B72';
const MUTED = '#71809A';
const GREEN = '#16865B';

const money = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const paymentLabel = (method: PaymentMethod) => {
  if (method === 'pix') return 'Pix';
  if (method === 'boleto') return 'Boleto';
  return 'Cartão de crédito';
};

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {!!subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  );
}

function ActionRow({
  icon,
  title,
  description,
  onPress,
  danger,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description?: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.actionRow} activeOpacity={0.75} onPress={onPress}>
      <View style={[styles.actionIcon, danger && styles.dangerIcon]}>
        <Feather name={icon} size={19} color={danger ? '#C24141' : BLUE} />
      </View>
      <View style={styles.actionTextWrap}>
        <Text style={[styles.actionTitle, danger && styles.dangerText]}>{title}</Text>
        {!!description && <Text style={styles.actionDescription}>{description}</Text>}
      </View>
      <Feather name="chevron-right" size={19} color="#9AA6B8" />
    </TouchableOpacity>
  );
}

export default function PrivateMyPlanScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  onNavigateToManagePlan,
  onNavigateToPaymentMethods,
  onNavigateToPets,
  onNavigateToInvoices,
  subscription,
  invoices = [],
  benefitsUsage = [],
  nextBillingDate,
  onCancelSubscription,
}: Props) {
  const [showCoverage, setShowCoverage] = useState(true);
  const [showUsage, setShowUsage] = useState(false);
  const hasPlan = Boolean(subscription);
  const isActive = subscription?.status === 'paid';

  const priceLabel = useMemo(() => {
    if (!subscription) return '';
    if (subscription.billingCycle === 'yearly') {
      return `${money(subscription.totalPrice)} / ano`;
    }
    return `${money(subscription.totalPrice)} / mês`;
  }, [subscription]);

  const confirmCancel = () => {
    Alert.alert(
      'Cancelar plano',
      'O cancelamento encerra a renovação. Conforme as regras do PetVitaliz, o acesso aos benefícios continua até o fim do ciclo já pago. Deseja continuar?',
      [
        { text: 'Manter plano', style: 'cancel' },
        {
          text: 'Continuar',
          style: 'destructive',
          onPress: () => {
            if (onCancelSubscription) onCancelSubscription();
            else Alert.alert('Solicitação não enviada', 'A ação de cancelamento ainda precisa ser conectada ao backend.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack || onNavigateToHome}>
            <Feather name="arrow-left" size={22} color={NAVY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meu Plano</Text>
          <View style={styles.headerSpacer} />
        </View>

        {hasPlan && subscription ? (
          <>
            <View style={styles.planCard}>
              <View style={styles.planTopLine}>
                <View style={styles.petAvatar}>
                  <Image source={require('../../assets/Explorar2.png')} style={styles.petImage} />
                </View>
                <View style={styles.planIdentity}>
                  <Text style={styles.eyebrow}>PLANO PETVITALIZ</Text>
                  <Text style={styles.planName}>{subscription.planName}</Text>
                  <Text style={styles.petName}>Pet vinculado: {subscription.petName}</Text>
                </View>
                <View style={[styles.statusBadge, isActive ? styles.activeBadge : styles.pendingBadge]}>
                  <View style={[styles.statusDot, { backgroundColor: isActive ? GREEN : '#C17A00' }]} />
                  <Text style={[styles.statusText, { color: isActive ? GREEN : '#9A6200' }]}>
                    {isActive ? 'Ativo' : 'Pendente'}
                  </Text>
                </View>
              </View>
              <View style={styles.priceLine}>
                <Text style={styles.price}>{money(subscription.totalPrice)}</Text>
                <Text style={styles.priceCycle}>{subscription.billingCycle === 'yearly' ? 'valor anual' : 'por mês'}</Text>
              </View>
              <View style={styles.planDivider} />
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Ciclo</Text>
                  <Text style={styles.summaryValue}>{subscription.billingCycle === 'yearly' ? 'Anual' : 'Mensal'}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Pagamento</Text>
                  <Text style={styles.summaryValue}>{paymentLabel(subscription.paymentMethod)}</Text>
                </View>
                {!!nextBillingDate && (
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Próxima cobrança</Text>
                    <Text style={styles.summaryValue}>{nextBillingDate}</Text>
                  </View>
                )}
              </View>
              {subscription.billingCycle === 'yearly' && subscription.paymentMethod === 'card' && subscription.installments > 1 && (
                <Text style={styles.installmentText}>{subscription.installments} parcelas no cartão</Text>
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <SectionTitle title="Resumo da cobertura" subtitle="Benefícios vinculados ao plano deste pet" />
                <TouchableOpacity onPress={() => setShowCoverage((v) => !v)}>
                  <Feather name={showCoverage ? 'chevron-up' : 'chevron-down'} size={21} color={BLUE} />
                </TouchableOpacity>
              </View>
              {showCoverage && (
                <View style={styles.whiteCard}>
                  {benefitsUsage.length > 0 ? benefitsUsage.map((item, index) => (
                    <View key={`${item.name}-${index}`} style={styles.coverageRow}>
                      <View style={styles.coverageCheck}><Feather name="check" size={14} color={GREEN} /></View>
                      <View style={styles.coverageTextWrap}>
                        <Text style={styles.coverageName}>{item.name}</Text>
                        <Text style={styles.coverageCount}>
                          {item.limit === null ? 'Ilimitado' : `${Math.max(item.limit - item.used, 0)} de ${item.limit} disponíveis neste ciclo`}
                        </Text>
                      </View>
                      <Text style={styles.availableText}>Disponível</Text>
                    </View>
                  )) : (
                    <View style={styles.emptyInfo}>
                      <Text style={styles.emptyInfoText}>As coberturas e cotas serão exibidas aqui conforme os dados do plano forem disponibilizados.</Text>
                      <TouchableOpacity onPress={onNavigateToBenefits}>
                        <Text style={styles.inlineLink}>Consultar Benefícios</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <SectionTitle title="Gerenciar assinatura" subtitle="Acesse as configurações do seu plano" />
              <View style={styles.whiteCard}>
                <ActionRow icon="sliders" title="Gerenciar plano" description="Plano, ciclo de cobrança e cancelamento" onPress={onNavigateToManagePlan || (() => Alert.alert('Gerenciar plano', 'A tela Gerenciar Plano será conectada à navegação conforme o fluxo do PDF.'))} />
                <View style={styles.rowDivider} />
                <ActionRow icon="credit-card" title="Forma de pagamento" description="Consultar ou adicionar cartões" onPress={onNavigateToPaymentMethods || (() => Alert.alert('Formas de pagamento', 'Conecte esta ação à tela de Formas de Pagamento.'))} />
                <View style={styles.rowDivider} />
                <ActionRow icon="file-text" title="Ver faturas" description="Faturas pagas e pendentes" onPress={onNavigateToInvoices || (() => Alert.alert('Faturas', 'A tela de faturas será conectada na próxima etapa.'))} />
                <View style={styles.rowDivider} />
                <ActionRow icon="trending-up" title="Mudar de plano" description="Conhecer outras opções PetVitaliz" onPress={onNavigateToPlans} />
                <View style={styles.rowDivider} />
                <ActionRow icon="paw-print" title="Pets vinculados" description="Consultar os pets da sua conta" onPress={onNavigateToPets || (() => Alert.alert('Meus Pets', 'Conecte esta ação ao fluxo de Meus Pets.'))} />
                <View style={styles.rowDivider} />
                <ActionRow icon="x-circle" title="Cancelar plano" description="O acesso permanece até o fim do ciclo pago" onPress={confirmCancel} danger />
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <SectionTitle title="Histórico de utilização" subtitle="Acompanhe o uso das cotas do seu pet" />
                <TouchableOpacity onPress={() => setShowUsage((v) => !v)}>
                  <Feather name={showUsage ? 'chevron-up' : 'chevron-down'} size={21} color={BLUE} />
                </TouchableOpacity>
              </View>
              {showUsage && (
                <View style={styles.whiteCard}>
                  {benefitsUsage.length > 0 ? benefitsUsage.map((item, index) => (
                    <View key={`usage-${item.name}-${index}`} style={styles.usageRow}>
                      <Text style={styles.coverageName}>{item.name}</Text>
                      <Text style={styles.usageValue}>{item.limit === null ? `${item.used} utilizações` : `${item.used}/${item.limit}`}</Text>
                    </View>
                  )) : (
                    <Text style={styles.emptyInfoText}>Ainda não há registros de utilização disponíveis. Consulte Benefícios e Minhas Consultas para acompanhar os serviços.</Text>
                  )}
                  <TouchableOpacity style={styles.outlineButton} onPress={onNavigateToBenefits}>
                    <Text style={styles.outlineButtonText}>IR PARA BENEFÍCIOS</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        ) : (
          <View style={styles.noPlanCard}>
            <View style={styles.noPlanIcon}><MaterialCommunityIcons name="paw" size={44} color={BLUE} /></View>
            <Text style={styles.noPlanTitle}>Seu pet ainda não tem um plano</Text>
            <Text style={styles.noPlanDescription}>Escolha um plano PetVitaliz para acessar consultas, exames e outros benefícios disponíveis para seu pet.</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={onNavigateToPlans} activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>CONTRATAR PLANO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.textButton} onPress={onNavigateToPlans}>
              <Text style={styles.textButtonLabel}>Comparar planos</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <PrivateBottomNav
        currentRoute="PrivateMyPlan"
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
  container: { flex: 1, backgroundColor: '#F6F8FC' },
  scrollContent: { paddingBottom: 112 },
  header: { height: 62, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EEF1F6' },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 19, fontFamily: 'PlusJakartaSans_700Bold', color: NAVY },
  headerSpacer: { width: 40 },
  planCard: { backgroundColor: '#FFFFFF', marginHorizontal: 18, marginTop: 20, padding: 18, borderRadius: 20, borderWidth: 1, borderColor: '#E8EDF5', elevation: 2, shadowColor: '#15294B', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  planTopLine: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  petAvatar: { width: 66, height: 66, borderRadius: 33, overflow: 'hidden', backgroundColor: '#EAF0FF' },
  petImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  planIdentity: { flex: 1 },
  eyebrow: { fontSize: 9, letterSpacing: 1, color: '#8793A7', fontFamily: 'PlusJakartaSans_700Bold' },
  planName: { fontSize: 21, color: NAVY, marginTop: 3, fontFamily: 'PlusJakartaSans_700Bold' },
  petName: { fontSize: 11, color: MUTED, marginTop: 3, fontFamily: 'PlusJakartaSans_500Medium' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 20 },
  activeBadge: { backgroundColor: '#E8F7EF' },
  pendingBadge: { backgroundColor: '#FFF4DB' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold' },
  priceLine: { flexDirection: 'row', alignItems: 'baseline', gap: 7, marginTop: 20 },
  price: { fontSize: 28, color: BLUE, fontFamily: 'PlusJakartaSans_700Bold' },
  priceCycle: { fontSize: 12, color: MUTED, fontFamily: 'PlusJakartaSans_500Medium' },
  planDivider: { height: 1, backgroundColor: '#EDF0F5', marginVertical: 17 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 18 },
  summaryItem: { minWidth: '42%', flex: 1 },
  summaryLabel: { fontSize: 10, color: MUTED, marginBottom: 5, fontFamily: 'PlusJakartaSans_400Regular' },
  summaryValue: { fontSize: 12, color: '#263B5E', fontFamily: 'PlusJakartaSans_700Bold' },
  installmentText: { fontSize: 10, color: MUTED, marginTop: 13, fontFamily: 'PlusJakartaSans_500Medium' },
  section: { marginHorizontal: 18, marginTop: 23 },
  sectionHeading: { flex: 1 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, color: NAVY, fontFamily: 'PlusJakartaSans_700Bold' },
  sectionSubtitle: { fontSize: 10, color: MUTED, marginTop: 4, fontFamily: 'PlusJakartaSans_400Regular' },
  whiteCard: { backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 15, paddingVertical: 5, borderWidth: 1, borderColor: '#EDF0F5' },
  coverageRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 9 },
  coverageCheck: { width: 25, height: 25, borderRadius: 13, backgroundColor: '#E8F7EF', alignItems: 'center', justifyContent: 'center' },
  coverageTextWrap: { flex: 1 },
  coverageName: { fontSize: 12, color: '#263B5E', fontFamily: 'PlusJakartaSans_700Bold' },
  coverageCount: { fontSize: 10, color: MUTED, marginTop: 3, fontFamily: 'PlusJakartaSans_400Regular' },
  availableText: { color: GREEN, fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold' },
  emptyInfo: { paddingVertical: 15 },
  emptyInfoText: { fontSize: 11, lineHeight: 18, color: MUTED, fontFamily: 'PlusJakartaSans_400Regular' },
  inlineLink: { color: BLUE, fontSize: 11, marginTop: 10, fontFamily: 'PlusJakartaSans_700Bold' },
  actionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 11 },
  actionIcon: { width: 37, height: 37, borderRadius: 11, backgroundColor: '#EEF3FF', alignItems: 'center', justifyContent: 'center' },
  dangerIcon: { backgroundColor: '#FFF0F0' },
  actionTextWrap: { flex: 1 },
  actionTitle: { fontSize: 12, color: '#263B5E', fontFamily: 'PlusJakartaSans_700Bold' },
  actionDescription: { fontSize: 10, color: MUTED, marginTop: 3, fontFamily: 'PlusJakartaSans_400Regular' },
  dangerText: { color: '#C24141' },
  rowDivider: { height: 1, backgroundColor: '#F0F2F6', marginLeft: 48 },
  usageRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#F0F2F6' },
  usageValue: { fontSize: 12, color: BLUE, fontFamily: 'PlusJakartaSans_700Bold' },
  outlineButton: { borderWidth: 1, borderColor: BLUE, borderRadius: 11, minHeight: 44, alignItems: 'center', justifyContent: 'center', marginVertical: 13 },
  outlineButtonText: { color: BLUE, fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold' },
  noPlanCard: { backgroundColor: '#FFFFFF', marginHorizontal: 18, marginTop: 28, padding: 25, borderRadius: 20, alignItems: 'center' },
  noPlanIcon: { width: 86, height: 86, borderRadius: 43, backgroundColor: '#EAF0FF', alignItems: 'center', justifyContent: 'center', marginBottom: 19 },
  noPlanTitle: { fontSize: 19, color: NAVY, textAlign: 'center', fontFamily: 'PlusJakartaSans_700Bold' },
  noPlanDescription: { fontSize: 12, lineHeight: 19, color: MUTED, textAlign: 'center', marginTop: 10, marginBottom: 22, fontFamily: 'PlusJakartaSans_400Regular' },
  primaryButton: { backgroundColor: BLUE, width: '100%', minHeight: 49, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold' },
  textButton: { padding: 14 },
  textButtonLabel: { color: BLUE, fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold' },
});
