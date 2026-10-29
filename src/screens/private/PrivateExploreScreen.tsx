import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../../components/BottomNavigation';

interface PrivateHomeScreenProps {
  onNavigateToServices?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToSupport?: () => void;
  onNavigateToTips?: () => void;
}

export default function PrivateHomeScreen({
  onNavigateToServices,
  onNavigateToPlans,
  onNavigateToExplore,
  onNavigateToBenefits,
  onNavigateToProfile,
  onNavigateToSupport,
  onNavigateToTips,
}: PrivateHomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#21479B" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner Superior Privado */}
        <View style={styles.headerBanner}>
          <View style={styles.topRow}>
            <Text style={styles.brandTitle}>PetVitaliz</Text>
            <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
              <Ionicons name="settings-sharp" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.welcomeText}>Bem-vindo(a)!</Text>
          <Text style={styles.welcomeSubtitle}>Cuide da saúde do seu pet em um só lugar.</Text>
        </View>

        {/* Atalhos de Acesso Rápido */}
        <View style={styles.quickAccessSection}>
          <Text style={styles.sectionTitle}>Acesso Rápido</Text>
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity style={styles.quickAccessCard} onPress={onNavigateToServices} activeOpacity={0.8}>
              <View style={[styles.quickAccessIconBg, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="grid-outline" size={22} color="#0284C7" />
              </View>
              <Text style={styles.quickAccessLabel}>Serviços</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAccessCard} onPress={onNavigateToPlans} activeOpacity={0.8}>
              <View style={[styles.quickAccessIconBg, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="card-outline" size={22} color="#D97706" />
              </View>
              <Text style={styles.quickAccessLabel}>Meu Plano</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAccessCard} onPress={onNavigateToSupport} activeOpacity={0.8}>
              <View style={[styles.quickAccessIconBg, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="headset-outline" size={22} color="#16A34A" />
              </View>
              <Text style={styles.quickAccessLabel}>Suporte</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seção de Dicas para o Pet */}
        <View style={styles.tipsSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Dicas para o seu Pet</Text>
            <TouchableOpacity onPress={onNavigateToTips} activeOpacity={0.7}>
              <Text style={styles.seeMoreLink}>Ver mais</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.tipPreviewCard} onPress={onNavigateToTips} activeOpacity={0.85}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300&auto=format&fit=crop' }}
              style={styles.tipPreviewImage}
            />
            <View style={styles.tipPreviewContent}>
              <Text style={styles.tipCategoryBadge}>ALIMENTAÇÃO</Text>
              <Text style={styles.tipPreviewTitle} numberOfLines={2}>
                Como escolher a ração ideal para cada idade
              </Text>
              <Text style={styles.tipReadTime}>4 min de leitura</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Componente Global de Navegação */}
      <BottomNavigation
        currentRoute="Home"
        onNavigateToExplore={onNavigateToExplore}
        onNavigateToPlans={onNavigateToPlans}
        onNavigateToBenefits={onNavigateToBenefits}
        onNavigateToProfile={onNavigateToProfile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 30 },
  headerBanner: {
    backgroundColor: '#21479B',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  settingsButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  welcomeSubtitle: { fontSize: 13, color: '#DCE4F7' },
  quickAccessSection: { paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickAccessCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  quickAccessIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickAccessLabel: { fontSize: 12, fontWeight: '700', color: '#1E293B' },
  tipsSection: { paddingHorizontal: 20, paddingTop: 24 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeMoreLink: { fontSize: 13, fontWeight: '700', color: '#21479B' },
  tipPreviewCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  tipPreviewImage: { width: 80, height: 80, borderRadius: 12 },
  tipPreviewContent: { flex: 1, marginLeft: 12 },
  tipCategoryBadge: { fontSize: 10, fontWeight: '800', color: '#21479B', marginBottom: 4 },
  tipPreviewTitle: { fontSize: 13, fontWeight: '700', color: '#1E293B', lineHeight: 18, marginBottom: 4 },
  tipReadTime: { fontSize: 11, color: '#94A3B8' },
});