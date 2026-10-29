import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomNavigationProps {
  currentRoute: 'Home' | 'Explore' | 'Plans' | 'Benefits' | 'Profile';
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

export default function BottomNavigation({
  currentRoute,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: BottomNavigationProps) {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        style={currentRoute === 'Home' ? styles.activeTab : styles.tabItem}
        onPress={onNavigateToHome}
        activeOpacity={0.8}
      >
        <Ionicons
          name={currentRoute === 'Home' ? 'home' : 'home-outline'}
          size={22}
          color={currentRoute === 'Home' ? '#FFFFFF' : '#21479B'}
        />
        <Text style={currentRoute === 'Home' ? styles.activeTabText : styles.tabText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={currentRoute === 'Explore' ? styles.activeTab : styles.tabItem}
        onPress={onNavigateToExplore}
        activeOpacity={0.8}
      >
        <Ionicons
          name={currentRoute === 'Explore' ? 'search' : 'search-outline'}
          size={22}
          color={currentRoute === 'Explore' ? '#FFFFFF' : '#94A3B8'}
        />
        <Text style={currentRoute === 'Explore' ? styles.activeTabText : styles.tabText}>Explorar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={currentRoute === 'Plans' ? styles.activeTab : styles.tabItem}
        onPress={onNavigateToPlans}
        activeOpacity={0.8}
      >
        <Ionicons
          name={currentRoute === 'Plans' ? 'ribbon' : 'ribbon-outline'}
          size={22}
          color={currentRoute === 'Plans' ? '#FFFFFF' : '#94A3B8'}
        />
        <Text style={currentRoute === 'Plans' ? styles.activeTabText : styles.tabText}>Plano</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={currentRoute === 'Benefits' ? styles.activeTab : styles.tabItem}
        onPress={onNavigateToBenefits}
        activeOpacity={0.8}
      >
        <Ionicons
          name={currentRoute === 'Benefits' ? 'gift' : 'gift-outline'}
          size={22}
          color={currentRoute === 'Benefits' ? '#FFFFFF' : '#94A3B8'}
        />
        <Text style={currentRoute === 'Benefits' ? styles.activeTabText : styles.tabText}>Benefícios</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={currentRoute === 'Profile' ? styles.activeTab : styles.tabItem}
        onPress={onNavigateToProfile}
        activeOpacity={0.8}
      >
        <Ionicons
          name={currentRoute === 'Profile' ? 'person' : 'person-outline'}
          size={22}
          color={currentRoute === 'Profile' ? '#FFFFFF' : '#94A3B8'}
        />
        <Text style={currentRoute === 'Profile' ? styles.activeTabText : styles.tabText}>Perfil</Text>
      </TouchableOpacity>
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
    justifyContent: 'space-around',
    paddingHorizontal: 8,
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
  activeTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#21479B',
    height: 52,
    borderRadius: 16,
    marginTop: -12,
    shadowColor: '#21479B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  tabText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  activeTabText: {
    fontSize: 10,
    color: '#FFFFFF',
    marginTop: 2,
    fontWeight: '700',
  },
});