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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ForgotPasswordScreenProps {
  registeredEmails?: string[];
  onNavigateToLogin?: () => void;
  onCodeSent?: (email: string) => void;
  onBack?: () => void;
}

export default function ForgotPasswordScreen({
  registeredEmails = [],
  onNavigateToLogin,
  onCodeSent,
  onBack,
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (text.length > 0 && !emailRegex.test(text)) {
      setEmailError('Insira um e-mail válido (ex: voce@email.com)');
    } else {
      setEmailError('');
    }
  };

  const handleSendCode = () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      Alert.alert('Campo obrigatório', 'Informe o seu e-mail para continuar.');
      return;
    }

    if (emailError) {
      Alert.alert('E-mail inválido', 'Por favor, insira um e-mail válido.');
      return;
    }

    // Verifica se o e-mail existe na lista de e-mails cadastrados
    const emailExists = registeredEmails.some(
      (e) => e.toLowerCase() === cleanEmail
    );

    if (!emailExists) {
      setEmailError('Nenhuma conta encontrada com este e-mail.');
      Alert.alert(
        'Conta não encontrada',
        'Não encontramos nenhuma conta cadastrada com este e-mail. Verifique a digitação ou crie uma nova conta.'
      );
      return;
    }

    // Na web o Alert.alert não executa botões; segue direto para a próxima tela
    if (Platform.OS === 'web') {
      if (onCodeSent) onCodeSent(cleanEmail);
      return;
    }

    Alert.alert(
      'Código enviado!',
      `Enviamos o código de recuperação para: ${cleanEmail}`,
      [
        {
          text: 'Continuar',
          onPress: () => {
            if (onCodeSent) onCodeSent(cleanEmail);
          },
        },
      ]
    );
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

        <Text style={styles.title}>Recupere sua senha</Text>
        <Text style={styles.subtitle}>
          Informe o e-mail da sua conta para receber o código de recuperação.
        </Text>
      </View>

      {/* Card Branco com Formulário */}
      <View style={styles.card}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>E-mail</Text>
          <View
            style={[
              styles.inputContainer,
              emailError ? styles.inputError : null,
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color="#7B8497"
              style={styles.inputLeftIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="voce@email.com"
              placeholderTextColor="#AAB1BF"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSendCode}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Enviar código</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.mutedText}>Lembrou sua senha? </Text>
          <TouchableOpacity onPress={onNavigateToLogin} activeOpacity={0.7}>
            <Text style={styles.linkText}>Entrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIconBadge}>
            <Ionicons name="mail-outline" size={22} color="#21479B" />
          </View>
          <Text style={styles.infoText}>
            Não recebeu o e-mail? Verifique também a caixa de spam.
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
    paddingBottom: 28,
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
    marginBottom: 10,
    alignItems: 'center',
  },
  logoIcon: {
    width: 58,
    height: 58,
    tintColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
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
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2A3342',
    marginBottom: 6,
  },
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
  inputLeftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#2A3342',
  },
  inputError: {
    borderColor: '#E53935',
  },
  errorText: {
    color: '#E53935',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  primaryButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#1B4298',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F6FD',
    borderRadius: 16,
    padding: 16,
    marginTop: 32,
    gap: 12,
  },
  infoIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
    lineHeight: 18,
    fontWeight: '500',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 20,
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