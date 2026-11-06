
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';

type BillingCycle = 'monthly' | 'yearly';

interface PlanSubscription {
  planId: string;
  planName: string;
  petName: string;
  billingCycle: BillingCycle;
  paymentMethod: 'card' | 'pix' | 'boleto';
  totalPrice: number;
  installments: number;
  status: 'paid' | 'pending';
}

interface Props {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToExplore: () => void;
  onNavigateToPlans: () => void;
  onNavigateToBenefits: () => void;
  onNavigateToProfile: () => void;
  onNavigateToPaymentMethods: () => void;
  subscription?: PlanSubscription | null;
  onChangeBillingCycle?: (cycle: BillingCycle) => void;
  onCancelSubscription?: () => void;
}

const BLUE = '#315BA8';
const NAVY = '#183B72';
const MUTED = '#71809A';

const money = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export default function PrivateManagePlanScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  onNavigateToPaymentMethods,
  subscription,
  onChangeBillingCycle,
  onCancelSubscription,
}: Props) {
  const confirmCancel = () => {
    Alert.alert(
      'Cancelar plano',
      'Seu acesso aos benefícios continuará até o final do ciclo já pago. Deseja realmente cancelar a renovação?',
      [
        {
          text: 'Manter plano',
          style: 'cancel',
        },
        {
          text: 'Cancelar plano',
          style: 'destructive',
          onPress: () => {
            if (onCancelSubscription) {
              onCancelSubscription();
            } else {
              Alert.alert(
                'Atenção',
                'O cancelamento ainda precisa ser conectado ao backend.'
              );
            }
          },
        },
      ]
    );
  };

  const isYearly = subscription?.billingCycle === 'yearly';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color={NAVY} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Gerenciar plano</Text>

          <View style={{ width: 40 }} />
        </View>

        {!subscription ? (
          <View style={styles.emptyCard}>
            <Feather name="alert-circle" size={40} color={BLUE} />
            <Text style={styles.emptyTitle}>Nenhum plano encontrado</Text>
            <Text style={styles.emptyDescription}>
              Seu pet ainda não possui uma assinatura ativa.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onNavigateToPlans}
            >
              <Text style={styles.primaryButtonText}>CONHECER PLANOS</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.intro}>
              <Text style={styles.title}>Sua assinatura</Text>
              <Text style={styles.subtitle}>
                Gerencie as configurações do plano do seu pet.
              </Text>
            </View>

            <View style={styles.planCard}>
              <View style={styles.planIcon}>
                <Feather name="shield" size={25} color={BLUE} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.planLabel}>PLANO CONTRATADO</Text>
                <Text style={styles.planName}>{subscription.planName}</Text>
                <Text style={styles.petName}>
                  Pet vinculado: {subscription.petName}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  subscription.status === 'paid'
                    ? styles.activeBadge
                    : styles.pendingBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        subscription.status === 'paid'
                          ? '#16865B'
                          : '#9A6200',
                    },
                  ]}
                >
                  {subscription.status === 'paid' ? 'Ativo' : 'Pendente'}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Mudar plano</Text>

            <TouchableOpacity
              style={styles.optionCard}
              activeOpacity={0.75}
              onPress={onNavigateToPlans}
            >
              <View style={styles.optionIcon}>
                <Feather name="refresh-cw" size={20} color={BLUE} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>Conhecer outros planos</Text>
                <Text style={styles.optionDescription}>
                  Compare as opções disponíveis para seu pet.
                </Text>
              </View>

              <Feather name="chevron-right" size={21} color="#9AA6B8" />
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Ciclo de cobrança</Text>

            <View style={styles.billingCard}>
              <Text style={styles.optionTitle}>Seu ciclo atual</Text>

              <Text style={styles.billingDescription}>
                {isYearly ? 'Cobrança anual' : 'Cobrança mensal'}
              </Text>

              <View style={styles.cycleOptions}>
                <TouchableOpacity
                  style={[
                    styles.cycleButton,
                    !isYearly && styles.cycleButtonSelected,
                  ]}
                  onPress={() => onChangeBillingCycle?.('monthly')}
                >
                  <Text
                    style={[
                      styles.cycleText,
                      !isYearly && styles.cycleTextSelected,
                    ]}
                  >
                    Mensal
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.cycleButton,
                    isYearly && styles.cycleButtonSelected,
                  ]}
                  onPress={() => onChangeBillingCycle?.('yearly')}
                >
                  <Text
                    style={[
                      styles.cycleText,
                      isYearly && styles.cycleTextSelected,
                    ]}
                  >
                    Anual
                  </Text>
                  <Text style={styles.discountText}>10% OFF</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.cycleHint}>
                A alteração do ciclo precisa ser confirmada no fluxo de cobrança.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Forma de pagamento</Text>

            <TouchableOpacity
              style={styles.optionCard}
              activeOpacity={0.75}
              onPress={onNavigateToPaymentMethods}
            >
              <View style={styles.optionIcon}>
                <Feather name="credit-card" size={20} color={BLUE} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>Cartão de crédito</Text>
                <Text style={styles.optionDescription}>
                  Consulte ou adicione seus cartões.
                </Text>
              </View>

              <Feather name="chevron-right" size={21} color="#9AA6B8" />
            </TouchableOpacity>

            <View style={styles.cancelCard}>
              <View style={styles.cancelHeader}>
                <Feather name="alert-circle" size={20} color="#C24141" />
                <Text style={styles.cancelTitle}>Cancelar plano</Text>
              </View>

              <Text style={styles.cancelDescription}>
                Ao cancelar, a renovação será interrompida. Você continuará
                tendo acesso aos benefícios até o fim do período já pago.
              </Text>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={confirmCancel}
              >
                <Text style={styles.cancelButtonText}>CANCELAR ASSINATURA</Text>
              </TouchableOpacity>
            </View>
          </>
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
  container: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    height: 62,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F6',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    color: NAVY,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  intro: {
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 18,
  },
  title: {
    fontSize: 21,
    color: NAVY,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  subtitle: {
    fontSize: 12,
    color: MUTED,
    marginTop: 6,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    padding: 17,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E8EDF5',
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planLabel: {
    fontSize: 9,
    color: MUTED,
    letterSpacing: 1,
  },
  planName: {
    fontSize: 18,
    color: NAVY,
    marginTop: 3,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  petName: {
    fontSize: 10,
    color: MUTED,
    marginTop: 3,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 15,
  },
  activeBadge: {
    backgroundColor: '#E8F7EF',
  },
  pendingBadge: {
    backgroundColor: '#FFF4DB',
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  sectionTitle: {
    fontSize: 15,
    color: NAVY,
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    padding: 16,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#EDF0F5',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 12,
    color: '#263B5E',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  optionDescription: {
    fontSize: 10,
    color: MUTED,
    marginTop: 4,
    lineHeight: 15,
  },
  billingCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    padding: 17,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#EDF0F5',
  },
  billingDescription: {
    fontSize: 11,
    color: MUTED,
    marginTop: 5,
  },
  cycleOptions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  cycleButton: {
    flex: 1,
    minHeight: 45,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#E1E7F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleButtonSelected: {
    backgroundColor: '#EEF3FF',
    borderColor: BLUE,
  },
  cycleText: {
    fontSize: 12,
    color: MUTED,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  cycleTextSelected: {
    color: BLUE,
  },
  discountText: {
    fontSize: 9,
    color: '#16865B',
    marginTop: 2,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  cycleHint: {
    fontSize: 10,
    color: MUTED,
    lineHeight: 16,
    marginTop: 12,
  },
  cancelCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginTop: 27,
    padding: 17,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F2DEDE',
  },
  cancelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  cancelTitle: {
    fontSize: 14,
    color: '#C24141',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  cancelDescription: {
    fontSize: 11,
    lineHeight: 18,
    color: MUTED,
    marginTop: 11,
  },
  cancelButton: {
    height: 45,
    borderRadius: 11,
    backgroundColor: '#C24141',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 25,
    borderRadius: 18,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 17,
    color: NAVY,
    marginTop: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  emptyDescription: {
    fontSize: 12,
    color: MUTED,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  primaryButton: {
    width: '100%',
    minHeight: 48,
    borderRadius: 11,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
