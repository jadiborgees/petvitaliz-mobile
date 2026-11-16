
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

const COLORS = {
  primary: '#21479B',
  background: '#F7F9FC',
  surface: '#FFFFFF',
  text: '#17233F',
  secondary: '#66758C',
  muted: '#94A3B8',
  border: '#E8EDF4',
  danger: '#C73D3D',
  dangerBackground: '#FFF5F5',
};

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
    isLast = false,
  ) => (
    <TouchableOpacity
      key={title}
      style={[
        styles.menuRow,
        !isLast && styles.menuRowBorder,
      ]}
      activeOpacity={0.65}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Ionicons
        name={icon}
        size={20}
        color={COLORS.primary}
        style={styles.menuIcon}
      />

      <Text style={styles.menuText}>{title}</Text>

      <Ionicons
        name="chevron-forward-outline"
        size={16}
        color={COLORS.muted}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack || onNavigateToHome}
          activeOpacity={0.7}
          accessibilityLabel="Voltar"
        >
          <Ionicons
            name="arrow-back-outline"
            size={22}
            color={COLORS.text}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Meu perfil</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileCard}>
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
                size={31}
                color={COLORS.primary}
              />
            )}
          </View>

          <View style={styles.profileDetails}>
            <Text style={styles.userName}>
              {displayName}
            </Text>

            {!!displayEmail && (
              <Text style={styles.userEmail}>
                {displayEmail}
              </Text>
            )}

            <Text style={styles.accountCaption}>
              Informações da sua conta
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>CONTA</Text>

        <View style={styles.cardGroup}>
          {renderMenuItem(
            'person-outline',
            'Dados pessoais',
            onNavigateToPersonalData,
          )}
          {renderMenuItem(
            'card-outline',
            'Formas de pagamento',
            onNavigateToPaymentMethods,
            true,
          )}
        </View>

        <Text style={styles.sectionLabel}>
          PETS E CONSULTAS
        </Text>

        <View style={styles.cardGroup}>
          {renderMenuItem(
            'paw-outline',
            'Meus pets',
            onNavigateToPets,
          )}
          {renderMenuItem(
            'calendar-clear-outline',
            'Minhas consultas',
            onNavigateToConsultations,
            true,
          )}
        </View>

        <Text style={styles.sectionLabel}>
          PREFERÊNCIAS
        </Text>

        <View style={styles.cardGroup}>
          {renderMenuItem(
            'notifications-outline',
            'Notificações',
            onNavigateToNotifications,
          )}
          {renderMenuItem(
            'shield-checkmark-outline',
            'Segurança',
            onNavigateToSecurity,
          )}
          {renderMenuItem(
            'headset-outline',
            'Ajuda e suporte',
            onNavigateToHelp,
            true,
          )}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.75}
          onPress={onLogout}
          accessibilityRole="button"
        >
          <Ionicons
            name="log-out-outline"
            size={19}
            color={COLORS.danger}
          />

          <Text style={styles.logoutText}>
            Sair da conta
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          PetVitaliz · Sua saúde, nosso cuidado.
        </Text>
      </ScrollView>

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
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop:
      Platform.OS === 'android'
        ? (StatusBar.currentHeight || 24) + 8
        : 14,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
  },

  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },

  headerSpacer: {
    width: 36,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 18,
    marginBottom: 30,
  },

  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF3FC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  profileDetails: {
    flex: 1,
    marginLeft: 15,
  },

  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.4,
  },

  userEmail: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 4,
  },

  accountCaption: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 6,
  },

  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.15,
    color: '#8C9CB4',
    marginBottom: 11,
    marginTop: 4,
  },

  cardGroup: {
    backgroundColor: COLORS.surface,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 15,
    marginBottom: 26,
    overflow: 'hidden',
  },

  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 59,
  },

  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F8',
  },

  menuIcon: {
    width: 30,
    marginRight: 10,
  },

  menuText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
    letterSpacing: 0.05,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    minHeight: 50,
    backgroundColor: COLORS.dangerBackground,
    borderRadius: 14,
    marginTop: 1,
  },

  logoutText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '600',
  },

  footerText: {
    textAlign: 'center',
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 23,
  },
});
