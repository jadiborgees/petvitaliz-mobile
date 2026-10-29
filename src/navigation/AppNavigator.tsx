import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';

// Telas públicas
import SplashScreen from '../screens/public/SplashScreen';
import HomeScreen from '../screens/public/HomeScreen';
import ExploreScreen from '../screens/public/ExploreScreen';
import PlansScreen from '../screens/public/PlansScreen';
import BenefitsScreen from '../screens/public/BenefitsScreen';
import ProfileScreen from '../screens/public/ProfileScreen';
import ServicesScreen from '../screens/public/ServicesScreen';
import HowItWorksScreen from '../screens/public/HowItWorksScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import EmailSentScreen from '../screens/auth/EmailSentScreen';
import VerifyCodeScreen from '../screens/auth/VerifyCodeScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import SupportScreen from '../screens/public/SupportScreen';
import FaqScreen from '../screens/public/FaqScreen';
import TermsScreen from '../screens/public/TermsScreen';
import PrivacyScreen from '../screens/public/PrivacyScreen';

// Telas privadas
import PrivateHomeScreen from '../screens/private/PrivateHomeScreen';
import PrivateProfileScreen from '../screens/private/PrivateProfileScreen';
import PrivateExploreScreen from '../screens/private/PrivateExploreScreen';
import PrivateServicesScreen from '../screens/private/PrivateServicesScreen';
import PrivatePlansScreen from '../screens/private/PrivatePlansScreen';
import PrivateBenefitsScreen from '../screens/private/PrivateBenefitsScreen';
import PrivatePersonalDataScreen from '../screens/private/PrivatePersonalDataScreen';
import PrivatePaymentMethodsScreen from '../screens/private/PrivatePaymentMethodsScreen';
import PrivatePetsFlowScreen from '../screens/private/PrivatePetsFlowScreen';
import PrivateConsultationsScreen from '../screens/private/PrivateConsultationsScreen';
import PrivateNotificationsScreen from '../screens/private/PrivateNotificationsScreen';
import PrivateSecurityScreen from '../screens/private/PrivateSecurityScreen';
import PrivateHelpSupportScreen from '../screens/private/PrivateHelpSupportScreen';

type Screen =
  | 'Splash'
  | 'Home'
  | 'Explore'
  | 'Plans'
  | 'Benefits'
  | 'Profile'
  | 'Services'
  | 'HowItWorks'
  | 'Login'
  | 'Register'
  | 'ForgotPassword'
  | 'EmailSent'
  | 'VerifyCode'
  | 'ResetPassword'
  | 'Support'
  | 'Faq'
  | 'Terms'
  | 'Privacy'
  | 'PrivateHome'
  | 'PrivateProfile'
  | 'PrivateExplore'
  | 'PrivateServices'
  | 'PrivatePlans'
  | 'PrivateBenefits'
  | 'PrivatePersonalData'
  | 'PrivatePaymentMethods'
  | 'PrivatePetsFlow'
  | 'PrivateConsultations'
  | 'PrivateNotifications'
  | 'PrivateSecurity'
  | 'PrivateHelpSupport';

export default function AppNavigator() {
  const [stack, setStack] = useState<Screen[]>(['Splash']);
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([]);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  // Estados globais do utilizador (Perfil, Dados Pessoais, Foto, etc.)
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('Jadi Borges');
  const [userEmail, setUserEmail] = useState('jadi.borges@email.com');
  const [userPhone, setUserPhone] = useState('(11) 98765-4321');
  const [userCpf, setUserCpf] = useState('123.456.789-00');

  const currentScreen = stack[stack.length - 1];

  const push = useCallback(
    (screen: Screen) => setStack((prev) => [...prev, screen]),
    []
  );

  const reset = useCallback((screen: Screen) => setStack([screen]), []);

  const back = useCallback(
    () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev)),
    []
  );

  const goTo = useCallback((target: 'Login' | 'Register') => {
    setStack((prev) => {
      const index = prev.lastIndexOf(target);
      if (index >= 0) return prev.slice(0, index + 1);
      return [...prev.slice(0, -1), target];
    });
  }, []);

  // Botão voltar do Android
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 1) {
        back();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [stack, back]);

  // Navegação das abas inferiores (públicas)
  const tabs = {
    onNavigateToHome: () => reset('Home'),
    onNavigateToExplore: () => reset('Explore'),
    onNavigateToPlans: () => reset('Plans'),
    onNavigateToBenefits: () => reset('Benefits'),
    onNavigateToProfile: () => reset('Profile'),
  };

  // Navegação da barra inferior (privada / pós-login)
  const privateTabs = {
    onNavigateToHome: () => reset('PrivateHome'),
    onNavigateToExplore: () => reset('PrivateExplore'),
    onNavigateToPlans: () => reset('PrivatePlans'),
    onNavigateToBenefits: () => reset('PrivateBenefits'),
    onNavigateToProfile: () => reset('PrivateProfile'),
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Splash':
        return <SplashScreen onFinish={() => reset('Home')} />;

      // ---------- Abas principais (Públicas) ----------
      case 'Home':
        return (
          <HomeScreen
            {...tabs}
            onNavigateToLogin={() => push('Login')}
            onNavigateToRegister={() => push('Register')}
            onNavigateToServices={() => push('Services')}
            onNavigateToHowItWorks={() => push('HowItWorks')}
          />
        );
      case 'Explore':
        return <ExploreScreen {...tabs} onBack={() => reset('Home')} />;
      case 'Plans':
        return (
          <PlansScreen
            {...tabs}
            onNavigateToLogin={() => push('Login')}
            onBack={() => reset('Home')}
          />
        );
      case 'Benefits':
        return (
          <BenefitsScreen
            {...tabs}
            onNavigateToLogin={() => push('Login')}
            onNavigateToPlans={() => reset('Plans')}
            onBack={() => reset('Home')}
          />
        );
      case 'Profile':
        return (
          <ProfileScreen
            {...tabs}
            onNavigateToLogin={() => push('Login')}
            onNavigateToRegister={() => push('Register')}
            onNavigateToSupport={() => push('Support')}
            onNavigateToFaq={() => push('Faq')}
            onNavigateToTerms={() => push('Terms')}
            onNavigateToPrivacy={() => push('Privacy')}
            onBack={() => reset('Home')}
          />
        );

      // ---------- Páginas de conteúdo (Públicas) ----------
      case 'Services':
        return (
          <ServicesScreen
            onBack={back}
            onNavigateToPlans={() => reset('Plans')}
            onNavigateToExplore={() => reset('Explore')}
            onNavigateToLogin={() => push('Login')}
          />
        );
      case 'HowItWorks':
        return (
          <HowItWorksScreen
            onBack={back}
            onNavigateToServices={() => push('Services')}
            onNavigateToLogin={() => push('Login')}
            onNavigateToRegister={() => push('Register')}
          />
        );
      case 'Support':
        return <SupportScreen {...tabs} onBack={back} />;
      case 'Faq':
        return <FaqScreen {...tabs} onBack={back} />;
      case 'Terms':
        return <TermsScreen {...tabs} onBack={back} />;
      case 'Privacy':
        return <PrivacyScreen {...tabs} onBack={back} />;

      // ---------- Autenticação ----------
      case 'Login':
        return (
          <LoginScreen
            onBack={back}
            onLoginSuccess={() => reset('PrivateHome')}
            onNavigateToRegister={() => goTo('Register')}
            onNavigateToForgotPassword={() => push('ForgotPassword')}
            onNavigateToTerms={() => push('Terms')}
            onNavigateToPrivacy={() => push('Privacy')}
          />
        );
      case 'Register':
        return (
          <RegisterScreen
            onBack={back}
            registeredEmails={registeredEmails}
            onRegisterUser={(email) =>
              setRegisteredEmails((prev) => [...prev, email])
            }
            onNavigateToLogin={() => goTo('Login')}
            onNavigateToTerms={() => push('Terms')}
            onNavigateToPrivacy={() => push('Privacy')}
          />
        );

      // ---------- Recuperação de senha ----------
      case 'ForgotPassword':
        return (
          <ForgotPasswordScreen
            onBack={back}
            registeredEmails={registeredEmails}
            onNavigateToLogin={() => goTo('Login')}
            onCodeSent={(email) => {
              setRecoveryEmail(email);
              push('EmailSent');
            }}
          />
        );
      case 'EmailSent':
        return (
          <EmailSentScreen
            email={recoveryEmail}
            onBack={back}
            onNavigateToVerifyCode={() => push('VerifyCode')}
          />
        );
      case 'VerifyCode':
        return (
          <VerifyCodeScreen
            onBack={back}
            onNavigateToResetPassword={() => push('ResetPassword')}
          />
        );
      case 'ResetPassword':
        return (
          <ResetPasswordScreen
            onBack={back}
            onNavigateToLogin={() => goTo('Login')}
          />
        );

      // ---------- Área Privada (Pós-login) ----------
      case 'PrivateHome':
        return (
          <PrivateHomeScreen
            {...privateTabs}
            onNavigateToServices={() => push('PrivateServices')}
            profileImage={profileImage}
            userName={userName}
          />
        );
      case 'PrivateProfile':
        return (
          <PrivateProfileScreen
            {...privateTabs}
            profileImage={profileImage}
            userName={userName}
            userEmail={userEmail}
            onNavigateToPersonalData={() => push('PrivatePersonalData')}
            onNavigateToPaymentMethods={() => push('PrivatePaymentMethods')}
            onNavigateToPets={() => push('PrivatePetsFlow')}
            onNavigateToConsultations={() => push('PrivateConsultations')}
            onNavigateToNotifications={() => push('PrivateNotifications')}
            onNavigateToSecurity={() => push('PrivateSecurity')}
            onNavigateToHelp={() => push('PrivateHelpSupport')}
            onLogout={() => reset('Home')}
          />
        );
      case 'PrivateExplore':
        return <PrivateExploreScreen {...privateTabs} />;
      case 'PrivateServices':
        return <PrivateServicesScreen {...privateTabs} onBack={back} />;
      case 'PrivatePlans':
        return <PrivatePlansScreen {...privateTabs} />;
      case 'PrivateBenefits':
        return <PrivateBenefitsScreen {...privateTabs} />;

      // ---------- Subtelas do Perfil Privado ----------
      case 'PrivatePersonalData':
        return (
          <PrivatePersonalDataScreen
            {...privateTabs}
            onBack={back}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            userName={userName}
            setUserName={setUserName}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
            userPhone={userPhone}
            setUserPhone={setUserPhone}
            userCpf={userCpf}
            setUserCpf={setUserCpf}
          />
        );
      case 'PrivatePaymentMethods':
        return <PrivatePaymentMethodsScreen {...privateTabs} onBack={back} />;
      case 'PrivatePetsFlow':
        return <PrivatePetsFlowScreen {...privateTabs} onBack={back} />;
      case 'PrivateConsultations':
        return <PrivateConsultationsScreen {...privateTabs} onBack={back} />;
      case 'PrivateNotifications':
        return <PrivateNotificationsScreen {...privateTabs} onBack={back} />;
      case 'PrivateSecurity':
        return <PrivateSecurityScreen {...privateTabs} onBack={back} />;
      case 'PrivateHelpSupport':
        return <PrivateHelpSupportScreen {...privateTabs} onBack={back} />;

      default:
        return null;
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