import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import PrivateHeader from '../../components/PrivateHeader';
import Toast from '../../components/Toast';
import { theme } from '../../theme/privateTheme';

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
  userBirthDate?: string;
  setUserBirthDate?: (date: string) => void;
}

const C = theme.colors;
const F = theme.fonts;

// Máscaras: só números, com a pontuação colocada automaticamente.
const maskDate = (text: string) => {
  const d = text.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
};

const maskPhone = (text: string) => {
  const d = text.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const maskCpf = (text: string) => {
  const d = text.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

const isValidDate = (value: string) => {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;
  const [, dd, mm, yyyy] = match.map(Number) as unknown as [number, number, number, number];
  const date = new Date(yyyy, mm - 1, dd);
  return (
    date.getFullYear() === yyyy &&
    date.getMonth() === mm - 1 &&
    date.getDate() === dd &&
    date <= new Date() &&
    yyyy > 1900
  );
};

export default function PrivatePersonalDataScreen({
  onBack,
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
  userBirthDate = '',
  setUserBirthDate,
}: PrivatePersonalDataScreenProps) {
  const [name, setName] = useState(userName);
  const [birthDate, setBirthDate] = useState(userBirthDate);
  const [phone, setPhone] = useState(userPhone);
  const [cpf, setCpf] = useState(userCpf);
  const cpfLocked = userCpf.replace(/\D/g, '').length === 11; // depois de salvo, não muda
  const [toast, setToast] = useState('');

  // Alteração de e-mail com código
  const [emailModal, setEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState('');
  const [emailStep, setEmailStep] = useState<'request' | 'verify'>('request');

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão negada', 'Precisamos de acesso à galeria para trocar a foto.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setProfileImage(result.assets[0].uri);
      setToast('Foto atualizada');
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Nome obrigatório', 'Informe seu nome completo.');
      return;
    }
    if (birthDate && !isValidDate(birthDate)) {
      Alert.alert('Data inválida', 'Confira a data de nascimento (dd/mm/aaaa).');
      return;
    }
    if (phone && phone.replace(/\D/g, '').length < 10) {
      Alert.alert('Telefone incompleto', 'Informe o telefone com DDD.');
      return;
    }
    if (!cpfLocked && cpf && cpf.replace(/\D/g, '').length !== 11) {
      Alert.alert('CPF incompleto', 'O CPF precisa ter 11 números.');
      return;
    }
    setUserName(name.trim());
    setUserBirthDate?.(birthDate);
    setUserPhone(phone);
    if (!cpfLocked) setUserCpf(cpf);
    setToast('Dados atualizados');
  };

  const requestEmailChange = () => {
    const email = newEmail.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email) || email === userEmail) {
      Alert.alert('E-mail inválido', 'Digite um novo e-mail válido.');
      return;
    }
    setEmailStep('verify');
  };

  const confirmEmailChange = () => {
    if (code.replace(/\D/g, '').length !== 6) {
      Alert.alert('Código incompleto', 'Digite o código de 6 números.');
      return;
    }
    setUserEmail(newEmail.trim().toLowerCase());
    closeEmailModal();
    setToast('E-mail alterado');
  };

  const closeEmailModal = () => {
    setEmailModal(false);
    setEmailStep('request');
    setNewEmail('');
    setCode('');
  };

  const initial = (name.trim()[0] || 'U').toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <PrivateHeader title="Dados pessoais" onBack={onBack || onNavigateToProfile} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Foto */}
          <TouchableOpacity style={styles.avatarWrap} onPress={handlePickImage} activeOpacity={0.85}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initial}</Text>
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Feather name="camera" size={13} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.photoHint}>Toque para trocar a foto</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Seu nome" placeholderTextColor="#9AA6B8" />

            <Text style={styles.label}>E-mail</Text>
            <View style={[styles.input, styles.inputRow]}>
              <Text style={styles.inputText} numberOfLines={1}>{userEmail}</Text>
              <TouchableOpacity onPress={() => setEmailModal(true)}>
                <Text style={styles.link}>Alterar</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Data de nascimento</Text>
            <TextInput
              style={styles.input}
              value={birthDate}
              onChangeText={(text) => setBirthDate(maskDate(text))}
              placeholder="dd/mm/aaaa"
              placeholderTextColor="#9AA6B8"
              keyboardType="number-pad"
              maxLength={10}
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={(text) => setPhone(maskPhone(text))}
              placeholder="(11) 98765-4321"
              placeholderTextColor="#9AA6B8"
              keyboardType="phone-pad"
              maxLength={15}
            />

            <Text style={styles.label}>CPF</Text>
            {cpfLocked ? (
              <View style={[styles.input, styles.inputRow, styles.inputLocked]}>
                <Text style={styles.inputText}>{userCpf}</Text>
                <Feather name="lock" size={15} color={C.muted} />
              </View>
            ) : (
              <TextInput
                style={[styles.input, { marginBottom: 0 }]}
                value={cpf}
                onChangeText={(text) => setCpf(maskCpf(text))}
                placeholder="000.000.000-00"
                placeholderTextColor="#9AA6B8"
                keyboardType="number-pad"
                maxLength={14}
              />
            )}
            <Text style={styles.hint}>
              {cpfLocked ? 'Para mudar o CPF, fale com o suporte.' : 'Depois de salvo, o CPF não pode ser alterado.'}
            </Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>Salvar alterações</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Alterar e-mail */}
      <Modal visible={emailModal} transparent animationType="slide" onRequestClose={closeEmailModal}>
        <View style={styles.sheetOverlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Alterar e-mail</Text>
            {emailStep === 'request' ? (
              <>
                <Text style={styles.sheetText}>Vamos enviar um código para {userEmail} para confirmar a troca.</Text>
                <TextInput
                  style={styles.input}
                  value={newEmail}
                  onChangeText={setNewEmail}
                  placeholder="novo@email.com"
                  placeholderTextColor="#9AA6B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.primaryButton} onPress={requestEmailChange}>
                  <Text style={styles.primaryButtonText}>Enviar código</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.sheetText}>Digite o código de 6 números enviado para {userEmail}.</Text>
                <TextInput
                  style={[styles.input, styles.codeInput]}
                  value={code}
                  onChangeText={(text) => setCode(text.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  placeholderTextColor="#9AA6B8"
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <TouchableOpacity style={styles.primaryButton} onPress={confirmEmailChange}>
                  <Text style={styles.primaryButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.textButton} onPress={closeEmailModal}>
              <Text style={styles.link}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast message={toast} onHide={() => setToast('')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scrollContent: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 60 },

  avatarWrap: { alignSelf: 'center' },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: C.brandYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 30, fontFamily: F.bold, color: C.navy },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.primary,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoHint: { fontSize: 12, fontFamily: F.medium, color: C.muted, textAlign: 'center', marginTop: 8, marginBottom: 16 },

  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 14 },
  label: { fontSize: 13, fontFamily: F.bold, color: C.navy, marginBottom: 7 },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: F.medium,
    color: C.navy,
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  inputText: { flex: 1, fontSize: 14, fontFamily: F.medium, color: C.navy },
  inputLocked: { backgroundColor: C.background, marginBottom: 0 },
  hint: { fontSize: 11, fontFamily: F.regular, color: C.muted, marginTop: 6 },
  link: { fontSize: 13, fontFamily: F.bold, color: C.primary },

  primaryButton: {
    minHeight: 48,
    borderRadius: theme.radius.button,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontFamily: F.bold },
  textButton: { alignItems: 'center', paddingVertical: 14 },

  sheetOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 18, paddingBottom: 26 },
  sheetHandle: { width: 38, height: 4, borderRadius: 2, backgroundColor: '#D5DCE7', alignSelf: 'center', marginBottom: 14 },
  sheetTitle: { fontSize: 17, fontFamily: F.bold, color: C.navy },
  sheetText: { fontSize: 13, fontFamily: F.regular, color: C.textSecondary, marginTop: 6, marginBottom: 14, lineHeight: 19 },
  codeInput: { textAlign: 'center', fontSize: 20, letterSpacing: 6 },
});