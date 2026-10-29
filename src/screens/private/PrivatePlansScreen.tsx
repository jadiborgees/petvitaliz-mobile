import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';

interface PrivatePlansScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToAddPet?: () => void; // Prop para navegar para a tela de cadastrar pet
}

type Step = 'showcase' | 'details' | 'payment' | 'success';

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: string;
  avatar: any;
}

export default function PrivatePlansScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  onNavigateToAddPet,
}: PrivatePlansScreenProps) {
  const [step, setStep] = useState<Step>('showcase');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>('ouro');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'boleto'>('card');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [saveCard, setSaveCard] = useState(true);

  // Lista simulada de pets do usuário. Se for [], aciona o estado de "Nenhum Pet Cadastrado"
  const [userPets, setUserPets] = useState<Pet[]>([
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
    userPets.length > 0 ? userPets[0].id : null
  );

  const selectedPet = userPets.find((p) => p.id === selectedPetId);

  const plansData = {
    monthly: [
      {
        id: 'bronze',
        tag: 'BÁSICO',
        title: 'Plano Bronze',
        price: 'R$139,90',
        period: '/mês',
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
        price: 'R$219,90',
        period: '/mês',
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
        price: 'R$399,90',
        period: '/mês',
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
        price: 'R$649,90',
        period: '/mês',
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
        price: 'R$119,90',
        period: '/mês',
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
        price: 'R$179,90',
        period: '/mês',
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
        price: 'R$349,90',
        period: '/mês',
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
        price: 'R$549,90',
        period: '/mês',
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

  const currentPlans = plansData[billingCycle];
  const activePlanObj = currentPlans.find((p) => p.id === selectedPlanId) || currentPlans[2];

  const handleHeaderBack = () => {
    if (step === 'details') setStep('showcase');
    else if (step === 'payment') setStep('details');
    else if (onBack) onBack();
    else if (onNavigateToHome) onNavigateToHome();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Topo / Header */}
      <View style={styles.header}>
        {step !== 'success' && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleHeaderBack}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#21479B" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>
          {step === 'showcase' && 'Contratar Plano'}
          {step === 'details' && 'Detalhes do Plano'}
          {step === 'payment' && 'Pagamento'}
          {step === 'success' && 'Pagamento concluído'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ============================================================ */}
        {/* ETAPA 1: VITRINE DE PLANOS                                   */}
        {/* ============================================================ */}
        {step === 'showcase' && (
          <>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabButton, billingCycle === 'monthly' && styles.tabButtonActive]}
                onPress={() => setBillingCycle('monthly')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, billingCycle === 'monthly' && styles.tabTextActive]}>
                  Mensal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabButton, billingCycle === 'yearly' && styles.tabButtonActive]}
                onPress={() => setBillingCycle('yearly')}
                activeOpacity={0.8}
              >
                <View style={styles.yearlyTabContent}>
                  <Text style={[styles.tabText, billingCycle === 'yearly' && styles.tabTextActive]}>
                    Anual
                  </Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>10% OFF</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.cardsList}>
              {currentPlans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const allFeatures = isSelected
                  ? [...plan.features, ...plan.extraFeatures]
                  : plan.features;

                return (
                  <TouchableOpacity
                    key={plan.id}
                    activeOpacity={0.9}
                    onPress={() => setSelectedPlanId(plan.id)}
                    style={[styles.card, isSelected && styles.selectedCard]}
                  >
                    <Text style={[styles.cardTag, isSelected && styles.selectedCardTag]}>
                      {plan.tag}
                    </Text>

                    <View style={styles.cardHeaderRow}>
                      <View style={styles.cardTitleContainer}>
                        <View style={[styles.iconCircle, isSelected && styles.selectedIconCircle]} />
                        <Text style={[styles.cardTitle, isSelected && styles.selectedCardTitle]}>
                          {plan.title}
                        </Text>
                      </View>
                      <View style={styles.priceContainer}>
                        <Text style={[styles.cardPrice, isSelected && styles.selectedCardPrice]}>
                          {plan.price}
                        </Text>
                        <Text style={[styles.cardPeriod, isSelected && styles.selectedCardPeriod]}>
                          {plan.period}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.featuresList}>
                      {allFeatures.map((feat, idx) => (
                        <View key={idx} style={styles.featureItem}>
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color={isSelected ? '#A3C0F5' : '#10B981'}
                          />
                          <Text style={[styles.featureText, isSelected && styles.selectedFeatureText]}>
                            {feat.text}
                          </Text>
                          <Text style={[styles.featureCount, isSelected && styles.selectedFeatureCount]}>
                            {feat.count}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity
                      style={[styles.primaryButton, isSelected && styles.selectedButton]}
                      onPress={() => {
                        setSelectedPlanId(plan.id);
                        setStep('details');
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.primaryButtonText, isSelected && styles.selectedButtonText]}>
                        CONTRATAR
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* ============================================================ */}
        {/* ETAPA 2: DETALHES DO PLANO (COM SELEÇÃO / CADASTRO DE PET)  */}
        {/* ============================================================ */}
        {step === 'details' && (
          <>
            <Text style={styles.sectionLabel}>PET VINCULADO</Text>

            {/* Caso 1: Usuário possui pets cadastrados */}
            {userPets.length > 0 && selectedPet ? (
              <TouchableOpacity style={styles.petCard} activeOpacity={0.85}>
                <Image source={selectedPet.avatar} style={styles.petAvatar} />
                <View style={styles.petInfo}>
                  <View style={styles.petNameRow}>
                    <Text style={styles.petName}>{selectedPet.name}</Text>
                    <View style={styles.goldBadge}>
                      <Ionicons name="ribbon-outline" size={12} color="#B45309" />
                      <Text style={styles.goldBadgeText}>{activePlanObj.title.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={styles.petBreed}>
                    {selectedPet.type} · {selectedPet.breed}
                  </Text>
                  <Text style={styles.petAge}>
                    {selectedPet.age} · {selectedPet.gender}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ) : (
              /* Caso 2: Nenhum pet cadastrado */
              <TouchableOpacity
                style={styles.addPetCard}
                activeOpacity={0.85}
                onPress={onNavigateToAddPet}
              >
                <View style={styles.addPetIconCircle}>
                  <Ionicons name="add" size={22} color="#21479B" />
                </View>
                <View style={styles.addPetTextContainer}>
                  <Text style={styles.addPetTitle}>Nenhum pet cadastrado</Text>
                  <Text style={styles.addPetSubtitle}>
                    Clique para cadastrar o pet que receberá este plano.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}

            <Text style={styles.sectionLabel}>O QUE ESTÁ INCLUSO</Text>
            <View style={styles.detailsBox}>
              {[...activePlanObj.features, ...activePlanObj.extraFeatures].map((item, index) => (
                <View key={index} style={styles.detailRow}>
                  <View style={styles.detailRowLeft}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.detailRowText}>{item.text}</Text>
                  </View>
                  <Text style={styles.detailRowMetric}>{item.count}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionLabel}>CICLO DE COBRANÇA</Text>
            <View style={styles.cycleRow}>
              <TouchableOpacity
                style={[styles.cycleBox, billingCycle === 'monthly' && styles.activeCycleBox]}
                onPress={() => setBillingCycle('monthly')}
                activeOpacity={0.8}
              >
                <View style={styles.cycleBoxHeader}>
                  <Ionicons name="calendar-outline" size={18} color="#21479B" />
                  {billingCycle === 'monthly' && <Ionicons name="checkmark-circle" size={18} color="#21479B" />}
                </View>
                <Text style={styles.cycleTitle}>Mensal</Text>
                <Text style={styles.cyclePrice}>
                  {plansData.monthly.find((p) => p.id === selectedPlanId)?.price || activePlanObj.price}
                  <Text style={styles.cyclePeriod}>/mês</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cycleBox, billingCycle === 'yearly' && styles.activeCycleBox]}
                onPress={() => setBillingCycle('yearly')}
                activeOpacity={0.8}
              >
                <View style={styles.cycleBoxHeader}>
                  <Ionicons name="calendar-outline" size={18} color="#64748B" />
                  {billingCycle === 'yearly' && <Ionicons name="checkmark-circle" size={18} color="#21479B" />}
                </View>
                <Text style={styles.cycleTitle}>Anual (10% OFF)</Text>
                <Text style={styles.cyclePrice}>
                  {plansData.yearly.find((p) => p.id === selectedPlanId)?.price || activePlanObj.price}
                  <Text style={styles.cyclePeriod}>/mês</Text>
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.termsRow}
              activeOpacity={0.8}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
            >
              <Ionicons name={acceptedTerms ? 'checkbox' : 'square-outline'} size={20} color="#21479B" />
              <Text style={styles.termsText}>
                Li e aceito os <Text style={styles.linkText}>Termos de Uso</Text> e a{' '}
                <Text style={styles.linkText}>Política de Privacidade</Text>.
              </Text>
            </TouchableOpacity>

            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Ionicons name="document-text-outline" size={18} color="#21479B" />
                <Text style={styles.summaryTitle}>Resumo da contratação</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pet</Text>
                <Text style={styles.summaryValue}>{selectedPet ? selectedPet.name : 'Pendente'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Plano</Text>
                <Text style={styles.summaryValue}>{activePlanObj.title}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Valor</Text>
                <Text style={styles.summaryValueBold}>{activePlanObj.price}/mês</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!selectedPet || !acceptedTerms) && styles.disabledButton,
              ]}
              disabled={!selectedPet || !acceptedTerms}
              activeOpacity={0.85}
              onPress={() => setStep('payment')}
            >
              <Text style={styles.primaryButtonText}>
                {!selectedPet ? 'Cadastre um pet para continuar' : 'Continuar para pagamento'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* ============================================================ */}
        {/* ETAPA 3: PAGAMENTO                                           */}
        {/* ============================================================ */}
        {step === 'payment' && (
          <>
            <Text style={styles.sectionLabel}>FORMA DE PAGAMENTO</Text>
            <View style={styles.paymentMethodsCol}>
              <TouchableOpacity
                style={[styles.paymentMethodCard, paymentMethod === 'card' && styles.activePaymentCard]}
                onPress={() => setPaymentMethod('card')}
                activeOpacity={0.8}
              >
                <Ionicons name="radio-button-on" size={18} color="#21479B" />
                <Text style={styles.paymentMethodText}>Cartão de crédito</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.paymentMethodCard, paymentMethod === 'pix' && styles.activePaymentCard]}
                onPress={() => setPaymentMethod('pix')}
                activeOpacity={0.8}
              >
                <Ionicons name={paymentMethod === 'pix' ? 'radio-button-on' : 'radio-button-off'} size={18} color="#94A3B8" />
                <Text style={styles.paymentMethodTextLight}>Pix</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>DADOS DO CARTÃO</Text>
            <View style={styles.cardForm}>
              <TextInput style={styles.input} value="4521 •••• •••• 8890" editable={false} />
              <TextInput style={[styles.input, { marginTop: 10 }]} value="LUCIANA F SANTOS" editable={false} />
              <View style={styles.rowInputs}>
                <TextInput style={[styles.input, { flex: 1 }]} value="08/29" editable={false} />
                <TextInput style={[styles.input, { flex: 1 }]} value="999" editable={false} />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Salvar cartão para próximas cobranças</Text>
                <Switch value={saveCard} onValueChange={setSaveCard} trackColor={{ false: '#CBD5E1', true: '#21479B' }} />
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => setStep('success')}
            >
              <Text style={styles.primaryButtonText}>PAGAR</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ============================================================ */}
        {/* ETAPA 4: PAGAMENTO CONCLUÍDO                                 */}
        {/* ============================================================ */}
        {step === 'success' && (
          <View style={styles.successContainer}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Pagamento realizado!</Text>
            <Text style={styles.successSubtitle}>
              O {activePlanObj.title} já está ativo para {selectedPet?.name || 'seu pet'}.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => {
                if (onNavigateToHome) onNavigateToHome();
              }}
            >
              <Text style={styles.primaryButtonText}>VER MEU PLANO</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Componente Privado de Navegação */}
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#21479B' },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: { borderBottomColor: '#21479B' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#21479B', fontWeight: '800' },
  yearlyTabContent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  discountBadge: {
    backgroundColor: '#84CC16',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  cardsList: { gap: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedCard: {
    backgroundColor: '#1B4298',
    borderColor: '#1B4298',
  },
  cardTag: { fontSize: 10, fontWeight: '700', color: '#64748B', marginBottom: 8 },
  selectedCardTag: { color: '#A3C0F5' },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E2E8F0' },
  selectedIconCircle: { backgroundColor: '#FFFFFF' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  selectedCardTitle: { color: '#FFFFFF' },
  priceContainer: { alignItems: 'flex-end' },
  cardPrice: { fontSize: 16, fontWeight: '800', color: '#21479B' },
  selectedCardPrice: { color: '#FFFFFF' },
  cardPeriod: { fontSize: 10, color: '#64748B' },
  selectedCardPeriod: { color: '#A3C0F5' },
  featuresList: { gap: 8, marginBottom: 16 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { flex: 1, fontSize: 11, color: '#475569', fontWeight: '500' },
  selectedFeatureText: { color: '#FFFFFF' },
  featureCount: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  selectedFeatureCount: { color: '#A3C0F5' },
  primaryButton: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1B4298',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButtonText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  disabledButton: {
    backgroundColor: '#CBD5E1',
  },
  selectedButton: { backgroundColor: '#FFFFFF' },
  selectedButtonText: { color: '#1B4298' },

  /* Estilos para Pet */
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 8, marginTop: 12 },
  petCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 12 },
  petAvatar: { width: 50, height: 50, borderRadius: 12 },
  petInfo: { flex: 1, marginLeft: 12 },
  petNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  petName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  goldBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  goldBadgeText: { fontSize: 8, fontWeight: '800', color: '#B45309' },
  petBreed: { fontSize: 11, color: '#64748B', marginTop: 2 },
  petAge: { fontSize: 10, color: '#94A3B8' },

  /* Card de adicionar pet */
  addPetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  addPetIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPetTextContainer: { flex: 1, marginLeft: 12 },
  addPetTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  addPetSubtitle: { fontSize: 11, color: '#64748B', marginTop: 2 },

  /* Detalhes & Outros */
  detailsBox: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 12, gap: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailRowText: { fontSize: 12, color: '#334155', fontWeight: '500' },
  detailRowMetric: { fontSize: 12, color: '#64748B' },
  cycleRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  cycleBox: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  activeCycleBox: { borderColor: '#21479B', borderWidth: 2, backgroundColor: '#F8FAFC' },
  cycleBoxHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  cycleTitle: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  cyclePrice: { fontSize: 13, fontWeight: '800', color: '#21479B', marginTop: 2 },
  cyclePeriod: { fontSize: 10, color: '#64748B' },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  termsText: { fontSize: 11, color: '#64748B', flex: 1 },
  linkText: { color: '#21479B', fontWeight: '600' },
  summaryCard: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  summaryTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryLabel: { fontSize: 12, color: '#64748B' },
  summaryValue: { fontSize: 12, color: '#0F172A', fontWeight: '500' },
  summaryValueBold: { fontSize: 12, color: '#21479B', fontWeight: '800' },
  paymentMethodsCol: { gap: 10, marginBottom: 12 },
  paymentMethodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 10 },
  activePaymentCard: { backgroundColor: '#21479B', borderColor: '#21479B' },
  paymentMethodText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  paymentMethodTextLight: { fontSize: 13, fontWeight: '600', color: '#334155' },
  cardForm: { marginBottom: 16 },
  input: { backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 12, height: 44, color: '#0F172A' },
  rowInputs: { flexDirection: 'row', gap: 10, marginTop: 10 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  switchLabel: { fontSize: 12, color: '#64748B' },
  successContainer: { alignItems: 'center', paddingVertical: 20 },
  successIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#21479B', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  successTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  successSubtitle: { fontSize: 13, color: '#64748B', marginTop: 4, marginBottom: 20 },
});