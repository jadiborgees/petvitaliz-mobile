import React, { useMemo, useState, useEffect, useRef } from 'react';
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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';
import { getSpeciesIcon } from '../../components/PetAvatar';
import PrivateHeader from '../../components/PrivateHeader';
import { theme } from '../../theme/privateTheme';
import { PLAN_FEATURES, PLAN_NAMES, PLAN_ORDER, type PlanId } from '../../data/planCoverage';
import type { Pet } from './PrivatePetsFlowScreen';

type Step = 'showcase' | 'details' | 'payment' | 'loading' | 'success';
type BillingCycle = 'monthly' | 'yearly';
type PaymentMethod = 'card' | 'pix' | 'boleto';
type PaymentStatus = 'paid' | 'pending';

interface Plan {
  id: string;
  tag: string;
  title: string;
  price: number;
  features: { text: string; count: string }[];
  extraFeatures: { text: string; count: string }[];
}

interface SubscriptionData {
  petId: string;
  planId: string;
  planName: string;
  petName: string;
  billingCycle: BillingCycle;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  installments: number;
  status: PaymentStatus;
  cardLast4?: string; // só os 4 últimos dígitos do cartão
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
  pets: Pet[];
  initialPetId?: string | null; // pet já escolhido ao abrir (ex.: vindo de Meus Pets)
  initialPlanId?: string | null; // plano já escolhido ao abrir (ex.: tocando num banner)
  onPurchaseComplete?: (data: SubscriptionData) => void;
}

const INTEREST_RATE = 0.0199;

// Modo de teste: Pix e boleto mostram uma tela de carregamento
// e depois ativam o plano automaticamente.
// Para mudar o tempo de espera, altere o valor abaixo (em milissegundos).
const PIX_BOLETO_TEST_DELAY_MS = 5000;

// Conteúdo de cada plano: vem de src/data/planCoverage.ts (PLAN_FEATURES),
// o mesmo usado na aba Benefícios. Os 2 primeiros itens aparecem em destaque.
const PLAN_TAGS: Record<PlanId, string> = {
  bronze: 'BÁSICO',
  prata: 'POPULAR',
  ouro: 'MAIS COMPLETO',
  diamante: 'VIP',
};

const PLAN_BASE: Omit<Plan, 'price'>[] = PLAN_ORDER.map((id) => ({
  id,
  tag: PLAN_TAGS[id],
  title: PLAN_NAMES[id],
  features: PLAN_FEATURES[id].slice(0, 2),
  extraFeatures: PLAN_FEATURES[id].slice(2),
}));

// Preços por mês, iguais aos banners.
const PLAN_PRICE_TABLE: Record<BillingCycle, Record<string, number>> = {
  monthly: { bronze: 139.9, prata: 219.9, ouro: 399.9, diamante: 649.9 },
  yearly: { bronze: 119.9, prata: 179.9, ouro: 349.9, diamante: 549.9 },
};

// Cor do fundinho da coroa e frase curta de cada plano na vitrine.
const PLAN_TIER_STYLE: Record<PlanId, { color: string; summary: string }> = {
  bronze: { color: '#B87333', summary: 'Banho e tosa + atendimento básico' },
  prata: { color: '#A3ADBC', summary: '+ vacinas e 2 consultas' },
  ouro: { color: '#E3A912', summary: '+ exames e consultas ilimitadas' },
  diamante: { color: '#4FB3D9', summary: '+ leva e traz ilimitado' },
};

const plansData: Record<BillingCycle, Plan[]> = {
  monthly: PLAN_BASE.map((plan) => ({ ...plan, price: PLAN_PRICE_TABLE.monthly[plan.id] })),
  yearly: PLAN_BASE.map((plan) => ({ ...plan, price: PLAN_PRICE_TABLE.yearly[plan.id] })),
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
  pets,
  initialPetId,
  initialPlanId,
  onPurchaseComplete,
}: Props) {
  // Vindo de um banner, abre direto nos detalhes do plano escolhido.
  const [step, setStep] = useState<Step>(initialPlanId && pets.length > 0 ? 'details' : 'showcase');
  const [billingCycle, setBillingCycle] =
    useState<BillingCycle>('monthly');

  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId ?? 'ouro');
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('card');

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

  const userPets = pets;

  const [selectedPetId, setSelectedPetId] = useState<string | null>(
    initialPetId && pets.some((pet) => pet.id === initialPetId)
      ? initialPetId
      : pets.length > 0
        ? pets[0].id
        : null
  );

  const [petListExpanded, setPetListExpanded] = useState(false);

  const confirmationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancela a espera se a pessoa sair da tela antes de terminar.
  useEffect(() => {
    return () => {
      if (confirmationTimer.current) clearTimeout(confirmationTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!selectedPetId && pets.length > 0) {
      setSelectedPetId(pets[0].id);
    }

    if (
      selectedPetId &&
      !pets.some((pet) => pet.id === selectedPetId)
    ) {
      setSelectedPetId(pets.length > 0 ? pets[0].id : null);
    }

    if (pets.length <= 1) {
      setPetListExpanded(false);
    }
  }, [pets, selectedPetId]);

  const currentPlans = plansData[billingCycle];

  const activePlanObj =
    currentPlans.find((plan) => plan.id === selectedPlanId) ||
    currentPlans[2];

  const selectedPet = userPets.find(
    (pet) => pet.id === selectedPetId
  );

  // Foto real somente quando existir uma imagem cadastrada.
  // Sem foto, mostra exclusivamente o ícone de patinha.
  const renderPetAvatar = (
    avatar: string | null,
    checkout = false,
    species?: string | null
  ) => {
    const avatarStyle = checkout
      ? styles.checkoutPetAvatar
      : styles.petAvatar;

    const photoUri =
      typeof avatar === 'string' ? avatar.trim() : '';

    const isUserPhoto =
      photoUri.startsWith('https://') ||
      photoUri.startsWith('http://') ||
      photoUri.startsWith('file://') ||
      photoUri.startsWith('content://') ||
      photoUri.startsWith('data:image/');

    if (isUserPhoto) {
      return (
        <Image
          source={{ uri: photoUri }}
          style={avatarStyle}
          resizeMode="cover"
        />
      );
    }

    return (
      <View style={[avatarStyle, styles.petAvatarPlaceholder]}>
        <MaterialCommunityIcons
          name={getSpeciesIcon(species)}
          size={checkout ? 28 : 26}
          color="#183C98"
        />
      </View>
    );
  };

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

  // Na vitrine, qual plano está com a lista completa aberta.
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  // Da vitrine para os detalhes: precisa ter pet cadastrado.
  const handleContinueToDetails = () => {
    if (!userPets.length) {
      Alert.alert('Cadastre seu pet', 'Cadastre um pet antes de contratar um plano.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cadastrar pet', onPress: onNavigateToAddPet },
      ]);
      return;
    }
    setStep('details');
  };

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
          {
            text: 'Cadastrar pet',
            onPress: onNavigateToAddPet,
          },
        ]
      );
      return;
    }

    if (!selectedPet) {
      Alert.alert(
        'Selecione um pet',
        'Escolha o pet que receberá o plano.'
      );
      return;
    }

    if (!acceptedTerms) {
      Alert.alert(
        'Termos de uso',
        'Aceite os termos para continuar.'
      );
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

    if (
      paymentMethod === 'card' &&
      (!cardNumber.trim() ||
        !cardName.trim() ||
        !cardExpiry.trim() ||
        !cardCvv.trim())
    ) {
      Alert.alert(
        'Dados incompletos',
        'Preencha todos os dados do cartão.'
      );
      return;
    }

    // Modo de teste: cartão, Pix e boleto ativam o plano.
    const nextStatus: PaymentStatus = 'paid';

    setPaymentStatus(nextStatus);

    const subscription: SubscriptionData = {
      petId: selectedPet.id,
      planId: activePlanObj.id,
      planName: activePlanObj.title,
      petName: selectedPet.name,
      billingCycle,
      paymentMethod,
      totalPrice: finalPaymentTotal,
      cardLast4:
        paymentMethod === 'card'
          ? cardNumber.replace(/\D/g, '').slice(-4)
          : undefined,
      installments:
        paymentMethod === 'card' && billingCycle === 'yearly'
          ? installments
          : 1,
      status: nextStatus,
    };

    if (paymentMethod === 'card') {
      onPurchaseComplete?.(subscription);
      setStep('success');
      return;
    }

    // Pix e boleto: simula a espera pela confirmação do pagamento.
    setStep('loading');
    confirmationTimer.current = setTimeout(() => {
      onPurchaseComplete?.(subscription);
      setStep('success');
    }, PIX_BOLETO_TEST_DELAY_MS);
  };

  // Seleção de pet em formato expansível.
  const renderPetSelection = () => {
    if (userPets.length === 0) {
      return (
        <TouchableOpacity
          style={styles.addPetCard}
          onPress={onNavigateToAddPet}
          activeOpacity={0.85}
        >
          <Ionicons
            name="add-circle-outline"
            size={28}
            color="#183C98"
          />

          <View style={styles.petInfo}>
            <Text style={styles.petName}>
              Nenhum pet cadastrado
            </Text>

            <Text style={styles.petBreed}>
              Cadastre um pet para contratar um plano.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#94A3B8"
          />
        </TouchableOpacity>
      );
    }

    if (!selectedPet) {
      return null;
    }

    return (
      <View>
        <TouchableOpacity
          style={styles.petDropdownHeader}
          onPress={() => {
            if (userPets.length > 1) {
              setPetListExpanded((expanded) => !expanded);
            }
          }}
          activeOpacity={userPets.length > 1 ? 0.8 : 1}
        >
          <View style={styles.petDropdownSelected}>
            {renderPetAvatar(selectedPet.avatar, false, selectedPet.species)}

            <View style={styles.petInfo}>
              <Text style={styles.petName}>
                {selectedPet.name}
              </Text>

              <Text style={styles.petBreed}>
                {selectedPet.species} · {selectedPet.breed}
              </Text>

              <Text style={styles.petAge}>
                {selectedPet.age} · {selectedPet.gender}
              </Text>
            </View>
          </View>

          {userPets.length > 1 && (
            <Ionicons
              name={
                petListExpanded
                  ? 'chevron-up'
                  : 'chevron-down'
              }
              size={23}
              color="#183C98"
            />
          )}
        </TouchableOpacity>

        {userPets.length > 1 && petListExpanded && (
          <View style={styles.petDropdownOptions}>
            {userPets
              .filter((pet) => pet.id !== selectedPetId)
              .map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={styles.petCard}
                  onPress={() => {
                    setSelectedPetId(pet.id);
                    setPetListExpanded(false);
                  }}
                  activeOpacity={0.85}
                >
                  {renderPetAvatar(pet.avatar, false, pet.species)}

                  <View style={styles.petInfo}>
                    <Text style={styles.petName}>
                      {pet.name}
                    </Text>

                    <Text style={styles.petBreed}>
                      {pet.species} · {pet.breed}
                    </Text>

                    <Text style={styles.petAge}>
                      {pet.age} · {pet.gender}
                    </Text>
                  </View>

                  <Ionicons
                    name="radio-button-off"
                    size={22}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              ))}
          </View>
        )}
      </View>
    );
  };

  const renderInstallments = () => (
    <>
      <Text style={styles.sectionLabel}>
        QUANTIDADE DE PARCELAS
      </Text>

      <View style={styles.installmentsContainer}>
        <Text style={styles.installmentsDescription}>
          Escolha em quantas vezes deseja pagar o plano anual.
        </Text>

        <TouchableOpacity
          style={styles.installmentDropdown}
          onPress={() =>
            setInstallmentsOpen((value) => !value)
          }
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
            name={
              installmentsOpen ? 'chevron-up' : 'chevron-down'
            }
            size={21}
            color="#183C98"
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
                      (rate /
                        (1 - Math.pow(1 + rate, -number)));

                const selected = installments === number;

                return (
                  <TouchableOpacity
                    key={number}
                    style={[
                      styles.installmentDropdownOption,
                      selected &&
                        styles.installmentDropdownOptionActive,
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
                          selected &&
                            styles.installmentNumberActive,
                        ]}
                      >
                        {number}x de {formatCurrency(value)}
                      </Text>

                      <Text
                        style={[
                          styles.installmentOptionSubtitle,
                          selected &&
                            styles.installmentNumberActive,
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
      <PrivateHeader
        title={
          step === 'showcase'
            ? 'Contratar plano'
            : step === 'details'
              ? 'Detalhes do plano'
              : step === 'payment'
                ? 'Pagamento'
                : step === 'loading'
                  ? 'Confirmando pagamento'
                  : 'Pagamento concluído'
        }
        onBack={step !== 'success' && step !== 'loading' ? handleBack : undefined}
      />

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
            {/* Para qual pet */}
            {userPets.length === 0 ? (
              <TouchableOpacity style={styles.vtPetLine} onPress={onNavigateToAddPet} activeOpacity={0.8}>
                <View style={styles.vtPetIcon}>
                  <Ionicons name="paw" size={16} color={theme.colors.primary} />
                </View>
                <Text style={styles.vtPetText}>Cadastre um pet para contratar</Text>
                <Text style={styles.vtLink}>Adicionar</Text>
              </TouchableOpacity>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vtPetList}>
                {userPets.map((pet) => {
                  const active = pet.id === selectedPet?.id;
                  return (
                    <TouchableOpacity
                      key={pet.id}
                      style={[styles.vtPetPill, active && styles.vtPetPillActive]}
                      onPress={() => setSelectedPetId(pet.id)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.vtPetIcon, active && { backgroundColor: '#FFFFFF' }]}>
                        {pet.avatar ? (
                          <Image source={{ uri: pet.avatar }} style={styles.vtPetPhoto} />
                        ) : (
                          <MaterialCommunityIcons name={getSpeciesIcon(pet.species)} size={17} color={theme.colors.primary} />
                        )}
                      </View>
                      <Text style={styles.vtPetName}>
                        {active ? 'Plano para ' : ''}
                        <Text style={{ fontFamily: theme.fonts.bold }}>{pet.name}</Text>
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {/* Mensal / Anual */}
            <View style={styles.vtToggle}>
              {(['monthly', 'yearly'] as BillingCycle[]).map((cycle) => {
                const active = billingCycle === cycle;
                return (
                  <TouchableOpacity
                    key={cycle}
                    style={[styles.vtToggleOption, active && styles.vtToggleOptionActive]}
                    onPress={() => changeBillingCycle(cycle)}
                  >
                    <Text style={[styles.vtToggleText, active && styles.vtToggleTextActive]}>
                      {cycle === 'monthly' ? 'Mensal' : 'Anual'}
                    </Text>
                    {cycle === 'yearly' && (
                      <View style={styles.vtSaveBadge}>
                        <Text style={styles.vtSaveText}>até 18% off</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Planos: um aberto por vez */}
            {currentPlans.map((plan) => {
              const open = selectedPlanId === plan.id;
              const recommended = plan.id === 'ouro';
              const allFeatures = [...plan.features, ...plan.extraFeatures];
              const tier = PLAN_TIER_STYLE[plan.id as PlanId];
              return (
                <View key={plan.id} style={[styles.vtCard, open && styles.vtCardOpen]}>
                  {recommended && (
                    <View style={styles.vtRibbon}>
                      <Text style={styles.vtRibbonText}>Mais escolhido</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.vtCardTop}
                    onPress={() => setSelectedPlanId(plan.id)}
                    activeOpacity={0.8}
                  >
                    {/* Mesma coroa da barra inferior, com o fundo na cor do nível */}
                    <View style={[styles.vtCrown, { backgroundColor: tier.color }]}>
                      <MaterialCommunityIcons name="crown" size={19} color="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.vtPlanName}>{plan.title.replace('Plano ', '')}</Text>
                      <Text style={styles.vtPlanSummary}>{tier.summary}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.vtPrice}>{formatCurrency(plan.price)}</Text>
                      <Text style={styles.vtPriceUnit}>/mês</Text>
                    </View>
                  </TouchableOpacity>

                  {open && (
                    <>
                      <View style={styles.vtFeatures}>
                        {(expandedPlanId === plan.id ? allFeatures : allFeatures.slice(0, 3)).map((feature) => (
                          <View key={feature.text} style={styles.vtFeatureRow}>
                            <Ionicons name="checkmark-circle" size={15} color={theme.colors.success} />
                            <Text style={styles.vtFeatureText}>{feature.text}</Text>
                            <Text style={styles.vtFeatureCount}>{feature.count}</Text>
                          </View>
                        ))}
                        {allFeatures.length > 3 && (
                          <TouchableOpacity
                            onPress={() => setExpandedPlanId(expandedPlanId === plan.id ? null : plan.id)}
                          >
                            <Text style={styles.vtSeeAll}>
                              {expandedPlanId === plan.id ? 'Ver menos' : `Ver tudo (${allFeatures.length} itens)`}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      <TouchableOpacity
                        style={styles.vtChooseButton}
                        onPress={() => {
                          setSelectedPlanId(plan.id);
                          handleContinueToDetails();
                        }}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.vtChooseText}>
                          Escolher {plan.title.replace('Plano ', '')} ·{' '}
                          {billingCycle === 'yearly'
                            ? `${formatCurrency(plan.price * 12)}/ano`
                            : `${formatCurrency(plan.price)}/mês`}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              );
            })}
          </>
        )}

        {/* DETALHES DO PLANO */}
        {step === 'details' && (
          <>
            <Text style={styles.sectionLabel}>
              PET VINCULADO
            </Text>

            <Text style={styles.petSelectionDescription}>
              Selecione o pet que receberá o plano.
            </Text>

            {renderPetSelection()}

            <Text style={styles.sectionLabel}>
              O QUE ESTÁ INCLUSO
            </Text>

            <View style={styles.detailsBox}>
              {[
                ...activePlanObj.features,
                ...activePlanObj.extraFeatures,
              ].map((item, index) => (
                <View
                  key={index}
                  style={styles.detailRow}
                >
                  <View style={styles.detailRowLeft}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#10B981"
                    />

                    <Text style={styles.detailRowText}>
                      {item.text}
                    </Text>
                  </View>

                  <Text style={styles.detailRowMetric}>
                    {item.count}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionLabel}>
              CICLO DE COBRANÇA
            </Text>

            <View style={styles.cycleRow}>
              {(['monthly', 'yearly'] as BillingCycle[]).map(
                (cycle) => {
                  const plan = plansData[cycle].find(
                    (item) => item.id === selectedPlanId
                  )!;

                  return (
                    <TouchableOpacity
                      key={cycle}
                      style={[
                        styles.cycleBox,
                        billingCycle === cycle &&
                          styles.activeCycleBox,
                      ]}
                      onPress={() => changeBillingCycle(cycle)}
                    >
                      <View style={styles.cycleBoxHeader}>
                        <Ionicons
                          name="calendar-outline"
                          size={18}
                          color="#183C98"
                        />

                        {billingCycle === cycle && (
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color="#183C98"
                          />
                        )}
                      </View>

                      <Text style={styles.cycleTitle}>
                        {cycle === 'monthly'
                          ? 'Mensal'
                          : 'Anual · até 18% OFF'}
                      </Text>

                      <Text style={styles.cyclePrice}>
                        {formatCurrency(plan.price)}
                        <Text style={styles.cyclePeriod}>
                          /mês
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() =>
                setAcceptedTerms((value) => !value)
              }
            >
              <Ionicons
                name={
                  acceptedTerms ? 'checkbox' : 'square-outline'
                }
                size={20}
                color="#183C98"
              />

              <Text style={styles.termsText}>
                Li e aceito os Termos de Uso e a Política de
                Privacidade.
              </Text>
            </TouchableOpacity>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>
                Resumo da contratação
              </Text>

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
                <Text style={styles.summaryLabel}>
                  Cobrança
                </Text>

                <Text style={styles.summaryValue}>
                  {billingCycle === 'yearly'
                    ? 'Anual'
                    : 'Mensal'}
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
                (!selectedPet || !acceptedTerms) &&
                  styles.disabledButton,
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
              {selectedPet &&
                renderPetAvatar(selectedPet.avatar, true, selectedPet.species)}

              <View style={styles.petInfo}>
                <Text style={styles.checkoutPetLabel}>
                  PLANO PARA
                </Text>

                <Text style={styles.petName}>
                  {selectedPet?.name}
                </Text>

                <Text style={styles.petBreed}>
                  {activePlanObj.title}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>
              FORMA DE PAGAMENTO
            </Text>

            <View style={styles.paymentOptions}>
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === 'card' && styles.paymentOptionActive,
                ]}
                onPress={() => setPaymentMethod('card')}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="card-outline"
                  size={23}
                  color={paymentMethod === 'card' ? '#183C98' : '#64748B'}
                />
                <View style={styles.paymentMethodInfo}>
                  <Text style={styles.paymentMethodText}>Cartão de crédito</Text>
                  <Text style={styles.paymentMethodSubtitle}>Pague com cartão</Text>
                </View>
                <Ionicons
                  name={paymentMethod === 'card' ? 'radio-button-on' : 'radio-button-off'}
                  size={21}
                  color={paymentMethod === 'card' ? '#183C98' : '#94A3B8'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === 'pix' && styles.paymentOptionActive,
                ]}
                onPress={() => setPaymentMethod('pix')}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="qr-code-outline"
                  size={23}
                  color={paymentMethod === 'pix' ? '#183C98' : '#64748B'}
                />
                <View style={styles.paymentMethodInfo}>
                  <Text style={styles.paymentMethodText}>Pix</Text>
                  <Text style={styles.paymentMethodSubtitle}>Pagamento à vista</Text>
                </View>
                <Ionicons
                  name={paymentMethod === 'pix' ? 'radio-button-on' : 'radio-button-off'}
                  size={21}
                  color={paymentMethod === 'pix' ? '#183C98' : '#94A3B8'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === 'boleto' && styles.paymentOptionActive,
                ]}
                onPress={() => setPaymentMethod('boleto')}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="barcode-outline"
                  size={23}
                  color={paymentMethod === 'boleto' ? '#183C98' : '#64748B'}
                />
                <View style={styles.paymentMethodInfo}>
                  <Text style={styles.paymentMethodText}>Boleto bancário</Text>
                  <Text style={styles.paymentMethodSubtitle}>Pagamento por boleto</Text>
                </View>
                <Ionicons
                  name={paymentMethod === 'boleto' ? 'radio-button-on' : 'radio-button-off'}
                  size={21}
                  color={paymentMethod === 'boleto' ? '#183C98' : '#94A3B8'}
                />
              </TouchableOpacity>
            </View>

            {paymentMethod === 'card' && billingCycle === 'yearly' &&
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

                  <Text style={styles.inputLabel}>Nome impresso no cartão</Text>
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
                      trackColor={{
                        false: '#CBD5E1',
                        true: '#183C98',
                      }}
                    />
                  </View>
                </View>
              </>
            )}

            {paymentMethod === 'pix' && (
              <View style={styles.alternativePaymentInfo}>
                <Ionicons name="qr-code-outline" size={32} color="#183C98" />
                <Text style={styles.alternativePaymentTitle}>Pagamento via Pix</Text>
                <Text style={styles.alternativePaymentText}>
                  Ao continuar, a solicitação de pagamento Pix ficará aguardando
                  confirmação. O QR Code e o código Pix precisam ser gerados
                  pelo sistema de pagamento integrado.
                </Text>
                <Text style={styles.alternativePaymentNote}>
                  Esta versão de demonstração ainda não gera um QR Code válido.
                </Text>
              </View>
            )}

            {paymentMethod === 'boleto' && (
              <View style={styles.alternativePaymentInfo}>
                <Ionicons name="barcode-outline" size={32} color="#183C98" />
                <Text style={styles.alternativePaymentTitle}>Pagamento por boleto</Text>
                <Text style={styles.alternativePaymentText}>
                  Ao continuar, a solicitação do boleto ficará aguardando
                  confirmação. A linha digitável e o PDF precisam ser fornecidos
                  pelo sistema de pagamento integrado.
                </Text>
                <Text style={styles.alternativePaymentNote}>
                  Esta versão de demonstração ainda não gera um boleto válido.
                </Text>
              </View>
            )}

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>
                Resumo do pagamento
              </Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Pet
                </Text>

                <Text style={styles.summaryValue}>
                  {selectedPet?.name}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Plano
                </Text>

                <Text style={styles.summaryValue}>
                  {activePlanObj.title}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Ciclo
                </Text>

                <Text style={styles.summaryValue}>
                  {billingCycle === 'yearly' ? 'Anual' : 'Mensal'}
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Total
                </Text>

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
                CONFIRMAR PAGAMENTO
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* CARREGAMENTO */}
        {step === 'loading' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#183C98"
            />

            <Text style={styles.loadingTitle}>
              {paymentMethod === 'pix'
                ? 'Aguardando confirmação do Pix'
                : paymentMethod === 'boleto'
                  ? 'Aguardando compensação do boleto'
                  : 'Preparando sua contratação'}
            </Text>

            <Text style={styles.loadingText}>
              Aguarde enquanto confirmamos o pagamento. Não feche esta tela.
            </Text>
          </View>
        )}

        {/* SUCESSO */}
        {step === 'success' && (
          <View style={styles.successContainer}>
            <View
              style={[
                styles.successIcon,
                paymentStatus === 'pending' && styles.pendingPaymentIcon,
              ]}
            >
              <Ionicons
                name={paymentStatus === 'paid' ? 'checkmark' : 'time-outline'}
                size={42}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.successTitle}>
              {paymentStatus === 'paid'
                ? 'Pagamento concluído!'
                : 'Pagamento aguardando confirmação'}
            </Text>

            <Text style={styles.successDescription}>
              {paymentStatus === 'paid'
                ? `O plano foi contratado para ${selectedPet?.name}.`
                : `A contratação para ${selectedPet?.name} foi registrada e será ativada após a confirmação do pagamento.`}
            </Text>

            <View style={styles.successSummary}>
              <Text style={styles.summaryTitle}>
                Resumo da contratação
              </Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pet</Text>

                <Text style={styles.summaryValue}>
                  {selectedPet?.name}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Plano</Text>

                <Text style={styles.summaryValue}>
                  {activePlanObj.title}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Pagamento
                </Text>

                <Text style={styles.summaryValue}>
                  {paymentMethod === 'card'
                    ? 'Cartão de crédito'
                    : paymentMethod === 'pix'
                      ? 'Pix'
                      : 'Boleto bancário'}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Ciclo
                </Text>

                <Text style={styles.summaryValue}>
                  {billingCycle === 'yearly' ? 'Anual' : 'Mensal'}
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  {paymentStatus === 'paid' ? 'Total pago' : 'Total a pagar'}
                </Text>

                <Text style={styles.summaryValueBold}>
                  {formatCurrency(finalPaymentTotal)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                if (onNavigateToMyPlan) {
                  onNavigateToMyPlan();
                } else {
                  Alert.alert(
                    'Meu Plano',
                    'A rota Meu Plano não foi configurada no AppNavigator.'
                  );
                }
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>
                {paymentStatus === 'paid' ? 'ACOMPANHAR MEU PLANO' : 'VOLTAR AO MEU PLANO'}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {step === 'showcase' && (
      <PrivateBottomNav
        currentRoute="PrivatePlans"
        onNavigateToHome={onNavigateToHome}
        onNavigateToExplore={onNavigateToExplore}
        onNavigateToPlans={onNavigateToPlans}
        onNavigateToBenefits={onNavigateToBenefits}
        onNavigateToProfile={onNavigateToProfile}
      />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  // ---- Vitrine (padrão novo) ----
  vtPetList: { gap: 8, paddingBottom: 12 },
  vtPetLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
  },
  vtPetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 22,
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 14,
  },
  vtPetPillActive: { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.primary, borderWidth: 1.5 },
  vtPetIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  vtPetPhoto: { width: 30, height: 30 },
  vtPetName: { fontSize: 13, fontFamily: theme.fonts.regular, color: theme.colors.navy },
  vtPetText: { flex: 1, fontSize: 13, fontFamily: theme.fonts.medium, color: theme.colors.navy },
  vtLink: { fontSize: 13, fontFamily: theme.fonts.bold, color: theme.colors.primary },

  vtToggle: { flexDirection: 'row', backgroundColor: theme.colors.divider, borderRadius: 12, padding: 4, marginBottom: 16 },
  vtToggleOption: { flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', paddingVertical: 9, borderRadius: 9 },
  vtToggleOptionActive: { backgroundColor: theme.colors.card },
  vtToggleText: { fontSize: 13, fontFamily: theme.fonts.semibold, color: theme.colors.muted },
  vtToggleTextActive: { fontFamily: theme.fonts.bold, color: theme.colors.navy },
  vtSaveBadge: { backgroundColor: '#E7F6EF', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1 },
  vtSaveText: { fontSize: 10, fontFamily: theme.fonts.bold, color: theme.colors.success },

  vtCard: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 13,
    marginBottom: 12,
  },
  vtCardOpen: { borderColor: theme.colors.primary, borderWidth: 2 },
  vtRibbon: {
    position: 'absolute',
    top: -10,
    left: 14,
    backgroundColor: theme.colors.brandYellow,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 2,
  },
  vtRibbonText: { fontSize: 10, fontFamily: theme.fonts.bold, color: theme.colors.navy },
  vtCardTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  vtCrown: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  vtPlanName: { fontSize: 15, fontFamily: theme.fonts.bold, color: theme.colors.navy },
  vtPlanSummary: { fontSize: 11, fontFamily: theme.fonts.regular, color: theme.colors.muted, marginTop: 1 },
  vtPrice: { fontSize: 16, fontFamily: theme.fonts.bold, color: theme.colors.primary },
  vtPriceUnit: { fontSize: 10, fontFamily: theme.fonts.regular, color: theme.colors.muted },
  vtFeatures: { borderTopWidth: 1, borderTopColor: theme.colors.divider, marginTop: 12, paddingTop: 8 },
  vtFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5 },
  vtFeatureText: { flex: 1, fontSize: 12, fontFamily: theme.fonts.medium, color: theme.colors.navy },
  vtFeatureCount: { fontSize: 12, fontFamily: theme.fonts.semibold, color: theme.colors.muted },
  vtSeeAll: { fontSize: 12, fontFamily: theme.fonts.bold, color: theme.colors.primary, paddingTop: 6 },
  vtChooseButton: {
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  vtChooseText: { fontSize: 13, fontFamily: theme.fonts.bold, color: '#FFFFFF' },

  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    color: '#183C98',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 130,
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
    borderBottomColor: '#183C98',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#183C98',
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
    borderColor: '#183C98',
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
    color: '#183C98',
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
    color: '#183C98',
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
    backgroundColor: '#183C98',
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
  petSelectionDescription: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  petDropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  petDropdownSelected: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  petDropdownOptions: {
    marginTop: 2,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#DCE6F5',
  },
  petAvatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF3FC',
    borderWidth: 1,
    borderColor: '#DCE6F5',
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
    borderColor: '#183C98',
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
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailRowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailRowText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
  },
  detailRowMetric: {
    fontSize: 11,
    fontWeight: '700',
    color: '#183C98',
    marginLeft: 8,
  },
  cycleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cycleBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  activeCycleBox: {
    borderColor: '#183C98',
    backgroundColor: '#F5F8FF',
  },
  cycleBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cycleTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#263650',
    marginBottom: 7,
  },
  cyclePrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#183C98',
  },
  cyclePeriod: {
    fontSize: 10,
    fontWeight: '400',
    color: '#8490A2',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginVertical: 18,
  },
  termsText: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 17,
  },
  summaryCard: {
    backgroundColor: '#F8FAFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#DCE6F5',
    padding: 15,
    marginBottom: 18,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#263650',
    marginBottom: 13,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#263650',
  },
  summaryValueBold: {
    fontSize: 16,
    fontWeight: '900',
    color: '#183C98',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#DCE6F5',
    marginVertical: 10,
  },
  checkoutPetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    borderRadius: 15,
    padding: 13,
    borderWidth: 1,
    borderColor: '#DCE6F5',
    marginBottom: 18,
  },
  checkoutPetAvatar: {
    width: 58,
    height: 58,
    borderRadius: 14,
  },
  checkoutPetLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8996AA',
    marginBottom: 5,
  },
  paymentOptions: {
    gap: 9,
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE4EF',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#FFFFFF',
  },
  paymentOptionActive: {
    borderColor: '#183C98',
    backgroundColor: '#F5F8FF',
  },
  alternativePaymentInfo: {
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#DCE6F5',
    borderRadius: 15,
    padding: 18,
    marginBottom: 16,
  },
  alternativePaymentTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#263650',
    marginTop: 10,
    marginBottom: 7,
  },
  alternativePaymentText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 17,
    textAlign: 'center',
  },
  alternativePaymentNote: {
    fontSize: 10,
    color: '#94A3B8',
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 9,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE4EF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  paymentMethodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentMethodText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#263650',
  },
  paymentMethodSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  cardForm: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 15,
    padding: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 7,
    marginTop: 10,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: '#DCE4EF',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#263650',
    fontSize: 13,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  switchLabel: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
  },
  installmentsContainer: {
    backgroundColor: '#F8FAFF',
    borderRadius: 15,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DCE6F5',
  },
  installmentsDescription: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 12,
  },
  installmentDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DCE4EF',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  installmentDropdownTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#263650',
  },
  installmentDropdownSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
  },
  installmentOptions: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  installmentDropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  installmentDropdownOptionActive: {
    backgroundColor: '#183C98',
  },
  installmentNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#263650',
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  installmentResultLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  installmentResultValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#183C98',
  },
  interestInfo: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#DCE6F5',
  },
  interestText: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  installmentDisclaimer: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 10,
    lineHeight: 15,
  },
  loadingContainer: {
    flex: 1,
    minHeight: 350,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#263650',
    marginTop: 18,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 25,
  },
  pendingPaymentIcon: {
    backgroundColor: '#D97706',
  },
  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 18,
  },
  successTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#263650',
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
  },
  successSummary: {
    backgroundColor: '#F8FAFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#DCE6F5',
    padding: 15,
    marginBottom: 20,
  },
});