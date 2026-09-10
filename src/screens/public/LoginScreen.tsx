import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#32489F" />

      <View style={styles.topSection}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons
            name="chevron-back"
            size={26}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View style={styles.logoCircle}>
          <Ionicons
            name="paw"
            size={22}
            color="#32489F"
          />
        </View>

        <Text style={styles.title}>Login</Text>

        <Text style={styles.subtitle}>
          Insira seu e-mail e senha para fazer login
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>E-mail</Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={19}
            color="#8992A5"
            style={styles.inputIcon}
          />

          <TextInput
            placeholder="voce@email.com"
            placeholderTextColor="#A7ADBA"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.label}>Senha</Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={19}
            color="#8992A5"
            style={styles.inputIcon}
          />

          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#A7ADBA"
            style={styles.input}
            secureTextEntry={!showPassword}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#8992A5"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>
            Esqueci minha senha
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.createAccountRow}>
          <Text style={styles.createAccountText}>
            Ainda não tem uma conta?
          </Text>

          <TouchableOpacity>
            <Text style={styles.createAccountLink}>
              {' '}Criar conta
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />

          <Text style={styles.dividerText}>ou continue com</Text>

          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleIcon}>G</Text>

          <Text style={styles.googleText}>
            Continuar com Google
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Termos de Uso</Text>
          </TouchableOpacity>

          <Text style={styles.footerDot}>•</Text>

          <TouchableOpacity>
            <Text style={styles.footerLink}>
              Política de Privacidade
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#32489F',
  },

  topSection: {
    height: 220,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },

  backButton: {
    position: 'absolute',
    left: 16,
    top: 18,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  logoCircle: {
    marginTop: 48,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    marginTop: 16,
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  label: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#242B3A',
    marginBottom: 7,
    marginTop: 8,
  },

  inputContainer: {
    height: 46,
    borderWidth: 1,
    borderColor: '#D7DCE5',
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1F2937',
    outlineStyle: 'none' as any,
  },

  eyeButton: {
    width: 30,
    height: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  forgotPassword: {
    marginTop: 14,
    textAlign: 'right',
    color: '#214CB7',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
  },

  loginButton: {
    height: 50,
    backgroundColor: '#224DB6',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },

  createAccountRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  createAccountText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#707583',
  },

  createAccountLink: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#214CB7',
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  dividerText: {
    marginHorizontal: 12,
    color: '#858A96',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
  },

  googleButton: {
    height: 46,
    borderWidth: 1,
    borderColor: '#D7DCE5',
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  googleIcon: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_700Bold',
    marginRight: 12,
    color: '#4285F4',
  },

  googleText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#343A47',
  },

  footer: {
    marginTop: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerLink: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#3156B6',
  },

  footerDot: {
    marginHorizontal: 8,
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#8790A5',
  },
});