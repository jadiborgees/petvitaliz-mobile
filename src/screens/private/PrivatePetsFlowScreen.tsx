
import React, { useEffect, useState } from 'react';
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
}

interface PrivatePetsFlowScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;

  pets: Pet[];
  onPetsChange: React.Dispatch<React.SetStateAction<Pet[]>>;
}

type FlowMode = 'list' | 'empty' | 'step1' | 'step2' | 'step3' | 'profile';
type ProfileTab = 'sobre' | 'saude' | 'historico';

const speciesList = ['Cachorro', 'Gato', 'Ave', 'Outro'];
const genderList = ['Macho', 'Fêmea'];

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

  const [isSpeciesModalVisible, setIsSpeciesModalVisible] = useState(false);
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);
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
    setPetAge(pet.age);
    setPetWeight(pet.weight);
    setPetBio(pet.bio);
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
    if (!petAge.trim()) {
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
      age: petAge.trim(),
      gender: petGender,
      weight: petWeight.trim(),
      plan: existingPet?.plan ?? null,
      hasActivePlan: existingPet?.hasActivePlan ?? false,
      bio: petBio.trim(),
      avatar: petImage,
    };

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
        <Ionicons name="paw" size={size * 0.42} color="#21479B" />
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
      <Ionicons name={icon} size={19} color="#21479B" />
      <Text style={styles.menuButtonText}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {mode === 'profile'
            ? 'Perfil Pet'
            : mode === 'step1'
              ? 'Identificação'
              : mode === 'step2'
                ? 'Características'
                : mode === 'step3'
                  ? 'Sobre o Pet'
                  : 'Meus Pets'}
        </Text>

        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {mode === 'empty' && (
          <View style={styles.emptyContainer}>
            <View style={styles.illustrationCircle}>
              <Ionicons name="paw" size={58} color="#21479B" />
            </View>

            <Text style={styles.emptyTitle}>
              Você ainda não tem nenhum pet cadastrado
            </Text>

            <Text style={styles.emptySubtitle}>
              Cadastre seu pet para manter as informações dele organizadas
              e acessar os serviços disponíveis.
            </Text>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={startNewPet}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Adicionar Pet</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'list' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionMainTitle}>Pets cadastrados</Text>
              <Text style={styles.sectionSubtitle}>
                Visualize e gerencie os pets da sua conta.
              </Text>
            </View>

            {pets.map((pet) => (
              <View key={pet.id} style={styles.petCardItem}>
                <View style={styles.petCardTop}>
                  {renderPetAvatar(pet, 58)}

                  <View style={styles.petCardInfo}>
                    <Text style={styles.petCardName}>{pet.name}</Text>

                    <Text style={styles.petCardDetails}>
                      {pet.species} · {pet.breed}
                    </Text>

                    <Text style={styles.petCardSubDetails}>
                      {pet.age} · {pet.gender}
                    </Text>

                    <View
                      style={[
                        styles.planBadge,
                        pet.hasActivePlan
                          ? styles.activePlanBadge
                          : styles.noPlanBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.planBadgeText,
                          pet.hasActivePlan
                            ? styles.activePlanText
                            : styles.noPlanText,
                        ]}
                      >
                        {pet.hasActivePlan
                          ? pet.plan || 'Plano ativo'
                          : 'Pet sem plano'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.petCardDivider} />

                <View style={styles.petCardActionsRow}>
                  <TouchableOpacity
                    onPress={() => openPetProfile(pet)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.seeProfileLink}>Ver perfil ›</Text>
                  </TouchableOpacity>

                  <View style={styles.actionIconsRight}>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => startEditingPet(pet)}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={17}
                        color="#64748B"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => requestDeletePet(pet)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={17}
                        color="#DC2626"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addPetButton}
              onPress={startNewPet}
              activeOpacity={0.85}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color="#21479B"
              />
              <Text style={styles.addPetButtonText}>
                Adicionar outro pet
              </Text>
            </TouchableOpacity>
          </>
        )}

        {mode === 'step1' && (
          <>
            <View style={styles.progressBarRow}>
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={styles.progressSegment} />
              <View style={styles.progressSegment} />
            </View>

            <View style={styles.avatarUploadSection}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePickPetImage}
                style={styles.avatarContainerMain}
              >
                {petImage ? (
                  <Image
                    source={{ uri: petImage }}
                    style={styles.avatarImageStyle}
                  />
                ) : (
                  <View style={styles.avatarPlaceholderInner}>
                    <Ionicons
                      name="camera-outline"
                      size={32}
                      color="#94A3B8"
                    />
                  </View>
                )}

                <View style={styles.cameraBadgeFixed}>
                  <Ionicons name="add" size={14} color="#FFFFFF" />
                </View>
              </TouchableOpacity>

              <Text style={styles.avatarUploadText}>
                Foto do pet (opcional)
              </Text>
            </View>

            <Text style={styles.sectionLabel}>DADOS BÁSICOS</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex.: Lua"
                placeholderTextColor="#94A3B8"
                value={petName}
                onChangeText={setPetName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Espécie *</Text>
              <TouchableOpacity
                style={styles.selectBox}
                onPress={() => setIsSpeciesModalVisible(true)}
              >
                <Text style={styles.selectText}>{petSpecies}</Text>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Raça <Text style={styles.optionalText}>(opcional)</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ex.: Golden Retriever ou SRD"
                placeholderTextColor="#94A3B8"
                value={petBreed}
                onChangeText={setPetBreed}
              />
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => {
                if (validateStep1()) setMode('step2');
              }}
            >
              <Text style={styles.primaryBtnText}>Continuar</Text>
            </TouchableOpacity>
          </>
        )}

        {mode === 'step2' && (
          <>
            <View style={styles.progressBarRow}>
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={styles.progressSegment} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sexo *</Text>
              <TouchableOpacity
                style={styles.selectBox}
                onPress={() => setIsGenderModalVisible(true)}
              >
                <Text style={styles.selectText}>{petGender}</Text>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Idade aproximada *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex.: 4 anos"
                placeholderTextColor="#94A3B8"
                value={petAge}
                onChangeText={setPetAge}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Peso atual <Text style={styles.optionalText}>(opcional)</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ex.: 28 kg"
                placeholderTextColor="#94A3B8"
                value={petWeight}
                onChangeText={setPetWeight}
              />
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => {
                if (validateStep2()) setMode('step3');
              }}
            >
              <Text style={styles.primaryBtnText}>Continuar</Text>
            </TouchableOpacity>
          </>
        )}

        {mode === 'step3' && (
          <>
            <View style={styles.progressBarRow}>
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={[styles.progressSegment, styles.activeSegment]} />
              <View style={[styles.progressSegment, styles.activeSegment]} />
            </View>

            <Text style={styles.sectionLabel}>SOBRE O PET</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Personalidade e hábitos (opcional)
              </Text>
              <TextInput
                style={styles.textArea}
                placeholder="Conte um pouco sobre a personalidade e os hábitos do seu pet..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={5}
                value={petBio}
                onChangeText={setPetBio}
              />
            </View>

            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#21479B"
              />
              <Text style={styles.infoText}>
                O cadastro do pet é gratuito. Você poderá contratar um plano
                separadamente quando desejar.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={savePet}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>
                {editingPetId ? 'Salvar alterações' : 'Concluir cadastro'}
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
              <Ionicons name="pencil-outline" size={17} color="#21479B" />
              <Text style={styles.secondaryBtnText}>
                Editar informações
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <Modal
        visible={isSpeciesModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSpeciesModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a espécie</Text>

            {speciesList.map((species) => (
              <TouchableOpacity
                key={species}
                style={styles.modalOption}
                onPress={() => {
                  setPetSpecies(species);
                  setIsSpeciesModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{species}</Text>
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

      <Modal
        visible={isGenderModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsGenderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o sexo</Text>

            {genderList.map((gender) => (
              <TouchableOpacity
                key={gender}
                style={styles.modalOption}
                onPress={() => {
                  setPetGender(gender);
                  setIsGenderModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{gender}</Text>
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

      {!!successMessage && (
        <View style={styles.toastCard}>
          <Ionicons name="checkmark-circle" size={19} color="#10B981" />
          <Text style={styles.toastText}>{successMessage}</Text>
        </View>
      )}

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
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    color: '#21479B',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 120,
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
    color: '#21479B',
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
    color: '#21479B',
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
    backgroundColor: '#21479B',
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
    backgroundColor: '#21479B',
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
    color: '#21479B',
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
    borderBottomColor: '#21479B',
  },
  profileTabText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  profileTabTextActive: {
    color: '#21479B',
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
    color: '#21479B',
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
    color: '#21479B',
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
