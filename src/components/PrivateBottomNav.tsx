
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      <View style={styles.iconSlot}>
        {active ? (
          <View style={styles.activeCircle}>
            {children}
          </View>
        ) : (
          children
        )}
      </View>

      <Text style={active ? styles.activeTabText : styles.tabText}>
        {label}
      </Text>
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
            size={22}
            color={isHomeActive ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR}
          />
        </Tab>

        {/* Plano */}
        <Tab
          active={isPlanActive}
          label="Plano"
          onPress={onNavigateToPlans}
        >
          <Image
            source={require('../assets/coroa_outline.png')}
            style={[
              styles.crownIcon,
              {
                tintColor: isPlanActive
                  ? ACTIVE_ICON_COLOR
                  : INACTIVE_ICON_COLOR,
              },
            ]}
            resizeMode="contain"
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
            size={22}
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
            size={22}
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
    height: 65,
    backgroundColor: '#FFFFFF',
    width: '92%',
    marginBottom: 20,
    borderRadius: 24,
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

  iconSlot: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },

  activeCircle: {
    position: 'absolute',
    top: -42,
    left: -17,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#21479B',
    borderWidth: 6,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 6,
  },

  crownIcon: {
    width: 22,
    height: 22,
  },

  tabText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },

  activeTabText: {
    fontSize: 10,
    color: '#0F172A',
    marginTop: 4,
    fontWeight: '700',
  },
});
