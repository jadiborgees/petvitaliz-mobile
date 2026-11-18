import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  Alert,
} from 'react-native';

// Telas públicas
import SplashScreen from '../screens/public/SplashScreen';
import HomeScreen from '../screens/public/HomeScreen';
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
import PrivateMyPlanScreen from '../screens/private/PrivateMyPlanScreen';
import PrivateChangePlanScreen from '../screens/private/PrivateChangePlanScreen';
import { PLAN_NAMES, getCyclePrice, getPlanId, type ServiceId, type PlanId } from '../data/planCoverage';
import PrivateManagePlanScreen from '../screens/private/PrivateManagePlanScreen';
import PrivateInvoicesScreen from '../screens/private/PrivateInvoicesScreen';
import PrivateBenefitsScreen from '../screens/private/PrivateBenefitsScreen';
import PrivatePersonalDataScreen from '../screens/private/PrivatePersonalDataScreen';
import PrivatePaymentMethodsScreen from '../screens/private/PrivatePaymentMethodsScreen';
import type { SavedCard } from '../screens/private/PrivatePaymentMethodsScreen';
import PrivatePetsFlowScreen from '../screens/private/PrivatePetsFlowScreen';
import type { Pet } from '../screens/private/PrivatePetsFlowScreen';
import PrivateConsultationsScreen from '../screens/private/PrivateConsultationsScreen';
import type { ConsultationAppointment } from '../screens/private/PrivateConsultationsScreen';
import PrivateNotificationsScreen from '../screens/private/PrivateNotificationsScreen';
import type { NotificationPrefs } from '../screens/private/PrivateNotificationsScreen';
import PrivateSecurityScreen from '../screens/private/PrivateSecurityScreen';
import PrivateHelpSupportScreen from '../screens/private/PrivateHelpSupportScreen';
import PrivateTermsScreen from '../screens/private/PrivateTermsScreen';

// Rotas
type Screen =
  | 'Splash'
  | 'Home'
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
  | 'PrivateMyPlan'
  | 'PrivateChangePlan'
  | 'PrivateManagePlan'
  | 'PrivateInvoices'
  | 'PrivateBenefits'
  | 'PrivatePersonalData'
  | 'PrivatePaymentMethods'
  | 'PrivatePetsFlow'
  | 'PrivateConsultations'
  | 'PrivateNotifications'
  | 'PrivateSecurity'
  | 'PrivateHelpSupport'
  | 'PrivateTerms'
  | 'PublicHelp'
  | 'PublicTerms';

// Dados da assinatura
type PlanSubscription = {
  petId: string;
  planId: string;
  planName: string;
  petName: string;
  billingCycle: 'monthly' | 'yearly';
  paymentMethod: 'card' | 'pix' | 'boleto';
  totalPrice: number;
  installments: number;
  status: 'paid' | 'pending';
  cardLast4?: string;
  startedAt?: string;
  // Troca para um plano menor, agendada para a próxima renovação.
  scheduledChange?: {
    planId: string;
    planName: string;
    billingCycle: 'monthly' | 'yearly';
    effectiveDate: string;
  } | null;
};

// Dados das faturas
type Invoice = {
  id: string;
  description: string;
  dueDate: string;
  amount: number;
  status: 'Paga' | 'Pendente';
};

export default function AppNavigator() {
  const [stack, setStack] = useState<Screen[]>(['Splash']);

  const [registeredEmails, setRegisteredEmails] = useState<string[]>([]);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  // Dados do usuário
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('Jadi Borges');
  const [userEmail, setUserEmail] = useState('jadi.borges@email.com');
  const [userPhone, setUserPhone] = useState('(11) 98765-4321');
  const [userCpf, setUserCpf] = useState('123.456.789-00');
  const [userBirthDate, setUserBirthDate] = useState('');

  // Preferências de notificação
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
    consultas: true,
    vacinas: true,
    ofertas: false,
  });

  // Cartões salvos (só os 4 últimos números)
  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    { id: 'card-demo', brand: 'Visa', last4: '8890', holder: 'JADI BORGES', expiry: '09/29', isMain: true },
  ]);

  // Lista compartilhada de pets
  const [userPets, setUserPets] = useState<Pet[]>([]);

  // Dados da contratação
  const [planSubscription, setPlanSubscription] =
    useState<PlanSubscription | null>(null);

  // Faturas
  const [invoices] = useState<Invoice[]>([]);

  // Pet escolhido ao abrir Contratar Plano a partir de Meus Pets
  const [contractPetId, setContractPetId] = useState<string | null>(null);
  // Plano escolhido ao tocar num banner
  const [contractPlanId, setContractPlanId] = useState<string | null>(null);

  // Agendamento aberto a partir de Serviços ou Meu Plano
  const [bookingIntent, setBookingIntent] = useState<{
    petId: string;
    serviceId?: ServiceId;
  } | null>(null);

  const openConsultations = (intent: { petId: string; serviceId?: ServiceId } | null = null) => {
    setBookingIntent(intent);
    push('PrivateConsultations');
  };

  // Pet escolhido para a tela Mudar de plano
  const [changePlanPetId, setChangePlanPetId] = useState<string | null>(null);
  const [changePlanPreset, setChangePlanPreset] = useState<{
    planId: PlanId;
    cycle: 'monthly' | 'yearly';
  } | null>(null);

  const openChangePlan = (
    petId: string,
    preset: { planId: PlanId; cycle: 'monthly' | 'yearly' } | null = null,
  ) => {
    setChangePlanPetId(petId);
    setChangePlanPreset(preset);
    push('PrivateChangePlan');
  };

  // Consultas agendadas (compartilhadas entre as telas)
  const [appointments, setAppointments] = useState<ConsultationAppointment[]>([]);

  const currentScreen = stack[stack.length - 1];

  // Navegação
  const push = useCallback((screen: Screen) => {
    setStack((prev) => [...prev, screen]);
  }, []);

  const reset = useCallback((screen: Screen) => {
    setStack([screen]);
  }, []);

  const back = useCallback(() => {
    setStack((prev) =>
      prev.length > 1 ? prev.slice(0, -1) : prev,
    );
  }, []);

  // Volta para a tela anterior. Se não houver (aberta pela barra inferior),
  // volta para o Início da área logada.
  const backOrHome = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : ['PrivateHome']));
  }, []);

  // Plano escolhido sem login (regra A2): depois do login, abre o checkout dele.
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);

  // Plano aberto na vitrine pública (vindo da Home)
  const [publicPlanId, setPublicPlanId] = useState<PlanId | undefined>(undefined);

  const choosePlanPublic = (planId: string) => {
    setPendingPlanId(planId);
    setStack((prev) => [...prev, 'Login']);
  };

  // Depois de entrar ou criar conta.
  const afterAuth = () => {
    if (pendingPlanId) {
      setContractPetId(null);
      setContractPlanId(pendingPlanId);
      setPendingPlanId(null);
      setStack(['PrivateHome', 'PrivatePlans']);
    } else {
      setStack(['PrivateHome']);
    }
  };

  const goTo = useCallback((target: 'Login' | 'Register') => {
    setStack((prev) => {
      const index = prev.lastIndexOf(target);

      if (index >= 0) {
        return prev.slice(0, index + 1);
      }

      return [...prev.slice(0, -1), target];
    });
  }, []);

  // Botão voltar do Android
  useEffect(() => {
    const sub = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (stack.length > 1) {
          back();
          return true;
        }

        return false;
      },
    );

    return () => sub.remove();
  }, [stack, back]);

  // Navegação pública
  const tabs = {
    onNavigateToHome: () => reset('Home'),
    onNavigateToPlans: () => {
      setPublicPlanId(undefined);
      reset('Plans');
    },
    onNavigateToBenefits: () => reset('Benefits'),
    onNavigateToProfile: () => reset('Profile'),
  };

  // Navegação privada
  const privateTabs = {
    onNavigateToHome: () => reset('PrivateHome'),
    onNavigateToExplore: () => reset('PrivateExplore'),

    onNavigateToPlans: () => {
      setContractPetId(null);
      setContractPlanId(null);
      reset(planSubscription ? 'PrivateMyPlan' : 'PrivatePlans');
    },

    onNavigateToMyPlan: () => reset('PrivateMyPlan'),
    onNavigateToBenefits: () => reset('PrivateBenefits'),
    onNavigateToProfile: () => reset('PrivateProfile'),
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Splash':
        return (
          <SplashScreen
            onFinish={() => reset('Home')}
          />
        );

      // Telas públicas
      case 'Home':
        return (
          <HomeScreen
            {...tabs}
            onNavigateToLogin={() => push('Login')}
            onNavigateToRegister={() => push('Register')}
            onNavigateToServices={() => reset('Plans')}
            onNavigateToSupport={() => push('PublicHelp')}
            onChoosePlan={choosePlanPublic}
            onOpenPlans={(planId) => {
              setPublicPlanId(planId);
              push('Plans');
            }}
          />
        );

      case 'Plans':
        return (
          <PlansScreen
            {...tabs}
            onNavigateToLogin={() => push('Login')}
            onChoosePlan={choosePlanPublic}
            initialPlanId={publicPlanId}
            onBack={() => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : ['Home']))}
          />
        );

      case 'Benefits':
        return (
          <BenefitsScreen
            {...tabs}
            onNavigateToLogin={() => push('Login')}
            onNavigateToRegister={() => push('Register')}
            onChoosePlan={choosePlanPublic}
            onBack={() => reset('Home')}
          />
        );

      case 'Profile':
        return (
          <ProfileScreen
            {...tabs}
            onNavigateToLogin={() => push('Login')}
            onNavigateToRegister={() => push('Register')}
            onNavigateToSupport={() => push('PublicHelp')}
            onNavigateToTerms={() => push('PublicTerms')}
            onBack={() => reset('Home')}
          />
        );

      // Páginas públicas
      case 'Services':
        return (
          <ServicesScreen
            onBack={back}
            onNavigateToPlans={() => reset('Plans')}
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

      // Autenticação
      case 'Login':
        return (
          <LoginScreen
            onBack={back}
            onLoginSuccess={afterAuth}
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
            onRegisterSuccess={afterAuth}
            onNavigateToTerms={() => push('PublicTerms')}
            onNavigateToPrivacy={() => push('Privacy')}
          />
        );

      // Recuperação de senha
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

      // Área privada
      case 'PrivateHome':
        return (
          <PrivateHomeScreen
            {...privateTabs}
            onNavigateToServices={() => push('PrivateServices')}
            onNavigateToSupport={() => push('PrivateHelpSupport')}
            onNavigateToPets={() => push('PrivatePetsFlow')}
            onNavigateToConsultations={() => openConsultations()}
            onNavigateToPersonalData={() => push('PrivatePersonalData')}
            onNavigateToPaymentMethods={() => push('PrivatePaymentMethods')}
            onNavigateToNotifications={() => push('PrivateNotifications')}
            onNavigateToSecurity={() => push('PrivateSecurity')}
            onLogout={() => reset('Home')}
            profileImage={profileImage}
            userName={userName}
            userEmail={userEmail}
            pets={userPets}
            subscription={planSubscription}
            appointments={appointments}
            onOpenPlan={(planId) => {
              setContractPetId(null);
              setContractPlanId(planId);
              push('PrivatePlans');
            }}
            upcomingCount={appointments.filter((item) => item.status === 'scheduled' && item.date >= new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)).length}
            onNavigateToTerms={() => push('PrivateTerms')}
            onNavigateToMyPlan={() => reset('PrivateMyPlan')}
            onContractPlan={(petId) => {
              setContractPetId(petId);
              setContractPlanId(null);
              push('PrivatePlans');
            }}
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
            onNavigateToConsultations={() => openConsultations()}
            onNavigateToNotifications={() => push('PrivateNotifications')}
            onNavigateToSecurity={() => push('PrivateSecurity')}
            onNavigateToHelp={() => push('PrivateHelpSupport')}
            onNavigateToMyPlan={() => reset('PrivateMyPlan')}
            onNavigateToTerms={() => push('PrivateTerms')}
            onBack={backOrHome}
            petsCount={userPets.length}
            activePlans={userPets.filter((pet) => pet.hasActivePlan).length}
            upcomingCount={appointments.filter((item) => item.status === 'scheduled' && item.date >= new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)).length}
            onLogout={() => reset('Home')}
          />
        );

      case 'PrivateExplore':
        return (
          <PrivateExploreScreen {...privateTabs} />
        );

      case 'PrivateServices':
        return (
          <PrivateServicesScreen
            {...privateTabs}
            onBack={back}
            pets={userPets}
            onNavigateToAddPet={() => push('PrivatePetsFlow')}
            onSelectService={(petId, serviceId) => openConsultations({ petId, serviceId })}
          />
        );

      // Contratação de planos
      case 'PrivatePlans':
        return (
          <PrivatePlansScreen
            {...privateTabs}
            onBack={backOrHome}
            pets={userPets}
            initialPetId={contractPetId}
            initialPlanId={contractPlanId}
            onPurchaseComplete={(subscription) => {
              setPlanSubscription({
                ...subscription,
                startedAt: new Date().toISOString(),
              });

              if (subscription.status === 'paid') {
                setUserPets((previousPets) =>
                  previousPets.map((pet) =>
                    pet.id === subscription.petId
                      ? {
                          ...pet,
                          plan: subscription.planName,
                          hasActivePlan: true,
                        }
                      : pet,
                  ),
                );
              }
            }}
            onNavigateToAddPet={() => push('PrivatePetsFlow')}
            onNavigateToMyPlan={() => reset('PrivateMyPlan')}
          />
        );

      // Meu Plano
      case 'PrivateMyPlan':
        return (
          <PrivateMyPlanScreen
            {...privateTabs}
            onBack={backOrHome}
            onNavigateToPlans={() => reset('PrivatePlans')}
            onNavigateToManagePlan={() => push('PrivateManagePlan')}
            onNavigateToPaymentMethods={() => push('PrivatePaymentMethods')}
            onNavigateToInvoices={() => push('PrivateInvoices')}
            onNavigateToPets={() => push('PrivatePetsFlow')}
            onNavigateToSchedule={(petId) => openConsultations({ petId })}
            onNavigateToChangePlan={(petId) => openChangePlan(petId)}
            onCancelSubscription={() => {
              Alert.alert(
                'Cancelamento',
                'A solicitação de cancelamento ainda precisa ser conectada ao backend.',
              );
            }}
            subscription={planSubscription}
            invoices={invoices}
            appointments={appointments}
            pets={userPets}
          />
        );

      // Mudar de plano
      case 'PrivateChangePlan': {
        const pet = userPets.find((item) => item.id === changePlanPetId);
        if (!pet) return null;

        const details =
          planSubscription &&
          planSubscription.petName.trim().toLowerCase() === pet.name.trim().toLowerCase()
            ? planSubscription
            : null;

        return (
          <PrivateChangePlanScreen
            pet={pet}
            currentCycle={details?.billingCycle}
            paymentMethod={details?.paymentMethod}
            startedAt={details?.startedAt}
            initialPlanId={changePlanPreset?.planId}
            initialCycle={changePlanPreset?.cycle}
            onBack={back}
            onNavigateToPaymentMethods={() => push('PrivatePaymentMethods')}
            onConfirm={(result) => {
              const planName = PLAN_NAMES[result.planId];
              const base: PlanSubscription = details ?? {
                petId: pet.id,
                planId: getPlanId(pet.plan) ?? result.planId,
                planName: pet.plan ?? planName,
                petName: pet.name,
                billingCycle: 'monthly',
                paymentMethod: 'card',
                totalPrice: getCyclePrice(getPlanId(pet.plan) ?? result.planId, 'monthly'),
                installments: 1,
                status: 'paid',
                startedAt: new Date().toISOString(),
              };

              if (result.appliesNow) {
                // Upgrade: vale hoje.
                setUserPets((previous) =>
                  previous.map((item) =>
                    item.id === pet.id ? { ...item, plan: planName, hasActivePlan: true } : item,
                  ),
                );
                setPlanSubscription({
                  ...base,
                  planId: result.planId,
                  planName,
                  billingCycle: result.billingCycle,
                  totalPrice: getCyclePrice(result.planId, result.billingCycle),
                  installments: 1,
                  startedAt:
                    result.billingCycle !== base.billingCycle
                      ? new Date().toISOString()
                      : base.startedAt,
                  scheduledChange: null,
                });
                back();
                Alert.alert('Plano alterado', `${pet.name} agora tem o ${planName}.`);
              } else {
                // Plano menor ou troca de ciclo: vale na próxima renovação.
                setPlanSubscription({
                  ...base,
                  scheduledChange: {
                    planId: result.planId,
                    planName,
                    billingCycle: result.billingCycle,
                    effectiveDate: result.effectiveDate,
                  },
                });
                back();
                Alert.alert(
                  'Mudança agendada',
                  `${pet.name} passa para o ${planName} em ${new Date(result.effectiveDate).toLocaleDateString('pt-BR')}.`,
                );
              }
            }}
          />
        );
      }

      // Gerenciar Plano
      case 'PrivateManagePlan':
        return (
          <PrivateManagePlanScreen
            {...privateTabs}
            onBack={back}
            onNavigateToPaymentMethods={() => push('PrivatePaymentMethods')}
            onNavigateToChangePlan={(petId, preset) => openChangePlan(petId, preset ?? null)}
            subscription={planSubscription}
            pets={userPets}
            onCancelSubscription={() => {
              Alert.alert(
                'Cancelamento',
                'A solicitação de cancelamento ainda precisa ser conectada ao backend.',
              );
            }}
          />
        );

      // Faturas
      case 'PrivateInvoices':
        return (
          <PrivateInvoicesScreen
            {...privateTabs}
            onBack={back}
            invoices={invoices}
            onPayInvoice={(invoice) => {
              Alert.alert(
                'Pagamento de fatura',
                `Fatura: ${invoice.description}\nValor: ${invoice.amount.toLocaleString(
                  'pt-BR',
                  {
                    style: 'currency',
                    currency: 'BRL',
                  },
                )}\n\nO pagamento desta fatura ainda precisa ser conectado ao checkout.`,
              );
            }}
          />
        );

      case 'PrivateBenefits':
        return (
          <PrivateBenefitsScreen
            {...privateTabs}
            onBack={backOrHome}
            pets={userPets}
            appointments={appointments}
            onNavigateToAddPet={() => push('PrivatePetsFlow')}
            onSchedule={(petId) => openConsultations({ petId })}
            onContractPlan={(petId, planId) => {
              setContractPetId(petId);
              setContractPlanId(planId);
              push('PrivatePlans');
            }}
            onChangePlan={(petId, planId) => {
              const cycle =
                planSubscription && planSubscription.petId === petId
                  ? planSubscription.billingCycle
                  : 'monthly';
              openChangePlan(petId, { planId, cycle });
            }}
          />
        );

      // Subtelas do perfil privado
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
            userBirthDate={userBirthDate}
            setUserBirthDate={setUserBirthDate}
          />
        );

      case 'PrivatePaymentMethods':
        return (
          <PrivatePaymentMethodsScreen
            {...privateTabs}
            onBack={back}
            cards={savedCards}
            onCardsChange={setSavedCards}
            hasActivePlan={userPets.some((pet) => pet.hasActivePlan)}
          />
        );

      case 'PrivatePetsFlow':
        return (
          <PrivatePetsFlowScreen
            {...privateTabs}
            onBack={back}
            pets={userPets}
            onPetsChange={setUserPets}
            onContractPlan={(petId) => {
              setContractPetId(petId);
              setContractPlanId(null);
              push('PrivatePlans');
            }}
          />
        );

      case 'PrivateConsultations':
        return (
          <PrivateConsultationsScreen
            {...privateTabs}
            onBack={back}
            pets={userPets}
            appointments={appointments}
            onAppointmentsChange={setAppointments}
            initialPetId={bookingIntent?.petId}
            initialServiceId={bookingIntent?.serviceId}
            openServiceChoice={!!bookingIntent && !bookingIntent.serviceId}
            onContractPlan={(petId) => {
              setContractPetId(petId);
              setContractPlanId(null);
              push('PrivatePlans');
            }}
          />
        );

      case 'PrivateNotifications':
        return (
          <PrivateNotificationsScreen
            {...privateTabs}
            onBack={back}
            pets={userPets}
            appointments={appointments}
            subscription={planSubscription}
            prefs={notificationPrefs}
            onPrefsChange={setNotificationPrefs}
            onOpenConsultations={() => openConsultations()}
            onOpenMyPlan={() => reset('PrivateMyPlan')}
          />
        );

      case 'PrivateSecurity':
        return (
          <PrivateSecurityScreen
            {...privateTabs}
            onBack={back}
            onDeleteAccount={() => {
              // Regra N11: cancela os planos e apaga os dados.
              setUserPets([]);
              setPlanSubscription(null);
              setAppointments([]);
              setSavedCards([]);
              setProfileImage(null);
              setUserBirthDate('');
              reset('Home');
              Alert.alert('Conta excluída', 'Seus dados foram apagados. Esperamos ver você de novo.');
            }}
          />
        );

      case 'PrivateHelpSupport':
        return (
          <PrivateHelpSupportScreen
            {...privateTabs}
            onBack={back}
            onNavigateToTerms={() => push('PrivateTerms')}
          />
        );

      // Termos abertos de dentro da conta (sem a barra pública)
      case 'PrivateTerms':
        return (
          <PrivateTermsScreen
            {...privateTabs}
            onBack={backOrHome}
            onNavigateToHelp={() => push('PrivateHelpSupport')}
          />
        );

      // Ajuda e Termos abertos sem login (com a barra pública)
      case 'PublicHelp':
        return (
          <PrivateHelpSupportScreen
            {...tabs}
            onBack={back}
            onNavigateToTerms={() => push('PublicTerms')}
          />
        );

      case 'PublicTerms':
        return (
          <PrivateTermsScreen
            {...tabs}
            onBack={back}
            onNavigateToHelp={() => push('PublicHelp')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});