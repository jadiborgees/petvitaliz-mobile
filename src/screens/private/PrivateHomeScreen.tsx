
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
import { Ionicons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';

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

const PRIMARY = '#21479B';
const BACKGROUND = '#F5F7FC';
const PALE_BLUE = '#EAF0FF';

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
}: PrivateHomeScreenProps) {
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
              <Image
                key={`banner-${index}`}
                source={banner}
                style={styles.bannerImage}
                resizeMode="cover"
              />
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

          <TouchableOpacity
            onPress={onNavigateToPlans}
            activeOpacity={0.7}
          >
            <Text style={styles.seeMoreLink}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.plansRow}
        >
          {/* Pet 1: Lua */}
          <TouchableOpacity
            style={styles.planCard}
            activeOpacity={0.9}
            onPress={onNavigateToPlans}
          >
            <View style={styles.petRow}>
              <Image
                source={require('../../assets/Explorar2.png')}
                style={styles.petImage}
              />

              <View style={styles.petInfo}>
                <Text style={styles.petName}>Lua</Text>
                <Text style={styles.petDetails}>
                  Golden Retriever · 3 anos
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#94A3B8"
              />
            </View>

            <View style={styles.planBox}>
              <View>
                <Text style={styles.planName}>Plano Ouro</Text>

                <Text style={styles.planRenewal}>
                  Renovação{' '}
                  <Text style={styles.planRenewalStrong}>
                    24/06/2027
                  </Text>
                </Text>
              </View>

              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>Ativo</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Pet 2: Savannah */}
          <TouchableOpacity
            style={styles.planCard}
            activeOpacity={0.9}
            onPress={onNavigateToPlans}
          >
            <View style={styles.petRow}>
              <Image
                source={require('../../assets/Explorar3.png')}
                style={styles.petImage}
              />

              <View style={styles.petInfo}>
                <Text style={styles.petName}>Savannah</Text>
                <Text style={styles.petDetails}>Female</Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#94A3B8"
              />
            </View>

            <View style={styles.planBox}>
              <View>
                <Text style={styles.planName}>Grooming</Text>
                <Text style={styles.planRenewal}>
                  Serviço contratado
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>

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
              color="#FFFFFF"
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
            color="#94A3B8"
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
              color="#F59E0B"
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
                color="#F59E0B"
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
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setAccountMenuVisible(false)}
          />

          <View style={styles.accountSheet}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Minha conta</Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setAccountMenuVisible(false)}
              >
                <Ionicons
                  name="close"
                  size={22}
                  color="#475569"
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.accountScroll}
            >
              {/* PERFIL */}
              <TouchableOpacity
                style={styles.profileCard}
                activeOpacity={0.8}
                onPress={() =>
                  handleMenuNavigation(onNavigateToProfile)
                }
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileAvatar}
                  />
                ) : (
                  <View style={styles.profileAvatar}>
                    <Text style={styles.profileAvatarText}>
                      {initial}
                    </Text>
                  </View>
                )}

                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {userName}
                  </Text>

                  <Text style={styles.profileEmail}>
                    {userEmail || 'E-mail não informado'}
                  </Text>

                  <Text style={styles.profileLink}>
                    Ver meu perfil
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#94A3B8"
                />
              </TouchableOpacity>

              {/* ATALHOS */}
              <Text style={styles.menuSectionTitle}>
                MEUS ATALHOS
              </Text>

              <View style={styles.shortcuts}>
                <TouchableOpacity
                  style={styles.shortcut}
                  activeOpacity={0.7}
                  onPress={() =>
                    handleMenuNavigation(onNavigateToPets)
                  }
                >
                  <View style={styles.shortcutIcon}>
                    <Ionicons
                      name="paw-outline"
                      size={23}
                      color={PRIMARY}
                    />
                  </View>

                  <Text style={styles.shortcutTitle}>
                    Meus Pets
                  </Text>

                  <Text style={styles.shortcutSubtitle}>
                    Animais cadastrados
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.shortcut}
                  activeOpacity={0.7}
                  onPress={() =>
                    handleMenuNavigation(onNavigateToConsultations)
                  }
                >
                  <View style={styles.shortcutIcon}>
                    <Ionicons
                      name="calendar-outline"
                      size={23}
                      color={PRIMARY}
                    />
                  </View>

                  <Text style={styles.shortcutTitle}>
                    Consultas
                  </Text>

                  <Text style={styles.shortcutSubtitle}>
                    Meus agendamentos
                  </Text>
                </TouchableOpacity>
              </View>

              {/* CONTA E PREFERÊNCIAS */}
              <Text style={styles.menuSectionTitle}>
                CONTA E PREFERÊNCIAS
              </Text>

              <View style={styles.menuGroup}>
                {renderMenuItem(
                  'person-outline',
                  'Dados pessoais',
                  onNavigateToPersonalData,
                )}

                {renderMenuItem(
                  'card-outline',
                  'Formas de pagamento',
                  onNavigateToPaymentMethods,
                )}

                {renderMenuItem(
                  'notifications-outline',
                  'Notificações',
                  onNavigateToNotifications,
                )}

                {renderMenuItem(
                  'shield-checkmark-outline',
                  'Segurança',
                  onNavigateToSecurity,
                )}
              </View>

              {/* SUPORTE */}
              <Text style={styles.menuSectionTitle}>
                PRECISA DE AJUDA?
              </Text>

              <View style={styles.menuGroup}>
                {renderMenuItem(
                  'headset-outline',
                  'Ajuda e suporte',
                  onNavigateToSupport,
                )}
              </View>

              {/* SAIR */}
              <TouchableOpacity
                style={styles.logoutButton}
                activeOpacity={0.7}
                onPress={() =>
                  handleMenuNavigation(onLogout)
                }
              >
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color="#DC2626"
                />

                <Text style={styles.logoutText}>
                  Sair da conta
                </Text>
              </TouchableOpacity>

              <Text style={styles.versionText}>
                PetVitaliz · Sua saúde, nosso cuidado.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  supportIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },

  supportText: {
    flex: 1,
    marginLeft: 12,
  },

  supportTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },

  supportSubtitle: {
    fontSize: 12,
    color: '#64748B',
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
    borderColor: '#E2E8F0',
  },

  ratingIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFF7E6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  ratingText: {
    flex: 1,
    marginLeft: 10,
  },

  ratingTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#17233F',
  },

  ratingSubtitle: {
    fontSize: 10,
    color: '#718096',
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
