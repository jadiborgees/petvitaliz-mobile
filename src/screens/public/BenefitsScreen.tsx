import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import PrivateHeader from '../../components/PrivateHeader';
import BottomNavigation from '../../components/BottomNavigation';
import { theme } from '../../theme/privateTheme';
import { PLAN_ORDER, PLAN_NAMES, PLAN_FEATURES, type PlanId } from '../../data/planCoverage';

interface BenefitsScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToRegister?: () => void;
  onChoosePlan?: (planId: PlanId) => void;
}

const BANNERS: Record<PlanId, ImageSourcePropType> = {
  bronze: require('../../assets/Plano-Bronze.png'),
  prata: require('../../assets/Plano-Prata.png'),
  ouro: require('../../assets/Plano-Ouro.png'),
  diamante: require('../../assets/Plano-Diamante.png'),
};

const BANNER_WIDTH = Dimensions.get('window').width - 36;
const C = theme.colors;
const F = theme.fonts;

export default function BenefitsScreen({
  onBack,
  onNavigateToHome,
  onNavigateToPlans,
  onNavigateToProfile,
  onNavigateToLogin,
  onNavigateToRegister,
  onChoosePlan,
}: BenefitsScreenProps) {
  const [tab, setTab] = useState<PlanId>('ouro');
  const choose = () => (onChoosePlan ? onChoosePlan(tab) : onNavigateToLogin?.());

  return (
    <SafeAreaView style={styles.container}>
      <PrivateHeader title="Benefícios" onBack={onBack ?? onNavigateToHome} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Regra A3 */}
        <View style={styles.hero}>
          <View style={styles.heroCircle} />
          <Text style={styles.heroTitle}>Entre para ver seus benefícios</Text>
          <Text style={styles.heroText}>Cotas do mês, serviços cobertos e agendamento do seu pet.</Text>
          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.yellowButton} onPress={onNavigateToLogin} activeOpacity={0.85}>
              <Text style={styles.yellowText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.outlineButton} onPress={onNavigateToRegister} activeOpacity={0.85}>
              <Text style={styles.outlineText}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Conheça os planos</Text>
        <View style={styles.tabs}>
          {PLAN_ORDER.map((id) => (
            <TouchableOpacity key={id} style={[styles.tab, tab === id && styles.tabActive]} onPress={() => setTab(id)}>
              <Text style={[styles.tabText, tab === id && styles.tabTextActive]}>{PLAN_NAMES[id].replace('Plano ', '')}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.92} onPress={choose}>
          <Image source={BANNERS[tab]} style={styles.banner} resizeMode="cover" />
        </TouchableOpacity>

        <View style={styles.card}>
          {PLAN_FEATURES[tab].map((feature, index) => (
            <View key={feature.text} style={[styles.featureRow, index < PLAN_FEATURES[tab].length - 1 && styles.divider]}>
              <Feather name="check-circle" size={16} color={C.success} />
              <Text style={styles.featureText}>{feature.text}</Text>
              <Text style={styles.featureCount}>{feature.count}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={choose} activeOpacity={0.85}>
          <Text style={styles.primaryText}>Escolher {PLAN_NAMES[tab].replace('Plano ', '')}</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavigation
        currentRoute="Benefits"
        onNavigateToHome={onNavigateToHome}
        onNavigateToPlans={onNavigateToPlans}
        onNavigateToBenefits={() => {}}
        onNavigateToProfile={onNavigateToProfile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scrollContent: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 130 },
  hero: { backgroundColor: C.primary, borderRadius: 20, padding: 16, overflow: 'hidden' },
  heroCircle: { position: 'absolute', right: -40, top: -40, width: 130, height: 130, borderRadius: 65, backgroundColor: '#2148AA' },
  heroTitle: { fontSize: 17, fontFamily: F.bold, color: '#FFFFFF' },
  heroText: { fontSize: 12, fontFamily: F.regular, color: '#C9D6EE', marginTop: 4 },
  heroButtons: { flexDirection: 'row', gap: 8, marginTop: 14 },
  yellowButton: { flex: 1, minHeight: 42, borderRadius: 11, backgroundColor: C.brandYellow, alignItems: 'center', justifyContent: 'center' },
  yellowText: { fontSize: 13, fontFamily: F.bold, color: C.navy },
  outlineButton: { flex: 1, minHeight: 42, borderRadius: 11, borderWidth: 1.5, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  outlineText: { fontSize: 13, fontFamily: F.bold, color: '#FFFFFF' },
  sectionTitle: { fontSize: 16, fontFamily: F.bold, color: C.navy, marginTop: 24 },
  tabs: { flexDirection: 'row', backgroundColor: C.divider, borderRadius: 12, padding: 4, marginTop: 10, marginBottom: 12 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 9 },
  tabActive: { backgroundColor: C.card },
  tabText: { fontSize: 12, fontFamily: F.semibold, color: C.muted },
  tabTextActive: { color: C.navy, fontFamily: F.bold },
  banner: { width: BANNER_WIDTH, height: BANNER_WIDTH / 2, borderRadius: 16 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, paddingHorizontal: 14, marginTop: 12 },
  divider: { borderBottomWidth: 1, borderBottomColor: C.divider },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 11 },
  featureText: { flex: 1, fontSize: 13, fontFamily: F.medium, color: C.navy },
  featureCount: { fontSize: 12, fontFamily: F.semibold, color: C.muted },
  primaryButton: { minHeight: 48, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  primaryText: { color: '#FFFFFF', fontSize: 14, fontFamily: F.bold },
});