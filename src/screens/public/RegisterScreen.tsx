import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface RegisterScreenProps {
  onRegisterSuccess?: () => void;
  onNavigateToLogin?: () => void;
  onBack?: () => void;
}

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  mask: string;
}

const COUNTRIES: Country[] = [
  { code: 'BR', name: 'Brasil', flag: '🇧🇷', dialCode: '+55', mask: '(99) 99999-9999' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸', dialCode: '+1', mask: '(999) 999-9999' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351', mask: '999 999 999' },
  { code: 'ES', name: 'Espanha', flag: '🇪🇸', dialCode: '+34', mask: '999 99 99 99' },
];

export default function RegisterScreen({
  onRegisterSuccess,
  onNavigateToLogin,
  onBack,
}: RegisterScreenProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Data de nascimento e Calendário
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Telefone e País
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [celular, setCelular] = useState('');
  const [showCountryModal, setShowCountryModal] = useState(false);

  // Senha
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validação de e-mail em tempo real
  const handleEmailChange = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (text.length > 0 && !emailRegex.test(text)) {
      setEmailError('Insira um e-mail válido (ex: voce@email.com)');
    } else {
      setEmailError('');
    }
  };

  // Regras de validação de senha
  const isMinMaxValid = senha.length >= 8 && senha.length <= 20;
  const hasUpper = /[A-Z]/.test(senha);
  const hasLower = /[a-z]/.test(senha);
  const hasNumber = /[0-9]/.test(senha);
  const isPasswordValid = isMinMaxValid && hasUpper && hasLower && hasNumber;

  // Formatação de telefone
  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;

    if (selectedCountry.code === 'BR') {
      if (cleaned.length <= 11) {
        formatted = cleaned
          .replace(/^(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2');
      }
    }
    setCelular(formatted);
  };

  const handleRegister = () => {
    if (!nome.trim() || !email.trim() || !dataNascimento || !celular.trim() || !senha) {
      Alert.alert('Campos incompletos', 'Por favor, preencha todos os campos.');
      return;
    }

    if (emailError) {
      Alert.alert('E-mail inválido', 'Corrija o formato do e-mail antes de continuar.');
      return;
    }

    if (!isPasswordValid) {
      Alert.alert('Senha fraca', 'A senha não atende a todos os requisitos de segurança.');
      return;
    }

    Alert.alert('Sucesso', 'Conta criada com sucesso!');
    if (onRegisterSuccess) onRegisterSuccess();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#21479B" />

      {/* Cabeçalho Azul Superior */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack || onNavigateToLogin}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Cadastre-se</Text>
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitle}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={onNavigateToLogin} activeOpacity={0.7}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Branco com Formulário */}
      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Nome completo */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Como podemos chamar você?"
              placeholderTextColor="#AAB1BF"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          {/* E-mail */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="voce@email.com"
              placeholderTextColor="#AAB1BF"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
          </View>

          {/* Data de nascimento */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Data de nascimento</Text>
            <TouchableOpacity
              style={styles.iconInputContainer}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <Text style={dataNascimento ? styles.dateText : styles.placeholderText}>
                {dataNascimento
                  ? dataNascimento.toLocaleDateString('pt-BR')
                  : 'DD/MM/AAAA'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#7B8497" />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dataNascimento || new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDataNascimento(selectedDate);
              }}
            />
          )}

          {/* Celular com Seletor de País */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Celular</Text>
            <View style={styles.phoneInputContainer}>
              <TouchableOpacity
                style={styles.countryPicker}
                onPress={() => setShowCountryModal(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.flagEmoji}>{selectedCountry.flag}</Text>
                <Ionicons name="chevron-down" size={14} color="#7B8497" />
              </TouchableOpacity>
              <TextInput
                style={styles.phoneInput}
                placeholder={selectedCountry.mask}
                placeholderTextColor="#AAB1BF"
                value={celular}
                onChangeText={formatPhone}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>
          </View>

          {/* Senha com olho e validações */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.iconInputContainer}>
              <TextInput
                style={styles.iconInput}
                placeholder="Crie uma senha segura"
                placeholderTextColor="#AAB1BF"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword}
                maxLength={20}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#7B8497"
                />
              </TouchableOpacity>
            </View>

            {/* Checklist de Requisitos de Senha */}
            {senha.length > 0 && (
              <View style={styles.requirementsContainer}>
                <Text style={[styles.reqText, isMinMaxValid ? styles.reqValid : styles.reqInvalid]}>
                  • Entre 8 e 20 caracteres
                </Text>
                <Text style={[styles.reqText, hasUpper ? styles.reqValid : styles.reqInvalid]}>
                  • Pelo menos 1 letra maiúscula
                </Text>
                <Text style={[styles.reqText, hasLower ? styles.reqValid : styles.reqInvalid]}>
                  • Pelo menos 1 letra minúscula
                </Text>
                <Text style={[styles.reqText, hasNumber ? styles.reqValid : styles.reqInvalid]}>
                  • Pelo menos 1 número
                </Text>
              </View>
            )}
          </View>

          {/* Botão Principal */}
          <TouchableOpacity
            style={[styles.primaryButton, !isPasswordValid && senha.length > 0 ? styles.buttonDisabled : null]}
            onPress={handleRegister}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Criar conta</Text>
          </TouchableOpacity>

          {/* Termos Legais */}
          <Text style={styles.legalNotice}>
            Ao continuar, você concorda com os{' '}
            <Text style={styles.legalLink}>Termos de Uso</Text>
            {'\n'}e a <Text style={styles.legalLink}>Política de Privacidade</Text>.
          </Text>
        </ScrollView>
      </View>

      {/* Modal de Seleção de País */}
      <Modal visible={showCountryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o País</Text>
              <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                <Ionicons name="close" size={24} color="#2A3342" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryOption}
                  onPress={() => {
                    setSelectedCountry(item);
                    setCelular('');
                    setShowCountryModal(false);
                  }}
                >
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryDial}>{item.dialCode}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#21479B' },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 24,
    paddingHorizontal: 20,
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
  title: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', marginBottom: 2 },
  subtitleRow: { flexDirection: 'row', alignItems: 'center' },
  subtitle: { fontSize: 13, color: '#DCE4F7' },
  loginLink: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', textDecorationLine: 'underline' },
  card: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 22, paddingTop: 24 },
  scrollContent: { paddingBottom: 30 },
  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '700', color: '#2A3342', marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E1E6F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#2A3342',
    backgroundColor: '#FFFFFF',
  },
  inputError: { borderColor: '#E53935' },
  errorText: { color: '#E53935', fontSize: 11, marginTop: 4, fontWeight: '600' },
  iconInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 1,
    borderColor: '#E1E6F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
  },
  iconInput: { flex: 1, height: '100%', fontSize: 14, color: '#2A3342' },
  placeholderText: { fontSize: 14, color: '#AAB1BF' },
  dateText: { fontSize: 14, color: '#2A3342' },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#E1E6F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: '#E1E6F0',
    gap: 6,
    height: '100%',
  },
  flagEmoji: { fontSize: 18 },
  phoneInput: { flex: 1, height: '100%', paddingHorizontal: 14, fontSize: 14, color: '#2A3342' },
  requirementsContainer: { marginTop: 8, gap: 2 },
  reqText: { fontSize: 11, fontWeight: '600' },
  reqValid: { color: '#2E7D32' },
  reqInvalid: { color: '#D32F2F' },
  primaryButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#1B4298',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonDisabled: { opacity: 0.6 },
  primaryButtonText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  legalNotice: { textAlign: 'center', fontSize: 11, color: '#7B8497', marginTop: 20, lineHeight: 16 },
  legalLink: { fontWeight: '700', color: '#21479B' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '50%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#2A3342' },
  countryOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F3F8', gap: 12 },
  countryFlag: { fontSize: 20 },
  countryName: { flex: 1, fontSize: 14, color: '#2A3342', fontWeight: '600' },
  countryDial: { fontSize: 13, color: '#7B8497' },
});