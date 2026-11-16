import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Text } from 'react-native';
import PrivateHeader from '../../components/PrivateHeader';
import BottomNavigation from '../../components/BottomNavigation';
import PlanShowcaseList from '../../components/PlanShowcaseList';
import { theme } from '../../theme/privateTheme';
import type { PlanId } from '../../data/planCoverage';

interface PlansScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToLogin?: () => void;
  // Escolher um plano sem login: entra (ou cria conta) e volta para ele (regra A2)
  onChoosePlan?: (planId: PlanId) => void;
  initialPlanId?: PlanId;
}

export default function PlansScreen({
  onBack,
  onNavigateToHome,
  onNavigateToBenefits,
  onNavigateToProfile,
  onNavigateToLogin,
  onChoosePlan,
  initialPlanId,
}: PlansScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <PrivateHeader title="Planos" onBack={onBack ?? onNavigateToHome} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.intro}>Escolha o plano ideal. Você entra ou cria sua conta e segue para o pagamento.</Text>
        <PlanShowcaseList initialPlanId={initialPlanId} onChoose={(planId) => (onChoosePlan ? onChoosePlan(planId) : onNavigateToLogin?.())} />
      </ScrollView>
      <BottomNavigation
        currentRoute="Plans"
        onNavigateToHome={onNavigateToHome}
        onNavigateToPlans={() => {}}
        onNavigateToBenefits={onNavigateToBenefits}
        onNavigateToProfile={onNavigateToProfile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 130 },
  intro: { fontSize: 13, fontFamily: theme.fonts.regular, color: theme.colors.muted, marginBottom: 14, lineHeight: 19 },
});