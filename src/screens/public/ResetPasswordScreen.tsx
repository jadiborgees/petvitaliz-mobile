import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ResetPasswordScreenProps {
  onNavigateToLogin?: () => void;
  onBack?: () => void;
}

export default function ResetPasswordScreen({
  onNavigateToLogin,
  onBack,
}: ResetPasswordScreenProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const hasMinLen = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isPasswordValid = hasMinLen && hasUpper && hasLower && hasNumber;

  const handleSavePassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Campos obrigatórios', 'Preencha e confirme a nova senha.');
      return;
    }
    if (!isPasswordValid) {
      Alert.alert('Senha fraca', 'Sua senha deve atender a todos os requisitos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    setIsSuccess(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#21479B" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        {!isSuccess && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>
          {isSuccess ? 'Senha alterada!' : 'Crie sua nova senha'}
        </Text>
        <Text style={styles.subtitle}>
          {isSuccess
            ? 'Sua nova senha foi alterada com sucesso.'
            : 'Escolha uma senha segura para proteger a sua conta.'}
        </Text>
      </View>

      {/* Card Branco */}
      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {!isSuccess ? (
            <>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nova senha</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite sua nova senha"
                    placeholderTextColor="#AAB1BF"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <Ionicons
                      name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#7B8497"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Confirmar nova senha</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite novamente"
                    placeholderTextColor="#AAB1BF"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? 'eye-outline' : 'eye-off-outline'
                      }
                      size={20}
                      color="#7B8497"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.requirementsTitle}>
                Sua senha deve conter:
              </Text>
              <View style={styles.requirementsGrid}>
                <View style={styles.reqItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={hasMinLen ? '#2E7D32' : '#CBD5E1'}
                  />
                  <Text
                    style={[
                      styles.reqGridText,
                      hasMinLen ? styles.reqValid : null,
                    ]}
                  >
                    8 ou mais caracteres
                  </Text>
                </View>
                <View style={styles.reqItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={hasNumber ? '#2E7D32' : '#CBD5E1'}
                  />
                  <Text
                    style={[
                      styles.reqGridText,
                      hasNumber ? styles.reqValid : null,
                    ]}
                  >
                    Um número
                  </Text>
                </View>
                <View style={styles.reqItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={hasUpper ? '#2E7D32' : '#CBD5E1'}
                  />
                  <Text
                    style={[
                      styles.reqGridText,
                      hasUpper ? styles.reqValid : null,
                    ]}
                  >
                    Uma letra maiúscula
                  </Text>
                </View>
                <View style={styles.reqItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={hasLower ? '#2E7D32' : '#CBD5E1'}
                  />
                  <Text
                    style={[
                      styles.reqGridText,
                      hasLower ? styles.reqValid : null,
                    ]}
                  >
                    Uma letra minúscula
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSavePassword}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>Salvar nova senha</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.centerIconContainer}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={36} color="#FFFFFF" />
                </View>
                <Text style={styles.innerTitle}>Senha alterada!</Text>
                <Text style={styles.innerSubtitle}>
                  Sua nova senha foi criada com sucesso.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={onNavigateToLogin}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>Ir para o login</Text>
              </TouchableOpacity>

              <View style={styles.infoCard}>
                <View style={styles.infoIconBadge}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={22}
                    color="#21479B"
                  />
                </View>
                <Text style={styles.infoText}>
                  Por segurança, os outros acessos à sua conta poderão ser
                  encerrados.
                </Text>
              </View>
            </>
          )}

          <View style={styles.footerLinks}>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.legalLink}>Termos de Uso</Text>
            </TouchableOpacity>
            <Text style={styles.legalBullet}> • </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.legalLink}>Política de Privacidade</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#21479B' },
  header: {
    paddingTop:
      Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 24,
    paddingHorizontal: 28,
    paddingBottom: 24,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logoContainer: { marginBottom: 8, alignItems: 'center' },
  logoIcon: { width: 54, height: 54, tintColor: '#FFFFFF' },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#DCE4F7',
    textAlign: 'center',
    lineHeight: 18,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 24,
  },
  scrollContent: { paddingBottom: 24 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#2A3342', marginBottom: 6 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#E1E6F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
  },
  input: { flex: 1, height: '100%', fontSize: 14, color: '#2A3342' },
  primaryButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#1B4298',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  primaryButtonText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2A3342',
    marginBottom: 10,
  },
  requirementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
    columnGap: 12,
    marginBottom: 16,
  },
  reqItem: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: 6 },
  reqGridText: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  reqValid: { color: '#2A3342', fontWeight: '600' },
  centerIconContainer: { alignItems: 'center', marginVertical: 12 },
  checkCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#2D52A8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  innerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: 4,
  },
  innerSubtitle: { fontSize: 12, color: '#7B8497', textAlign: 'center' },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F6FD',
    borderRadius: 16,
    padding: 14,
    marginTop: 24,
    gap: 12,
  },
  infoIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E1E6F0',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#4A5568',
    lineHeight: 17,
    fontWeight: '500',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 10,
  },
  legalLink: { fontSize: 11, fontWeight: '700', color: '#21479B' },
  legalBullet: { fontSize: 11, color: '#21479B' },
});