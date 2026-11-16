import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type PrivateRoute =
  | 'PrivateHome'
  | 'PrivateExplore'
  | 'PrivatePlans'
  | 'PrivateMyPlan'
  | 'PrivateManagePlan'
  | 'PrivateInvoices'
  | 'PrivateBenefits'
  | 'PrivateProfile';

interface PrivateBottomNavProps {
  currentRoute: PrivateRoute;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

const ACTIVE_ICON_COLOR = '#FFFFFF';
const INACTIVE_ICON_COLOR = '#1E293B';

function Tab({
  active,
  label,
  onPress,
  children,
}: {
  active: boolean;
  label: string;
  onPress?: () => void;
  children: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Aba ativa: bloco azul com ícone e nome dentro */}
      <View style={active ? styles.activePill : styles.tabContent}>
        {children}
        <Text
          style={active ? styles.activeTabText : styles.tabText}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function PrivateBottomNav({
  currentRoute,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: PrivateBottomNavProps) {
  const isHomeActive = currentRoute === 'PrivateHome';

  const isPlanActive = [
    'PrivatePlans',
    'PrivateMyPlan',
    'PrivateManagePlan',
    'PrivateInvoices',
  ].includes(currentRoute);

  const isBenefitsActive = currentRoute === 'PrivateBenefits';
  const isProfileActive = currentRoute === 'PrivateProfile';

  return (
    <View style={styles.bottomBarWrapper}>
      <View style={styles.bottomBar}>
        {/* Início */}
        <Tab
          active={isHomeActive}
          label="Início"
          onPress={onNavigateToHome}
        >
          <Ionicons
            name={isHomeActive ? 'home' : 'home-outline'}
            size={20}
            color={isHomeActive ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR}
          />
        </Tab>

        {/* Plano */}
        <Tab
          active={isPlanActive}
          label="Plano"
          onPress={onNavigateToPlans}
        >
          <MaterialCommunityIcons
            name={isPlanActive ? 'crown' : 'crown-outline'}
            size={24} // a coroa é um desenho menor; 24 fica do tamanho visual dos outros ícones de 20
            color={isPlanActive ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR}
          />
        </Tab>

        {/* Benefícios */}
        <Tab
          active={isBenefitsActive}
          label="Benefícios"
          onPress={onNavigateToBenefits}
        >
          <Ionicons
            name={isBenefitsActive ? 'gift' : 'gift-outline'}
            size={20}
            color={isBenefitsActive ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR}
          />
        </Tab>

        {/* Perfil */}
        <Tab
          active={isProfileActive}
          label="Perfil"
          onPress={onNavigateToProfile}
        >
          <Ionicons
            name={isProfileActive ? 'person' : 'person-outline'}
            size={20}
            color={isProfileActive ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR}
          />
        </Tab>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  bottomBar: {
    flexDirection: 'row',
    height: 72,
    backgroundColor: '#FFFFFF',
    width: '92%',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 28,
    alignItems: 'center',
    paddingHorizontal: 8,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },

  tabContent: {
    width: 76,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bloco azul da aba ativa, com ícone e nome dentro
  activePill: {
    width: 76,
    height: 56,
    borderRadius: 22,
    backgroundColor: '#183C98',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
    fontFamily: 'PlusJakartaSans_400Regular',
  },

  activeTabText: {
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 3,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
});