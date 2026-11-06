
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Platform,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';

type Step = 'showcase' | 'details' | 'payment' | 'loading' | 'success';
type BillingCycle = 'monthly' | 'yearly';
type PaymentMethod = 'card' | 'pix' | 'boleto';
type PaymentStatus = 'paid' | 'pending';

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: string;
  avatar: any;
}

interface Plan {
  id: string;
  tag: string;
  title: string;
  price: number;
  features: { text: string; count: string }[];
  extraFeatures: { text: string; count: string }[];
}

interface SubscriptionData {
  planId: string;
  planName: string;
  petName: string;
  billingCycle: BillingCycle;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  installments: number;
  status: PaymentStatus;
}

interface Props {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToMyPlan?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToAddPet?: () => void;
  onPurchaseComplete?: (data: SubscriptionData) => void;
}

const INTEREST_RATE = 0.0199;

const plansData: Record<BillingCycle, Plan[]> = {
  monthly: [
    {
      id: 'bronze',
      tag: 'BÁSICO',
      title: 'Plano Bronze',
      price: 139.90,
      features: [
        { text: 'Banho e Tosa', count: '2/mês' },
        { text: 'Atendimento Veterinário Básico', count: '1/mês' },
      ],
      extraFeatures: [
        { text: 'Desconto em Medicamentos', count: '10%' },
        { text: 'Histórico de Vacinas Digital', count: 'Inclui' },
      ],
    },
    {
      id: 'prata',
      tag: 'POPULAR',
      title: 'Plano Prata',
      price: 219.90,
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
      price: 399.90,
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
      price: 649.90,
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
      price: 125.91,
      features: [
        { text: 'Banho e Tosa', count: '2/mês' },
        { text: 'Atendimento Veterinário Básico', count: '1/mês' },
      ],
      extraFeatures: [
        { text: 'Desconto em Medicamentos', count: '10%' },
        { text: 'Histórico de Vacinas Digital', count: 'Inclui' },
      ],
    },
    {
      id: 'prata',
      tag: 'POPULAR',
      title: 'Plano Prata',
      price: 197.91,
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
      price: 359.91,
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
      price: 584.91,
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

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export default function PrivatePlansScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToMyPlan,
  onNavigateToBenefits,
  onNavigateToProfile,
  onNavigateToAddPet,
  onPurchaseComplete,
}: Props) {
  const [step, setStep] = useState<Step>('showcase');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState('ouro');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [installments, setInstallments] = useState(1);
  const [installmentsOpen, setInstallmentsOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [saveCard, setSaveCard] = useState(true);

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>('pending');

  // Dados demonstrativos. Substituir pelos pets retornados pela API.
  const [userPets] = useState<Pet[]>([
    {
      id: '1',
      name: 'Lua',
      type: 'Cachorro',
      breed: 'Golden Retriever',
      age: '4 anos',
      gender: 'Fêmea',
      avatar: require('../../assets/Explorar2.png'),
    },
  ]);

  const [selectedPetId, setSelectedPetId] = useState<string | null>(
    userPets.length === 1 ? userPets[0].id : null
  );

  const currentPlans = plansData[billingCycle];

  const activePlanObj =
    currentPlans.find((plan) => plan.id === selectedPlanId) ||
    currentPlans[2];

  const selectedPet = userPets.find(
    (pet) => pet.id === selectedPetId
  );

  const totalPrice = useMemo(
    () =>
      billingCycle === 'yearly'
        ? activePlanObj.price * 12
        : activePlanObj.price,
    [billingCycle, activePlanObj]
  );

  const installmentValue = useMemo(() => {
    if (installments <= 4) {
      return totalPrice / installments;
    }

    return (
      totalPrice *
      (INTEREST_RATE /
        (1 - Math.pow(1 + INTEREST_RATE, -installments)))
    );
  }, [totalPrice, installments]);

  const installmentTotal = installmentValue * installments;
  const interestAmount = installmentTotal - totalPrice;

  const finalPaymentTotal =
    billingCycle === 'yearly' && paymentMethod === 'card'
      ? installmentTotal
      : totalPrice;

  const formattedInstallment = formatCurrency(installmentValue);

  const changeBillingCycle = (cycle: BillingCycle) => {
    setBillingCycle(cycle);
    setInstallments(1);
    setInstallmentsOpen(false);
  };

  const handleBack = () => {
    if (step === 'details') {
      setStep('showcase');
    } else if (step === 'payment') {
      setStep('details');
    } else {
      onBack?.();
    }
  };

  const handleContinue = () => {
    if (!userPets.length) {
      Alert.alert(
        'Cadastre seu pet',
        'Cadastre um pet antes de contratar um plano.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Cadastrar pet', onPress: onNavigateToAddPet },
        ]
      );
      return;
    }

    if (!selectedPet) {
      Alert.alert('Selecione um pet', 'Escolha o pet que receberá o plano.');
      return;
    }

    if (!acceptedTerms) {
      Alert.alert('Termos de uso', 'Aceite os termos para continuar.');
      return;
    }

    setStep('payment');
  };

  const handlePayment = () => {
    if (!selectedPet) {
      Alert.alert('Atenção', 'Selecione um pet.');
      setStep('details');
      return;
    }

    if (!acceptedTerms) {
      Alert.alert('Atenção', 'Aceite os termos para continuar.');
      return;
    }

    if (paymentMethod === 'card') {
      if (
        !cardNumber.trim() ||
        !cardName.trim() ||
        !cardExpiry.trim() ||
        !cardCvv.trim()
      ) {
        Alert.alert('Dados incompletos', 'Preencha todos os dados do cartão.');
        return;
      }

      // Simulação: a aprovação real depende da integração com o gateway.
      setPaymentStatus('paid');
    } else {
      // Pix e boleto permanecem pendentes até a confirmação do gateway.
      setPaymentStatus('pending');
    }

    const subscription: SubscriptionData = {
      planId: activePlanObj.id,
      planName: activePlanObj.title,
      petName: selectedPet.name,
      billingCycle,
      paymentMethod,
      totalPrice: finalPaymentTotal,
      installments:
        billingCycle === 'yearly' && paymentMethod === 'card'
          ? installments
          : 1,
      status: paymentMethod === 'card' ? 'paid' : 'pending',
    };

    onPurchaseComplete?.(subscription);

    if (paymentMethod === 'pix' || paymentMethod === 'boleto') {
      setStep('loading');

      setTimeout(() => {
        onNavigateToMyPlan?.();
      }, 10000);

      return;
    }

    setStep('success');
  };

  const renderPetSelection = () => {
    if (userPets.length === 0) {
      return (
        <TouchableOpacity
          style={styles.addPetCard}
          onPress={onNavigateToAddPet}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle-outline" size={28} color="#21479B" />
          <View style={styles.petInfo}>
            <Text style={styles.petName}>Nenhum pet cadastrado</Text>
            <Text style={styles.petBreed}>
              Cadastre um pet para contratar um plano.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>
      );
    }

    return (
      <View>
        {userPets.length > 1 && (
          <Text style={styles.petSelectionDescription}>
            Selecione o pet que receberá o plano.
          </Text>
        )}

        {userPets.map((pet) => {
          const selected = selectedPetId === pet.id;

          return (
            <TouchableOpacity
              key={pet.id}
              style={[styles.petCard, selected && styles.selectedPetCard]}
              onPress={() => setSelectedPetId(pet.id)}
              activeOpacity={0.85}
            >
              <Image source={pet.avatar} style={styles.petAvatar} />
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petBreed}>
                  {pet.type} · {pet.breed}
                </Text>
                <Text style={styles.petAge}>
                  {pet.age} · {pet.gender}
                </Text>
              </View>
              <Ionicons
                name={selected ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={selected ? '#21479B' : '#94A3B8'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderPaymentMethod = (
    method: PaymentMethod,
    title: string,
    subtitle: string,
    icon: keyof typeof Ionicons.glyphMap
  ) => {
    const selected = paymentMethod === method;

    return (
      <TouchableOpacity
        key={method}
        style={[
          styles.paymentMethodCard,
          selected && styles.activePaymentCard,
        ]}
        onPress={() => {
          setPaymentMethod(method);
          setInstallments(1);
          setInstallmentsOpen(false);
        }}
        activeOpacity={0.85}
      >
        <Ionicons
          name={icon}
          size={24}
          color={selected ? '#FFFFFF' : '#21479B'}
        />
        <View style={styles.paymentMethodInfo}>
          <Text
            style={[
              styles.paymentMethodText,
              selected && styles.paymentMethodTextActive,
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.paymentMethodSubtitle,
              selected && styles.paymentMethodSubtitleActive,
            ]}
          >
            {subtitle}
          </Text>
        </View>
        <Ionicons
          name={selected ? 'radio-button-on' : 'radio-button-off'}
          size={21}
          color={selected ? '#FFFFFF' : '#94A3B8'}
        />
      </TouchableOpacity>
    );
  };

  const renderInstallments = () => (
    <>
      <Text style={styles.sectionLabel}>QUANTIDADE DE PARCELAS</Text>
      <View style={styles.installmentsContainer}>
        <Text style={styles.installmentsDescription}>
          Escolha em quantas vezes deseja pagar o plano anual.
        </Text>

        <TouchableOpacity
          style={styles.installmentDropdown}
          onPress={() => setInstallmentsOpen((value) => !value)}
          activeOpacity={0.85}
        >
          <View>
            <Text style={styles.installmentDropdownTitle}>
              {installments}x de {formattedInstallment}
            </Text>
            <Text style={styles.installmentDropdownSubtitle}>
              {installments <= 4
                ? 'Sem juros'
                : 'Com juros de 1,99% ao mês'}
            </Text>
          </View>
          <Ionicons
            name={installmentsOpen ? 'chevron-up' : 'chevron-down'}
            size={21}
            color="#21479B"
          />
        </TouchableOpacity>

        {installmentsOpen && (
          <View style={styles.installmentOptions}>
            {Array.from({ length: 12 }, (_, index) => index + 1).map(
              (number) => {
                const rate = number > 4 ? INTEREST_RATE : 0;
                const value =
                  rate === 0
                    ? totalPrice / number
                    : totalPrice *
                      (rate / (1 - Math.pow(1 + rate, -number)));

                const selected = installments === number;

                return (
                  <TouchableOpacity
                    key={number}
                    style={[
                      styles.installmentDropdownOption,
                      selected && styles.installmentDropdownOptionActive,
                    ]}
                    onPress={() => {
                      setInstallments(number);
                      setInstallmentsOpen(false);
                    }}
                  >
                    <View>
                      <Text
                        style={[
                          styles.installmentNumber,
                          selected && styles.installmentNumberActive,
                        ]}
                      >
                        {number}x de {formatCurrency(value)}
                      </Text>
                      <Text
                        style={[
                          styles.installmentOptionSubtitle,
                          selected && styles.installmentNumberActive,
                        ]}
                      >
                        {number <= 4 ? 'Sem juros' : 'Com juros'}
                      </Text>
                    </View>
                    {selected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={19}
                        color="#FFFFFF"
                      />
                    )}
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        )}

        <View style={styles.installmentResult}>
          <Text style={styles.installmentResultLabel}>
            {installments}x de
          </Text>
          <Text style={styles.installmentResultValue}>
            {formattedInstallment}
          </Text>
        </View>

        {installments > 4 && (
          <View style={styles.interestInfo}>
            <Text style={styles.interestText}>
              Juros: {formatCurrency(interestAmount)}
            </Text>
            <Text style={styles.interestText}>
              Total com juros: {formatCurrency(installmentTotal)}
            </Text>
          </View>
        )}

        <Text style={styles.installmentDisclaimer}>
          Até 4x sem juros. De 5x a 12x, juros de 1,99% ao mês.
        </Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        {step !== 'success' ? (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#21479B" />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}

        <Text style={styles.headerTitle}>
          {step === 'showcase' && 'Contratar Plano'}
          {step === 'details' && 'Detalhes do Plano'}
          {step === 'payment' && 'Pagamento'}
          {step === 'loading' && 'Preparando contratação'}
          {step === 'success' && 'Pagamento concluído'}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          step === 'success' && { flexGrow: 1 },
        ]}
      >
        {/* VITRINE DE PLANOS */}
        {step === 'showcase' && (
          <>
            <View style={styles.tabContainer}>
              {(['monthly', 'yearly'] as BillingCycle[]).map((cycle) => (
                <TouchableOpacity
                  key={cycle}
                  style={[
                    styles.tabButton,
                    billingCycle === cycle && styles.tabButtonActive,
                  ]}
                  onPress={() => changeBillingCycle(cycle)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      billingCycle === cycle && styles.tabTextActive,
                    ]}
                  >
                    {cycle === 'monthly' ? 'Mensal' : 'Anual · 10% OFF'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.cardsList}>
              {currentPlans.map((plan) => {
                const selected = selectedPlanId === plan.id;
                const recommended = plan.id === 'ouro';
                const features = selected
                  ? [...plan.features, ...plan.extraFeatures]
                  : plan.features;

                return (
                  <View
                    key={plan.id}
                    style={[
                      styles.card,
                      selected && styles.selectedCard,
                    ]}
                  >
                    <View style={styles.cardTopRow}>
                      <Text style={styles.cardTag}>{plan.tag}</Text>
                      {recommended && (
                        <View style={styles.recommendedBadge}>
                          <Ionicons name="star" size={11} color="#315BA8" />
                          <Text style={styles.recommendedText}>
                            RECOMENDADO
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.cardTitle}>{plan.title}</Text>
                      <View style={styles.priceContainer}>
                        <Text style={styles.cardPrice}>
                          {formatCurrency(plan.price)}
                        </Text>
                        <Text style={styles.cardPeriod}>/mês</Text>
                      </View>
                    </View>

                    <View style={styles.featuresList}>
                      {features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#10B981"
                          />
                          <Text style={styles.featureText}>
                            {feature.text}
                          </Text>
                          <Text style={styles.featureCount}>
                            {feature.count}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => {
                        setSelectedPlanId(plan.id);
                        setStep('details');
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.primaryButtonText}>
                        CONTRATAR
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* DETALHES DO PLANO */}
        {step === 'details' && (
          <>
            <Text style={styles.sectionLabel}>PET VINCULADO</Text>
            {renderPetSelection()}

            <Text style={styles.sectionLabel}>O QUE ESTÁ INCLUSO</Text>
            <View style={styles.detailsBox}>
              {[...activePlanObj.features, ...activePlanObj.extraFeatures].map(
                (item, index) => (
                  <View key={index} style={styles.detailRow}>
                    <View style={styles.detailRowLeft}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#10B981"
                      />
                      <Text style={styles.detailRowText}>{item.text}</Text>
                    </View>
                    <Text style={styles.detailRowMetric}>{item.count}</Text>
                  </View>
                )
              )}
            </View>

            <Text style={styles.sectionLabel}>CICLO DE COBRANÇA</Text>
            <View style={styles.cycleRow}>
              {(['monthly', 'yearly'] as BillingCycle[]).map((cycle) => {
                const plan = plansData[cycle].find(
                  (item) => item.id === selectedPlanId
                )!;

                return (
                  <TouchableOpacity
                    key={cycle}
                    style={[
                      styles.cycleBox,
                      billingCycle === cycle && styles.activeCycleBox,
                    ]}
                    onPress={() => changeBillingCycle(cycle)}
                  >
                    <View style={styles.cycleBoxHeader}>
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="#21479B"
                      />
                      {billingCycle === cycle && (
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color="#21479B"
                        />
                      )}
                    </View>
                    <Text style={styles.cycleTitle}>
                      {cycle === 'monthly' ? 'Mensal' : 'Anual · 10% OFF'}
                    </Text>
                    <Text style={styles.cyclePrice}>
                      {formatCurrency(plan.price)}
                      <Text style={styles.cyclePeriod}>/mês</Text>
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAcceptedTerms((value) => !value)}
            >
              <Ionicons
                name={acceptedTerms ? 'checkbox' : 'square-outline'}
                size={20}
                color="#21479B"
              />
              <Text style={styles.termsText}>
                Li e aceito os Termos de Uso e a Política de Privacidade.
              </Text>
            </TouchableOpacity>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Resumo da contratação</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pet</Text>
                <Text style={styles.summaryValue}>
                  {selectedPet?.name || 'Selecione um pet'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Plano</Text>
                <Text style={styles.summaryValue}>
                  {activePlanObj.title}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Cobrança</Text>
                <Text style={styles.summaryValue}>
                  {billingCycle === 'yearly' ? 'Anual' : 'Mensal'}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total</Text>
                <Text style={styles.summaryValueBold}>
                  {formatCurrency(totalPrice)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!selectedPet || !acceptedTerms) && styles.disabledButton,
              ]}
              disabled={!selectedPet || !acceptedTerms}
              onPress={handleContinue}
            >
              <Text style={styles.primaryButtonText}>
                CONTINUAR PARA PAGAMENTO
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* PAGAMENTO */}
        {step === 'payment' && (
          <>
            <View style={styles.checkoutPetCard}>
              {selectedPet && (
                <Image
                  source={selectedPet.avatar}
                  style={styles.checkoutPetAvatar}
                />
              )}
              <View style={styles.petInfo}>
                <Text style={styles.checkoutPetLabel}>PLANO PARA</Text>
                <Text style={styles.petName}>{selectedPet?.name}</Text>
                <Text style={styles.petBreed}>{activePlanObj.title}</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>FORMA DE PAGAMENTO</Text>
            <View style={styles.paymentMethodsCol}>
              {renderPaymentMethod(
                'card',
                'Cartão de crédito',
                'Pague com seu cartão',
                'card-outline'
              )}
              {renderPaymentMethod(
                'pix',
                'Pix',
                'Pagamento à vista',
                'qr-code-outline'
              )}
              {renderPaymentMethod(
                'boleto',
                'Boleto bancário',
                'Pagamento à vista',
                'barcode-outline'
              )}
            </View>

            {billingCycle === 'yearly' && paymentMethod === 'card' &&
              renderInstallments()}

            {paymentMethod === 'card' && (
              <>
                <Text style={styles.sectionLabel}>DADOS DO CARTÃO</Text>
                <View style={styles.cardForm}>
                  <Text style={styles.inputLabel}>Número do cartão</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0000 0000 0000 0000"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    maxLength={19}
                  />

                  <Text style={styles.inputLabel}>
                    Nome impresso no cartão
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="NOME COMPLETO"
                    placeholderTextColor="#94A3B8"
                    value={cardName}
                    onChangeText={setCardName}
                    autoCapitalize="characters"
                  />

                  <View style={styles.rowInputs}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>Validade</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="MM/AA"
                        placeholderTextColor="#94A3B8"
                        value={cardExpiry}
                        onChangeText={setCardExpiry}
                        maxLength={5}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>CVV</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="123"
                        placeholderTextColor="#94A3B8"
                        keyboardType="numeric"
                        secureTextEntry
                        value={cardCvv}
                        onChangeText={setCardCvv}
                        maxLength={4}
                      />
                    </View>
                  </View>

                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>
                      Salvar cartão para próximas cobranças
                    </Text>
                    <Switch
                      value={saveCard}
                      onValueChange={setSaveCard}
                      trackColor={{ false: '#CBD5E1', true: '#21479B' }}
                    />
                  </View>
                </View>
              </>
            )}

            {paymentMethod !== 'card' && (
              <View style={styles.paymentInfoBox}>
                <Ionicons
                  name={
                    paymentMethod === 'pix'
                      ? 'qr-code-outline'
                      : 'barcode-outline'
                  }
                  size={38}
                  color="#21479B"
                />
                <Text style={styles.paymentInfoTitle}>
                  {paymentMethod === 'pix' ? 'Pagamento via Pix' : 'Pagamento via boleto'}
                </Text>
                <Text style={styles.paymentInfoText}>
                  {paymentMethod === 'pix'
                    ? 'O QR Code e o código Pix serão disponibilizados após integração com o gateway.'
                    : 'O boleto bancário será disponibilizado após integração com o gateway.'}
                </Text>
                <Text style={styles.paymentInfoAmount}>
                  {formatCurrency(totalPrice)}
                </Text>
                <Text style={styles.paymentInfoHint}>
                  A contratação ficará pendente até a confirmação do pagamento.
                </Text>
              </View>
            )}

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Resumo do pagamento</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pet</Text>
                <Text style={styles.summaryValue}>{selectedPet?.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Plano</Text>
                <Text style={styles.summaryValue}>{activePlanObj.title}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Forma</Text>
                <Text style={styles.summaryValue}>
                  {paymentMethod === 'card'
                    ? 'Cartão de crédito'
                    : paymentMethod === 'pix'
                    ? 'Pix'
                    : 'Boleto'}
                </Text>
              </View>

              {billingCycle === 'yearly' && paymentMethod === 'card' && (
                <>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Parcelamento</Text>
                    <Text style={styles.summaryValue}>
                      {installments}x de {formattedInstallment}
                    </Text>
                  </View>
                  {installments > 4 && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Juros</Text>
                      <Text style={styles.summaryValue}>
                        {formatCurrency(interestAmount)}
                      </Text>
                    </View>
                  )}
                </>
              )}

              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Valor total</Text>
                <Text style={styles.summaryValueBold}>
                  {formatCurrency(finalPaymentTotal)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handlePayment}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>
                {paymentMethod === 'card'
                  ? 'CONFIRMAR PAGAMENTO'
                  : paymentMethod === 'pix'
                  ? 'GERAR PIX'
                  : 'GERAR BOLETO'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.securePaymentText}>
              <Ionicons name="lock-closed" size={12} color="#64748B" />{' '}
              Ambiente demonstrativo de pagamento.
            </Text>
          </>
        )}

        {/* CARREGAMENTO PARA PIX E BOLETO */}
        {step === 'loading' && (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingIconCircle}>
              <Ionicons
                name={paymentMethod === 'pix' ? 'qr-code-outline' : 'document-text-outline'}
                size={38}
                color="#21479B"
              />
            </View>

            <ActivityIndicator
              size="large"
              color="#21479B"
              style={styles.loadingSpinner}
            />

            <Text style={styles.loadingTitle}>
              Preparando sua contratação...
            </Text>

            <Text style={styles.loadingDescription}>
              Estamos organizando os dados do seu plano e preparando sua área
              de acompanhamento.
            </Text>

            <View style={styles.loadingInfoCard}>
              <Text style={styles.loadingInfoLabel}>PLANO SELECIONADO</Text>
              <Text style={styles.loadingInfoValue}>{activePlanObj.title}</Text>

              <View style={styles.summaryDivider} />

              <Text style={styles.loadingInfoLabel}>PET</Text>
              <Text style={styles.loadingInfoValue}>{selectedPet?.name}</Text>

              <View style={styles.summaryDivider} />

              <Text style={styles.loadingInfoLabel}>PAGAMENTO</Text>
              <Text style={styles.loadingInfoValue}>
                {paymentMethod === 'pix' ? 'Pix' : 'Boleto bancário'}
              </Text>

              <View style={styles.summaryDivider} />

              <Text style={styles.loadingInfoLabel}>VALOR</Text>
              <Text style={styles.loadingInfoValue}>
                {formatCurrency(finalPaymentTotal)}
              </Text>
            </View>

            <Text style={styles.loadingFooter}>
              Aguarde alguns instantes...
            </Text>
          </View>
        )}

        {/* CONFIRMAÇÃO */}
        {step === 'success' && (
          <View style={styles.successContainer}>
            <View style={styles.successTop}>
              <View
                style={[
                  styles.successIconCircle,
                  paymentStatus === 'pending' && styles.pendingIconCircle,
                ]}
              >
                <Ionicons
                  name={paymentStatus === 'paid' ? 'checkmark' : 'time-outline'}
                  size={36}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.successTitle}>
                {paymentStatus === 'paid'
                  ? 'Pagamento confirmado!'
                  : 'Estamos aguardando seu pagamento'}
              </Text>

              <Text style={styles.successSubtitle}>
                {paymentStatus === 'paid'
                  ? `A simulação da contratação do ${activePlanObj.title} para ${selectedPet?.name} foi concluída.`
                  : `Sua solicitação do ${activePlanObj.title} para ${selectedPet?.name} foi registrada. A ativação acontecerá após a confirmação do pagamento.`}
              </Text>
            </View>

            <View style={styles.successDetailsCard}>
              <Text style={styles.successSectionTitle}>
                Resumo da contratação
              </Text>

              <View style={styles.successInfoRow}>
                <Ionicons name="paw" size={21} color="#21479B" />
                <View style={styles.successInfoContent}>
                  <Text style={styles.successInfoLabel}>Pet vinculado</Text>
                  <Text style={styles.successInfoValue}>
                    {selectedPet?.name}
                  </Text>
                </View>
              </View>

              <View style={styles.successInfoRow}>
                <Ionicons
                  name="shield-checkmark"
                  size={21}
                  color="#21479B"
                />
                <View style={styles.successInfoContent}>
                  <Text style={styles.successInfoLabel}>Plano contratado</Text>
                  <Text style={styles.successInfoValue}>
                    {activePlanObj.title}
                  </Text>
                </View>
              </View>

              <View style={styles.successInfoRow}>
                <Ionicons
                  name={
                    paymentMethod === 'pix'
                      ? 'qr-code'
                      : paymentMethod === 'boleto'
                      ? 'barcode'
                      : 'card'
                  }
                  size={21}
                  color="#21479B"
                />
                <View style={styles.successInfoContent}>
                  <Text style={styles.successInfoLabel}>Pagamento</Text>
                  <Text style={styles.successInfoValue}>
                    {paymentMethod === 'card'
                      ? 'Cartão de crédito'
                      : paymentMethod === 'pix'
                      ? 'Pix'
                      : 'Boleto bancário'}
                  </Text>
                </View>
              </View>

              <View style={styles.summaryDivider} />
              <View style={styles.successTotalRow}>
                <Text style={styles.successTotalLabel}>Valor total</Text>
                <Text style={styles.successTotalValue}>
                  {formatCurrency(finalPaymentTotal)}
                </Text>
              </View>

              {billingCycle === 'yearly' && paymentMethod === 'card' && (
                <Text style={styles.successInstallmentText}>
                  {installments}x de {formattedInstallment}
                </Text>
              )}
            </View>

            <View style={styles.successNextSteps}>
              <Text style={styles.successSectionTitle}>Próximos passos</Text>
              <View style={styles.successStepRow}>
                <Ionicons name="checkmark-circle" size={19} color="#16A36A" />
                <Text style={styles.successStepText}>
                  Solicitação registrada
                </Text>
              </View>
              <View style={styles.successStepRow}>
                <Ionicons
                  name={paymentStatus === 'paid' ? 'checkmark-circle' : 'time'}
                  size={19}
                  color={paymentStatus === 'paid' ? '#16A36A' : '#D98200'}
                />
                <Text style={styles.successStepText}>
                  {paymentStatus === 'paid'
                    ? 'Pagamento aprovado na simulação'
                    : 'Aguardando confirmação do pagamento'}
                </Text>
              </View>
              <View style={styles.successStepRow}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={19}
                  color="#94A3B8"
                />
                <Text style={styles.successStepText}>
                  Ativação do plano após confirmação
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => {
                if (onNavigateToMyPlan) {
                  onNavigateToMyPlan();
                } else {
                  Alert.alert(
                    'Navegação indisponível',
                    'A rota Meu Plano não foi configurada no AppNavigator.'
                  );
                }
              }}
            >
              <Text style={styles.primaryButtonText}>
                ACOMPANHAR MEU PLANO
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <PrivateBottomNav
        currentRoute="PrivatePlans"
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop:
      Platform.OS === 'android'
        ? (StatusBar.currentHeight || 24) + 8
        : 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 32,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#21479B',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#21479B',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#21479B',
    fontWeight: '800',
  },
  cardsList: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#DCE4EF',
    marginBottom: 2,
    shadowColor: '#183B72',
    shadowOpacity: 0.045,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  selectedCard: {
    backgroundColor: '#F8FAFF',
    borderColor: '#315BA8',
    borderWidth: 1.5,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },
  cardTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAF0FF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },
  recommendedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#315BA8',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#263650',
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#21479B',
  },
  cardPeriod: {
    fontSize: 10,
    color: '#8490A2',
  },
  featuresList: {
    gap: 10,
    marginBottom: 17,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 11,
    color: '#475569',
  },
  featureCount: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#21479B',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#CBD5E1',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8996AA',
    marginBottom: 10,
    marginTop: 19,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  selectedPetCard: {
    borderColor: '#315BA8',
    backgroundColor: '#F8FAFF',
  },
  petAvatar: {
    width: 50,
    height: 50,
    borderRadius: 13,
  },
  petInfo: {
    flex: 1,
    marginLeft: 12,
  },
  petName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#263650',
  },
  petBreed: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
  },
  petAge: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  petSelectionDescription: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  addPetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    borderRadius: 15,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
  },
  detailsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    gap: 13,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  detailRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  detailRowText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
  },
  detailRowMetric: {
    fontSize: 11,
    color: '#64748B',
  },
  cycleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cycleBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeCycleBox: {
    borderColor: '#315BA8',
    backgroundColor: '#F8FAFF',
    borderWidth: 1.5,
  },
  cycleBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cycleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#263650',
  },
  cyclePrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#21479B',
    marginTop: 7,
  },
  cyclePeriod: {
    fontSize: 10,
    color: '#64748B',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginVertical: 16,
  },
  termsText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 17,
    gap: 11,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#183B72',
    marginBottom: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  summaryValue: {
    fontSize: 12,
    color: '#263650',
    fontWeight: '600',
    textAlign: 'right',
  },
  summaryValueBold: {
    fontSize: 15,
    color: '#21479B',
    fontWeight: '800',
    textAlign: 'right',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  checkoutPetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  checkoutPetAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  checkoutPetLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 4,
  },
  paymentMethodsCol: {
    gap: 10,
    marginBottom: 8,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  activePaymentCard: {
    backgroundColor: '#F0F5FF',
    borderColor: '#315BA8',
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  paymentMethodTextActive: {
    color: '#21479B',
  },
  paymentMethodSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 3,
  },
  paymentMethodSubtitleActive: {
    color: '#64748B',
  },
  installmentsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 14,
  },
  installmentsDescription: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  installmentDropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  installmentDropdownTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#21479B',
  },
  installmentDropdownSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  installmentOptions: {
    marginTop: 8,
    gap: 7,
  },
  installmentDropdownOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  installmentDropdownOptionActive: {
    backgroundColor: '#21479B',
    borderColor: '#21479B',
  },
  installmentNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  installmentNumberActive: {
    color: '#FFFFFF',
  },
  installmentOptionSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 3,
  },
  installmentResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  installmentResultLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  installmentResultValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#21479B',
  },
  interestInfo: {
    marginTop: 10,
    gap: 5,
  },
  interestText: {
    fontSize: 11,
    color: '#475569',
  },
  installmentDisclaimer: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 9,
    lineHeight: 15,
  },
  cardForm: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 46,
    color: '#0F172A',
    fontSize: 13,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    gap: 10,
  },
  switchLabel: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  paymentInfoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  paymentInfoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#263650',
  },
  paymentInfoText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
  },
  paymentInfoAmount: {
    fontSize: 21,
    fontWeight: '800',
    color: '#21479B',
  },
  paymentInfoHint: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
  securePaymentText: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 45,
    paddingBottom: 45,
  },
  loadingIconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#F0F5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  loadingSpinner: {
    marginBottom: 22,
  },
  loadingTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#183B72',
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingDescription: {
    fontSize: 12,
    lineHeight: 19,
    color: '#748096',
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 12,
  },
  loadingInfoCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    gap: 9,
  },
  loadingInfoLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
  },
  loadingInfoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#263650',
  },
  loadingFooter: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 22,
  },
  successContainer: {
    width: '100%',
    paddingTop: 18,
    paddingBottom: 25,
  },
  successTop: {
    alignItems: 'center',
    marginBottom: 22,
  },
  successIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#16A36A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 17,
  },
  pendingIconCircle: {
    backgroundColor: '#E08300',
  },
  successTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#17233F',
    textAlign: 'center',
    marginBottom: 9,
  },
  successSubtitle: {
    fontSize: 12,
    lineHeight: 19,
    color: '#748096',
    textAlign: 'center',
  },
  successDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    marginBottom: 14,
  },
  successSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#183B72',
    marginBottom: 15,
  },
  successInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 12,
  },
  successInfoContent: {
    flex: 1,
  },
  successInfoLabel: {
    fontSize: 10,
    color: '#8995A8',
    marginBottom: 3,
  },
  successInfoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#263650',
  },
  successTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successTotalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#46546D',
  },
  successTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#21479B',
  },
  successInstallmentText: {
    textAlign: 'right',
    fontSize: 11,
    color: '#64748B',
    marginTop: 5,
  },
  successNextSteps: {
    backgroundColor: '#FFF8EB',
    borderRadius: 16,
    padding: 17,
    marginBottom: 17,
  },
  successStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  successStepText: {
    fontSize: 11,
    color: '#536176',
    flex: 1,
  },
});
