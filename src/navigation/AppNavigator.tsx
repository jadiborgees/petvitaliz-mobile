import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import HomeScreen from '../screens/public/HomeScreen';
import ExploreScreen from '../screens/public/ExploreScreen';
import PlansScreen from '../screens/public/PlansScreen';
import BenefitsScreen from '../screens/public/BenefitsScreen';
import ProfileScreen from '../screens/public/ProfileScreen';
import LoginScreen from '../screens/public/LoginScreen';
import RegisterScreen from '../screens/public/RegisterScreen';
import SupportScreen from '../screens/public/SupportScreen';
import FaqScreen from '../screens/public/FaqScreen';
import TermsScreen from '../screens/public/TermsScreen';
import PrivacyScreen from '../screens/public/PrivacyScreen';

export default function AppNavigator() {
  const [currentScreen, setCurrentScreen] = useState<
    | 'Home'
    | 'Explore'
    | 'Plans'
    | 'Benefits'
    | 'Profile'
    | 'Login'
    | 'Register'
    | 'Support'
    | 'Faq'
    | 'Terms'
    | 'Privacy'
  >('Home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return (
          <HomeScreen
            onNavigateToExplore={() => setCurrentScreen('Explore')}
            onNavigateToPlans={() => setCurrentScreen('Plans')}
            onNavigateToBenefits={() => setCurrentScreen('Benefits')}
            onNavigateToProfile={() => setCurrentScreen('Profile')}
            onNavigateToLogin={() => setCurrentScreen('Login')}
            onNavigateToRegister={() => setCurrentScreen('Register')}
          />
        );
      case 'Explore':
        return (
          <ExploreScreen
            onNavigateToHome={() => setCurrentScreen('Home')}
            onNavigateToPlans={() => setCurrentScreen('Plans')}
            onNavigateToBenefits={() => setCurrentScreen('Benefits')}
            onNavigateToProfile={() => setCurrentScreen('Profile')}
            onBack={() => setCurrentScreen('Home')}
          />
        );
      case 'Plans':
        return (
          <PlansScreen
            onNavigateToHome={() => setCurrentScreen('Home')}
            onNavigateToExplore={() => setCurrentScreen('Explore')}
            onNavigateToBenefits={() => setCurrentScreen('Benefits')}
            onNavigateToProfile={() => setCurrentScreen('Profile')}
            onNavigateToLogin={() => setCurrentScreen('Login')}
            onBack={() => setCurrentScreen('Home')}
          />
        );
      case 'Benefits':
        return (
          <BenefitsScreen
            onNavigateToHome={() => setCurrentScreen('Home')}
            onNavigateToExplore={() => setCurrentScreen('Explore')}
            onNavigateToPlans={() => setCurrentScreen('Plans')}
            onNavigateToProfile={() => setCurrentScreen('Profile')}
            onNavigateToLogin={() => setCurrentScreen('Login')}
            onBack={() => setCurrentScreen('Home')}
          />
        );
      case 'Profile':
        return (
          <ProfileScreen
            onNavigateToHome={() => setCurrentScreen('Home')}
            onNavigateToExplore={() => setCurrentScreen('Explore')}
            onNavigateToPlans={() => setCurrentScreen('Plans')}
            onNavigateToBenefits={() => setCurrentScreen('Benefits')}
            onNavigateToProfile={() => setCurrentScreen('Profile')}
            onNavigateToLogin={() => setCurrentScreen('Login')}
            onNavigateToRegister={() => setCurrentScreen('Register')}
            onNavigateToSupport={() => setCurrentScreen('Support')}
            onNavigateToFaq={() => setCurrentScreen('Faq')}
            onNavigateToTerms={() => setCurrentScreen('Terms')}
            onNavigateToPrivacy={() => setCurrentScreen('Privacy')}
            onBack={() => setCurrentScreen('Home')}
          />
        );
      case 'Login':
        return <LoginScreen onBack={() => setCurrentScreen('Profile')} />;
      case 'Register':
        return <RegisterScreen onBack={() => setCurrentScreen('Profile')} />;
      case 'Support':
        return <SupportScreen onBack={() => setCurrentScreen('Profile')} />;
      case 'Faq':
        return <FaqScreen onBack={() => setCurrentScreen('Profile')} />;
      case 'Terms':
        return <TermsScreen onBack={() => setCurrentScreen('Profile')} />;
      case 'Privacy':
        return <PrivacyScreen onBack={() => setCurrentScreen('Profile')} />;
      default:
        return (
          <HomeScreen
            onNavigateToExplore={() => setCurrentScreen('Explore')}
            onNavigateToPlans={() => setCurrentScreen('Plans')}
            onNavigateToBenefits={() => setCurrentScreen('Benefits')}
            onNavigateToProfile={() => setCurrentScreen('Profile')}
          />
        );
    }
  };

  return <View style={styles.container}>{renderScreen()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});