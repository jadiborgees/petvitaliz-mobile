import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';

interface PrivateBenefitsScreenProps {
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

export default function PrivateBenefitsScreen({
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: PrivateBenefitsScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#21479B" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clube de Benefícios</Text>
      </View>

      {/* Conteúdo */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionSubtitle}>Descontos exclusivos para clientes PetVitaliz</Text>

        {/* Card Benefício 1 */}
        <TouchableOpacity style={styles.benefitCard} activeOpacity={0.85}>
          <View style={[styles.iconBg, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="medical-outline" size={24} color="#EF4444" />
          </View>
          <View style={styles.benefitInfo}>
            <Text style={styles.benefitTitle}>20% OFF em Exames</Text>
            <Text style={styles.benefitDesc}>Válido para laboratórios parceiros da rede.</Text>
          </View>
        </TouchableOpacity>

        {/* Card Benefício 2 */}
        <TouchableOpacity style={styles.benefitCard} activeOpacity={0.85}>
          <View style={[styles.iconBg, { backgroundColor: '#E0F2FE' }]}>
            <Ionicons name="cut-outline" size={24} color="#0284C7" />
          </View>
          <View style={styles.benefitInfo}>
            <Text style={styles.benefitTitle}>Banho e Tosa Grátis</Text>
            <Text style={styles.benefitDesc}>1 cupom mensal nos petshops credenciados.</Text>
          </View>
        </TouchableOpacity>

        {/* Card Benefício 3 */}
        <TouchableOpacity style={styles.benefitCard} activeOpacity={0.85}>
          <View style={[styles.iconBg, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="cart-outline" size={24} color="#D97706" />
          </View>
          <View style={styles.benefitInfo}>
            <Text style={styles.benefitTitle}>15% OFF em Rações</Text>
            <Text style={styles.benefitDesc}>Desconto direto na compra em lojas parceiras.</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Componente Fixo de Navegação */}
      <PrivateBottomNav
        currentRoute="PrivateBenefits"
        onNavigateToHome={onNavigateToHome || (() => {})}
        onNavigateToExplore={onNavigateToExplore || (() => {})}
        onNavigateToPlans={onNavigateToPlans || (() => {})}
        onNavigateToBenefits={onNavigateToBenefits || (() => {})}
        onNavigateToProfile={onNavigateToProfile || (() => {})}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#21479B',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 16,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  scrollContent: { padding: 20, paddingBottom: 90 },
  sectionSubtitle: { fontSize: 13, color: '#64748B', fontWeight: '500', marginBottom: 16 },
  benefitCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitInfo: { flex: 1, marginLeft: 14 },
  benefitTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  benefitDesc: { fontSize: 12, color: '#64748B', marginTop: 2 },
});