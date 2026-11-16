import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface BottomNavigationProps {
  currentRoute: 'Home' | 'Explore' | 'Plans' | 'Benefits' | 'Profile';
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

export default function BottomNavigation({
  currentRoute,
  onNavigateToHome,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: BottomNavigationProps) {
  const color = (
    route: BottomNavigationProps['currentRoute']
  ) =>
    currentRoute === route
      ? ACTIVE_ICON_COLOR
      : INACTIVE_ICON_COLOR;

  return (
    <View style={styles.bottomBar}>
      {/* INÍCIO */}
      <Tab
        active={currentRoute === 'Home'}
        label="Início"
        onPress={onNavigateToHome}
      >
        <Ionicons
          name={currentRoute === 'Home' ? 'home' : 'home-outline'}
          size={20}
          color={color('Home')}
        />
      </Tab>

      {/* PLANO */}
      <Tab
        active={currentRoute === 'Plans'}
        label="Plano"
        onPress={onNavigateToPlans}
      >
        <MaterialCommunityIcons
          name={currentRoute === 'Plans' ? 'crown' : 'crown-outline'}
          size={24}
          color={color('Plans')}
        />
      </Tab>

      {/* BENEFÍCIOS */}
      <Tab
        active={currentRoute === 'Benefits'}
        label="Benefícios"
        onPress={onNavigateToBenefits}
      >
        <Ionicons
          name={currentRoute === 'Benefits' ? 'gift' : 'gift-outline'}
          size={20}
          color={color('Benefits')}
        />
      </Tab>

      {/* PERFIL */}
      <Tab
        active={currentRoute === 'Profile'}
        label="Perfil"
        onPress={onNavigateToProfile}
      >
        <Ionicons
          name={currentRoute === 'Profile' ? 'person' : 'person-outline'}
          size={20}
          color={color('Profile')}
        />
      </Tab>
    </View>
  );
}

const styles = StyleSheet.create({
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