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
import LoginScreen from '../screens/public/LoginScreen';
import RegisterScreen from '../screens/public/RegisterScreen';
import ForgotPasswordScreen from '../screens/public/ForgotPasswordScreen';
import EmailSentScreen from '../screens/public/EmailSentScreen';
import VerifyCodeScreen from '../screens/public/VerifyCodeScreen';
import ResetPasswordScreen from '../screens/public/ResetPasswordScreen';
import SupportScreen from '../screens/public/SupportScreen';
import FaqScreen from '../screens/public/FaqScreen';
import TermsScreen from '../screens/public/TermsScreen';
import PrivacyScreen from '../screens/public/PrivacyScreen';

// Telas privadas (apenas a Home privada nesta etapa)
import PrivateHomeScreen from '../screens/private/PrivateHomeScreen';

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
  | 'PrivateHome';

export default function AppNavigator() {
  // Pilha de telas: "voltar" sempre retorna à tela anterior real.
  const [stack, setStack] = useState<Screen[]>(['Splash']);
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([]);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const currentScreen = stack[stack.length - 1];

  // Abre uma tela por cima da atual (ex.: Profile -> Termos)
  const push = useCallback(
    (screen: Screen) => setStack((prev) => [...prev, screen]),
    []
  );

  // Zera o histórico e vai para a tela (abas, splash, login bem-sucedido)
  const reset = useCallback((screen: Screen) => setStack([screen]), []);

  // Volta uma tela
  const back = useCallback(
    () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev)),
    []
  );

  // Login <-> Cadastro: troca a tela atual sem acumular histórico.
  // Se a tela de destino já existe na pilha, volta até ela.
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

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Splash':
        return <SplashScreen onFinish={() => reset('Home')} />;

      // ---------- Abas principais ----------
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

      // ---------- Páginas de conteúdo ----------
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
            // LOGIN OK -> Home privada (limpa o histórico para o "voltar"
            // não retornar para a tela de login)
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

      // ---------- Área privada ----------
      case 'PrivateHome':
        return <PrivateHomeScreen />;

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
