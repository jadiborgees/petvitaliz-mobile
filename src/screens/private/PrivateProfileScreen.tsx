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

interface PrivateProfileScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToPersonalData?: () => void;
  onNavigateToPaymentMethods?: () => void;
  onNavigateToPets?: () => void;
  onNavigateToConsultations?: () => void;
  onNavigateToNotifications?: () => void;
  onNavigateToSecurity?: () => void;
  onNavigateToHelp?: () => void;
  onLogout?: () => void;
}

export default function PrivateProfileScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  onNavigateToPersonalData,
  onNavigateToPaymentMethods,
  onNavigateToPets,
  onNavigateToConsultations,
  onNavigateToNotifications,
  onNavigateToSecurity,
  onNavigateToHelp,
  onLogout,
}: PrivateProfileScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#21479B" />

      {/* Cabeçalho com fundo Azul */}
      <View style={styles.headerBackground}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack || onNavigateToHome}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Avatar Centralizado */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person-outline" size={42} color="#64748B" />
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Informações do Usuário */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>Jadi Borges</Text>
          <Text style={styles.userEmail}>jadi@email.com</Text>
        </View>

        {/* Seção CONTA */}
        <Text style={styles.sectionLabel}>CONTA</Text>
        <View style={styles.cardGroup}>
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={onNavigateToPersonalData}
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="person-outline" size={18} color="#21479B" />
            </View>
            <Text style={styles.menuText}>Dados Pessoais</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={onNavigateToPaymentMethods}
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="card-outline" size={18} color="#21479B" />
            </View>
            <Text style={styles.menuText}>Formas de Pagamento</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Seção PETS E CONSULTAS */}
        <Text style={styles.sectionLabel}>PETS E CONSULTAS</Text>
        <View style={styles.cardGroup}>
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={onNavigateToPets}
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="paw-outline" size={18} color="#21479B" />
            </View>
            <Text style={styles.menuText}>Meus Pets</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={onNavigateToConsultations}
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="medical-outline" size={18} color="#21479B" />
            </View>
            <Text style={styles.menuText}>Minhas Consultas</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Seção PREFERÊNCIAS */}
        <Text style={styles.sectionLabel}>PREFERÊNCIAS</Text>
        <View style={styles.cardGroup}>
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={onNavigateToNotifications}
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="notifications-outline" size={18} color="#21479B" />
            </View>
            <Text style={styles.menuText}>Notificações</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={onNavigateToSecurity}
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="lock-closed-outline" size={18} color="#21479B" />
            </View>
            <Text style={styles.menuText}>Segurança</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={onNavigateToHelp}
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="help-circle-outline" size={18} color="#21479B" />
            </View>
            <Text style={styles.menuText}>Ajuda e Suporte</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Botão Sair da Conta */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={onLogout}
        >
          <Ionicons name="log-out-outline" size={18} color="#DC2626" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Navegação Inferior Privada */}
      <PrivateBottomNav
        currentRoute="PrivateProfile"
        onNavigateToHome={onNavigateToHome}
        onNavigateToExplore={onNavigateToExplore}
        onNavigateToPlans={onNavigateToPlans}
        onNavigateToBenefits={onNavigateToBenefits}
        onNavigateToProfile={onNavigateToProfile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerBackground: {
    backgroundColor: '#21479B',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingBottom: 36,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  avatarContainer: { alignItems: 'center', marginTop: 16 },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 110 },
  userInfoContainer: { alignItems: 'center', marginBottom: 20 },
  userName: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  userEmail: { fontSize: 12, color: '#64748B', marginTop: 2 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 8, marginTop: 12 },
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 8,
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: { flex: 1, fontSize: 13, fontWeight: '700', color: '#1E293B' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 62 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    height: 48,
    marginTop: 20,
    gap: 8,
  },
  logoutText: { color: '#DC2626', fontWeight: '800', fontSize: 13 },
});