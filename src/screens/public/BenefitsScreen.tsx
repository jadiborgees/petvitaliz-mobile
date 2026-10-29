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

interface BenefitsScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToProfile?: () => void;
}

export default function BenefitsScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToLogin,
  onNavigateToProfile,
}: BenefitsScreenProps) {
  const benefitsList = [
    {
      id: 1,
      title: 'Consultas & Exames',
      description: 'Acesso a uma ampla rede de clínicas parceiras com desconto exclusivo.',
      icon: 'medkit-outline',
      badge: 'SAÚDE',
    },
    {
      id: 2,
      title: 'Banho & Tosa com Desconto',
      description: 'Mantenha o seu pet limpo e saudável em pet shops selecionados.',
      icon: 'cut-outline',
      badge: 'ESTÉTICA',
    },
    {
      id: 3,
      title: 'Farmácia Veterinária',
      description: 'Até 20% de desconto em medicamentos e antipulgas parceiros.',
      icon: 'bandage-outline',
      badge: 'ECONOMIA',
    },
    {
      id: 4,
      title: 'Atendimento 24h',
      description: 'Suporte e orientações de emergência a qualquer hora do dia.',
      icon: 'time-outline',
      badge: '24 HORAS',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Topo / Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack || onNavigateToHome}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Benefícios</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Conteúdo com Rolagem Vertical */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner de Destaque */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTag}>CLUB PETVITALIZ</Text>
          <Text style={styles.heroTitle}>Vantagens exclusivas para o seu melhor amigo</Text>
          <Text style={styles.heroSubtitle}>
            Assine um de nossos planos e garanta economias reais nos cuidados diários.
          </Text>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={onNavigateToPlans}
            activeOpacity={0.85}
          >
            <Text style={styles.heroButtonText}>VER PLANOS</Text>
          </TouchableOpacity>
        </View>

        {/* Título da Seção */}
        <Text style={styles.sectionTitle}>O que você recebe</Text>

        {/* Lista de Cards de Benefícios */}
        <View style={styles.cardsContainer}>
          {benefitsList.map((item) => (
            <View key={item.id} style={styles.benefitCard}>
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  <Ionicons name={item.icon as any} size={22} color="#21479B" />
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          ))}
        </View>

        {/* Banner Inferior Chamada para Ação */}
        <View style={styles.ctaCard}>
          <Ionicons name="gift-outline" size={32} color="#FFFFFF" />
          <View style={styles.ctaInfo}>
            <Text style={styles.ctaTitle}>Quer aproveitar tudo isso?</Text>
            <Text style={styles.ctaSubtitle}>Escolha o plano ideal e comece hoje.</Text>
          </View>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={onNavigateToPlans}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaButtonText}>Conhecer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Componente Global de Navegação */}
      <BottomNavigation
        currentRoute="Benefits"
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
  heroCard: {
    backgroundColor: '#1B4298',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  heroTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A3C0F5',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#E2E8F0',
    lineHeight: 18,
    marginBottom: 16,
  },
  heroButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  heroButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1B4298',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 14,
  },
  cardsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  benefitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  ctaCard: {
    backgroundColor: '#21479B',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ctaInfo: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ctaSubtitle: {
    fontSize: 11,
    color: '#A3C0F5',
    marginTop: 2,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  ctaButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#21479B',
  },
});