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

export default function NewPasswordScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

        <Text style={styles.topTitle}>
          Crie sua nova senha
        </Text>

        <Text style={styles.topSubtitle}>
          Escolha uma senha segura para proteger a sua conta.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nova senha</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua nova senha"
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
              color="#949BA8"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.strengthRow}>
          <View style={styles.strengthBar} />
          <View style={styles.strengthBar} />
          <View style={styles.strengthBar} />
        </View>

        <Text style={styles.label}>
          Confirmar nova senha
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite novamente"
            placeholderTextColor="#A7ADBA"
            secureTextEntry={!showConfirmPassword}
          />

          <TouchableOpacity
            onPress={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            style={styles.eyeButton}
          >
            <Ionicons
              name={
                showConfirmPassword
                  ? 'eye-off-outline'
                  : 'eye-outline'
              }
              size={20}
              color="#949BA8"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.requirementsTitle}>
          Sua senha deve conter:
        </Text>

        <View style={styles.requirementsContainer}>
          <View style={styles.requirementColumn}>
            <View style={styles.requirementRow}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color="#7C8799"
              />

              <Text style={styles.requirementText}>
                8 ou mais caracteres
              </Text>
            </View>

            <View style={styles.requirementRow}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color="#7C8799"
              />

              <Text style={styles.requirementText}>
                Uma letra maiúscula
              </Text>
            </View>
          </View>

          <View style={styles.requirementColumn}>
            <View style={styles.requirementRow}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color="#7C8799"
              />

              <Text style={styles.requirementText}>
                Um número
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>
            Salvar nova senha
          </Text>
        </TouchableOpacity>

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
    height: 190,
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

  topTitle: {
    marginTop: 14,
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },

  topSubtitle: {
    marginTop: 7,
    fontSize: 9,
    lineHeight: 13,
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
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#242B3A',
    marginBottom: 7,
    marginTop: 4,
  },

  inputContainer: {
    height: 46,
    borderWidth: 1,
    borderColor: '#D8DDE6',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },

  input: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1F2937',
    outlineStyle: 'none' as any,
  },

  eyeButton: {
    width: 32,
    height: 32,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  strengthRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
    marginBottom: 10,
  },

  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#D9DDE5',
  },

  requirementsTitle: {
    marginTop: 14,
    marginBottom: 10,
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#343A47',
  },

  requirementsContainer: {
    flexDirection: 'row',
  },

  requirementColumn: {
    flex: 1,
  },

  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  requirementText: {
    marginLeft: 6,
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#858A96',
  },

  saveButton: {
    height: 48,
    backgroundColor: '#244EB7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },

  footer: {
    marginTop: 'auto',
    marginBottom: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerLink: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#3156B6',
  },

  footerDot: {
    marginHorizontal: 8,
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#8790A5',
  },
});