import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FaqScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

export default function FaqScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: FaqScreenProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const categories = [
    { title: 'Planos', subtitle: 'Dúvidas sobre planos e benefícios', icon: 'cube-outline' },
    { title: 'Pagamentos', subtitle: 'Cobranças, faturas e reembolsos', icon: 'card-outline' },
    { title: 'Consultas e serviços', subtitle: 'Agendamentos e atendimento', icon: 'stethoscope' },
    { title: 'Pets', subtitle: 'Cadastro e cuidados', icon: 'paw-outline' },
    { title: 'Conta', subtitle: 'Acesso, dados e segurança', icon: 'person-outline' },
  ];

  const faqs = [
    {
      question: 'Como funciona o PetVitaliz?',
      answer: 'O PetVitaliz oferece planos de saúde e bem-estar para pets com ampla rede credenciada e descontos exclusivos em consultas, vacinas e banhos.',
    },
    {
      question: 'Como faço para contratar um plano?',
      answer: 'Basta navegar até a tela de Planos, escolher o plano ideal para o seu pet e seguir o fluxo de cadastro e pagamento.',
    },
    {
      question: 'Quais são as formas de pagamento?',
      answer: 'Aceitamos cartão de crédito e PIX com renovação automática no plano mensal ou anual.',
    },
    {
      question: 'Como cancelar meu plano?',
      answer: 'Você pode solicitar o cancelamento diretamente pelo suporte no aplicativo sem taxas ou carências abusivas.',
    },
    {
      question: 'Como agendar uma consulta?',
      answer: 'Após entrar na sua conta, acesse a área do cliente para visualizar a rede de parceiros e solicitar agendamentos.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Pesquisa */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput placeholder="Buscar dúvidas..." placeholderTextColor="#94A3B8" style={styles.searchInput} />
        </View>

        <Text style={styles.sectionTitle}>Categorias</Text>
        <View style={styles.categoriesList}>
          {categories.map((cat, idx) => (
            <TouchableOpacity key={idx} style={styles.categoryCard} activeOpacity={0.7}>
              <View style={styles.categoryIconBadge}>
                <Ionicons name={cat.icon as any} size={18} color="#21479B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.categoryTitle}>{cat.title}</Text>
                <Text style={styles.categorySubtitle}>{cat.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Perguntas frequentes</Text>
        <View style={styles.faqList}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <TouchableOpacity
                key={idx}
                style={styles.faqCard}
                onPress={() => setOpenFaqIndex(isOpen ? null : idx)}
                activeOpacity={0.8}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#21479B" />
                </View>
                {isOpen && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToHome} activeOpacity={0.7}>
          <Ionicons name="home-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToExplore} activeOpacity={0.7}>
          <Ionicons name="search-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Explorar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTabCenter} onPress={onNavigateToPlans} activeOpacity={0.85}>
          <Image source={require('../../assets/coroa.png')} style={styles.crownIcon} resizeMode="contain" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToBenefits} activeOpacity={0.7}>
          <Ionicons name="gift-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Benefícios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToProfile || onBack} activeOpacity={0.7}>
          <Ionicons name="person" size={22} color="#21479B" />
          <Text style={[styles.bottomTabText, styles.bottomTabActive]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#21479B' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#1E293B' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginBottom: 12 },
  categoriesList: { gap: 10 },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  categoryIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0F5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  categorySubtitle: { fontSize: 10, color: '#94A3B8', marginTop: 1 },
  faqList: { gap: 10 },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { flex: 1, fontSize: 12, fontWeight: '700', color: '#1E293B', marginRight: 8 },
  faqAnswer: { fontSize: 11, color: '#64748B', lineHeight: 16, marginTop: 8 },
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
  bottomTab: { alignItems: 'center', justifyContent: 'center' },
  bottomTabText: { fontSize: 10, color: '#94A3B8', marginTop: 2, fontWeight: '500' },
  bottomTabActive: { color: '#21479B', fontWeight: '800' },
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
  crownIcon: { width: 24, height: 24, tintColor: '#FFFFFF' },
});