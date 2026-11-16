import React, { useEffect, useRef, useState } from 'react';
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
  Animated,
  Easing,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import PrivateBottomNav from '../../components/PrivateBottomNav';
import PrivateHeader from '../../components/PrivateHeader';
import PetAvatar, { getSpeciesIcon } from '../../components/PetAvatar';
import { theme } from '../../theme/privateTheme';
import { PLAN_NAMES, getPlanId } from '../../data/planCoverage';

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  plan: string | null;
  hasActivePlan: boolean;
  bio: string;
  avatar: string | null;
  traits?: string[]; // ids de PET_TRAITS
  loves?: string[]; // ids de PET_LOVES
}

interface PrivatePetsFlowScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onContractPlan?: (petId: string) => void;

  pets: Pet[];
  onPetsChange: React.Dispatch<React.SetStateAction<Pet[]>>;
}

type FlowMode = 'list' | 'empty' | 'step1' | 'step2' | 'step3' | 'profile';
type ProfileTab = 'sobre' | 'saude' | 'historico';

const speciesList = ['Cachorro', 'Gato', 'Ave', 'Outro'];
const genderList = ['Fêmea', 'Macho'];

// Etiquetas do "Sobre o pet". O texto muda conforme o sexo.
export const PET_TRAITS = [
  { id: 'brincalhao', icon: 'smile', male: 'Brincalhão', female: 'Brincalhona' },
  { id: 'carinhoso', icon: 'heart', male: 'Carinhoso', female: 'Carinhosa' },
  { id: 'dorminhoco', icon: 'moon', male: 'Dorminhoco', female: 'Dorminhoca' },
  { id: 'sociavel', icon: 'users', male: 'Sociável', female: 'Sociável' },
  { id: 'agitado', icon: 'zap', male: 'Agitado', female: 'Agitada' },
  { id: 'medroso', icon: 'cloud-lightning', male: 'Medroso', female: 'Medrosa' },
] as const;

export const PET_LOVES = [
  { id: 'passear', icon: 'map', label: 'Passear' },
  { id: 'petiscos', icon: 'gift', label: 'Petiscos' },
  { id: 'bolinha', icon: 'circle', label: 'Bolinha' },
  { id: 'agua', icon: 'droplet', label: 'Água' },
  { id: 'sofa', icon: 'home', label: 'Sofá' },
] as const;

const BIO_LIMIT = 200;

export const traitLabel = (id: string, gender: string) => {
  const trait = PET_TRAITS.find((item) => item.id === id);
  if (!trait) return id;
  return gender === 'Macho' ? trait.male : trait.female;
};

export const loveLabel = (id: string) => PET_LOVES.find((item) => item.id === id)?.label ?? id;

// Idade: guarda "4 anos" / "1 ano" / "3 meses" / "1 mês".
const formatAge = (value: string, unit: 'anos' | 'meses') => {
  const n = Number(value);
  if (unit === 'meses') return `${n} ${n === 1 ? 'mês' : 'meses'}`;
  return `${n} ${n === 1 ? 'ano' : 'anos'}`;
};

const parseAge = (age: string): { value: string; unit: 'anos' | 'meses' } => {
  const value = (age.match(/\d+/) ?? [''])[0];
  return { value, unit: /m[eê]s/i.test(age) ? 'meses' : 'anos' };
};

// Peso: só números e uma vírgula, até 2 casas decimais.
const sanitizeWeight = (text: string) => {
  const cleaned = text.replace(/\./g, ',').replace(/[^0-9,]/g, '');
  const [whole, ...rest] = cleaned.split(',');
  if (rest.length === 0) return whole.slice(0, 3);
  return `${whole.slice(0, 3)},${rest.join('').slice(0, 2)}`;
};

// Etiqueta que dá um pulinho ao ser tocada.
function BounceChip({
  label,
  icon,
  selected,
  tone = 'blue',
  onPress,
}: {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  selected: boolean;
  tone?: 'blue' | 'orange';
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.15, useNativeDriver: true, speed: 50, bounciness: 12 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 10 }),
    ]).start();
    onPress();
  };

  const activeStyle = tone === 'blue' ? styles.chipBlue : styles.chipOrange;
  const activeText = tone === 'blue' ? '#FFFFFF' : theme.colors.warning;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.chip, selected && activeStyle]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <Feather name={icon} size={13} color={selected ? activeText : theme.colors.textSecondary} />
        <Text style={[styles.chipText, selected && { color: activeText, fontFamily: theme.fonts.bold }]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function PrivatePetsFlowScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  onContractPlan,
  pets,
  onPetsChange,
}: PrivatePetsFlowScreenProps) {
  const [mode, setMode] = useState<FlowMode>(
    pets.length > 0 ? 'list' : 'empty',
  );

  const [profileTab, setProfileTab] = useState<ProfileTab>('sobre');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);

  const [petImage, setPetImage] = useState<string | null>(null);
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState('Cachorro');
  const [petBreed, setPetBreed] = useState('');
  const [petGender, setPetGender] = useState('Fêmea');
  const [petAge, setPetAge] = useState('');
  const [petWeight, setPetWeight] = useState('');
  const [petBio, setPetBio] = useState('');
  const [ageUnit, setAgeUnit] = useState<'anos' | 'meses'>('anos');
  const [petTraits, setPetTraits] = useState<string[]>([]);
  const [petLoves, setPetLoves] = useState<string[]>([]);
  const [choosePlanNow, setChoosePlanNow] = useState(false);

  // Animações da etapa 3
  const avatarWiggle = useRef(new Animated.Value(0)).current;
  const pawWiggle = useRef(new Animated.Value(0)).current;

  const [isSpeciesModalVisible, setIsSpeciesModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mantém a tela sincronizada com a lista compartilhada.
  useEffect(() => {
    if (mode === 'empty' || mode === 'list') {
      setMode(pets.length > 0 ? 'list' : 'empty');
    }
  }, [pets.length]);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => setSuccessMessage(''), 2500);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const resetForm = () => {
    setEditingPetId(null);
    setPetImage(null);
    setPetName('');
    setPetSpecies('Cachorro');
    setPetBreed('');
    setPetGender('Fêmea');
    setPetAge('');
    setPetWeight('');
    setPetBio('');
    setAgeUnit('anos');
    setPetTraits([]);
    setPetLoves([]);
    setChoosePlanNow(false);
  };

  const startNewPet = () => {
    resetForm();
    setMode('step1');
  };

  const startEditingPet = (pet: Pet) => {
    setEditingPetId(pet.id);
    setSelectedPet(pet);
    setPetImage(pet.avatar);
    setPetName(pet.name);
    setPetSpecies(pet.species);
    setPetBreed(pet.breed);
    setPetGender(pet.gender);
    const parsedAge = parseAge(pet.age);
    setPetAge(parsedAge.value);
    setAgeUnit(parsedAge.unit);
    setPetWeight(sanitizeWeight(pet.weight.replace(/kg/i, '').trim()));
    setPetBio(pet.bio);
    setPetTraits(pet.traits ?? []);
    setPetLoves(pet.loves ?? []);
    setMode('step1');
  };

  const handlePickPetImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de acesso à galeria para selecionar a foto do pet.',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setPetImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  };

  const handleBack = () => {
    if (mode === 'step1') {
      resetForm();
      setMode(pets.length > 0 ? 'list' : 'empty');
      return;
    }

    if (mode === 'step2') {
      setMode('step1');
      return;
    }

    if (mode === 'step3') {
      setMode('step2');
      return;
    }

    if (mode === 'profile') {
      setMode('list');
      setSelectedPet(null);
      return;
    }

    onBack?.();
  };

  const validateStep1 = () => {
    if (!petName.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o nome do seu pet.');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!petAge.trim() || Number(petAge) === 0) {
      Alert.alert('Campo obrigatório', 'Informe a idade aproximada do pet.');
      return false;
    }

    return true;
  };

  const savePet = () => {
    const existingPet = pets.find((pet) => pet.id === editingPetId);

    const petData: Pet = {
      id: editingPetId || String(Date.now()),
      name: petName.trim(),
      species: petSpecies,
      breed: petBreed.trim() || 'SRD (Sem Raça Definida)',
      age: formatAge(petAge, ageUnit),
      gender: petGender,
      weight: petWeight.replace(/,$/, '') ? `${petWeight.replace(/,$/, '')} kg` : '',
      plan: existingPet?.plan ?? null,
      hasActivePlan: existingPet?.hasActivePlan ?? false,
      bio: petBio.trim(),
      avatar: petImage,
      traits: petTraits,
      loves: petLoves,
    };
    const wantsPlan = !editingPetId && choosePlanNow;

    if (editingPetId) {
      onPetsChange((previous) =>
        previous.map((pet) =>
          pet.id === editingPetId ? petData : pet,
        ),
      );
      setSuccessMessage('Dados do pet atualizados!');
    } else {
      onPetsChange((previous) => [...previous, petData]);
      setSuccessMessage('Pet cadastrado com sucesso!');
    }

    resetForm();
    setMode('list');

    // "Escolher um plano agora": abre o checkout com este pet.
    if (wantsPlan) {
      if (onContractPlan) onContractPlan(petData.id);
      else onNavigateToPlans?.();
    }
  };

  // A patinha do botão balança e depois conclui.
  const finishWithWiggle = () => {
    pawWiggle.setValue(0);
    Animated.timing(pawWiggle, {
      toValue: 1,
      duration: 450,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => savePet());
  };

  // O avatar balança ao entrar na etapa 3.
  useEffect(() => {
    if (mode !== 'step3') return;
    avatarWiggle.setValue(0);
    Animated.timing(avatarWiggle, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [mode]);

  const wiggle = (value: Animated.Value) =>
    value.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: ['0deg', '-14deg', '12deg', '-8deg', '4deg', '0deg'],
    });

  const toggleItem = (list: string[], setList: (items: string[]) => void, id: string) => {
    setList(list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);
  };

  const requestDeletePet = (pet: Pet) => {
    if (pet.hasActivePlan) {
      Alert.alert(
        'Não é possível excluir',
        'Este pet possui um plano ativo. Para excluí-lo, solicite o cancelamento do plano primeiro.',
        [{ text: 'Entendi', style: 'cancel' }],
      );
      return;
    }

    Alert.alert(
      'Excluir pet',
      `Tem certeza de que deseja excluir ${pet.name}? Essa ação não poderá ser desfeita.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            onPetsChange((previous) =>
              previous.filter((item) => item.id !== pet.id),
            );

            setSelectedPet(null);
            setSuccessMessage('Pet excluído.');
          },
        },
      ],
    );
  };

  const openPetProfile = (pet: Pet) => {
    setSelectedPet(pet);
    setProfileTab('sobre');
    setMode('profile');
  };

  const renderPetAvatar = (pet: Pet, size: number) => {
    if (pet.avatar) {
      return (
        <Image
          source={{ uri: pet.avatar }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 4,
          }}
        />
      );
    }

    return (
      <View
        style={[
          styles.petAvatarFallback,
          {
            width: size,
            height: size,
            borderRadius: size / 4,
          },
        ]}
      >
        <MaterialCommunityIcons name={getSpeciesIcon(pet.species)} size={size * 0.48} color="#183C98" />
      </View>
    );
  };

  const renderMenuButton = (
    title: string,
    onPress: () => void,
    icon: keyof typeof Ionicons.glyphMap,
  ) => (
    <TouchableOpacity
      style={styles.menuButton}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <Ionicons name={icon} size={19} color="#183C98" />
      <Text style={styles.menuButtonText}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <PrivateHeader
        title={
          mode === 'profile'
            ? 'Perfil Pet'
            : mode === 'step1' || mode === 'step2' || mode === 'step3'
              ? editingPetId
                ? 'Editar pet'
                : 'Adicionar pet'
              : 'Meus Pets'
        }
        onBack={handleBack}
        right={
          mode === 'list' ? (
            <TouchableOpacity onPress={startNewPet} activeOpacity={0.7}>
              <Feather name="plus" size={23} color={theme.colors.primary} />
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {mode === 'empty' && (
          <View style={[styles.v2Card, styles.v2EmptyCard]}>
            <PetAvatar size={72} />
            <Text style={styles.v2EmptyTitle}>Cadastre seu primeiro pet</Text>
            <Text style={styles.v2EmptyText}>
              Leva menos de 1 minuto. Depois você escolhe um plano para ele.
            </Text>
            <TouchableOpacity style={styles.v2PrimaryButton} onPress={startNewPet} activeOpacity={0.85}>
              <Feather name="plus" size={17} color="#FFFFFF" />
              <Text style={styles.v2PrimaryButtonText}>Adicionar pet</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'empty' && (
          <>
            <Text style={styles.v2SectionTitle}>Por que cadastrar?</Text>
            <View style={[styles.v2Card, styles.v2ListCard]}>
              {[
                { icon: 'award' as const, text: 'Contratar um plano para ele' },
                { icon: 'calendar' as const, text: 'Agendar consultas e banho' },
                { icon: 'shield' as const, text: 'Carteira de vacinação digital' },
              ].map((item, index) => (
                <View key={item.text} style={[styles.v2ReasonRow, index < 2 && styles.v2Divider]}>
                  <Feather name={item.icon} size={17} color={theme.colors.primary} />
                  <Text style={styles.v2ReasonText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {mode === 'list' && (
          <>
            <Text style={styles.v2Count}>
              {pets.length} {pets.length === 1 ? 'pet cadastrado' : 'pets cadastrados'}
            </Text>

            {pets.map((pet) => {
              const planId = pet.hasActivePlan ? getPlanId(pet.plan) : null;
              const details = [pet.breed, pet.age, pet.gender].filter(Boolean).join(' · ');

              return (
                <View key={pet.id} style={[styles.v2Card, styles.v2PetCard]}>
                  <View style={styles.v2PetTop}>
                    <PetAvatar species={pet.species} avatar={pet.avatar} size={50} />
                    <View style={styles.v2PetInfo}>
                      <Text style={styles.v2PetName}>{pet.name}</Text>
                      <Text style={styles.v2PetDetails} numberOfLines={1}>
                        {details || pet.species}
                      </Text>
                    </View>
                    <View style={[styles.v2Badge, planId ? styles.v2BadgeActive : styles.v2BadgeNoPlan]}>
                      <Text style={[styles.v2BadgeText, { color: planId ? theme.colors.success : theme.colors.warning }]}>
                        {planId ? PLAN_NAMES[planId].replace('Plano ', '') : 'Sem plano'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.v2Actions}>
                    {planId ? (
                      <TouchableOpacity
                        style={[styles.v2MainAction, styles.v2MainActionSoft]}
                        onPress={() => openPetProfile(pet)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.v2MainActionText, { color: theme.colors.primary }]}>Ver perfil</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.v2MainAction}
                        onPress={() => (onContractPlan ? onContractPlan(pet.id) : onNavigateToPlans?.())}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.v2MainActionText}>Contratar plano</Text>
                      </TouchableOpacity>
                    )}

                    {!planId && (
                      <TouchableOpacity style={styles.v2IconButton} onPress={() => openPetProfile(pet)}>
                        <Feather name="eye" size={17} color={theme.colors.primary} />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.v2IconButton} onPress={() => startEditingPet(pet)}>
                      <Feather name="edit-2" size={16} color={theme.colors.primary} />
                    </TouchableOpacity>

                    {/* Pet com plano ativo não pode ser excluído (N10) */}
                    {planId ? (
                      <TouchableOpacity style={styles.v2IconButton} onPress={() => requestDeletePet(pet)}>
                        <Feather name="trash-2" size={16} color="#A7B1C2" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.v2IconButton} onPress={() => requestDeletePet(pet)}>
                        <Feather name="trash-2" size={16} color={theme.colors.danger} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}

            <TouchableOpacity style={styles.v2AddCard} onPress={startNewPet} activeOpacity={0.8}>
              <Feather name="plus" size={17} color={theme.colors.primary} />
              <Text style={styles.v2AddText}>Adicionar outro pet</Text>
            </TouchableOpacity>
          </>
        )}

        {(mode === 'step1' || mode === 'step2' || mode === 'step3') && (
          <View style={styles.stepHeader}>
            <View style={styles.stepLabelRow}>
              <Text style={styles.stepLabel}>
                Etapa {mode === 'step1' ? 1 : mode === 'step2' ? 2 : 3} de 3
              </Text>
              <Text style={styles.stepLabel}>
                {mode === 'step1' ? 'Identificação' : mode === 'step2' ? 'Características' : 'Sobre o pet'}
              </Text>
            </View>
            <View style={styles.stepBars}>
              {[1, 2, 3].map((n) => (
                <View
                  key={n}
                  style={[
                    styles.stepBar,
                    n <= (mode === 'step1' ? 1 : mode === 'step2' ? 2 : 3) && styles.stepBarActive,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {mode === 'step1' && (
          <>
            <View style={styles.photoSection}>
              <TouchableOpacity activeOpacity={0.85} onPress={handlePickPetImage}>
                <PetAvatar species={petSpecies} avatar={petImage} size={84} />
                <View style={styles.cameraBadge}>
                  <Feather name="camera" size={13} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              <Text style={styles.photoText}>
                {petImage ? 'Toque para trocar a foto' : 'Adicionar foto (opcional)'}
              </Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.fieldLabel}>Nome</Text>
              <TextInput
                style={styles.field}
                placeholder="Ex.: Lua"
                placeholderTextColor="#9AA6B8"
                value={petName}
                onChangeText={setPetName}
                maxLength={30}
              />

              <Text style={styles.fieldLabel}>Espécie</Text>
              <TouchableOpacity
                style={[styles.field, styles.selectField]}
                onPress={() => setIsSpeciesModalVisible(true)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={getSpeciesIcon(petSpecies)}
                  size={18}
                  color={theme.colors.primary}
                />
                <Text style={styles.selectFieldText}>{petSpecies}</Text>
                <Feather name="chevron-down" size={18} color={theme.colors.muted} />
              </TouchableOpacity>

              <Text style={styles.fieldLabel}>
                Raça <Text style={styles.fieldOptional}>(opcional)</Text>
              </Text>
              <TextInput
                style={[styles.field, { marginBottom: 0 }]}
                placeholder="Ex.: Golden Retriever ou SRD"
                placeholderTextColor="#9AA6B8"
                value={petBreed}
                onChangeText={setPetBreed}
              />
            </View>

            <TouchableOpacity
              style={styles.v2PrimaryButton}
              onPress={() => {
                if (validateStep1()) setMode('step2');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.v2PrimaryButtonText}>Continuar</Text>
            </TouchableOpacity>
          </>
        )}

        {mode === 'step2' && (
          <>
            <View style={styles.formCard}>
              <Text style={styles.fieldLabel}>Sexo</Text>
              <View style={styles.optionRow}>
                {genderList.map((gender) => {
                  const selected = petGender === gender;
                  return (
                    <TouchableOpacity
                      key={gender}
                      style={[styles.optionButton, selected && styles.optionButtonActive]}
                      onPress={() => setPetGender(gender)}
                      activeOpacity={0.8}
                    >
                      <MaterialCommunityIcons
                        name={gender === 'Fêmea' ? 'gender-female' : 'gender-male'}
                        size={16}
                        color={selected ? theme.colors.primary : theme.colors.textSecondary}
                      />
                      <Text style={[styles.optionText, selected && styles.optionTextActive]}>{gender}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.fieldLabel}>Idade aproximada</Text>
              <View style={styles.ageRow}>
                <TextInput
                  style={[styles.field, styles.ageInput]}
                  placeholder={ageUnit === 'anos' ? 'Ex.: 4' : 'Ex.: 6'}
                  placeholderTextColor="#9AA6B8"
                  keyboardType="number-pad"
                  value={petAge}
                  onChangeText={(text) => setPetAge(text.replace(/[^0-9]/g, '').slice(0, 2))}
                  maxLength={2}
                />
                <View style={styles.unitToggle}>
                  {(['anos', 'meses'] as const).map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      style={[styles.unitOption, ageUnit === unit && styles.unitOptionActive]}
                      onPress={() => setAgeUnit(unit)}
                    >
                      <Text style={[styles.unitText, ageUnit === unit && styles.unitTextActive]}>{unit}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text style={styles.fieldLabel}>
                Peso <Text style={styles.fieldOptional}>(opcional)</Text>
              </Text>
              <View style={[styles.field, styles.weightField]}>
                <TextInput
                  style={styles.weightInput}
                  placeholder="Ex.: 28,5"
                  placeholderTextColor="#9AA6B8"
                  keyboardType="decimal-pad"
                  value={petWeight}
                  onChangeText={(text) => setPetWeight(sanitizeWeight(text))}
                />
                <Text style={styles.weightUnit}>kg</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.v2PrimaryButton}
              onPress={() => {
                if (validateStep2()) setMode('step3');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.v2PrimaryButtonText}>Continuar</Text>
            </TouchableOpacity>
          </>
        )}

        {mode === 'step3' && (
          <>
            <View style={styles.aboutHeader}>
              <Animated.View style={{ transform: [{ rotate: wiggle(avatarWiggle) }] }}>
                <PetAvatar species={petSpecies} avatar={petImage} size={50} />
              </Animated.View>
              <View style={{ flex: 1 }}>
                <Text style={styles.aboutTitle}>
                  Conta pra gente sobre {petGender === 'Macho' ? 'o' : 'a'} {petName.trim() || 'seu pet'}
                </Text>
                <Text style={styles.aboutSubtitle}>Tudo opcional, toque para marcar</Text>
              </View>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.fieldLabel}>{petGender === 'Macho' ? 'Jeitinho dele' : 'Jeitinho dela'}</Text>
              <View style={styles.chipWrap}>
                {PET_TRAITS.map((trait) => (
                  <BounceChip
                    key={trait.id}
                    label={petGender === 'Macho' ? trait.male : trait.female}
                    icon={trait.icon}
                    selected={petTraits.includes(trait.id)}
                    onPress={() => toggleItem(petTraits, setPetTraits, trait.id)}
                  />
                ))}
              </View>

              <Text style={styles.fieldLabel}>{petGender === 'Macho' ? 'Ele adora' : 'Ela adora'}</Text>
              <View style={styles.chipWrap}>
                {PET_LOVES.map((love) => (
                  <BounceChip
                    key={love.id}
                    label={love.label}
                    icon={love.icon}
                    tone="orange"
                    selected={petLoves.includes(love.id)}
                    onPress={() => toggleItem(petLoves, setPetLoves, love.id)}
                  />
                ))}
              </View>

              <Text style={styles.fieldLabel}>Algo mais?</Text>
              <TextInput
                style={[styles.field, styles.bioField]}
                placeholder="Ex.: tem medo de trovão, não gosta de banho..."
                placeholderTextColor="#9AA6B8"
                multiline
                maxLength={BIO_LIMIT}
                value={petBio}
                onChangeText={setPetBio}
              />
              <Text style={styles.bioCounter}>
                {petBio.length}/{BIO_LIMIT}
              </Text>
            </View>

            {!editingPetId && (
              <TouchableOpacity
                style={styles.planCheck}
                onPress={() => setChoosePlanNow((value) => !value)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, choosePlanNow && styles.checkboxActive]}>
                  {choosePlanNow && <Feather name="check" size={14} color="#FFFFFF" />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planCheckTitle}>Escolher um plano agora</Text>
                  <Text style={styles.planCheckText}>Opcional. Dá para contratar depois.</Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.v2PrimaryButton} onPress={finishWithWiggle} activeOpacity={0.85}>
              <Animated.View style={{ transform: [{ rotate: wiggle(pawWiggle) }] }}>
                <MaterialCommunityIcons name="paw" size={18} color="#FFFFFF" />
              </Animated.View>
              <Text style={styles.v2PrimaryButtonText}>
                {editingPetId
                  ? 'Salvar alterações'
                  : choosePlanNow
                    ? 'Concluir e ver planos'
                    : 'Concluir cadastro'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {mode === 'profile' && selectedPet && (
          <>
            <View style={styles.profilePetHeader}>
              {renderPetAvatar(selectedPet, 92)}
              <Text style={styles.profilePetName}>{selectedPet.name}</Text>
              <Text style={styles.profilePetSubtitle}>
                {selectedPet.species} · {selectedPet.breed}
              </Text>
              <Text style={styles.profilePetPlan}>
                {selectedPet.hasActivePlan
                  ? selectedPet.plan || 'Plano ativo'
                  : 'Pet sem plano'}
              </Text>
            </View>

            <View style={styles.profileTabs}>
              {(['sobre', 'saude', 'historico'] as ProfileTab[]).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.profileTab,
                    profileTab === tab && styles.profileTabActive,
                  ]}
                  onPress={() => setProfileTab(tab)}
                >
                  <Text
                    style={[
                      styles.profileTabText,
                      profileTab === tab && styles.profileTabTextActive,
                    ]}
                  >
                    {tab === 'sobre'
                      ? 'Sobre'
                      : tab === 'saude'
                        ? 'Saúde'
                        : 'Histórico'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {profileTab === 'sobre' && (
              <View style={styles.detailCard}>
                <Text style={styles.detailTitle}>Informações do pet</Text>
                <DetailRow label="Nome" value={selectedPet.name} />
                <DetailRow label="Espécie" value={selectedPet.species} />
                <DetailRow label="Raça" value={selectedPet.breed} />
                <DetailRow label="Idade" value={selectedPet.age} />
                <DetailRow label="Sexo" value={selectedPet.gender} />
                <DetailRow
                  label="Peso"
                  value={selectedPet.weight || 'Não informado'}
                />
                <DetailRow
                  label="Sobre"
                  value={selectedPet.bio || 'Nenhuma informação adicionada.'}
                />
                {(selectedPet.traits?.length ?? 0) + (selectedPet.loves?.length ?? 0) > 0 && (
                  <View style={[styles.chipWrap, { marginTop: 12, marginBottom: 0 }]}>
                    {(selectedPet.traits ?? []).map((id) => (
                      <View key={id} style={[styles.chip, styles.chipBlue]}>
                        <Text style={[styles.chipText, { color: '#FFFFFF' }]}>
                          {traitLabel(id, selectedPet.gender)}
                        </Text>
                      </View>
                    ))}
                    {(selectedPet.loves ?? []).map((id) => (
                      <View key={id} style={[styles.chip, styles.chipOrange]}>
                        <Text style={[styles.chipText, { color: theme.colors.warning }]}>
                          Adora {loveLabel(id).toLowerCase()}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {profileTab === 'saude' && (
              <View style={styles.emptyDetailCard}>
                <Ionicons
                  name="heart-outline"
                  size={32}
                  color="#94A3B8"
                />
                <Text style={styles.emptyDetailText}>
                  Não há informações de saúde cadastradas para este pet.
                </Text>
              </View>
            )}

            {profileTab === 'historico' && (
              <View style={styles.emptyDetailCard}>
                <Ionicons
                  name="document-text-outline"
                  size={32}
                  color="#94A3B8"
                />
                <Text style={styles.emptyDetailText}>
                  Ainda não há registros no histórico deste pet.
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => startEditingPet(selectedPet)}
            >
              <Ionicons name="pencil-outline" size={17} color="#183C98" />
              <Text style={styles.secondaryBtnText}>
                Editar informações
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Lista de espécies (abre de baixo para cima) */}
      <Modal
        visible={isSpeciesModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSpeciesModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setIsSpeciesModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Qual é a espécie?</Text>
            {speciesList.map((species) => {
              const selected = petSpecies === species;
              return (
                <TouchableOpacity
                  key={species}
                  style={[styles.sheetOption, selected && styles.sheetOptionActive]}
                  onPress={() => {
                    setPetSpecies(species);
                    setIsSpeciesModalVisible(false);
                  }}
                  activeOpacity={0.8}
                >
                  <PetAvatar species={species} size={36} background={selected ? '#FFFFFF' : theme.colors.primarySoft} />
                  <Text style={[styles.sheetOptionText, selected && { fontFamily: theme.fonts.bold }]}>{species}</Text>
                  {selected && <Feather name="check-circle" size={20} color={theme.colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {!!successMessage && (
        <View style={styles.toastCard}>
          <Ionicons name="checkmark-circle" size={19} color="#10B981" />
          <Text style={styles.toastText}>{successMessage}</Text>
        </View>
      )}

      {/* A barra some durante o cadastro, para focar em concluir */}
      {(mode === 'list' || mode === 'empty' || mode === 'profile') && (
      <PrivateBottomNav
        currentRoute="PrivateProfile"
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

const T = theme.colors;
const TF = theme.fonts;

const styles = StyleSheet.create({
  // ---- Cadastro de pet ----
  stepHeader: { marginBottom: 16 },
  stepLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
  stepLabel: { fontSize: 11, fontFamily: TF.medium, color: T.muted },
  stepBars: { flexDirection: 'row', gap: 6 },
  stepBar: { flex: 1, height: 5, borderRadius: 3, backgroundColor: '#E1E7F0' },
  stepBarActive: { backgroundColor: T.primary },
  photoSection: { alignItems: 'center', marginBottom: 16 },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: T.primary,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: { fontSize: 12, fontFamily: TF.medium, color: T.muted, marginTop: 8 },
  formCard: {
    backgroundColor: T.card,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: theme.radius.card,
    padding: 14,
  },
  fieldLabel: { fontSize: 13, fontFamily: TF.bold, color: T.navy, marginBottom: 7 },
  fieldOptional: { fontSize: 12, fontFamily: TF.regular, color: T.muted },
  field: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: TF.medium,
    color: T.navy,
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
  },
  selectField: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  selectFieldText: { flex: 1, fontSize: 14, fontFamily: TF.semibold, color: T.navy },
  optionRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
  },
  optionButtonActive: { borderColor: T.primary, borderWidth: 1.5, backgroundColor: T.primarySoft },
  optionText: { fontSize: 13, fontFamily: TF.medium, color: T.textSecondary },
  optionTextActive: { fontFamily: TF.bold, color: T.navy },
  ageRow: { flexDirection: 'row', gap: 8 },
  ageInput: { flex: 1 },
  unitToggle: { flexDirection: 'row', backgroundColor: T.divider, borderRadius: 10, padding: 3, height: 46 },
  unitOption: { paddingHorizontal: 12, borderRadius: 8, justifyContent: 'center' },
  unitOptionActive: { backgroundColor: '#FFFFFF' },
  unitText: { fontSize: 12, fontFamily: TF.medium, color: T.muted },
  unitTextActive: { fontFamily: TF.bold, color: T.navy },
  weightField: { flexDirection: 'row', alignItems: 'center', marginBottom: 0 },
  weightInput: { flex: 1, fontSize: 14, fontFamily: TF.medium, color: T.navy, paddingVertical: 10 },
  weightUnit: { fontSize: 13, fontFamily: TF.semibold, color: T.muted },

  aboutHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  aboutTitle: { fontSize: 16, fontFamily: TF.bold, color: T.navy },
  aboutSubtitle: { fontSize: 12, fontFamily: TF.regular, color: T.muted, marginTop: 2 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 14 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 16,
    paddingHorizontal: 11,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  chipBlue: { backgroundColor: T.primary, borderColor: T.primary },
  chipOrange: { backgroundColor: '#FFF4DE', borderColor: '#FFE2AE' },
  chipText: { fontSize: 12, fontFamily: TF.medium, color: T.textSecondary },
  bioField: { minHeight: 80, paddingTop: 10, textAlignVertical: 'top', marginBottom: 4 },
  bioCounter: { fontSize: 10, fontFamily: TF.regular, color: '#9AA6B8', textAlign: 'right' },
  planCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: T.card,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 14,
    padding: 13,
    marginTop: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: T.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: T.primary },
  planCheckTitle: { fontSize: 13, fontFamily: TF.bold, color: T.navy },
  planCheckText: { fontSize: 11, fontFamily: TF.regular, color: T.muted, marginTop: 1 },

  sheetOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
  },
  sheetHandle: { width: 38, height: 4, borderRadius: 2, backgroundColor: '#D5DCE7', alignSelf: 'center', marginBottom: 14 },
  sheetTitle: { fontSize: 16, fontFamily: TF.bold, color: T.navy, marginBottom: 10 },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    marginBottom: 4,
  },
  sheetOptionActive: { backgroundColor: T.primarySoft, borderColor: T.primary },
  sheetOptionText: { flex: 1, fontSize: 14, fontFamily: TF.medium, color: T.navy },

  // ---- Padrão novo (Meus Pets) ----
  v2Card: {
    backgroundColor: T.card,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: theme.radius.bigCard,
  },
  v2EmptyCard: { alignItems: 'center', paddingVertical: 26, paddingHorizontal: 18 },
  v2EmptyTitle: { fontSize: 17, fontFamily: TF.bold, color: T.navy, marginTop: 14, textAlign: 'center' },
  v2EmptyText: { fontSize: 12, fontFamily: TF.regular, color: T.muted, textAlign: 'center', lineHeight: 18, marginTop: 6 },
  v2PrimaryButton: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 8,
    minHeight: 48,
    borderRadius: theme.radius.button,
    backgroundColor: T.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  v2PrimaryButtonText: { color: '#FFFFFF', fontSize: 14, fontFamily: TF.bold },
  v2SectionTitle: { fontSize: 15, fontFamily: TF.bold, color: T.navy, marginTop: 24, marginBottom: 10 },
  v2ListCard: { paddingHorizontal: 15, borderRadius: theme.radius.card },
  v2ReasonRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13 },
  v2ReasonText: { fontSize: 13, fontFamily: TF.medium, color: T.navy },
  v2Divider: { borderBottomWidth: 1, borderBottomColor: T.divider },

  v2Count: { fontSize: 12, fontFamily: TF.medium, color: T.muted, marginBottom: 10 },
  v2PetCard: { padding: 14, marginBottom: 12 },
  v2PetTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  v2PetInfo: { flex: 1 },
  v2PetName: { fontSize: 16, fontFamily: TF.bold, color: T.navy },
  v2PetDetails: { fontSize: 12, fontFamily: TF.regular, color: T.muted, marginTop: 2 },
  v2Badge: { borderRadius: 8, paddingHorizontal: 9, paddingVertical: 3 },
  v2BadgeActive: { backgroundColor: '#E7F6EF' },
  v2BadgeNoPlan: { backgroundColor: '#FFF4DE' },
  v2BadgeText: { fontSize: 11, fontFamily: TF.bold },
  v2Actions: { flexDirection: 'row', gap: 8, marginTop: 14 },
  v2MainAction: {
    flex: 1,
    minHeight: 40,
    borderRadius: 10,
    backgroundColor: T.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  v2MainActionSoft: { backgroundColor: T.primarySoft },
  v2MainActionText: { fontSize: 13, fontFamily: TF.bold, color: '#FFFFFF' },
  v2IconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  v2AddCard: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C9D3E3',
    borderRadius: theme.radius.card,
    paddingVertical: 14,
    marginTop: 2,
  },
  v2AddText: { fontSize: 13, fontFamily: TF.bold, color: T.primary },


  container: {
    flex: 1,
    backgroundColor: T.background,
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
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
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
  sectionHeader: {
    marginBottom: 16,
  },
  sectionMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 38,
    paddingHorizontal: 10,
  },
  illustrationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 28,
  },
  petCardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  petCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petAvatarFallback: {
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  petCardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  petCardName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  petCardDetails: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },
  petCardSubDetails: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  planBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 7,
  },
  activePlanBadge: {
    backgroundColor: '#DCFCE7',
  },
  noPlanBadge: {
    backgroundColor: '#F1F5F9',
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  activePlanText: {
    color: '#15803D',
  },
  noPlanText: {
    color: '#64748B',
  },
  petCardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  petCardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeProfileLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#183C98',
  },
  actionIconsRight: {
    flexDirection: 'row',
    gap: 10,
  },
  iconActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addPetButton: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  addPetButtonText: {
    color: '#183C98',
    fontWeight: '800',
    fontSize: 13,
  },
  progressBarRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 24,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  activeSegment: {
    backgroundColor: '#183C98',
  },
  avatarUploadSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
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
    backgroundColor: '#183C98',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 2,
  },
  avatarUploadText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 10,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  optionalText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '400',
  },
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
  selectText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    height: 120,
    fontSize: 13,
    color: '#0F172A',
    textAlignVertical: 'top',
  },
  primaryBtn: {
    backgroundColor: '#183C98',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    width: '100%',
    elevation: 2,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    color: '#475569',
    fontSize: 12,
    lineHeight: 18,
  },
  profilePetHeader: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  profilePetName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  profilePetSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  profilePetPlan: {
    fontSize: 12,
    fontWeight: '700',
    color: '#183C98',
    marginTop: 8,
  },
  profileTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 16,
  },
  profileTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  profileTabActive: {
    borderBottomColor: '#183C98',
  },
  profileTabText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  profileTabTextActive: {
    color: '#183C98',
    fontWeight: '800',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  detailRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },
  emptyDetailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyDetailText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
  },
  secondaryBtn: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#183C98',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  modalOption: {
    width: '100%',
    paddingVertical: 13,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#183C98',
  },
  modalCancel: {
    marginTop: 16,
    padding: 8,
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  toastCard: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    elevation: 5,
  },
  toastText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  menuButtonText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
});