import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  SplashScreen,
  HomeScreen,
  ServicesScreen,
  HowItWorksScreen,
  ExploreScreen,
  PlansScreen,
  BenefitsScreen,
  ProfileScreen,
  SupportScreen,
  FaqScreen,
  TermsScreen,
  PrivacyScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  EmailSentScreen,
  VerifyCodeScreen,
  ResetPasswordScreen,
} from '../screens/public';

import {
  PrivateHomeScreen,
  PrivateExploreScreen,
  NoPlanScreen,
  PrivateServicesScreen,
  PetTipsScreen,
} from '../screens/private';

type ScreenName =
  | 'home'
  | 'services'
  | 'howItWorks'
  | 'explore'
  | 'plans'
  | 'benefits'
  | 'profile'
  | 'support'
  | 'faq'
  | 'terms'
  | 'privacy'
  | 'login'
  | 'register'
  | 'forgotPassword'
  | 'emailSent'
  | 'verifyCode'
  | 'resetPassword'
  | 'privateHome'
  | 'privateExplore'
  | 'noPlan'
  | 'privateServices'
  | 'petTips';

export default function AppNavigator() {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('home');
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([
    'teste@petvitaliz.com',
  ]);

  const handleRegisterUser = (newEmail: string) => {
    if (!registeredEmails.includes(newEmail)) {
      setRegisteredEmails((prev) => [...prev, newEmail]);
    }
  };

  if (isShowSplash) {
    return <SplashScreen onFinish={() => setIsShowSplash(false)} />;
  }

  return (
    <View style={styles.container}>
      {/* --- TELAS PÚBLICAS --- */}

      {currentScreen === 'home' && (
        <HomeScreen
          onNavigateToLogin={() => setCurrentScreen('login')}
          onNavigateToRegister={() => setCurrentScreen('register')}
          onNavigateToForgotPassword={() => setCurrentScreen('forgotPassword')}
          onNavigateToServices={() => setCurrentScreen('services')}
          onNavigateToHowItWorks={() => setCurrentScreen('howItWorks')}
          onNavigateToExplore={() => setCurrentScreen('explore')}
          onNavigateToPlans={() => setCurrentScreen('plans')}
          onNavigateToBenefits={() => setCurrentScreen('benefits')}
          onNavigateToProfile={() => setCurrentScreen('profile')}
        />
      )}

      {currentScreen === 'explore' && (
        <ExploreScreen
          onBack={() => setCurrentScreen('home')}
          onNavigateToHome={() => setCurrentScreen('home')}
          onNavigateToLogin={() => setCurrentScreen('login')}
          onNavigateToPlans={() => setCurrentScreen('plans')}
          onNavigateToBenefits={() => setCurrentScreen('benefits')}
          onNavigateToProfile={() => setCurrentScreen('profile')}
        />
      )}

      {currentScreen === 'plans' && (
        <PlansScreen
          onBack={() => setCurrentScreen('home')}
          onNavigateToHome={() => setCurrentScreen('home')}
          onNavigateToExplore={() => setCurrentScreen('explore')}
          onNavigateToBenefits={() => setCurrentScreen('benefits')}
          onNavigateToLogin={() => setCurrentScreen('login')}
          onNavigateToProfile={() => setCurrentScreen('profile')}
        />
      )}

      {currentScreen === 'benefits' && (
        <BenefitsScreen
          onBack={() => setCurrentScreen('home')}
          onNavigateToHome={() => setCurrentScreen('home')}
          onNavigateToExplore={() => setCurrentScreen('explore')}
          onNavigateToPlans={() => setCurrentScreen('plans')}
          onNavigateToLogin={() => setCurrentScreen('login')}
          onNavigateToProfile={() => setCurrentScreen('profile')}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen
          onBack={() => setCurrentScreen('home')}
          onNavigateToLogin={() => setCurrentScreen('login')}
          onNavigateToRegister={() => setCurrentScreen('register')}
          onNavigateToSupport={() => setCurrentScreen('support')}
          onNavigateToFaq={() => setCurrentScreen('faq')}
          onNavigateToTerms={() => setCurrentScreen('terms')}
          onNavigateToPrivacy={() => setCurrentScreen('privacy')}
          onNavigateToHome={() => setCurrentScreen('home')}
          onNavigateToExplore={() => setCurrentScreen('explore')}
          onNavigateToPlans={() => setCurrentScreen('plans')}
          onNavigateToBenefits={() => setCurrentScreen('benefits')}
        />
      )}

      {currentScreen === 'support' && (
        <SupportScreen
          onBack={() => setCurrentScreen('profile')}
          onNavigateToFaq={() => setCurrentScreen('faq')}
          onNavigateToHome={() => setCurrentScreen('home')}
          onNavigateToExplore={() => setCurrentScreen('explore')}
          onNavigateToPlans={() => setCurrentScreen('plans')}
          onNavigateToBenefits={() => setCurrentScreen('benefits')}
          onNavigateToProfile={() => setCurrentScreen('profile')}
        />
      )}

      {currentScreen === 'faq' && (
        <FaqScreen
          onBack={() => setCurrentScreen('profile')}
          onNavigateToHome={() => setCurrentScreen('home')}
          onNavigateToExplore={() => setCurrentScreen('explore')}
          onNavigateToPlans={() => setCurrentScreen('plans')}
          onNavigateToBenefits={() => setCurrentScreen('benefits')}
          onNavigateToProfile={() => setCurrentScreen('profile')}
        />
      )}

      {currentScreen === 'terms' && (
        <TermsScreen
          onBack={() => setCurrentScreen('profile')}
          onNavigateToHome={() => setCurrentScreen('home')}
          onNavigateToExplore={() => setCurrentScreen('explore')}
          onNavigateToPlans={() => setCurrentScreen('plans')}
          onNavigateToBenefits={() => setCurrentScreen('benefits')}
          onNavigateToProfile={() => setCurrentScreen('profile')}
        />
      )}

      {currentScreen === 'privacy' && (
        <PrivacyScreen
          onBack={() => setCurrentScreen('profile')}
          onNavigateToHome={() => setCurrentScreen('home')}
          onNavigateToExplore={() => setCurrentScreen('explore')}
          onNavigateToPlans={() => setCurrentScreen('plans')}
          onNavigateToBenefits={() => setCurrentScreen('benefits')}
          onNavigateToProfile={() => setCurrentScreen('profile')}
        />
      )}

      {currentScreen === 'services' && (
        <ServicesScreen
          onBack={() => setCurrentScreen('home')}
          onNavigateToPlans={() => setCurrentScreen('plans')}
          onNavigateToLogin={() => setCurrentScreen('login')}
          onNavigateToExplore={() => setCurrentScreen('explore')}
          onNavigateToBenefits={() => setCurrentScreen('benefits')}
          onNavigateToProfile={() => setCurrentScreen('profile')}
        />
      )}

      {currentScreen === 'howItWorks' && (
        <HowItWorksScreen
          onBack={() => setCurrentScreen('home')}
          onNavigateToRegister={() => setCurrentScreen('register')}
          onNavigateToLogin={() => setCurrentScreen('login')}
          onNavigateToServices={() => setCurrentScreen('services')}
          onNavigateToProfile={() => setCurrentScreen('profile')}
        />
      )}

      {currentScreen === 'login' && (
        <LoginScreen
          onLoginSuccess={() => setCurrentScreen('privateHome')}
          onNavigateToRegister={() => setCurrentScreen('register')}
          onNavigateToForgotPassword={() => setCurrentScreen('forgotPassword')}
          onBack={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'register' && (
        <RegisterScreen
          onRegisterSuccess={() => setCurrentScreen('login')}
          onNavigateToLogin={() => setCurrentScreen('login')}
          onNavigateToTerms={() => setCurrentScreen('terms')}
          onNavigateToPrivacy={() => setCurrentScreen('privacy')}
          onBack={() => setCurrentScreen('profile')}
          registeredEmails={registeredEmails}
          onRegisterUser={handleRegisterUser}
        />
      )}

      {currentScreen === 'forgotPassword' && (
        <ForgotPasswordScreen
          registeredEmails={registeredEmails}
          onNavigateToEmailSent={() => setCurrentScreen('emailSent')}
          onNavigateToLogin={() => setCurrentScreen('login')}
          onBack={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'emailSent' && (
        <EmailSentScreen
          onNavigateToVerifyCode={() => setCurrentScreen('verifyCode')}
          onBack={() => setCurrentScreen('forgotPassword')}
        />
      )}

      {currentScreen === 'verifyCode' && (
        <VerifyCodeScreen
          onNavigateToResetPassword={() => setCurrentScreen('resetPassword')}
          onBack={() => setCurrentScreen('emailSent')}
        />
      )}

      {currentScreen === 'resetPassword' && (
        <ResetPasswordScreen
          onNavigateToLogin={() => setCurrentScreen('login')}
          onBack={() => setCurrentScreen('verifyCode')}
        />
      )}

      {/* --- TELAS PRIVADAS --- */}

      {currentScreen === 'privateHome' && (
        <PrivateHomeScreen
          onNavigateToServices={() => setCurrentScreen('privateServices')}
          onNavigateToPlans={() => setCurrentScreen('noPlan')}
          onNavigateToExplore={() => setCurrentScreen('privateExplore')}
          onNavigateToBenefits={() => setCurrentScreen('benefits')}
          onNavigateToProfile={() => setCurrentScreen('profile')}
          onNavigateToSupport={() => setCurrentScreen('support')}
          onNavigateToTips={() => setCurrentScreen('petTips')}
        />
      )}

      {currentScreen === 'privateServices' && (
        <PrivateServicesScreen
          onBack={() => setCurrentScreen('privateHome')}
          onNavigateToHome={() => setCurrentScreen('privateHome')}
          onNavigateToExplore={() => setCurrentScreen('privateExplore')}
          onNavigateToPlans={() => setCurrentScreen('noPlan')}
          onNavigateToBenefits={() => setCurrentScreen('benefits')}
          onNavigateToProfile={() => setCurrentScreen('profile')}
        />
      )}

      {currentScreen === 'petTips' && (
        <PetTipsScreen
          onBack={() => setCurrentScreen('privateHome')}
          onNavigateToHome={() => setCurrentScreen('privateHome')}
          onNavigateToExplore={() => setCurrentScreen('privateExplore')}
          onNavigateToPlans={() => setCurrentScreen('noPlan')}
          onNavigateToBenefits={() => setCurrentScreen('benefits')}
          onNavigateToProfile={() => setCurrentScreen('profile')}
        />
      )}

      {currentScreen === 'privateExplore' && (
        <PrivateExploreScreen
          onBack={() => setCurrentScreen('privateHome')}
          onNavigateToHome={() => setCurrentScreen('privateHome')}
          onNavigateToPlans={() => setCurrentScreen('noPlan')}
          onNavigateToBenefits={() => setCurrentScreen('benefits')}
          onNavigateToProfile={() => setCurrentScreen('profile')}
        />
      )}

      {currentScreen === 'noPlan' && (
        <NoPlanScreen
          onBack={() => setCurrentScreen('privateHome')}
          onNavigateToHome={() => setCurrentScreen('privateHome')}
          onNavigateToPlans={() => setCurrentScreen('plans')}
          onNavigateToExplore={() => setCurrentScreen('privateExplore')}
          onNavigateToBenefits={() => setCurrentScreen('benefits')}
          onNavigateToProfile={() => setCurrentScreen('profile')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});