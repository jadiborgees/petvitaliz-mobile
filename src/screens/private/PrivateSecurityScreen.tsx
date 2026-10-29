import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';

interface PrivateSecurityScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

type SecurityMode = 'main' | 'changePassword' | 'deleteAccount' | 'devices';

export default function PrivateSecurityScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: PrivateSecurityScreenProps) {
  const [mode, setMode] = useState<SecurityMode>('main');

  // Estados dos toggles
  const [biometryLogin, setBiometryLogin] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Estados do formulário de alterar senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validações visuais da nova senha
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  const handleBack = () => {
    if (mode !== 'main') {
      setMode('main');
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'main' && 'Segurança'}
          {mode === 'changePassword' && 'Alterar senha'}
          {mode === 'deleteAccount' && 'Excluir conta'}
          {mode === 'devices' && 'Dispositivos conectados'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ============================================================ */}
        {/* 1. MENU PRINCIPAL DE SEGURANÇA                               */}
        {/* ============================================================ */}
        {mode === 'main' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionMainTitle}>Segurança</Text>
              <Text style={styles.sectionSubtitle}>
                Gerencie como e quando você deseja ser notificado sobre atualizações importantes.[cite: 18]
              </Text>
            </View>

            <Text style={styles.groupLabel}>ACESSO</Text>
            
            <View style={styles.cardGroup}>
              {/* Alterar Senha */}
              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => setMode('changePassword')}
                activeOpacity={0.7}
              >
                <View style={styles.menuRowLeft}>
                  <Ionicons name="key-outline" size={20} color="#21479B" />
                  <Text style={styles.menuRowText}>Alterar senha</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Login por Biometria */}
              <View style={styles.menuRow}>
                <View style={styles.menuRowLeft}>
                  <Ionicons name="finger-print-outline" size={20} color="#21479B" />
                  <View>
                    <Text style={styles.menuRowText}>Login por biometria</Text>
                    <Text style={styles.menuRowSubText}>Face ID ou digital[cite: 18]</Text>
                  </View>
                </View>
                <Switch
                  value={biometryLogin}
                  onValueChange={setBiometryLogin}
                  trackColor={{ false: '#CBD5E1', true: '#21479B' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.divider} />

              {/* Autenticação em duas etapas */}
              <View style={styles.menuRow}>
                <View style={styles.menuRowLeft}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#21479B" />
                  <View>
                    <Text style={styles.menuRowText}>Autenticação em duas etapas</Text>
                    <Text style={styles.menuRowSubText}>Camada extra de proteção[cite: 18]</Text>
                  </View>
                </View>
                <Switch
                  value={twoFactorAuth}
                  onValueChange={setTwoFactorAuth}
                  trackColor={{ false: '#CBD5E1', true: '#21479B' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            <Text style={styles.groupLabel}>ATIVIDADE</Text>

            <View style={styles.cardGroup}>
              {/* Dispositivos Conectados */}
              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => setMode('devices')}
                activeOpacity={0.7}
              >
                <View style={styles.menuRowLeft}>
                  <Ionicons name="phone-portrait-outline" size={20} color="#21479B" />
                  <View>
                    <Text style={styles.menuRowText}>Dispositivos conectados</Text>
                    <Text style={styles.menuRowSubText}>2 sessões ativas[cite: 18]</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Botão Excluir Conta */}
            <TouchableOpacity
              style={styles.deleteAccountBtn}
              onPress={() => setMode('deleteAccount')}
              activeOpacity={0.85}
            >
              <Ionicons name="trash-outline" size={18} color="#DC2626" />
              <Text style={styles.deleteAccountBtnText}>Excluir conta</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ============================================================ */}
        {/* 2. ALTERAR SENHA                                             */}
        {/* ============================================================ */}
        {mode === 'changePassword' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionMainTitle}>Segurança</Text>
              <Text style={styles.sectionSubtitle}>
                Gerencie como e quando você deseja ser notificado sobre atualizações importantes.[cite: 18]
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha atual</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                <Ionicons name="eye-off-outline" size={18} color="#94A3B8" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nova senha</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <Ionicons name="eye-off-outline" size={18} color="#94A3B8" />
              </View>
            </View>

            {/* Validações da Senha */}
            <View style={styles.validationBox}>
              <Text style={styles.validationTitle}>A nova senha deve conter:</Text>
              <View style={styles.validationRow}>
                <Ionicons name={hasMinLength ? "checkmark-circle" : "ellipse-outline"} size={14} color={hasMinLength ? "#10B981" : "#94A3B8"} />
                <Text style={[styles.validationText, hasMinLength && styles.validText]}>Pelo menos 8 caracteres[cite: 18]</Text>
              </View>
              <View style={styles.validationRow}>
                <Ionicons name={hasUpperCase ? "checkmark-circle" : "ellipse-outline"} size={14} color={hasUpperCase ? "#10B981" : "#94A3B8"} />
                <Text style={[styles.validationText, hasUpperCase && styles.validText]}>Uma letra maiúscula[cite: 18]</Text>
              </View>
              <View style={styles.validationRow}>
                <Ionicons name={hasLowerCase ? "checkmark-circle" : "ellipse-outline"} size={14} color={hasLowerCase ? "#10B981" : "#94A3B8"} />
                <Text style={[styles.validationText, hasLowerCase && styles.validText]}>Uma letra minúscula[cite: 18]</Text>
              </View>
              <View style={styles.validationRow}>
                <Ionicons name={hasNumber ? "checkmark-circle" : "ellipse-outline"} size={14} color={hasNumber ? "#10B981" : "#94A3B8"} />
                <Text style={[styles.validationText, hasNumber && styles.validText]}>Um número[cite: 18]</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar nova senha</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <Ionicons name="eye-off-outline" size={18} color="#94A3B8" />
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={() => setMode('main')}
            >
              <Text style={styles.primaryBtnText}>Alterar senha</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ============================================================ */}
        {/* 3. EXCLUIR CONTA                                             */}
        {/* ============================================================ */}
        {mode === 'deleteAccount' && (
          <View style={styles.deleteContainer}>
            <View style={styles.deleteIconCircle}>
              <Ionicons name="trash-outline" size={32} color="#DC2626" />
            </View>

            <Text style={styles.deleteTitle}>Tem certeza que deseja excluir a sua conta?</Text>
            <Text style={styles.deleteSubtitle}>
              Esta ação não poderá ser desfeita e todas as suas informações, pet, agendamentos e planos serão perdidas.[cite: 18]
            </Text>

            <TouchableOpacity
              style={styles.deleteConfirmBtn}
              activeOpacity={0.85}
              onPress={() => setMode('main')}
            >
              <Text style={styles.deleteConfirmBtnText}>Excluir conta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={0.8}
              onPress={() => setMode('main')}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================ */}
        {/* 4. DISPOSITIVOS CONECTADOS                                   */}
        {/* ============================================================ */}
        {mode === 'devices' && (
          <>
            <Text style={styles.devicesHeaderSub}>
              Veja os dispositivos que estão conectados à sua conta.[cite: 18]
            </Text>

            {/* Dispositivo Atual */}
            <View style={styles.deviceCard}>
              <Ionicons name="phone-portrait-outline" size={24} color="#21479B" />
              <View style={styles.deviceInfo}>
                <View style={styles.deviceTitleRow}>
                  <Text style={styles.deviceName}>iPhone 16</Text>
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>Atual</Text>
                  </View>
                </View>
                <Text style={styles.deviceDetails}>São Paulo, SP · Brasil[cite: 18]</Text>
                <Text style={styles.deviceTime}>App · Hoje, 09:41[cite: 18]</Text>
              </View>
            </View>

            {/* Dispositivo 2 */}
            <View style={styles.deviceCard}>
              <Ionicons name="phone-portrait-outline" size={24} color="#64748B" />
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>Android</Text>
                <Text style={styles.deviceDetails}>Campinas, SP · Brasil[cite: 18]</Text>
                <Text style={styles.deviceTime}>App · 05/09/2025, 18:10[cite: 18]</Text>
              </View>
              <Ionicons name="ellipsis-vertical" size={16} color="#94A3B8" />
            </View>

            {/* Dispositivo 3 */}
            <View style={styles.deviceCard}>
              <Ionicons name="phone-portrait-outline" size={24} color="#64748B" />
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>Android</Text>
                <Text style={styles.deviceDetails}>Campinas, SP · Brasil[cite: 18]</Text>
                <Text style={styles.deviceTime}>App · 05/09/2025, 18:10[cite: 18]</Text>
              </View>
              <Ionicons name="ellipsis-vertical" size={16} color="#94A3B8" />
            </View>

            <View style={styles.tipBox}>
              <Ionicons name="information-circle-outline" size={18} color="#21479B" />
              <Text style={styles.tipText}>
                Se precisar, você pode reagendar ou cancelar sua consulta até 24 horas antes do horário marcado.[cite: 18]
              </Text>
            </View>
          </>
        )}

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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#21479B' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 110 },

  sectionHeader: { marginBottom: 16 },
  sectionMainTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  sectionSubtitle: { fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 18 },

  groupLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 8, marginTop: 16, letterSpacing: 0.5 },
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  menuRowText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  menuRowSubText: { fontSize: 11, color: '#64748B', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 16 },

  deleteAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    height: 50,
    marginTop: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  deleteAccountBtnText: { color: '#DC2626', fontWeight: '800', fontSize: 14 },

  /* Alterar Senha */
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#64748B', marginBottom: 6 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  input: { flex: 1, fontSize: 13, color: '#0F172A', fontWeight: '500' },
  validationBox: { marginBottom: 16, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  validationTitle: { fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 8 },
  validationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  validationText: { fontSize: 11, color: '#94A3B8' },
  validText: { color: '#10B981', fontWeight: '600' },

  primaryBtn: {
    backgroundColor: '#21479B',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '100%',
    elevation: 2,
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },

  /* Excluir Conta */
  deleteContainer: { alignItems: 'center', paddingVertical: 20 },
  deleteIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  deleteTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 8 },
  deleteSubtitle: { fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 24, paddingHorizontal: 10, lineHeight: 18 },
  deleteConfirmBtn: {
    backgroundColor: '#DC2626',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  deleteConfirmBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  cancelBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cancelBtnText: { color: '#0F172A', fontWeight: '800', fontSize: 13 },

  /* Dispositivos Conectados */
  devicesHeaderSub: { fontSize: 12, color: '#64748B', marginBottom: 16 },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    gap: 14,
  },
  deviceInfo: { flex: 1 },
  deviceTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deviceName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  currentBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  currentBadgeText: { fontSize: 9, fontWeight: '800', color: '#21479B' },
  deviceDetails: { fontSize: 11, color: '#64748B', marginTop: 2 },
  deviceTime: { fontSize: 10, color: '#94A3B8', marginTop: 1 },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  tipText: { fontSize: 11, color: '#64748B', flex: 1, lineHeight: 16 },
});