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
  Image,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import PrivateBottomNav from '../../components/PrivateBottomNav';

interface PrivatePersonalDataScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  profileImage: string | null;
  setProfileImage: (uri: string | null) => void;
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  userPhone: string;
  setUserPhone: (phone: string) => void;
  userCpf: string;
  setUserCpf: (cpf: string) => void;
}

export default function PrivatePersonalDataScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  profileImage,
  setProfileImage,
  userName,
  setUserName,
  userEmail,
  setUserEmail,
  userPhone,
  setUserPhone,
  userCpf,
  setUserCpf,
}: PrivatePersonalDataScreenProps) {
  // Estados locais para edição temporária antes de salvar
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [phone, setPhone] = useState(userPhone);
  const [cpf, setCpf] = useState(userCpf);

  // Estados para o fluxo de alteração de e-mail por código
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [tempNewEmail, setTempNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [stepCode, setStepCode] = useState<'request' | 'verify'>('request');

  // Função para escolher a foto de perfil
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar sua galeria de fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Salvar alterações gerais
  const handleSave = () => {
    setUserName(name);
    setUserPhone(phone);
    setUserCpf(cpf);
    Alert.alert('Sucesso', 'Dados pessoais atualizados com sucesso!');
  };

  // Solicitar código para alterar o e-mail
  const handleRequestEmailChange = () => {
    if (!tempNewEmail || tempNewEmail === userEmail) {
      Alert.alert('Atenção', 'Digite um novo e-mail válido.');
      return;
    }
    // Simulação de envio de código para o e-mail original
    Alert.alert('Código enviado', `Um código de confirmação foi enviado para o seu e-mail original (${userEmail}).`);
    setStepCode('verify');
  };

  // Confirmar código e atualizar e-mail
  const handleVerifyAndChangeEmail = () => {
    if (verificationCode.length < 4) {
      Alert.alert('Erro', 'Digite o código de verificação válido.');
      return;
    }
    setUserEmail(tempNewEmail);
    setEmail(tempNewEmail);
    setIsEmailModalVisible(false);
    setStepCode('request');
    setVerificationCode('');
    Alert.alert('Sucesso', 'E-mail alterado com sucesso!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack || onNavigateToProfile} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dados Pessoais</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Foto de Perfil */}
        <View style={styles.avatarSection}>
          <TouchableOpacity activeOpacity={0.8} onPress={handlePickImage} style={styles.avatarContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person-outline" size={48} color="#64748B" />
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarLabel}>Foto de Perfil</Text>
        </View>

        {/* Nome Completo */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome completo</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Seu nome completo"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* E-mail (Protegido por código) */}
        <View style={styles.inputGroup}>
          <View style={styles.emailHeaderRow}>
            <Text style={styles.label}>E-mail</Text>
            <TouchableOpacity onPress={() => setIsEmailModalVisible(true)}>
              <Text style={styles.changeEmailLink}>Alterar e-mail</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.inputContainer, styles.disabledInputContainer]}>
            <Ionicons name="mail-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={email}
              editable={false}
              placeholderTextColor="#94A3B8"
            />
            <Ionicons name="lock-closed-outline" size={16} color="#94A3B8" />
          </View>
        </View>

        {/* Telefone */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* CPF Opcional */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>CPF <Text style={styles.optionalText}>(Opcional)</Text></Text>
          <View style={styles.inputContainer}>
            <Ionicons name="card-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={cpf}
              onChangeText={setCpf}
              placeholder="000.000.000-00"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.helperText}>Você pode preencher ou deixar o CPF em branco.</Text>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={handleSave}>
          <Text style={styles.primaryBtnText}>Salvar</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Modal de Alteração de E-mail via Código */}
      <Modal visible={isEmailModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar E-mail</Text>
            {stepCode === 'request' ? (
              <>
                <Text style={styles.modalSub}>
                  Por segurança, enviaremos um código de confirmação para o seu e-mail atual ({userEmail}).
                </Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Digite o novo e-mail"
                  placeholderTextColor="#94A3B8"
                  value={tempNewEmail}
                  onChangeText={setTempNewEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <TouchableOpacity style={styles.primaryBtn} onPress={handleRequestEmailChange}>
                  <Text style={styles.primaryBtnText}>Enviar Código</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalSub}>
                  Digite o código de 4 dígitos enviado para {userEmail}.
                </Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Código de verificação"
                  placeholderTextColor="#94A3B8"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="numeric"
                  maxLength={4}
                />
                <TouchableOpacity style={styles.primaryBtn} onPress={handleVerifyAndChangeEmail}>
                  <Text style={styles.primaryBtnText}>Confirmar e Alterar</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => {
                setIsEmailModalVisible(false);
                setStepCode('request');
                setTempNewEmail('');
              }}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarContainer: { position: 'relative', width: 90, height: 90, borderRadius: 45 },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarImage: { width: 90, height: 90, borderRadius: 45 },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#21479B',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarLabel: { fontSize: 13, fontWeight: '600', color: '#64748B', marginTop: 8 },

  inputGroup: { marginBottom: 16 },
  emailHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  optionalText: { fontSize: 11, color: '#94A3B8', fontWeight: '400' },
  changeEmailLink: { fontSize: 12, fontWeight: '700', color: '#21479B' },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginTop: 6,
  },
  disabledInputContainer: { backgroundColor: '#F8FAFC' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 13, color: '#0F172A', fontWeight: '500' },
  disabledInput: { color: '#64748B' },
  helperText: { fontSize: 11, color: '#94A3B8', marginTop: 4, marginLeft: 4 },

  primaryBtn: {
    backgroundColor: '#21479B',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
    elevation: 2,
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, width: '100%', maxWidth: 340, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 10 },
  modalSub: { fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 16, lineHeight: 18 },
  modalInput: { width: '100%', height: 48, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, fontSize: 13, color: '#0F172A', marginBottom: 16 },
  modalCancelBtn: { marginTop: 12, padding: 8 },
  modalCancelText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
});