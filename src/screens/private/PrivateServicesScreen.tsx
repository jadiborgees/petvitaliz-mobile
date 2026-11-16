import React, { useMemo, useState } from 'react';
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
  ImageBackground,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';
import { getSpeciesIcon } from '../../components/PetAvatar';
import type { Pet } from './PrivatePetsFlowScreen';
import {
  SERVICES,
  PLAN_NAMES,
  getPlanId,
  getServiceQuota,
  getMinimumPlan,
  type ServiceInfo,
  type ServiceId,
} from '../../data/planCoverage';

interface PrivateServicesScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToAddPet?: () => void;
  onSelectService?: (petId: string, serviceId: ServiceId) => void;
  pets: Pet[];
}

export default function PrivateServicesScreen({
  onBack,
  onNavigateToHome,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  onNavigateToAddPet,
  onSelectService,
  pets,
}: PrivateServicesScreenProps) {
  const [search, setSearch] = useState('');
  const [selectedPetId, setSelectedPetId] = useState<string | null>(pets[0]?.id ?? null);
  const [petPickerOpen, setPetPickerOpen] = useState(false);
  const [lockedService, setLockedService] = useState<ServiceInfo | null>(null);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId) ?? pets[0] ?? null;
  const planId = selectedPet?.hasActivePlan ? getPlanId(selectedPet.plan) : null;

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return SERVICES;
    return SERVICES.filter((service) => service.name.toLowerCase().includes(query));
  }, [search]);

  const handleServicePress = (service: ServiceInfo) => {
    if (!selectedPet) return;
    if (getServiceQuota(planId, service.id) === null) {
      setLockedService(service);
      return;
    }
    onSelectService?.(selectedPet.id, service.id);
  };

  const minimumPlan = lockedService ? getMinimumPlan(lockedService.id) : null;

  const renderPetAvatar = (pet: Pet) =>
    pet.avatar ? (
      <Image source={{ uri: pet.avatar }} style={styles.petAvatar} />
    ) : (
      <View style={styles.petAvatarPlaceholder}>
        <MaterialCommunityIcons name={getSpeciesIcon(pet.species)} size={24} color="#183C98" />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#183C98" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Serviços</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {pets.length === 0 ? (
          <View style={styles.noPetCard}>
            <Ionicons name="paw-outline" size={30} color="#183C98" />
            <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
            <Text style={styles.emptyDescription}>
              Cadastre um pet para ver os serviços disponíveis no plano dele.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={onNavigateToAddPet}>
              <Text style={styles.primaryButtonText}>Adicionar pet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Pet selecionado (o plano é por pet) */}
            <TouchableOpacity
              style={styles.selectedPet}
              activeOpacity={0.85}
              disabled={pets.length < 2}
              onPress={() => setPetPickerOpen((open) => !open)}
            >
              {selectedPet && renderPetAvatar(selectedPet)}
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{selectedPet?.name}</Text>
                <Text style={styles.petDescription}>
                  {selectedPet?.species} · {selectedPet?.breed}
                </Text>
                <Text style={planId ? styles.planBadgeText : styles.noPlanBadgeText}>
                  {planId ? PLAN_NAMES[planId].toUpperCase() : 'SEM PLANO'}
                </Text>
              </View>
              {pets.length > 1 && (
                <Ionicons
                  name={petPickerOpen ? 'chevron-up' : 'chevron-down'}
                  size={21}
                  color="#183C98"
                />
              )}
            </TouchableOpacity>

            {petPickerOpen && (
              <View style={styles.petPicker}>
                {pets.map((pet) => (
                  <TouchableOpacity
                    key={pet.id}
                    style={[styles.petOption, pet.id === selectedPet?.id && styles.petOptionSelected]}
                    onPress={() => {
                      setSelectedPetId(pet.id);
                      setPetPickerOpen(false);
                    }}
                  >
                    {renderPetAvatar(pet)}
                    <View style={styles.petInfo}>
                      <Text style={styles.petName}>{pet.name}</Text>
                      <Text style={styles.petDescription}>
                        {pet.hasActivePlan && pet.plan ? pet.plan : 'Sem plano'}
                      </Text>
                    </View>
                    {pet.id === selectedPet?.id && (
                      <Ionicons name="checkmark-circle" size={20} color="#183C98" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Pet sem plano (E8) */}
            {!planId && (
              <View style={styles.noPlanCard}>
                <Text style={styles.noPlanTitle}>
                  {selectedPet?.name} ainda não tem plano
                </Text>
                <Text style={styles.noPlanText}>
                  Contrate um plano para usar consultas, exames e banho e tosa.
                </Text>
                <TouchableOpacity style={styles.primaryButton} onPress={onNavigateToPlans}>
                  <Text style={styles.primaryButtonText}>Contratar plano</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Busca */}
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar serviço"
                placeholderTextColor="#94A3B8"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {/* Grade de serviços */}
            <View style={styles.grid}>
              {filteredServices.map((service) => {
                const quota = getServiceQuota(planId, service.id);
                const locked = quota === null;

                const content = (
                  <>
                    {!service.image && (
                      <View style={styles.cardIcon}>
                        <Ionicons name={service.icon} size={40} color="#183C98" />
                      </View>
                    )}
                    {locked && (
                      <View style={styles.lockBadge}>
                        <Ionicons name="lock-closed" size={14} color="#FFFFFF" />
                      </View>
                    )}
                    <View style={styles.cardOverlay}>
                      <Text style={styles.cardTitle}>{service.name}</Text>
                      <Text style={styles.cardSubtitle}>
                        {locked
                          ? 'Não incluso no plano'
                          : quota === 'ilimitado'
                            ? 'Ilimitado'
                            : `${quota}x por mês`}
                      </Text>
                    </View>
                  </>
                );

                return (
                  <TouchableOpacity
                    key={service.id}
                    style={[styles.card, locked && styles.cardLocked]}
                    activeOpacity={0.85}
                    onPress={() => handleServicePress(service)}
                  >
                    {service.image ? (
                      <ImageBackground
                        source={service.image}
                        style={styles.cardInner}
                        imageStyle={styles.cardImage}
                      >
                        {content}
                      </ImageBackground>
                    ) : (
                      <View style={[styles.cardInner, styles.cardPlain]}>{content}</View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {filteredServices.length === 0 && (
              <Text style={styles.emptyDescription}>
                Nenhum serviço encontrado para “{search}”.
              </Text>
            )}
          </>
        )}
      </ScrollView>

      {/* Serviço bloqueado (E6) */}
      <Modal
        visible={!!lockedService}
        transparent
        animationType="slide"
        onRequestClose={() => setLockedService(null)}
      >
        <View style={styles.sheetOverlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetIcon}>
              <Ionicons name="lock-closed" size={26} color="#183C98" />
            </View>
            <Text style={styles.sheetTitle}>{lockedService?.name}</Text>
            <Text style={styles.sheetText}>
              {minimumPlan
                ? `Não está incluso ${planId ? 'no seu plano' : 'para pets sem plano'}. Disponível a partir do ${PLAN_NAMES[minimumPlan]}.`
                : 'Este serviço não está disponível nos planos atuais.'}
            </Text>
            {minimumPlan && (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  setLockedService(null);
                  onNavigateToPlans?.();
                }}
              >
                <Text style={styles.primaryButtonText}>Ver {PLAN_NAMES[minimumPlan]}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setLockedService(null)}>
              <Text style={styles.secondaryButtonText}>Agora não</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <PrivateBottomNav
        currentRoute="PrivateHome"
        onNavigateToHome={onNavigateToHome}
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
  backButton: { padding: 4, width: 30 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#183C98' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 110 },

  selectedPet: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: '#DCE4EF',
    marginBottom: 12,
  },
  petPicker: { padding: 10, borderRadius: 14, backgroundColor: '#F8FAFC', marginBottom: 14 },
  petOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 13,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  petOptionSelected: { borderColor: '#183C98', backgroundColor: '#F5F8FF' },
  petAvatar: { width: 48, height: 48, borderRadius: 13 },
  petAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF3FC',
  },
  petInfo: { flex: 1, marginLeft: 12 },
  petName: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  petDescription: { fontSize: 11, color: '#64748B', marginTop: 3 },
  planBadgeText: { fontSize: 9, fontWeight: '800', color: '#183C98', marginTop: 4 },
  noPlanBadgeText: { fontSize: 9, fontWeight: '800', color: '#B45309', marginTop: 4 },

  noPlanCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  noPlanTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  noPlanText: { fontSize: 12, color: '#475569', lineHeight: 18 },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#0F172A' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', height: 150, borderRadius: 16, overflow: 'hidden', marginBottom: 14 },
  cardLocked: { opacity: 0.6 },
  cardInner: { flex: 1, justifyContent: 'flex-end' },
  cardImage: { borderRadius: 16 },
  cardPlain: { backgroundColor: '#EEF3FC' },
  cardIcon: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 40, alignItems: 'center', justifyContent: 'center' },
  cardOverlay: { backgroundColor: 'rgba(15, 23, 42, 0.55)', paddingHorizontal: 12, paddingVertical: 9 },
  cardTitle: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  cardSubtitle: { fontSize: 10, color: '#E2E8F0', marginTop: 2 },
  lockBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  noPetCard: {
    alignItems: 'center',
    padding: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 16,
  },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginVertical: 6, textAlign: 'center' },
  emptyDescription: { fontSize: 11, color: '#64748B', textAlign: 'center', lineHeight: 17 },

  primaryButton: {
    alignSelf: 'stretch',
    backgroundColor: '#183C98',
    minHeight: 48,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingHorizontal: 14,
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  secondaryButton: { alignSelf: 'stretch', minHeight: 46, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  secondaryButtonText: { color: '#183C98', fontWeight: '800', fontSize: 13 },

  sheetOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  sheetIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF3FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sheetTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  sheetText: { fontSize: 13, color: '#475569', textAlign: 'center', lineHeight: 19 },
});