import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import PrivateHeader from '../../components/PrivateHeader';
import BottomNavigation from '../../components/BottomNavigation';
import { theme } from '../../theme/privateTheme';

interface ProfileScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToRegister?: () => void;
  onNavigateToSupport?: () => void;
  onNavigateToTerms?: () => void;
  // mantidos por compatibilidade
  onNavigateToFaq?: () => void;
  onNavigateToPrivacy?: () => void;
}

const C = theme.colors;
const F = theme.fonts;

export default function ProfileScreen({
  onBack,
  onNavigateToHome,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToLogin,
  onNavigateToRegister,
  onNavigateToSupport,
  onNavigateToTerms,
}: ProfileScreenProps) {
  const items = [
    { icon: 'headphones' as const, title: 'Ajuda e suporte', onPress: onNavigateToSupport },
    { icon: 'file-text' as const, title: 'Termos e privacidade', onPress: onNavigateToTerms },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <PrivateHeader title="Perfil" onBack={onBack ?? onNavigateToHome} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <View style={styles.heroCircle} />
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="paw" size={28} color={C.navy} />
          </View>
          <Text style={styles.heroTitle}>Olá!</Text>
          <Text style={styles.heroText}>Entre para cuidar dos seus pets e planos.</Text>
          <TouchableOpacity style={styles.yellowButton} onPress={onNavigateToLogin} activeOpacity={0.85}>
            <Text style={styles.yellowText}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineButton} onPress={onNavigateToRegister} activeOpacity={0.85}>
            <Text style={styles.outlineText}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[styles.row, index < items.length - 1 && styles.divider]}
              onPress={item.onPress}
              activeOpacity={0.75}
            >
              <Feather name={item.icon} size={18} color={C.primary} />
              <Text style={styles.rowText}>{item.title}</Text>
              <Feather name="chevron-right" size={18} color="#9AA6B8" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomNavigation
        currentRoute="Profile"
        onNavigateToHome={onNavigateToHome}
        onNavigateToPlans={onNavigateToPlans}
        onNavigateToBenefits={onNavigateToBenefits}
        onNavigateToProfile={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scrollContent: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 130 },
  hero: { backgroundColor: C.primary, borderRadius: 20, padding: 18, alignItems: 'center', overflow: 'hidden' },
  heroCircle: { position: 'absolute', right: -40, top: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: '#2148AA' },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: C.brandYellow, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 19, fontFamily: F.bold, color: '#FFFFFF', marginTop: 10 },
  heroText: { fontSize: 12, fontFamily: F.regular, color: '#C9D6EE', marginTop: 3, marginBottom: 14 },
  yellowButton: { alignSelf: 'stretch', minHeight: 46, borderRadius: 12, backgroundColor: C.brandYellow, alignItems: 'center', justifyContent: 'center' },
  yellowText: { fontSize: 14, fontFamily: F.bold, color: C.navy },
  outlineButton: { alignSelf: 'stretch', minHeight: 44, borderRadius: 12, borderWidth: 1.5, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  outlineText: { fontSize: 14, fontFamily: F.bold, color: '#FFFFFF' },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, paddingHorizontal: 14, marginTop: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15 },
  divider: { borderBottomWidth: 1, borderBottomColor: C.divider },
  rowText: { flex: 1, fontSize: 14, fontFamily: F.semibold, color: C.navy },
});