import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';
import PrivateHeader from '../../components/PrivateHeader';
import { theme } from '../../theme/privateTheme';

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
  onNavigateToMyPlan?: () => void;
  onNavigateToTerms?: () => void;
  onLogout?: () => void;
  userName?: string;
  userEmail?: string;
  profileImage?: string | null;
  // Números dos atalhos
  petsCount?: number;
  upcomingCount?: number;
  activePlans?: number;
}

const C = theme.colors;
const F = theme.fonts;

const plural = (n: number, one: string, many: string, zero: string) =>
  n === 0 ? zero : n === 1 ? `1 ${one}` : `${n} ${many}`;

export default function PrivateProfileScreen({
  onBack,
  onNavigateToHome,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToPersonalData,
  onNavigateToPaymentMethods,
  onNavigateToPets,
  onNavigateToConsultations,
  onNavigateToNotifications,
  onNavigateToSecurity,
  onNavigateToHelp,
  onNavigateToMyPlan,
  onNavigateToTerms,
  onLogout,
  userName = 'Usuário',
  userEmail = '',
  profileImage,
  petsCount = 0,
  upcomingCount = 0,
  activePlans = 0,
}: PrivateProfileScreenProps) {
  const initial = (userName.trim()[0] || 'U').toUpperCase();

  const shortcuts = [
    { key: 'pets', icon: 'paw' as const, title: 'Meus pets', note: plural(petsCount, 'pet', 'pets', 'Nenhum'), onPress: onNavigateToPets, gold: false },
    { key: 'consultas', icon: 'calendar-blank-outline' as const, title: 'Consultas', note: plural(upcomingCount, 'próxima', 'próximas', 'Nenhuma marcada'), onPress: onNavigateToConsultations, gold: false },
    { key: 'plano', icon: 'crown' as const, title: 'Meu plano', note: plural(activePlans, 'ativo', 'ativos', 'Nenhum ativo'), onPress: onNavigateToMyPlan ?? onNavigateToPlans, gold: true },
  ];

  const accountItems = [
    { icon: 'user' as const, title: 'Dados pessoais', onPress: onNavigateToPersonalData },
    { icon: 'credit-card' as const, title: 'Formas de pagamento', onPress: onNavigateToPaymentMethods },
    { icon: 'bell' as const, title: 'Notificações', onPress: onNavigateToNotifications },
    { icon: 'shield' as const, title: 'Segurança', onPress: onNavigateToSecurity },
  ];

  const helpItems = [
    { icon: 'headphones' as const, title: 'Ajuda e suporte', onPress: onNavigateToHelp },
    { icon: 'file-text' as const, title: 'Termos e privacidade', onPress: onNavigateToTerms },
  ];

  const renderList = (items: typeof accountItems | typeof helpItems) => (
    <View style={styles.listCard}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.title}
          style={[styles.row, index < items.length - 1 && styles.divider]}
          onPress={item.onPress}
          activeOpacity={0.75}
        >
          <Feather name={item.icon} size={18} color={C.primary} />
          <Text style={styles.rowText}>{item.title}</Text>
          <Feather name="chevron-right" size={18} color="#9AA6B8" />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <PrivateHeader title="Meu perfil" onBack={onBack ?? onNavigateToHome} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Usuário */}
        <View style={styles.userCard}>
          <View style={styles.userCircle} />
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{userEmail || 'E-mail não informado'}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={onNavigateToPersonalData} activeOpacity={0.8}>
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>
        </View>

        {/* Atalhos */}
        <View style={styles.shortcuts}>
          {shortcuts.map((item) => (
            <TouchableOpacity key={item.key} style={styles.shortcut} onPress={item.onPress} activeOpacity={0.8}>
              <View style={[styles.shortcutIcon, item.gold && { backgroundColor: '#E3A912' }]}>
                <MaterialCommunityIcons name={item.icon} size={19} color={item.gold ? '#FFFFFF' : C.primary} />
              </View>
              <Text style={styles.shortcutTitle}>{item.title}</Text>
              <Text style={styles.shortcutNote}>{item.note}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Conta e preferências</Text>
        {renderList(accountItems)}

        <Text style={styles.sectionTitle}>Ajuda</Text>
        {renderList(helpItems)}

        <TouchableOpacity style={styles.logout} onPress={onLogout} activeOpacity={0.7}>
          <Feather name="log-out" size={17} color={C.danger} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      <PrivateBottomNav
        currentRoute="PrivateProfile"
        onNavigateToHome={onNavigateToHome}
        onNavigateToPlans={onNavigateToPlans}
        onNavigateToBenefits={onNavigateToBenefits}
        onNavigateToProfile={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scrollContent: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 140 },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.primary,
    borderRadius: 20,
    padding: 15,
    overflow: 'hidden',
  },
  userCircle: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#2148AA',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: C.brandYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 21, fontFamily: F.bold, color: C.navy },
  userName: { fontSize: 17, fontFamily: F.bold, color: '#FFFFFF' },
  userEmail: { fontSize: 12, fontFamily: F.regular, color: '#C9D6EE', marginTop: 2 },
  editButton: { backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  editText: { fontSize: 12, fontFamily: F.bold, color: C.primary },

  shortcuts: { flexDirection: 'row', gap: 8, marginTop: 12 },
  shortcut: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  shortcutIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  shortcutTitle: { fontSize: 12, fontFamily: F.bold, color: C.navy, textAlign: 'center' },
  shortcutNote: { fontSize: 10, fontFamily: F.regular, color: C.muted, marginTop: 2, textAlign: 'center' },

  sectionTitle: { fontSize: 15, fontFamily: F.bold, color: C.navy, marginTop: 22, marginBottom: 9 },
  listCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, paddingHorizontal: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: C.divider },
  rowText: { flex: 1, fontSize: 14, fontFamily: F.semibold, color: C.navy },

  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 20, marginTop: 6 },
  logoutText: { fontSize: 14, fontFamily: F.bold, color: C.danger },
});