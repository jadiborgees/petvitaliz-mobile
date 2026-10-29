import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmailSentScreenProps {
  email?: string;
  onNavigateToVerifyCode?: () => void;
  onBack?: () => void;
}

export default function EmailSentScreen({
  email,
  onNavigateToVerifyCode,
  onBack,
}: EmailSentScreenProps) {
  const [timer, setTimer] = useState(45);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

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

        <Text style={styles.title}>E-mail enviado!</Text>
        <Text style={styles.subtitle}>
          Enviamos um código de recuperação para o seu e-mail.
        </Text>
      </View>

      {/* Card Branco */}
      <View style={styles.card}>
        <View style={styles.centerIconContainer}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.innerTitle}>E-mail enviado!</Text>
          <Text style={styles.innerSubtitle}>
            Confira sua caixa de entrada para continuar.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onNavigateToVerifyCode}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Digitar código</Text>
        </TouchableOpacity>

        <Text style={styles.timerText}>
          Você poderá reenviar um novo código em{' '}
          <Text style={styles.timerHighlight}>
            00:{timer < 10 ? `0${timer}` : timer}
          </Text>
        </Text>

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
  container: { flex: 1, backgroundColor: '#21479B' },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 24,
    paddingHorizontal: 28,
    paddingBottom: 24,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logoContainer: { marginBottom: 8, alignItems: 'center' },
  logoIcon: { width: 54, height: 54, tintColor: '#FFFFFF' },
  title: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 12, color: '#DCE4F7', textAlign: 'center', lineHeight: 18 },
  card: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 22, paddingTop: 28, paddingBottom: 20 },
  centerIconContainer: { alignItems: 'center', marginVertical: 12 },
  checkCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#2D52A8', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  innerTitle: { fontSize: 20, fontWeight: '800', color: '#1A202C', marginBottom: 4 },
  innerSubtitle: { fontSize: 12, color: '#7B8497', textAlign: 'center' },
  primaryButton: { height: 50, borderRadius: 12, backgroundColor: '#1B4298', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  primaryButtonText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  timerText: { textAlign: 'center', fontSize: 12, color: '#7B8497', marginTop: 14 },
  timerHighlight: { color: '#21479B', fontWeight: '700' },
  infoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F6FD', borderRadius: 16, padding: 14, marginTop: 24, gap: 12 },
  infoIconBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E1E6F0' },
  infoText: { flex: 1, fontSize: 12, color: '#4A5568', lineHeight: 17, fontWeight: '500' },
  footerLinks: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 'auto', paddingTop: 10 },
  legalLink: { fontSize: 11, fontWeight: '700', color: '#21479B' },
  legalBullet: { fontSize: 11, color: '#21479B' },
});