import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../../components/BottomNavigation';

interface ProfileScreenProps {
  onBack?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToRegister?: () => void;
  onNavigateToSupport?: () => void;
  onNavigateToFaq?: () => void;
  onNavigateToTerms?: () => void;
  onNavigateToPrivacy?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

export default function ProfileScreen({
  onBack,
  onNavigateToLogin,
  onNavigateToRegister,
  onNavigateToSupport,
  onNavigateToFaq,
  onNavigateToTerms,
  onNavigateToPrivacy,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: ProfileScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#21479B" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Topo Azul com Botão Voltar, Título, Engrenagem e Avatar */}
        <View style={styles.topHeaderSection}>
          <View style={styles.headerTitleRow}>
            <TouchableOpacity onPress={onBack || onNavigateToHome} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Perfil</Text>

            <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
              <Ionicons name="settings-sharp" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person-outline" size={44} color="#94A3B8" />
            </View>
          </View>
        </View>

        {/* Mensagem de Boas-vindas e Botões */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Olá!</Text>
          <Text style={styles.welcomeSubtitle}>
            Entre na sua conta para acessar seus pets e planos.
          </Text>

          {/* Botão Entrar */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={onNavigateToLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Botão Cadastre-se */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={onNavigateToRegister}
            activeOpacity={0.85}
          >
            <Text style={styles.registerButtonText}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Opções */}
        <View style={styles.optionsList}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={onNavigateToSupport}
            activeOpacity={0.7}
          >
            <View style={styles.optionIconBadge}>
              <Ionicons name="headset-outline" size={20} color="#21479B" />
            </View>
            <Text style={styles.optionText}>Ajuda e Suporte</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={onNavigateToFaq}
            activeOpacity={0.7}
          >
            <View style={styles.optionIconBadge}>
              <Ionicons name="help-circle-outline" size={20} color="#21479B" />
            </View>
            <Text style={styles.optionText}>Perguntas frequentes</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={onNavigateToTerms}
            activeOpacity={0.7}
          >
            <View style={styles.optionIconBadge}>
              <Ionicons name="document-text-outline" size={20} color="#21479B" />
            </View>
            <Text style={styles.optionText}>Termos de Uso</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={onNavigateToPrivacy}
            activeOpacity={0.7}
          >
            <View style={styles.optionIconBadge}>
              <Ionicons name="lock-closed-outline" size={20} color="#21479B" />
            </View>
            <Text style={styles.optionText}>Política de Privacidade</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Componente Global de Navegação (Com a aba Perfil ativa) */}
      <BottomNavigation
        currentRoute="Profile"
        onNavigateToHome={onNavigateToHome}
        onNavigateToExplore={onNavigateToExplore}
        onNavigateToPlans={onNavigateToPlans}
        onNavigateToBenefits={onNavigateToBenefits}
        onNavigateToProfile={onNavigateToProfile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 24 },
  topHeaderSection: {
    backgroundColor: '#21479B',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingHorizontal: 20,
    paddingBottom: 50,
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  settingsButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -40,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F0F5FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  welcomeSection: {
    marginTop: 50,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  welcomeTitle: { fontSize: 22, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  loginButton: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#1B4298',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { marginHorizontal: 12, fontSize: 12, color: '#94A3B8' },
  registerButton: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  registerButtonText: { fontSize: 14, fontWeight: '800', color: '#1B4298' },
  optionsList: { paddingHorizontal: 20 },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  optionIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0F5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1E293B' },
});