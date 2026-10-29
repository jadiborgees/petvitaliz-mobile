import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VerifyCodeScreenProps {
  onNavigateToResetPassword?: () => void;
  onBack?: () => void;
}

export default function VerifyCodeScreen({
  onNavigateToResetPassword,
  onBack,
}: VerifyCodeScreenProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const codeInputs = useRef<Array<TextInput | null>>([]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      codeInputs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      codeInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      Alert.alert('Código incompleto', 'Digite o código completo de 6 dígitos.');
      return;
    }
    if (onNavigateToResetPassword) onNavigateToResetPassword();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#21479B" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
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

        <Text style={styles.title}>Verifique seu e-mail</Text>
        <Text style={styles.subtitle}>
          Digite o código que enviamos para o seu e-mail.
        </Text>
      </View>

      {/* Card Branco */}
      <View style={styles.card}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Código de verificação</Text>
          <View style={styles.codeInputsRow}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (codeInputs.current[index] = ref)}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputActive : null,
                ]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleCodeKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>
          <View style={styles.resendCodeRow}>
            <Text style={styles.mutedText}>Não recebeu o código? </Text>
            <TouchableOpacity
              onPress={() => Alert.alert('Reenviado', 'Um novo código foi enviado.')}
            >
              <Text style={styles.linkText}>Reenviar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleVerifyCode}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Verificar código</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <View style={styles.infoIconBadge}>
            <Ionicons name="mail-outline" size={22} color="#21479B" />
          </View>
          <Text style={styles.infoText}>
            Não encontrou o e-mail? Verifique também a caixa de spam.
          </Text>
        </View>

        <View style={styles.footerLinks}>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.legalLink}>Termos de Uso</Text>
          </TouchableOpacity>
          <Text style={styles.legalBullet}> • </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.legalLink}>Política de Privacidade</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#21479B',
  },
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
    top:
      Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logoContainer: {
    marginBottom: 8,
    alignItems: 'center',
  },
  logoIcon: {
    width: 54,
    height: 54,
    tintColor: '#FFFFFF',
  },
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
    paddingTop: 28,
    paddingBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2A3342',
    marginBottom: 6,
  },
  codeInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  codeInput: {
    width: 44,
    height: 52,
    borderWidth: 1,
    borderColor: '#E1E6F0',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#21479B',
    backgroundColor: '#FFFFFF',
  },
  codeInputActive: {
    borderColor: '#21479B',
    backgroundColor: '#F3F6FD',
  },
  resendCodeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  mutedText: {
    fontSize: 12,
    color: '#7B8497',
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#21479B',
  },
  primaryButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#1B4298',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
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
    marginTop: 'auto',
    paddingTop: 10,
  },
  legalLink: {
    fontSize: 11,
    fontWeight: '700',
    color: '#21479B',
  },
  legalBullet: {
    fontSize: 11,
    color: '#21479B',
  },
});