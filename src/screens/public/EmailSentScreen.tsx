import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function EmailSentScreen() {
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

        <Text style={styles.topTitle}>E-mail enviado!</Text>

        <Text style={styles.topSubtitle}>
          Enviamos um link de recuperação para o seu e-mail.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.successIconCircle}>
          <Ionicons
            name="checkmark"
            size={38}
            color="#FFFFFF"
          />
        </View>

        <Text style={styles.title}>
          E-mail enviado!
        </Text>

        <Text style={styles.subtitle}>
          Confira sua caixa de e-mail.
        </Text>

        <TouchableOpacity style={styles.resendButton}>
          <Text style={styles.resendButtonText}>
            Reenviar e-mail
          </Text>
        </TouchableOpacity>

        <Text style={styles.timerText}>
          Você poderá reenviar em{' '}
          <Text style={styles.timerHighlight}>00:45</Text>
        </Text>

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
    height: 180,
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
    marginTop: 12,
    fontSize: 21,
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
    paddingTop: 18,
    alignItems: 'center',
  },

  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1DA1F2',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#1DA1F2',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  title: {
    marginTop: 14,
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#234AAB',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#858A96',
  },

  resendButton: {
    width: '100%',
    height: 46,
    backgroundColor: '#244EB7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },

  resendButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },

  timerText: {
    marginTop: 12,
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#858A96',
  },

  timerHighlight: {
    color: '#3156B6',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },

  infoBox: {
    width: '100%',
    marginTop: 18,
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
    fontSize: 10,
    lineHeight: 15,
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