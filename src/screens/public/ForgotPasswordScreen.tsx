import React from 'react';
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

export default function ForgotPasswordScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3248A1" />

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
            color="#3248A1"
          />
        </View>

        <Text style={styles.title}>Recupere sua senha</Text>

        <Text style={styles.subtitle}>
          Informe o e-mail da sua conta para receber o link.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>E-mail</Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={19}
            color="#7E8CA6"
            style={styles.inputIcon}
          />

          <TextInput
            style={styles.input}
            placeholder="voce@email.com"
            placeholderTextColor="#A7ADBA"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>
            Enviar link de recuperação
          </Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>
            Lembrou sua senha?
          </Text>

          <TouchableOpacity>
            <Text style={styles.loginLink}>
              {' '}Entrar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoBox}>
          <View style={styles.infoIconCircle}>
            <Ionicons
              name="mail-outline"
              size={17}
              color="#71809C"
            />
          </View>

          <Text style={styles.infoText}>
            Não recebeu o e-mail? Verifique também a caixa de spam.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>
              Termos de Uso
            </Text>
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
    backgroundColor: '#3248A1',
  },

  topSection: {
    height: 205,
    alignItems: 'center',
    paddingHorizontal: 20,
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
    fontSize: 23,
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  label: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#242B3A',
    marginBottom: 7,
  },

  inputContainer: {
    height: 46,
    borderWidth: 1,
    borderColor: '#D8DDE6',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1F2937',

    // ajuda no Expo Web
    outlineStyle: 'none' as any,
  },

  sendButton: {
    height: 48,
    backgroundColor: '#244EB7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },

  loginText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#555C68',
  },

  loginLink: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#3156B6',
  },

  divider: {
    height: 1,
    backgroundColor: '#ECEEF2',
    marginTop: 40,
  },

  infoBox: {
    marginTop: 20,
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  infoIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#AAB6CF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#4E5666',
  },

  footer: {
    marginTop: 'auto',
    marginBottom: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#7A8291',
  },
});