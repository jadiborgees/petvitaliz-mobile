import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import PrivateBottomNav from '../../components/PrivateBottomNav';

interface PrivatePetsFlowScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

type FlowMode = 
  | 'list' 
  | 'empty' 
  | 'step1' 
  | 'step2' 
  | 'step3' 
  | 'step4' 
  | 'payment'
  | 'profile' 
  | 'deleteConfirm';

type ProfileTab = 'sobre' | 'saude' | 'historico';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  plan: string;
  bio: string;
  avatar: any | null;
}

export default function PrivatePetsFlowScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: PrivatePetsFlowScreenProps) {
  const [mode, setMode] = useState<FlowMode>('empty');
  const [profileTab, setProfileTab] = useState<ProfileTab>('sobre');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  const [pets, setPets] = useState<Pet[]>([
    {
      id: '1',
      name: 'Lua',
      species: 'Cachorro',
      breed: 'Golden Retriever',
      age: '4 anos',
      gender: 'Fêmea',
      weight: '28 kg',
      plan: 'PLANO OURO',
      bio: 'Lua é dócil e adora companhia.',
      avatar: require('../../assets/Explorar2.png'),
    },
  ]);

  // Campos do formulário do Pet
  const [petImage, setPetImage] = useState<string | null>(null);
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState('Cachorro');
  const [petBreed, setPetBreed] = useState('');
  const [petGender, setPetGender] = useState('Fêmea');
  const [petAge, setPetAge] = useState('');
  const [petWeight, setPetWeight] = useState('');
  const [petBio, setPetBio] = useState('');

  // Estados de Planos e Pagamento integrados
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('ouro'); // Padrão selecionado
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit');

  // Modais de seleção (Espécie e Sexo)
  const [isSpeciesModalVisible, setIsSpeciesModalVisible] = useState(false);
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);
  
  const speciesList = ['Cachorro', 'Gato', 'Ave', 'Outro'];
  const genderList = ['Macho', 'Fêmea'];

  const plansData = {
    monthly: [
      {
        id: 'none',
        tag: 'GRATUITO',
        title: 'Sem plano por enquanto',
        price: 'R$0,00',
        period: '',
        features: [{ text: 'Quero apenas cadastrar meu pet.', count: '' }],
        extraFeatures: [],
      },
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
          { text: 'Histórico de Vacinas Digital', count: 'Incluí' },
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
        id: 'none',
        tag: 'GRATUITO',
        title: 'Sem plano por enquanto',
        price: 'R$0,00',
        period: '',
        features: [{ text: 'Quero apenas cadastrar meu pet.', count: '' }],
        extraFeatures: [],
      },
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
          { text: 'Histórico de Vacinas Digital', count: 'Incluí' },
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

  const handlePickPetImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar sua galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setPetImage(result.assets[0].uri);
    }
  };

  const handleBack = () => {
    if (mode === 'step1') setMode(pets.length > 0 ? 'list' : 'empty');
    else if (mode === 'step2') setMode('step1');
    else if (mode === 'step3') setMode('step2');
    else if (mode === 'step4') setMode('step3');
    else if (mode === 'payment') setMode('step4');
    else if (mode === 'profile' || mode === 'deleteConfirm') setMode('list');
    else if (onBack) onBack();
  };

  const handleCompleteFlow = () => {
    if (selectedPlanId !== 'none' && mode === 'step4') {
      setMode('payment');
      return;
    }
    saveNewPet();
  };

  const saveNewPet = () => {
    let planFormatted = '';
    if (selectedPlanId === 'bronze') planFormatted = 'PLANO BRONZE';
    else if (selectedPlanId === 'prata') planFormatted = 'PLANO PRATA';
    else if (selectedPlanId === 'ouro') planFormatted = 'PLANO OURO';
    else if (selectedPlanId === 'diamante') planFormatted = 'PLANO DIAMANTE';

    const newPet: Pet = {
      id: String(Date.now()),
      name: petName || 'Novo Pet',
      species: petSpecies,
      breed: petBreed || 'SRD (Sem Raça Definida)',
      age: petAge || '1 ano',
      gender: petGender,
      weight: petWeight || '10 kg',
      plan: planFormatted,
      bio: petBio || 'Um pet muito especial.',
      avatar: petImage ? { uri: petImage } : null,
    };

    setPets([...pets, newPet]);
    setMode('list');
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);

    // Limpar campos
    setPetImage(null);
    setPetName('');
    setPetBreed('');
    setPetAge('');
    setPetWeight('');
    setPetBio('');
    setSelectedPlanId('ouro');
  };

  const handleDeletePet = () => {
    if (selectedPet) {
      const updated = pets.filter((p) => p.id !== selectedPet.id);
      setPets(updated);
      setSelectedPet(null);
      setMode(updated.length > 0 ? 'list' : 'empty');
    }
  };

  const getSelectedPlanDetails = () => {
    const found = currentPlans.find((p) => p.id === selectedPlanId);
    return found ? { name: found.title, price: `${found.price} ${found.period} (${billingCycle === 'yearly' ? 'Anual' : 'Mensal'})` } : { name: 'Sem Plano', price: 'R$0,00' };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {(mode === 'list' || mode === 'empty') && 'Meus Pets'}
          {mode === 'step1' && 'Identificação'}
          {mode === 'step2' && 'Características'}
          {mode === 'step3' && 'Sobre o Pet'}
          {mode === 'step4' && 'Plano do Pet'}
          {mode === 'payment' && 'Pagamento do Plano'}
          {(mode === 'profile' || mode === 'deleteConfirm') && 'Perfil Pet'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ============================================================ */}
        {/* 1. ESTADO VAZIO                                              */}
        {/* ============================================================ */}
        {mode === 'empty' && (
          <View style={styles.emptyContainer}>
            <View style={styles.illustrationCircle}>
              <Ionicons name="paw" size={64} color="#21479B" />
            </View>
            <Text style={styles.emptyTitle}>Você ainda não tem nenhum pet cadastrado</Text>
            <Text style={styles.emptySubtitle}>
              Adicione seu pet para aproveitar todos os benefícios do plano e cuidar da saúde dele com muito mais praticidade!
            </Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={() => setMode('step1')}
            >
              <Text style={styles.primaryBtnText}>Adicionar Pet</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================ */}
        {/* 2. LISTA DE PETS                                             */}
        {/* ============================================================ */}
        {mode === 'list' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionMainTitle}>Pets cadastrados</Text>
              <Text style={styles.sectionSubtitle}>Aqui você visualiza e gerencia os pets cadastrados na sua conta.</Text>
            </View>

            {pets.map((pet) => (
              <View key={pet.id} style={styles.petCardItem}>
                <View style={styles.petCardTop}>
                  {pet.avatar ? (
                    <Image source={pet.avatar} style={styles.petAvatarLarge} />
                  ) : (
                    <View style={styles.petAvatarFallback}>
                      <Ionicons name="paw" size={24} color="#21479B" />
                    </View>
                  )}
                  <View style={styles.petCardInfo}>
                    <View style={styles.petNameRow}>
                      <Text style={styles.petCardName}>{pet.name}</Text>
                      {pet.plan ? (
                        <View style={styles.goldBadge}>
                          <Ionicons name="ribbon-outline" size={10} color="#B45309" />
                          <Text style={styles.goldBadgeText}>{pet.plan}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.petCardDetails}>{pet.species} · {pet.breed}</Text>
                    <Text style={styles.petCardSubDetails}>{pet.age} · {pet.gender}</Text>
                  </View>
                </View>

                <View style={styles.petCardDivider} />

                <View style={styles.petCardActionsRow}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedPet(pet);
                      setMode('profile');
                      setProfileTab('sobre');
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.seeProfileLink}>Ver perfil ›</Text>
                  </TouchableOpacity>

                  <View style={styles.actionIconsRight}>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => {
                        setSelectedPet(pet);
                        setMode('step1');
                      }}
                    >
                      <Ionicons name="pencil-outline" size={16} color="#64748B" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => {
                        setSelectedPet(pet);
                        setMode('deleteConfirm');
                      }}
                    >
                      <Ionicons name="trash-outline" size={16} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.floatingAddBtn}
              activeOpacity={0.9}
              onPress={() => setMode('step1')}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {successToast && (
              <View style={styles.toastCard}>
                <View style={styles.toastIconCircle}>
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.toastText}>Pet cadastrado com sucesso!</Text>
              </View>
            )}
          </>
        )}

        {/* ============================================================ */}
        {/* 3. ADICIONAR PET - ETAPA 1                                   */}
        {/* ============================================================ */}
        {mode === 'step1' && (
          <>
            <View style={styles.progressBarRow}>
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={styles.progressSegment} />
              <View style={styles.progressSegment} />
              <View style={styles.progressSegment} />
            </View>

            <View style={styles.avatarUploadSection}>
              <TouchableOpacity activeOpacity={0.85} onPress={handlePickPetImage} style={styles.avatarContainerMain}>
                {petImage ? (
                  <Image source={{ uri: petImage }} style={styles.avatarImageStyle} />
                ) : (
                  <View style={styles.avatarPlaceholderInner}>
                    <Ionicons name="camera-outline" size={32} color="#94A3B8" />
                  </View>
                )}
                <View style={styles.cameraBadgeFixed}>
                  <Ionicons name="add" size={14} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              <Text style={styles.avatarUploadText}>Foto de perfil do Pet (Opcional)</Text>
            </View>

            <Text style={styles.sectionLabel}>DADOS BÁSICOS</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome*</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Lua"
                placeholderTextColor="#94A3B8"
                value={petName}
                onChangeText={setPetName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Espécie*</Text>
              <TouchableOpacity
                style={styles.selectBox}
                activeOpacity={0.8}
                onPress={() => setIsSpeciesModalVisible(true)}
              >
                <Text style={styles.selectText}>{petSpecies}</Text>
                <Ionicons name="chevron-down" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Raça <Text style={styles.optionalText}>(Opcional)</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Golden Retriever ou SRD"
                placeholderTextColor="#94A3B8"
                value={petBreed}
                onChangeText={setPetBreed}
              />
            </View>

            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={() => setMode('step2')}>
              <Text style={styles.primaryBtnText}>Continuar</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ============================================================ */}
        {/* ETAPA 2                                                      */}
        {/* ============================================================ */}
        {mode === 'step2' && (
          <>
            <View style={styles.progressBarRow}>
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={styles.progressSegment} />
              <View style={styles.progressSegment} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sexo*</Text>
              <TouchableOpacity
                style={styles.selectBox}
                activeOpacity={0.8}
                onPress={() => setIsGenderModalVisible(true)}
              >
                <Text style={styles.selectText}>{petGender}</Text>
                <Ionicons name="chevron-down" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Idade aproximada*</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 4 anos"
                placeholderTextColor="#94A3B8"
                value={petAge}
                onChangeText={setPetAge}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Peso atual</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 28 kg"
                placeholderTextColor="#94A3B8"
                value={petWeight}
                onChangeText={setPetWeight}
              />
            </View>

            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={() => setMode('step3')}>
              <Text style={styles.primaryBtnText}>Continuar</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ============================================================ */}
        {/* ETAPA 3                                                      */}
        {/* ============================================================ */}
        {mode === 'step3' && (
          <>
            <View style={styles.progressBarRow}>
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={styles.progressSegment} />
            </View>

            <Text style={styles.sectionLabel}>SOBRE O PET</Text>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.textArea}
                placeholder="Conte um pouco sobre a personalidade e os hábitos do seu pet..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                value={petBio}
                onChangeText={setPetBio}
              />
            </View>

            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={() => setMode('step4')}>
              <Text style={styles.primaryBtnText}>Continuar</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ============================================================ */}
        {/* ETAPA 4: PLANO DO PET (COM SELEÇÃO MENSAL / ANUAL)           */}
        {/* ============================================================ */}
        {mode === 'step4' && (
          <>
            <View style={styles.progressBarRow}>
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={[styles.progressSegment, styles.activeSegment]} />
            </View>

            <View style={styles.planHeaderContainer}>
              <Text style={styles.sectionMainTitle}>Plano do Pet</Text>
              <Text style={styles.sectionSubtitle}>Escolha um plano para garantir cobertura de saúde completa.</Text>
            </View>

            {/* Abas de Ciclo (Mensal / Anual) */}
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

                  {/* Lista de Benefícios */}
                  <View style={styles.featuresList}>
                    {allFeatures.map((feat, idx) => (
                      <View key={idx} style={styles.featureItem}>
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={isSelected ? '#A3C0F5' : '#10B981'}
                        />
                        <Text
                          style={[
                            styles.featureText,
                            isSelected && styles.selectedFeatureText,
                          ]}
                        >
                          {feat.text}
                        </Text>
                        <Text
                          style={[
                            styles.featureCount,
                            isSelected && styles.selectedFeatureCount,
                          ]}
                        >
                          {feat.count}
                        </Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={handleCompleteFlow}>
              <Text style={styles.primaryBtnText}>
                {selectedPlanId === 'none' ? 'Concluir Cadastro' : 'Ir para Pagamento'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* ============================================================ */}
        {/* FLUXO DE PAGAMENTO DO PLANO ESCOLHIDO                        */}
        {/* ============================================================ */}
        {mode === 'payment' && (
          <>
            <View style={styles.paymentSummaryCard}>
              <Text style={styles.summaryTitle}>Resumo da Assinatura</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pet:</Text>
                <Text style={styles.summaryValue}>{petName || 'Meu Pet'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Plano:</Text>
                <Text style={styles.summaryValue}>{getSelectedPlanDetails().name}</Text>
              </View>
              <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 8, marginTop: 8 }]}>
                <Text style={styles.summaryTotalLabel}>Total:</Text>
                <Text style={styles.summaryTotalValue}>{getSelectedPlanDetails().price}</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>ESCOLHA A FORMA DE PAGAMENTO</Text>

            {[
              { id: 'credit', title: 'Cartão de Crédito', icon: 'card-outline', desc: 'Cobrança recorrente' },
              { id: 'pix', title: 'PIX', icon: 'qr-code-outline', desc: 'Aprovação instantânea' },
              { id: 'boleto', title: 'Boleto Bancário', icon: 'barcode-outline', desc: 'Vencimento em 3 dias' },
            ].map((pm) => (
              <TouchableOpacity
                key={pm.id}
                style={[styles.card, selectedPaymentMethod === pm.id && styles.selectedCard]}
                onPress={() => setSelectedPaymentMethod(pm.id)}
                activeOpacity={0.9}
              >
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardTitleContainer}>
                    <Ionicons name={pm.icon as any} size={20} color={selectedPaymentMethod === pm.id ? '#FFFFFF' : '#21479B'} />
                    <Text style={[styles.cardTitle, selectedPaymentMethod === pm.id && styles.selectedCardTitle]}>
                      {pm.title}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.featureText, selectedPaymentMethod === pm.id && styles.selectedFeatureText]}>
                  {pm.desc}
                </Text>
              </TouchableOpacity>
            ))}

            {selectedPaymentMethod === 'credit' && (
              <View style={styles.cardFormContainer}>
                <Text style={styles.label}>Número do Cartão</Text>
                <TextInput style={styles.input} placeholder="0000 0000 0000 0000" placeholderTextColor="#94A3B8" />
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Validade</Text>
                    <TextInput style={styles.input} placeholder="MM/AA" placeholderTextColor="#94A3B8" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>CVV</Text>
                    <TextInput style={styles.input} placeholder="123" placeholderTextColor="#94A3B8" secureTextEntry />
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={saveNewPet}>
              <Text style={styles.primaryBtnText}>Confirmar Pagamento e Concluir</Text>
            </TouchableOpacity>
          </>
        )}

      </ScrollView>

      {/* Modal para Seleção de Espécie */}
      <Modal visible={isSpeciesModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a Espécie</Text>
            {speciesList.map((sp) => (
              <TouchableOpacity
                key={sp}
                style={styles.modalOption}
                onPress={() => {
                  setPetSpecies(sp);
                  setIsSpeciesModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{sp}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setIsSpeciesModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para Seleção de Sexo */}
      <Modal visible={isGenderModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Sexo</Text>
            {genderList.map((g) => (
              <TouchableOpacity
                key={g}
                style={styles.modalOption}
                onPress={() => {
                  setPetGender(g);
                  setIsGenderModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{g}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setIsGenderModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Navegação Inferior Privada */}
      <PrivateBottomNav
        currentRoute="PrivateProfile"
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
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 110 },

  sectionHeader: { marginBottom: 16 },
  sectionMainTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  sectionSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },

  petCardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  petCardTop: { flexDirection: 'row', alignItems: 'center' },
  petAvatarLarge: { width: 56, height: 56, borderRadius: 14 },
  petAvatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  petCardInfo: { flex: 1, marginLeft: 12 },
  petNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  petCardName: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  goldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  goldBadgeText: { fontSize: 8, fontWeight: '800', color: '#B45309' },
  petCardDetails: { fontSize: 12, color: '#64748B', marginTop: 2 },
  petCardSubDetails: { fontSize: 11, color: '#94A3B8', marginTop: 1 },
  petCardDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  petCardActionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeProfileLink: { fontSize: 13, fontWeight: '700', color: '#21479B' },
  actionIconsRight: { flexDirection: 'row', gap: 12 },
  iconActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  floatingAddBtn: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    elevation: 4,
  },

  toastCard: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    elevation: 4,
  },
  toastIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },

  emptyContainer: { alignItems: 'center', marginTop: 30, paddingHorizontal: 10 },
  illustrationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 8 },
  emptySubtitle: { fontSize: 12, color: '#64748B', textAlign: 'center', lineHeight: 18, marginBottom: 30 },

  progressBarRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  progressSegment: { flex: 1, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2 },
  activeSegment: { backgroundColor: '#21479B' },

  avatarUploadSection: { alignItems: 'center', marginBottom: 24 },
  avatarContainerMain: {
    position: 'relative',
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarPlaceholderInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarImageStyle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cameraBadgeFixed: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#21479B',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 2,
  },
  avatarUploadText: { fontSize: 12, color: '#64748B', fontWeight: '600', marginTop: 8 },

  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 8, marginTop: 10, letterSpacing: 0.5 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#64748B', marginBottom: 6 },
  optionalText: { fontSize: 11, color: '#94A3B8', fontWeight: '400' },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 13,
    color: '#0F172A',
  },
  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  selectText: { fontSize: 13, color: '#0F172A', fontWeight: '500' },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    height: 100,
    fontSize: 13,
    color: '#0F172A',
    textAlignVertical: 'top',
  },

  planHeaderContainer: { marginBottom: 16 },
  tabContainer: {
    flexDirection: 'row',
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

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
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
  featuresList: { gap: 8 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { flex: 1, fontSize: 11, color: '#475569', fontWeight: '500' },
  selectedFeatureText: { color: '#FFFFFF' },
  featureCount: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  selectedFeatureCount: { color: '#A3C0F5' },

  paymentSummaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  summaryTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryLabel: { fontSize: 12, color: '#64748B' },
  summaryValue: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  summaryTotalLabel: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  summaryTotalValue: { fontSize: 14, fontWeight: '800', color: '#21479B' },
  cardFormContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 12,
    marginBottom: 16,
  },

  primaryBtn: {
    backgroundColor: '#21479B',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '100%',
    elevation: 2,
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, width: '100%', maxWidth: 300, alignItems: 'center' },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  modalOption: { width: '100%', paddingVertical: 12, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalOptionText: { fontSize: 14, fontWeight: '600', color: '#21479B' },
  modalCancel: { marginTop: 16, padding: 8 },
  modalCancelText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
});