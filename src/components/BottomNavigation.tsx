import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

// Wrapper de cada aba: o ícone ativo vira um círculo flutuante
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
    <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconSlot}>
        {active ? <View style={styles.activeCircle}>{children}</View> : children}
      </View>
      <Text style={active ? styles.activeTabText : styles.tabText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function BottomNavigation({
  currentRoute,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: BottomNavigationProps) {
  const color = (route: BottomNavigationProps['currentRoute']) =>
    currentRoute === route ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR;

  return (
    <View style={styles.bottomBar}>
      {/* Home */}
      <Tab active={currentRoute === 'Home'} label="Home" onPress={onNavigateToHome}>
        <Ionicons
          name={currentRoute === 'Home' ? 'home' : 'home-outline'}
          size={22}
          color={color('Home')}
        />
      </Tab>

      {/* Explorar */}
      <Tab active={currentRoute === 'Explore'} label="Explorar" onPress={onNavigateToExplore}>
        <Ionicons
          name={currentRoute === 'Explore' ? 'search' : 'search-outline'}
          size={22}
          color={color('Explore')}
        />
      </Tab>

      {/* Plano */}
      <Tab active={currentRoute === 'Plans'} label="Plano" onPress={onNavigateToPlans}>
        <Image
          source={require('../assets/coroa_outline.png')}
          style={[styles.crownIcon, { tintColor: color('Plans') }]}
          resizeMode="contain"
        />
      </Tab>

      {/* Benefícios */}
      <Tab active={currentRoute === 'Benefits'} label="Benefícios" onPress={onNavigateToBenefits}>
        <Ionicons
          name={currentRoute === 'Benefits' ? 'gift' : 'gift-outline'}
          size={22}
          color={color('Benefits')}
        />
      </Tab>

      {/* Perfil */}
      <Tab active={currentRoute === 'Profile'} label="Perfil" onPress={onNavigateToProfile}>
        <Ionicons
          name={currentRoute === 'Profile' ? 'person' : 'person-outline'}
          size={22}
          color={color('Profile')}
        />
      </Tab>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
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
  // Espaço fixo do ícone: mantém todos os textos alinhados na mesma altura
  iconSlot: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  // Círculo azul com borda branca, flutuando acima da barra
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