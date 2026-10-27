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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HowItWorksScreenProps {
  onBack?: () => void;
  onNavigateToRegister?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToServices?: () => void;
}

export default function HowItWorksScreen({
  onBack,
  onNavigateToRegister,
  onNavigateToLogin,
  onNavigateToServices,
}: HowItWorksScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Topo / Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Como funciona</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Conteúdo com Rolagem Vertical */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Título Principal */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>A PetVitaliz facilita a sua vida</Text>
          <Text style={styles.mainSubtitle}>
            Assine, agende e aproveite o cuidado completo para o seu pet.
          </Text>
        </View>

        {/* Linha do Tempo / Passos */}
        <View style={styles.timelineContainer}>
          {/* Linha vertical conectando os passos */}
          <View style={styles.timelineLine} />

          {/* Passo 1 */}
          <View style={styles.stepItem}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Escolha seu plano</Text>
              <Text style={styles.stepDescription}>
                Compare benefícios e escolha o ideal para o seu pet.
              </Text>
            </View>
          </View>

          {/* Passo 2 */}
          <View style={styles.stepItem}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Agende os serviços</Text>
              <Text style={styles.stepDescription}>
                Marque banho, exames e vacinas direto pelo app.
              </Text>
            </View>
          </View>

          {/* Passo 3 */}
          <View style={styles.stepItem}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Leve seu pet ou peça busca</Text>
              <Text style={styles.stepDescription}>
                Use a rede credenciada ou o serviço leva e traz.
              </Text>
            </View>
          </View>

          {/* Passo 4 */}
          <View style={styles.stepItem}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Acompanhe pelo app</Text>
              <Text style={styles.stepDescription}>
                Veja histórico, próximos cuidados e receba lembretes.
              </Text>
            </View>
          </View>
        </View>

        {/* Seção Sem Burocracia */}
        <Text style={styles.sectionTitle}>Sem burocracia</Text>
        <View style={styles.pillsRow}>
          <View style={styles.pillCard}>
            <Text style={styles.pillText}>Sem carência</Text>
          </View>
          <View style={styles.pillCard}>
            <Text style={styles.pillText}>Cancele quando quiser</Text>
          </View>
        </View>

        {/* Botão Começar agora */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onNavigateToRegister}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Começar agora</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomTab} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="home-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToServices} activeOpacity={0.7}>
          <Ionicons name="search-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Explorar</Text>
        </TouchableOpacity>

        {/* Botão Central com coroa.png */}
        <TouchableOpacity style={styles.bottomTabCenter} activeOpacity={0.85}>
          <Image
            source={require('../../assets/coroa.png')}
            style={styles.crownIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} activeOpacity={0.7}>
          <Ionicons name="gift-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Benefícios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToLogin} activeOpacity={0.7}>
          <Ionicons name="person-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#21479B',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  titleSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  mainSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  timelineContainer: {
    position: 'relative',
    marginBottom: 28,
  },
  timelineLine: {
    position: 'absolute',
    left: 17,
    top: 20,
    bottom: 20,
    width: 2,
    backgroundColor: '#E2E8F0',
    zIndex: 1,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    zIndex: 2,
  },
  stepBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1B4298',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 36,
  },
  pillCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  primaryButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#1B4298',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bottomBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  bottomTab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTabText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  bottomTabCenter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1B4298',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    elevation: 4,
    shadowColor: '#1B4298',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  crownIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
});