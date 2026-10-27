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

interface LoginScreenProps {
  onLoginSuccess?: () => void;
  onNavigateToRegister?: () => void;
  onNavigateToForgotPassword?: () => void;
  onBack?: () => void;
}

export default function LoginScreen({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onBack,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha e-mail e senha para entrar.');
      return;
    }
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#21479B" />

      {/* Cabeçalho Azul Superior */}
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

        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>
          Insira seu e-mail e senha para fazer login
        </Text>
      </View>

      {/* Card Branco com Formulário */}
      <View style={styles.card}>
        {/* Campo E-mail */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="voce@email.com"
            placeholderTextColor="#AAB1BF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Campo Senha com olho */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor="#AAB1BF"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
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
        </View>

        <TouchableOpacity
          onPress={onNavigateToForgotPassword}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotText}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={styles.mutedText}>Ainda não tem uma conta? </Text>
          <TouchableOpacity onPress={onNavigateToRegister}>
            <Text style={styles.linkText}>Criar conta</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou continue com</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Botão Google com Imagem PNG */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => Alert.alert('Google', 'Integração demonstrativa.')}
          activeOpacity={0.85}
        >
          <Image
            source={require('../../assets/iconGoogle.png')}
            style={styles.googleIcon}
            resizeMode="contain"
          />
          <Text style={styles.googleButtonText}>Continuar com Google</Text>
        </TouchableOpacity>

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
    paddingHorizontal: 20,
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
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#DCE4F7',
    textAlign: 'center',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#E1E6F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#2A3342',
  },
  eyeIconContainer: {
    padding: 6,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#21479B',
    textAlign: 'right',
    marginTop: 2,
    marginBottom: 18,
  },
  primaryButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#1B4298',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  registerRow: {
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E6F0',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: '#7B8497',
  },
  googleButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E6F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  googleButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2A3342',
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