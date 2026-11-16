import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';
import PrivateHeader from '../../components/PrivateHeader';
import Toast from '../../components/Toast';
import { theme } from '../../theme/privateTheme';

interface PrivateSecurityScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onDeleteAccount?: () => void;
}

type Mode = 'main' | 'changePassword' | 'deleteAccount';

const C = theme.colors;
const F = theme.fonts;

function PasswordInput({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.passwordWrap}>
      <TextInput
        style={styles.passwordInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9AA6B8"
        secureTextEntry={!visible}
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={() => setVisible((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Feather name={visible ? 'eye-off' : 'eye'} size={18} color={C.muted} />
      </TouchableOpacity>
    </View>
  );
}

export default function PrivateSecurityScreen({
  onBack,
  onNavigateToHome,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  onDeleteAccount,
}: PrivateSecurityScreenProps) {
  const [mode, setMode] = useState<Mode>('main');
  const [toast, setToast] = useState('');

  // Alterar senha
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const rules = [
    { ok: next.length >= 8, text: 'Pelo menos 8 caracteres' },
    { ok: /[A-Z]/.test(next), text: 'Uma letra maiúscula' },
    { ok: /[a-z]/.test(next), text: 'Uma letra minúscula' },
    { ok: /\d/.test(next), text: 'Um número' },
  ];

  // Excluir conta
  const [deletePassword, setDeletePassword] = useState('');

  const goMain = () => {
    setMode('main');
    setCurrent('');
    setNext('');
    setConfirm('');
    setDeletePassword('');
  };

  const savePassword = () => {
    if (!current) {
      Alert.alert('Senha atual', 'Digite sua senha atual.');
      return;
    }
    if (rules.some((rule) => !rule.ok)) {
      Alert.alert('Senha fraca', 'A nova senha precisa cumprir todos os requisitos.');
      return;
    }
    if (next !== confirm) {
      Alert.alert('Senhas diferentes', 'A confirmação não é igual à nova senha.');
      return;
    }
    if (next === current) {
      Alert.alert('Mesma senha', 'A nova senha precisa ser diferente da atual.');
      return;
    }
    goMain();
    setToast('Senha alterada');
  };

  const deleteAccount = () => {
    if (deletePassword.length < 6) {
      Alert.alert('Senha obrigatória', 'Digite sua senha para confirmar a exclusão.');
      return;
    }
    Alert.alert('Excluir conta', 'Essa ação não pode ser desfeita. Excluir sua conta agora?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => onDeleteAccount?.() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <PrivateHeader
        title={mode === 'changePassword' ? 'Alterar senha' : mode === 'deleteAccount' ? 'Excluir conta' : 'Segurança'}
        onBack={mode === 'main' ? onBack : goMain}
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {mode === 'main' && (
            <>
              <View style={styles.card}>
                <TouchableOpacity style={styles.row} onPress={() => setMode('changePassword')} activeOpacity={0.75}>
                  <View style={styles.rowIcon}>
                    <Feather name="key" size={17} color={C.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowTitle}>Alterar senha</Text>
                    <Text style={styles.rowText}>Troque a senha de acesso ao app</Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#9AA6B8" />
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Zona de perigo</Text>
              <TouchableOpacity style={[styles.card, styles.dangerCard]} onPress={() => setMode('deleteAccount')} activeOpacity={0.8}>
                <View style={styles.row}>
                  <View style={[styles.rowIcon, { backgroundColor: '#FDECEC' }]}>
                    <Feather name="trash-2" size={17} color={C.danger} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rowTitle, { color: C.danger }]}>Excluir conta</Text>
                    <Text style={styles.rowText}>Cancela os planos e apaga pets e agendamentos</Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#9AA6B8" />
                </View>
              </TouchableOpacity>
            </>
          )}

          {mode === 'changePassword' && (
            <>
              <View style={[styles.card, styles.form]}>
                <Text style={styles.label}>Senha atual</Text>
                <PasswordInput value={current} onChangeText={setCurrent} placeholder="Sua senha atual" />
                <Text style={styles.label}>Nova senha</Text>
                <PasswordInput value={next} onChangeText={setNext} placeholder="Crie uma nova senha" />
                <View style={styles.rules}>
                  {rules.map((rule) => (
                    <View key={rule.text} style={styles.ruleRow}>
                      <Feather name={rule.ok ? 'check-circle' : 'circle'} size={14} color={rule.ok ? C.success : '#A7B1C2'} />
                      <Text style={[styles.ruleText, rule.ok && { color: C.success }]}>{rule.text}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.label}>Confirmar nova senha</Text>
                <PasswordInput value={confirm} onChangeText={setConfirm} placeholder="Repita a nova senha" />
                {!!confirm && confirm !== next && <Text style={styles.errorText}>As senhas não são iguais.</Text>}
              </View>
              <TouchableOpacity style={styles.primaryButton} onPress={savePassword} activeOpacity={0.85}>
                <Text style={styles.primaryButtonText}>Salvar nova senha</Text>
              </TouchableOpacity>
            </>
          )}

          {mode === 'deleteAccount' && (
            <>
              <View style={[styles.card, styles.form, styles.dangerCard]}>
                <View style={styles.deleteIcon}>
                  <Feather name="alert-triangle" size={24} color={C.danger} />
                </View>
                <Text style={styles.deleteTitle}>Excluir sua conta?</Text>
                <Text style={styles.deleteText}>
                  Seus planos são cancelados e todos os dados são apagados: pets, agendamentos, cartões e histórico. Isso não pode ser desfeito.
                </Text>
                <Text style={styles.label}>Confirme com sua senha</Text>
                <PasswordInput value={deletePassword} onChangeText={setDeletePassword} placeholder="Sua senha" />
              </View>
              <TouchableOpacity style={styles.dangerButton} onPress={deleteAccount} activeOpacity={0.85}>
                <Text style={styles.primaryButtonText}>Excluir minha conta</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.textButton} onPress={goMain}>
                <Text style={styles.linkText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast message={toast} onHide={() => setToast('')} />

      {mode === 'main' && (
        <PrivateBottomNav
          currentRoute="PrivateProfile"
          onNavigateToHome={onNavigateToHome}
          onNavigateToPlans={onNavigateToPlans}
          onNavigateToBenefits={onNavigateToBenefits}
          onNavigateToProfile={onNavigateToProfile}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scrollContent: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 130 },
  sectionTitle: { fontSize: 15, fontFamily: F.bold, color: C.navy, marginTop: 22, marginBottom: 9 },

  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, paddingHorizontal: 14 },
  dangerCard: { borderColor: '#F5C2C2' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  rowIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 14, fontFamily: F.bold, color: C.navy },
  rowText: { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 2 },

  form: { paddingVertical: 14 },
  label: { fontSize: 13, fontFamily: F.bold, color: C.navy, marginBottom: 7 },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 46,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
  },
  passwordInput: { flex: 1, fontSize: 14, fontFamily: F.medium, color: C.navy, paddingVertical: 10 },
  rules: { marginTop: -4, marginBottom: 14, gap: 5 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  ruleText: { fontSize: 12, fontFamily: F.medium, color: C.muted },
  errorText: { fontSize: 12, fontFamily: F.medium, color: C.danger, marginTop: -6 },

  deleteIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  deleteTitle: { fontSize: 17, fontFamily: F.bold, color: C.navy, textAlign: 'center', marginTop: 10 },
  deleteText: {
    fontSize: 13,
    fontFamily: F.regular,
    color: C.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 16,
  },

  primaryButton: {
    minHeight: 48,
    borderRadius: theme.radius.button,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  dangerButton: {
    minHeight: 48,
    borderRadius: theme.radius.button,
    backgroundColor: C.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontFamily: F.bold },
  textButton: { alignItems: 'center', paddingVertical: 14 },
  linkText: { fontSize: 14, fontFamily: F.bold, color: C.primary },
});