import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Platform,
  Dimensions,
  Modal,
  Pressable,
  TextInput,
  Keyboard,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme/privateTheme';
import PrivateBottomNav from '../../components/PrivateBottomNav';
import PetAvatar from '../../components/PetAvatar';
import type { Pet } from './PrivatePetsFlowScreen';
import { PLAN_NAMES, PLAN_COVERAGE, SERVICES as PLAN_SERVICES, getPlanId } from '../../data/planCoverage';
import type { ConsultationAppointment } from './PrivateConsultationsScreen';

// Dados de cobrança do plano contratado (para mostrar a renovação).
type HomeSubscription = {
  petId: string;
  petName: string;
  billingCycle: 'monthly' | 'yearly';
  status: 'paid' | 'pending';
  startedAt?: string;
};

interface PrivateHomeScreenProps {
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToSupport?: () => void;
  onNavigateToPets?: () => void;
  onNavigateToConsultations?: () => void;
  onNavigateToPersonalData?: () => void;
  onNavigateToPaymentMethods?: () => void;
  onNavigateToNotifications?: () => void;
  onNavigateToSecurity?: () => void;
  onLogout?: () => void;
  userName?: string;
  userEmail?: string;
  profileImage?: string | null;
  pets?: Pet[];
  subscription?: HomeSubscription | null;
  onNavigateToMyPlan?: () => void;
  onContractPlan?: (petId: string) => void;
  onNavigateToTerms?: () => void;
  upcomingCount?: number; // consultas marcadas (para o atalho)
  appointments?: ConsultationAppointment[];
  onOpenPlan?: (planId: string) => void;
}

interface ServiceSlide {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  image?: ImageSourcePropType;
}

const { width } = Dimensions.get('window');

const BANNER_WIDTH = width - 40;
const BANNER_GAP = 16;
const SERVICE_WIDTH = width * 0.7;
const SERVICE_GAP = 12;

const PRIMARY = '#183C98';
const BACKGROUND = '#F6F8FC';
const PALE_BLUE = '#E8EEFA';

// Plano de cada banner, na mesma ordem da lista abaixo.
const BANNER_PLAN_IDS = ['bronze', 'prata', 'ouro', 'diamante'];

const BANNERS: ImageSourcePropType[] = [
  require('../../assets/Plano-Bronze.png'),
  require('../../assets/Plano-Prata.png'),
  require('../../assets/Plano-Ouro.png'),
  require('../../assets/Plano-Diamante.png'),
];

const SERVICES: ServiceSlide[] = [
  {
    id: '1',
    name: 'Banho e Tosa',
    description: 'Higiene completa com produtos suaves para a pele do seu pet.',
    icon: 'water-outline',
    color: '#0284C7',
    bg: '#E0F2FE',
    image: require('../../assets/banho-tosa.jpg'),
  },
  {
    id: '2',
    name: 'Exames Veterinários',
    description: 'Exames laboratoriais e de imagem para cuidar da saúde do seu pet.',
    icon: 'flask-outline',
    color: '#CA8A04',
    bg: '#FEF9C3',
    image: require('../../assets/exames.jpg'),
  },
  {
    id: '3',
    name: 'Vacinação',
    description: 'Proteção e prevenção para manter a saúde do seu pet em dia.',
    icon: 'medical-outline',
    color: '#16A34A',
    bg: '#DCFCE7',
    image: require('../../assets/vacinacao.jpg'),
  },
  {
    id: '4',
    name: 'Emergência 24h',
    description: 'Atendimento veterinário de emergência a qualquer hora.',
    icon: 'alert-circle-outline',
    color: '#DC2626',
    bg: '#FEE2E2',
    image: require('../../assets/emergencia.jpg'),
  },
  {
    id: '5',
    name: 'Leva e Busca',
    description: 'Buscamos e levamos seu pet com segurança e conforto.',
    icon: 'car-outline',
    color: '#2563EB',
    bg: '#EFF6FF',
    image: require('../../assets/leva-busca.jpg'),
  },
];

export default function PrivateHomeScreen({
  onNavigateToHome,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  onNavigateToServices,
  onNavigateToSupport,
  onNavigateToPets,
  onNavigateToConsultations,
  onNavigateToPersonalData,
  onNavigateToPaymentMethods,
  onNavigateToNotifications,
  onNavigateToSecurity,
  onLogout,
  profileImage,
  userName = 'Jadi Borges',
  userEmail = '',
  pets = [],
  subscription,
  onNavigateToMyPlan,
  onContractPlan,
  onNavigateToTerms,
  upcomingCount = 0,
  appointments = [],
  onOpenPlan,
}: PrivateHomeScreenProps) {
  const activePlans = pets.filter((pet) => pet.hasActivePlan).length;
  const firstName = userName.trim().split(' ')[0] || 'Usuário';
  const initial = firstName.charAt(0).toUpperCase();

  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase('pt-BR');

  const filteredServices = SERVICES.filter((service) => {
    if (!normalizedSearchQuery) return true;
    return `${service.name} ${service.description}`.toLocaleLowerCase('pt-BR').includes(normalizedSearchQuery);
  });

  const searchSuggestions = normalizedSearchQuery
    ? SERVICES.filter((service) =>
        `${service.name} ${service.description}`.toLocaleLowerCase('pt-BR').includes(normalizedSearchQuery),
      ).slice(0, 5)
    : []; 

  // Carrossel de banners
  const bannerRef = useRef<ScrollView>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const totalBanners = BANNERS.length;

  // Carrossel de serviços
  const servicesRef = useRef<ScrollView>(null);
  const [serviceIndex, setServiceIndex] = useState(0);

  // Fechar menu e executar ação
  const handleMenuNavigation = (action?: () => void) => {
    setAccountMenuVisible(false);

    setTimeout(() => {
      action?.();
    }, 250);
  };

  // Rotação automática dos banners
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => {
        const next = (prev + 1) % totalBanners;

        bannerRef.current?.scrollTo({
          x: next * (BANNER_WIDTH + BANNER_GAP),
          animated: true,
        });

        return next;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Rotação automática dos serviços
  useEffect(() => {
    const timer = setInterval(() => {
      if (searchQuery.trim()) return;
      setServiceIndex((prev) => {
        const next = (prev + 1) % SERVICES.length;

        servicesRef.current?.scrollTo({
          x: next * (SERVICE_WIDTH + SERVICE_GAP),
          animated: true,
        });

        return next;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [searchQuery]);

  const renderMenuItem = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    action?: () => void,
  ) => (
    <TouchableOpacity
      key={title}
      style={styles.menuItem}
      activeOpacity={0.7}
      onPress={() => handleMenuNavigation(action)}
    >
      <View style={styles.menuItemIcon}>
        <Ionicons name={icon} size={20} color={PRIMARY} />
      </View>

      <Text style={styles.menuItemText}>{title}</Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#A0A9B8"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={BACKGROUND}
      />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.avatarButton}
          activeOpacity={0.85}
          onPress={() => setAccountMenuVisible(true)}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          )}
        </TouchableOpacity>

        {searchVisible ? (
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={19} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={(value) => {
                setSearchQuery(value);
                setServiceIndex(0);
                servicesRef.current?.scrollTo({ x: 0, animated: false });
              }}
              placeholder="Buscar serviços..."
              placeholderTextColor="#94A3B8"
              autoFocus
              returnKeyType="search"
              autoCapitalize="none"
            />
            {!!searchQuery && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setServiceIndex(0);
                  servicesRef.current?.scrollTo({ x: 0, animated: false });
                }}
                hitSlop={8}
              >
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setSearchVisible(false);
                setSearchQuery('');
                setServiceIndex(0);
                servicesRef.current?.scrollTo({ x: 0, animated: false });
              }}
              hitSlop={8}
              style={styles.closeSearchButton}
            >
              <Ionicons name="close" size={19} color="#475569" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greetingText}>
                Olá, {firstName}!
              </Text>

              <Text style={styles.headerTitle}>
                O que você procura hoje?
              </Text>
            </View>

            <TouchableOpacity
              style={styles.searchButton}
              activeOpacity={0.7}
              onPress={() => setSearchVisible(true)}
            >
              <Ionicons name="search-outline" size={21} color="#0F172A" />
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.notificationButton}
          activeOpacity={0.7}
          onPress={onNavigateToNotifications}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color="#0F172A"
          />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>

        {searchVisible && normalizedSearchQuery.length > 0 && (
          <View style={styles.searchSuggestionsContainer}>
            {searchSuggestions.length > 0 ? (
              searchSuggestions.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.searchSuggestionItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSearchQuery(service.name);
                    setServiceIndex(0);
                    servicesRef.current?.scrollTo({ x: 0, animated: false });
                    Keyboard.dismiss();
                  }}
                >
                  <View style={styles.searchSuggestionTextContainer}>
                    <Text style={styles.searchSuggestionTitle}>{service.name}</Text>
                    <Text style={styles.searchSuggestionDescription} numberOfLines={1}>
                      {service.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noSuggestions}>
                <Text style={styles.noSuggestionsText}>Nenhum serviço encontrado</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* CONTEÚDO DA HOME */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* BANNERS */}
        <View style={styles.bannerWrapper}>
          <ScrollView
            ref={bannerRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bannerContainer}
            onMomentumScrollEnd={(e) => {
              setBannerIndex(
                Math.round(
                  e.nativeEvent.contentOffset.x /
                  (BANNER_WIDTH + BANNER_GAP)
                )
              );
            }}
          >
            {BANNERS.map((banner, index) => (
              // Tocar no banner (ou no "Assine agora") abre o plano dele.
              <TouchableOpacity
                key={`banner-${index}`}
                activeOpacity={0.92}
                onPress={() => onOpenPlan?.(BANNER_PLAN_IDS[index])}
              >
                <Image source={banner} style={styles.bannerImage} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.paginationDots}>
            {[...Array(totalBanners)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  bannerIndex === i
                    ? styles.activeDot
                    : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* MEU PLANO */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Meu plano</Text>
          {pets.length > 0 && (
            <TouchableOpacity onPress={onNavigateToMyPlan ?? onNavigateToPlans} activeOpacity={0.7}>
              <Text style={styles.seeMoreLink}>Ver tudo</Text>
            </TouchableOpacity>
          )}
        </View>

        {pets.length === 0 ? (
          /* Chamada para cadastrar o primeiro pet */
          <TouchableOpacity style={styles.mpHero} activeOpacity={0.92} onPress={onNavigateToPets}>
            <View style={styles.mpHeroCircleBig} />
            <View style={styles.mpHeroCircle} />
            <Image source={require('../../assets/pets-abraco.png')} style={styles.mpHeroImage} resizeMode="contain" />
            <View style={styles.mpHeroText}>
              <Text style={styles.mpHeroEyebrow}>Primeiro passo</Text>
              <Text style={styles.mpHeroTitle}>Cadastre seu pet e escolha um plano</Text>
              <Text style={styles.mpHeroSubtitle}>Consultas, vacinas e banho.</Text>
              <View style={styles.mpHeroButton}>
                <Feather name="plus" size={15} color={T.navy} />
                <Text style={styles.mpHeroButtonText}>Adicionar pet</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.plansRow}>
            {pets.map((pet) => {
              const planId = pet.hasActivePlan ? getPlanId(pet.plan) : null;
              const details = subscription && subscription.petId === pet.id ? subscription : null;
              const petDetails = [pet.breed, pet.age].filter(Boolean).join(' · ');

              // Renovação: data da contratação + 1 mês (mensal) ou + 1 ano (anual).
              let renewal: string | null = null;
              if (details?.startedAt) {
                const date = new Date(details.startedAt);
                if (details.billingCycle === 'yearly') date.setFullYear(date.getFullYear() + 1);
                else date.setMonth(date.getMonth() + 1);
                renewal = date
                  .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
                  .replace(/\./g, '')
                  .replace(/ de /g, ' ');
              }

              // Barrinha: o serviço com cota mais usada no mês.
              let usage: { name: string; used: number; quota: number } | null = null;
              if (planId) {
                const now = new Date();
                const coverage = PLAN_COVERAGE[planId];
                PLAN_SERVICES.forEach((service) => {
                  const quota = coverage[service.id];
                  if (typeof quota !== 'number') return;
                  const used = appointments.filter((item) => {
                    if (item.petId !== pet.id || item.status === 'cancelled') return false;
                    const [year, month] = item.date.split('-').map(Number);
                    return (
                      (item.serviceId ?? 'consulta') === service.id &&
                      year === now.getFullYear() &&
                      month === now.getMonth() + 1
                    );
                  }).length;
                  if (!usage || used / quota > usage.used / usage.quota) {
                    usage = { name: service.name, used, quota };
                  }
                });
              }
              const usageInfo = usage as { name: string; used: number; quota: number } | null;

              return (
                <TouchableOpacity
                  key={pet.id}
                  style={styles.mpCard}
                  activeOpacity={0.9}
                  onPress={() =>
                    planId
                      ? (onNavigateToMyPlan ?? onNavigateToPlans)?.()
                      : onContractPlan
                        ? onContractPlan(pet.id)
                        : onNavigateToPlans?.()
                  }
                >
                  <View style={styles.mpTop}>
                    <PetAvatar species={pet.species} avatar={pet.avatar} size={44} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.mpPetName} numberOfLines={1}>{pet.name}</Text>
                      <Text style={styles.mpPetDetails} numberOfLines={1}>{petDetails || pet.species}</Text>
                    </View>
                    <View style={[styles.mpBadge, !planId && styles.mpBadgeNoPlan]}>
                      <Text style={[styles.mpBadgeText, !planId && { color: T.warning }]}>
                        {planId ? (details?.status === 'pending' ? 'Pendente' : 'Ativo') : 'Sem plano'}
                      </Text>
                    </View>
                  </View>

                  {planId ? (
                    <>
                      <View style={styles.mpPlanRow}>
                        <MaterialCommunityIcons name="crown-outline" size={19} color={T.warning} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.mpPlanName}>{PLAN_NAMES[planId]}</Text>
                          <Text style={styles.mpPlanNote}>{renewal ? `Renova em ${renewal}` : 'Plano ativo'}</Text>
                        </View>
                      </View>
                      {usageInfo ? (
                        <View style={{ marginTop: 10 }}>
                          <View style={styles.mpUsageRow}>
                            <Text style={styles.mpUsageText}>{usageInfo.name} no mês</Text>
                            <Text style={styles.mpUsageText}>
                              {Math.min(usageInfo.used, usageInfo.quota)} de {usageInfo.quota}
                            </Text>
                          </View>
                          <View style={styles.mpBarTrack}>
                            <View
                              style={[
                                styles.mpBarFill,
                                {
                                  width: `${Math.max(Math.min(usageInfo.used / usageInfo.quota, 1) * 100, 4)}%` as `${number}%`,
                                  backgroundColor: usageInfo.used >= usageInfo.quota ? T.warning : T.primary,
                                },
                              ]}
                            />
                          </View>
                        </View>
                      ) : (
                        <Text style={[styles.mpUsageText, { marginTop: 10 }]}>Serviços ilimitados no mês</Text>
                      )}
                    </>
                  ) : (
                    <View style={styles.mpChooseButton}>
                      <Text style={styles.mpChooseText}>Escolher um plano</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* SERVIÇOS */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Serviços</Text>

          <TouchableOpacity
            onPress={onNavigateToServices}
            activeOpacity={0.7}
          >
            <Text style={styles.seeMoreLink}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={servicesRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SERVICE_WIDTH + SERVICE_GAP}
          decelerationRate="fast"
          contentContainerStyle={styles.servicesRow}
          onMomentumScrollEnd={(e) => {
            setServiceIndex(
              Math.round(
                e.nativeEvent.contentOffset.x /
                (SERVICE_WIDTH + SERVICE_GAP)
              )
            );
          }}
        >
          {filteredServices.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={onNavigateToServices}
              style={styles.serviceSlideWrapper}
            >
              {(() => {
                const content = (
                  <>
                    {!item.image && (
                      <View style={styles.serviceIconBig}>
                        <Ionicons
                          name={item.icon}
                          size={56}
                          color={item.color}
                        />
                      </View>
                    )}

                    <View style={styles.serviceOverlay}>
                      <Text style={styles.serviceTitle}>
                        {item.name}
                      </Text>

                      <Text
                        style={styles.serviceDescription}
                        numberOfLines={2}
                      >
                        {item.description}
                      </Text>
                    </View>
                  </>
                );

                return item.image ? (
                  <ImageBackground
                    source={item.image}
                    style={styles.serviceSlide}
                    imageStyle={styles.serviceSlideImage}
                  >
                    {content}
                  </ImageBackground>
                ) : (
                  <View
                    style={[
                      styles.serviceSlide,
                      { backgroundColor: item.bg },
                    ]}
                  >
                    {content}
                  </View>
                );
              })()}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredServices.length === 0 && (
          <Text style={styles.noSearchResults}>
            Nenhum serviço encontrado para “{searchQuery}”.
          </Text>
        )}

        {filteredServices.length > 0 && (
          <View style={styles.paginationDots}>
          {filteredServices.map((item, i) => (
            <View
              key={item.id}
              style={[
                styles.dot,
                serviceIndex === i
                  ? styles.activeDot
                  : styles.inactiveDot,
              ]}
            />
          ))}
          </View>
        )}

        {/* SUPORTE */}
        <TouchableOpacity
          style={styles.supportRow}
          activeOpacity={0.85}
          onPress={onNavigateToSupport}
        >
          <View style={styles.supportIcon}>
            <Ionicons
              name="headset-outline"
              size={20}
              color={T.primary}
            />
          </View>

          <View style={styles.supportText}>
            <Text style={styles.supportTitle}>
              Falar com nossa equipe
            </Text>

            <Text style={styles.supportSubtitle}>
              Atendimento por chat ou WhatsApp
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* AVALIAÇÃO */}
        <TouchableOpacity
          style={styles.ratingRow}
          activeOpacity={0.85}
          onPress={onNavigateToSupport}
        >
          <View style={styles.ratingIcon}>
            <Ionicons
              name="star-outline"
              size={20}
              color="#E5A800"
            />
          </View>

          <View style={styles.ratingText}>
            <Text style={styles.ratingTitle}>
              Como está sua experiência?
            </Text>

            <Text style={styles.ratingSubtitle}>
              Sua opinião nos ajuda a melhorar sempre.
            </Text>
          </View>

          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name="star-outline"
                size={15}
                color="#E5A800"
              />
            ))}
          </View>

          <Ionicons
            name="chevron-forward"
            size={17}
            color="#94A3B8"
          />
        </TouchableOpacity>
      </ScrollView>

      {/* BARRA INFERIOR */}
      <PrivateBottomNav
        currentRoute="PrivateHome"
        onNavigateToHome={onNavigateToHome}
        onNavigateToPlans={onNavigateToPlans}
        onNavigateToBenefits={onNavigateToBenefits}
        onNavigateToProfile={onNavigateToProfile}
      />

      {/* MENU MINHA CONTA */}
      <Modal
        visible={accountMenuVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setAccountMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalBackdrop} onPress={() => setAccountMenuVisible(false)} />

          <View style={styles.accSheet}>
            <View style={styles.accHandle} />

            <View style={styles.accHeader}>
              <Text style={styles.accTitle}>Minha conta</Text>
              <TouchableOpacity style={styles.accClose} onPress={() => setAccountMenuVisible(false)}>
                <Feather name="x" size={18} color={T.navy} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.accScroll}>
              {/* Perfil */}
              <View style={[styles.accCard, styles.accProfile]}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.accAvatar} />
                ) : (
                  <View style={styles.accAvatar}>
                    <Text style={styles.accAvatarText}>{initial}</Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.accName} numberOfLines={1}>{userName}</Text>
                  <Text style={styles.accEmail} numberOfLines={1}>{userEmail || 'E-mail não informado'}</Text>
                </View>
                <TouchableOpacity onPress={() => handleMenuNavigation(onNavigateToPersonalData)}>
                  <Text style={styles.accLink}>Editar</Text>
                </TouchableOpacity>
              </View>

              {/* Atalhos */}
              <View style={styles.accShortcuts}>
                {[
                  {
                    key: 'pets',
                    icon: 'paw' as const,
                    title: 'Meus pets',
                    note: pets.length === 1 ? '1 pet' : `${pets.length} pets`,
                    onPress: onNavigateToPets,
                  },
                  {
                    key: 'consultas',
                    icon: 'calendar-blank-outline' as const,
                    title: 'Consultas',
                    note:
                      upcomingCount === 0
                        ? 'Nenhuma marcada'
                        : upcomingCount === 1
                          ? '1 próxima'
                          : `${upcomingCount} próximas`,
                    onPress: onNavigateToConsultations,
                  },
                  {
                    key: 'plano',
                    icon: 'crown-outline' as const,
                    title: 'Meu plano',
                    note: activePlans === 0 ? 'Nenhum ativo' : activePlans === 1 ? '1 ativo' : `${activePlans} ativos`,
                    onPress: onNavigateToMyPlan ?? onNavigateToPlans,
                  },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.accCard, styles.accShortcut]}
                    activeOpacity={0.8}
                    onPress={() => handleMenuNavigation(item.onPress)}
                  >
                    <View style={styles.accShortcutIcon}>
                      <MaterialCommunityIcons name={item.icon} size={19} color={T.primary} />
                    </View>
                    <Text style={styles.accShortcutTitle}>{item.title}</Text>
                    <Text style={styles.accShortcutNote}>{item.note}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Conta e preferências */}
              <Text style={styles.accSection}>Conta e preferências</Text>
              <View style={[styles.accCard, styles.accList]}>
                {[
                  { icon: 'user' as const, title: 'Dados pessoais', onPress: onNavigateToPersonalData },
                  { icon: 'credit-card' as const, title: 'Formas de pagamento', onPress: onNavigateToPaymentMethods },
                  { icon: 'bell' as const, title: 'Notificações', onPress: onNavigateToNotifications },
                  { icon: 'shield' as const, title: 'Segurança', onPress: onNavigateToSecurity },
                ].map((item, index, list) => (
                  <TouchableOpacity
                    key={item.title}
                    style={[styles.accRow, index < list.length - 1 && styles.accDivider]}
                    activeOpacity={0.75}
                    onPress={() => handleMenuNavigation(item.onPress)}
                  >
                    <Feather name={item.icon} size={18} color={T.primary} />
                    <Text style={styles.accRowText}>{item.title}</Text>
                    <Feather name="chevron-right" size={18} color="#9AA6B8" />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Ajuda */}
              <Text style={styles.accSection}>Ajuda</Text>
              <View style={[styles.accCard, styles.accList]}>
                {[
                  { icon: 'headphones' as const, title: 'Ajuda e suporte', onPress: onNavigateToSupport },
                  { icon: 'file-text' as const, title: 'Termos e privacidade', onPress: onNavigateToTerms },
                ].map((item, index, list) => (
                  <TouchableOpacity
                    key={item.title}
                    style={[styles.accRow, index < list.length - 1 && styles.accDivider]}
                    activeOpacity={0.75}
                    onPress={() => handleMenuNavigation(item.onPress)}
                  >
                    <Feather name={item.icon} size={18} color={T.primary} />
                    <Text style={styles.accRowText}>{item.title}</Text>
                    <Feather name="chevron-right" size={18} color="#9AA6B8" />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Sair */}
              <TouchableOpacity style={styles.accLogout} activeOpacity={0.7} onPress={() => handleMenuNavigation(onLogout)}>
                <Feather name="log-out" size={17} color={T.danger} />
                <Text style={styles.accLogoutText}>Sair da conta</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const T = theme.colors;
const TF = theme.fonts;

const styles = StyleSheet.create({
  // ---- Meu plano (Home) ----
  mpHero: {
    marginHorizontal: 20,
    height: 172,
    borderRadius: 22,
    backgroundColor: T.primary,
    overflow: 'hidden',
  },
  mpHeroCircleBig: {
    position: 'absolute',
    right: -50,
    top: -40,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: '#2148AA',
  },
  mpHeroCircle: {
    position: 'absolute',
    right: -20,
    top: -10,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#2C55BC',
  },
  mpHeroImage: { position: 'absolute', right: 6, bottom: 8, width: 159, height: 134 },
  mpHeroText: { position: 'absolute', left: 18, top: 18, width: '52%' },
  mpHeroEyebrow: { fontSize: 12, fontFamily: TF.medium, color: '#B9C8E6' },
  mpHeroTitle: { fontSize: 17, fontFamily: TF.bold, color: '#FFFFFF', lineHeight: 22, marginTop: 4 },
  mpHeroSubtitle: { fontSize: 12, fontFamily: TF.regular, color: '#C9D6EE', marginTop: 5 },
  mpHeroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: T.brandYellow,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginTop: 12,
  },
  mpHeroButtonText: { fontSize: 13, fontFamily: TF.bold, color: T.navy },

  mpCard: {
    width: 250,
    backgroundColor: T.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
  },
  mpTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mpPetName: { fontSize: 15, fontFamily: TF.bold, color: T.navy },
  mpPetDetails: { fontSize: 11, fontFamily: TF.regular, color: T.muted, marginTop: 1 },
  mpBadge: { backgroundColor: '#E7F6EF', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  mpBadgeNoPlan: { backgroundColor: '#FFF4DE' },
  mpBadgeText: { fontSize: 10, fontFamily: TF.bold, color: T.success },
  mpPlanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.divider,
  },
  mpPlanName: { fontSize: 13, fontFamily: TF.bold, color: T.navy },
  mpPlanNote: { fontSize: 11, fontFamily: TF.regular, color: T.muted, marginTop: 1 },
  mpUsageRow: { flexDirection: 'row', justifyContent: 'space-between' },
  mpUsageText: { fontSize: 11, fontFamily: TF.regular, color: T.muted },
  mpBarTrack: { height: 5, borderRadius: 3, backgroundColor: T.divider, marginTop: 5, overflow: 'hidden' },
  mpBarFill: { height: 5, borderRadius: 3 },
  mpChooseButton: {
    marginTop: 14,
    minHeight: 38,
    borderRadius: 11,
    backgroundColor: T.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mpChooseText: { fontSize: 12, fontFamily: TF.bold, color: '#FFFFFF' },

  // ---- Menu Minha conta (padrão novo) ----
  accSheet: {
    backgroundColor: T.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 10,
  },
  accHandle: { width: 38, height: 4, borderRadius: 2, backgroundColor: '#D5DCE7', alignSelf: 'center', marginBottom: 12 },
  accHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, marginBottom: 12 },
  accTitle: { fontSize: 19, fontFamily: TF.bold, color: T.navy },
  accClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: T.divider, alignItems: 'center', justifyContent: 'center' },
  accScroll: { paddingHorizontal: 18, paddingBottom: 36 },
  accCard: { backgroundColor: T.card, borderWidth: 1, borderColor: T.border, borderRadius: theme.radius.card },
  accProfile: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, borderRadius: theme.radius.bigCard },
  accAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: T.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accAvatarText: { fontSize: 19, fontFamily: TF.bold, color: '#FFFFFF' },
  accName: { fontSize: 16, fontFamily: TF.bold, color: T.navy },
  accEmail: { fontSize: 12, fontFamily: TF.regular, color: T.muted, marginTop: 2 },
  accLink: { fontSize: 13, fontFamily: TF.bold, color: T.primary },
  accShortcuts: { flexDirection: 'row', gap: 8, marginTop: 12 },
  accShortcut: { flex: 1, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4 },
  accShortcutIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: T.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  accShortcutTitle: { fontSize: 12, fontFamily: TF.bold, color: T.navy, textAlign: 'center' },
  accShortcutNote: { fontSize: 10, fontFamily: TF.regular, color: T.muted, marginTop: 2, textAlign: 'center' },
  accSection: { fontSize: 14, fontFamily: TF.bold, color: T.navy, marginTop: 20, marginBottom: 8 },
  accList: { paddingHorizontal: 14 },
  accRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  accDivider: { borderBottomWidth: 1, borderBottomColor: T.divider },
  accRowText: { flex: 1, fontSize: 14, fontFamily: TF.semibold, color: T.navy },
  accLogout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 18, marginTop: 6 },
  accLogoutText: { fontSize: 14, fontFamily: TF.bold, color: T.danger },

  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  // CABEÇALHO
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex: 20,
    elevation: 8,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android'
      ? (StatusBar.currentHeight || 24) + 8
      : 12,
    paddingBottom: 12,
  },

  avatarButton: {
    marginRight: 10,
  },

  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAB308',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
  },

  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },

  searchButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },

  searchInputContainer: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#DCE4F1',
    paddingHorizontal: 12,
    marginRight: 8,
  },

  searchSuggestionsContainer: {
    position: 'absolute',
    // Fica abaixo do campo de busca, sem cobrir o texto digitado.
    top: 82,
    left: 64,
    right: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7EBF2',
    paddingVertical: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 14,
    zIndex: 30,
  },

  searchSuggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 46,
  },

  searchSuggestionTextContainer: {
    flex: 1,
  },

  searchSuggestionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.15,
    color: '#26344D',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
  },

  searchSuggestionDescription: {
    fontSize: 10,
    fontWeight: '400',
    letterSpacing: 0.1,
    color: '#8993A3',
    marginTop: 3,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },

  noSuggestions: {
    paddingHorizontal: 14,
    paddingVertical: 16,
  },

  noSuggestionsText: {
    color: '#64748B',
    fontSize: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
    paddingHorizontal: 8,
  },

  closeSearchButton: {
    marginLeft: 8,
  },

  noSearchResults: {
    marginHorizontal: 20,
    paddingVertical: 24,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 13,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },

  greetingText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },

  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: PRIMARY,
    marginTop: 2,
  },

  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  notificationBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    position: 'absolute',
    top: 10,
    right: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  scrollContent: {
    paddingBottom: 110,
  },

  // BANNERS
  bannerWrapper: {
    marginTop: 8,
  },

  bannerContainer: {
    paddingHorizontal: 20,
    gap: BANNER_GAP,
  },

  bannerImage: {
    width: BANNER_WIDTH,
    height: 180,
    borderRadius: 20,
  },

  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },

  dot: {
    height: 6,
    borderRadius: 3,
  },

  activeDot: {
    width: 18,
    backgroundColor: PRIMARY,
  },

  inactiveDot: {
    width: 6,
    backgroundColor: '#CBD5E1',
  },

  // SEÇÕES
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 12,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },

  seeMoreLink: {
    fontSize: 13,
    fontWeight: '600',
    color: PRIMARY,
  },

  // PLANOS
  plansRow: {
    paddingHorizontal: 20,
    gap: 12,
  },

  planCard: {
    width: 290,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  petImage: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },

  petInfo: {
    flex: 1,
    marginLeft: 12,
  },

  petName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  petDetails: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  planBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PALE_BLUE,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  planName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },

  planRenewal: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  planRenewalStrong: {
    fontWeight: '700',
    color: '#334155',
  },

  statusPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  statusPillText: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '700',
  },

  // SERVIÇOS
  servicesRow: {
    paddingHorizontal: 20,
    gap: SERVICE_GAP,
  },

  serviceSlideWrapper: {
    width: SERVICE_WIDTH,
  },

  serviceSlide: {
    width: SERVICE_WIDTH,
    height: 170,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  serviceSlideImage: {
    borderRadius: 20,
  },

  serviceIconBig: {
    position: 'absolute',
    top: 24,
    right: 20,
    opacity: 0.9,
  },

  serviceOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },

  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  serviceDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    lineHeight: 16,
  },

  // SUPORTE
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: T.primary,
    borderRadius: 18,
    padding: 14,
  },

  supportIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: T.brandYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },

  supportText: {
    flex: 1,
    marginLeft: 12,
  },

  supportTitle: {
    fontSize: 14,
    fontFamily: TF.bold,
    color: '#FFFFFF',
  },

  supportSubtitle: {
    fontSize: 12,
    fontFamily: TF.regular,
    color: '#C9D6EE',
    marginTop: 2,
  },

  // AVALIAÇÃO
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: T.border,
  },

  ratingIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFF5D6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  ratingText: {
    flex: 1,
    marginLeft: 10,
  },

  ratingTitle: {
    fontSize: 12,
    fontFamily: TF.bold,
    color: T.navy,
  },

  ratingSubtitle: {
    fontSize: 10,
    fontFamily: TF.regular,
    color: T.muted,
    marginTop: 3,
  },

  stars: {
    flexDirection: 'row',
    gap: 1,
    marginRight: 5,
  },

  // MENU DE CONTA
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.48)',
  },

  accountSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '88%',
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 28 : 20,
  },

  modalHandle: {
    width: 38,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#D7DDE7',
    alignSelf: 'center',
    marginBottom: 18,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#17233F',
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  accountScroll: {
    paddingBottom: 12,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 17,
    backgroundColor: '#F7F9FC',
    borderWidth: 1,
    borderColor: '#E9EDF4',
    marginBottom: 25,
  },

  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EAB308',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
  },

  profileInfo: {
    flex: 1,
    marginLeft: 13,
  },

  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#17233F',
  },

  profileEmail: {
    fontSize: 12,
    color: '#718096',
    marginTop: 3,
  },

  profileLink: {
    fontSize: 12,
    fontWeight: '600',
    color: PRIMARY,
    marginTop: 5,
  },

  menuSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#94A3B8',
    marginBottom: 12,
  },

  shortcuts: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
  },

  shortcut: {
    flex: 1,
    padding: 13,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    backgroundColor: '#FFFFFF',
  },

  shortcutIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EEF3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  shortcutTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#17233F',
  },

  shortcutSubtitle: {
    fontSize: 10,
    color: '#8994A6',
    marginTop: 4,
  },

  menuGroup: {
    borderWidth: 1,
    borderColor: '#E9EDF4',
    borderRadius: 15,
    paddingHorizontal: 12,
    marginBottom: 25,
    backgroundColor: '#FFFFFF',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 57,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F6',
  },

  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  menuItemText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    minHeight: 50,
    borderRadius: 13,
    backgroundColor: '#FFF5F5',
    marginTop: 2,
  },

  logoutText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },

  versionText: {
    textAlign: 'center',
    fontSize: 10,
    color: '#A0A9B8',
    marginTop: 18,
  },
});