
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
  Image,
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

  userName?: string;
  userEmail?: string;
  profileImage?: string | null;
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
  userName,
  userEmail,
  profileImage,
}: PrivateProfileScreenProps) {
  const displayName = userName?.trim() || 'Meu Perfil';
  const displayEmail = userEmail?.trim() || '';

  const renderMenuItem = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    onPress?: () => void,
  ) => (
    <TouchableOpacity
      style={styles.menuRow}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.menuIconCircle}>
        <Ionicons name={icon} size={18} color="#21479B" />
      </View>

      <Text style={styles.menuText}>{title}</Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#94A3B8"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#21479B"
      />

      {/* Cabeçalho */}
      <View style={styles.headerBackground}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack || onNavigateToHome}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Perfil</Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Foto do usuário */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons
                name="person-outline"
                size={42}
                color="#64748B"
              />
            )}
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Informações do usuário */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>
            {displayName}
          </Text>

          {!!displayEmail && (
            <Text style={styles.userEmail}>
              {displayEmail}
            </Text>
          )}
        </View>

        {/* CONTA */}
        <Text style={styles.sectionLabel}>CONTA</Text>

        <View style={styles.cardGroup}>
          {renderMenuItem(
            'person-outline',
            'Dados Pessoais',
            onNavigateToPersonalData,
          )}

          <View style={styles.divider} />

          {renderMenuItem(
            'card-outline',
            'Formas de Pagamento',
            onNavigateToPaymentMethods,
          )}
        </View>

        {/* PETS E CONSULTAS */}
        <Text style={styles.sectionLabel}>
          PETS E CONSULTAS
        </Text>

        <View style={styles.cardGroup}>
          {renderMenuItem(
            'paw-outline',
            'Meus Pets',
            onNavigateToPets,
          )}

          <View style={styles.divider} />

          {renderMenuItem(
            'medical-outline',
            'Minhas Consultas',
            onNavigateToConsultations,
          )}
        </View>

        {/* PREFERÊNCIAS */}
        <Text style={styles.sectionLabel}>
          PREFERÊNCIAS
        </Text>

        <View style={styles.cardGroup}>
          {renderMenuItem(
            'notifications-outline',
            'Notificações',
            onNavigateToNotifications,
          )}

          <View style={styles.divider} />

          {renderMenuItem(
            'lock-closed-outline',
            'Segurança',
            onNavigateToSecurity,
          )}

          <View style={styles.divider} />

          {renderMenuItem(
            'help-circle-outline',
            'Ajuda e Suporte',
            onNavigateToHelp,
          )}
        </View>

        {/* Sair da conta */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={onLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color="#DC2626"
          />

          <Text style={styles.logoutText}>
            Sair da Conta
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Navegação inferior */}
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
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  headerBackground: {
    backgroundColor: '#21479B',
    paddingTop:
      Platform.OS === 'android'
        ? (StatusBar.currentHeight || 24) + 8
        : 12,
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

  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  headerSpacer: {
    width: 32,
  },

  avatarContainer: {
    alignItems: 'center',
    marginTop: 16,
  },

  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },

  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },

  userEmail: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 8,
    marginTop: 12,
  },

  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 8,
  },

  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },

  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  menuText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },

  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 62,
  },

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

  logoutText: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 13,
  },
});
