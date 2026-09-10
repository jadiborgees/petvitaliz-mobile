import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3248A1" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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

          <Text style={styles.title}>Cadastre-se</Text>

          <View style={styles.loginRow}>
            <Text style={styles.subtitle}>Já tem uma conta?</Text>

            <TouchableOpacity>
              <Text style={styles.loginLink}>
                {' '}Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Nome completo</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={19}
              color="#8992A5"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.inputFlex}
              placeholder="Como podemos chamar você?"
              placeholderTextColor="#A7ADBA"
            />
          </View>

          <Text style={styles.label}>E-mail</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={19}
              color="#8992A5"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.inputFlex}
              placeholder="voce@email.com"
              placeholderTextColor="#A7ADBA"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Data de nascimento</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="calendar-outline"
              size={19}
              color="#8992A5"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.inputFlex}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#A7ADBA"
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>Celular</Text>

          <View style={styles.phoneContainer}>
            <View style={styles.countryArea}>
              <Text style={styles.flag}>🇧🇷</Text>

              <Ionicons
                name="chevron-down"
                size={14}
                color="#7A8290"
              />
            </View>

            <TextInput
              style={styles.phoneInput}
              placeholder="(11) 98765-4321"
              placeholderTextColor="#A7ADBA"
              keyboardType="phone-pad"
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
              style={styles.inputFlex}
              placeholder="Crie uma senha segura"
              placeholderTextColor="#A7ADBA"
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

          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>
              Criar conta
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />

            <Text style={styles.dividerText}>
              ou continue com
            </Text>

            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.googleButton}>
            <Text style={styles.googleIcon}>G</Text>

            <Text style={styles.googleText}>
              Continuar com Google
            </Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            Ao continuar, você concorda com os{' '}
            <Text style={styles.linkText}>
              Termos de Uso
            </Text>
            {'\n'}e a{' '}
            <Text style={styles.linkText}>
              Política de Privacidade.
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3248A1',
  },

  scrollContent: {
    flexGrow: 1,
  },

  topSection: {
    height: 210,
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
    marginTop: 50,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    marginTop: 15,
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },

  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  subtitle: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#FFFFFF',
  },

  loginLink: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },

  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 34,
  },

  label: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#242B3A',
    marginTop: 10,
    marginBottom: 7,
  },

  inputContainer: {
    height: 45,
    borderWidth: 1,
    borderColor: '#D8DDE6',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },

  inputIcon: {
    marginRight: 10,
  },

  inputFlex: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1F2937',
    outlineStyle: 'none' as any,
  },

  eyeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  phoneContainer: {
    height: 45,
    borderWidth: 1,
    borderColor: '#D8DDE6',
    borderRadius: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },

  countryArea: {
    width: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E4E7EC',
  },

  flag: {
    fontSize: 17,
    marginRight: 6,
  },

  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1F2937',
    outlineStyle: 'none' as any,
  },

  createButton: {
    height: 50,
    backgroundColor: '#244EB7',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 34,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 26,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#858A96',
  },

  googleButton: {
    height: 46,
    borderWidth: 1,
    borderColor: '#D8DDE6',
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  googleIcon: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#4285F4',
    marginRight: 12,
  },

  googleText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#343A47',
  },

  termsText: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#848B98',
  },

  linkText: {
    color: '#3156B6',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
});