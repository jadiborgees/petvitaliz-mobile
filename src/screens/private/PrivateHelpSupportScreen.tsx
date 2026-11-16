import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';
import PrivateHeader from '../../components/PrivateHeader';
import { theme } from '../../theme/privateTheme';

// Número do WhatsApp do atendimento (DDI + DDD + número, só dígitos).
// TROQUE pelo número real da PetVitaliz.
const WHATSAPP_NUMBER = '5511999999999';
const WHATSAPP_MESSAGE = 'Olá! Preciso de ajuda com o app PetVitaliz.';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface PrivateHelpSupportScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToTerms?: () => void;
}

type CategoryId = 'todas' | 'plano' | 'pagamentos' | 'consultas' | 'pet' | 'conta';

const CATEGORIES: { id: CategoryId; label: string; icon: React.ComponentProps<typeof Feather>['name'] }[] = [
  { id: 'plano', label: 'Meu plano', icon: 'award' },
  { id: 'pagamentos', label: 'Pagamentos', icon: 'credit-card' },
  { id: 'consultas', label: 'Consultas', icon: 'calendar' },
  { id: 'pet', label: 'Meu pet', icon: 'heart' },
  { id: 'conta', label: 'Conta e acesso', icon: 'user' },
  { id: 'todas', label: 'Todas', icon: 'help-circle' },
];

// Perguntas frequentes. Edite aqui para mudar o conteúdo.
const FAQ: { category: Exclude<CategoryId, 'todas'>; question: string; answer: string }[] = [
  {
    category: 'plano',
    question: 'O plano vale para todos os meus pets?',
    answer: 'Não. Cada plano é de um pet. Se você tem mais de um, escolha um plano para cada um em Meu Plano.',
  },
  {
    category: 'plano',
    question: 'Como mudo de plano?',
    answer:
      'Em Meu Plano, toque em "Mudar de plano". Para um plano maior, a mudança vale na hora e você paga só a diferença. Para um menor, ela acontece na próxima renovação.',
  },
  {
    category: 'plano',
    question: 'Se eu cancelar, perco os benefícios na hora?',
    answer: 'Não. Você continua usando o plano até o fim do ciclo já pago. Depois disso, ele não renova.',
  },
  {
    category: 'plano',
    question: 'O que acontece quando a cota do mês acaba?',
    answer: 'O serviço fica como "Cota esgotada" até o dia 1º do mês seguinte, quando a cota renova.',
  },
  {
    category: 'pagamentos',
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Cartão de crédito. Com o cartão aprovado, o plano é ativado na hora.',
  },
  {
    category: 'pagamentos',
    question: 'O plano anual é mais barato?',
    answer: 'Sim. No plano anual o valor por mês é menor e a cobrança é feita de uma vez para os 12 meses.',
  },
  {
    category: 'pagamentos',
    question: 'Meu pagamento foi recusado. E agora?',
    answer: 'Confira os dados do cartão ou use outro. Suas escolhas de plano e de pet ficam salvas para tentar de novo.',
  },
  {
    category: 'consultas',
    question: 'Até quando posso reagendar ou cancelar?',
    answer: 'Até 24 horas antes do horário marcado. Cancelando dentro desse prazo, sua cota não é consumida.',
  },
  {
    category: 'consultas',
    question: 'Posso escolher o veterinário?',
    answer: 'Nesta versão, a clínica atribui o profissional. O nome aparece nos detalhes da consulta.',
  },
  {
    category: 'pet',
    question: 'Como cadastro um pet?',
    answer: 'Vá em Perfil › Meus Pets › Adicionar pet. São 3 etapas rápidas e o cadastro é gratuito.',
  },
  {
    category: 'pet',
    question: 'Por que não consigo excluir meu pet?',
    answer: 'Pets com plano ativo não podem ser excluídos. Cancele o plano dele antes.',
  },
  {
    category: 'conta',
    question: 'Como troco minha senha?',
    answer: 'Vá em Perfil › Segurança › Alterar senha. Você recebe uma confirmação por e-mail.',
  },
  {
    category: 'conta',
    question: 'Esqueci minha senha.',
    answer: 'Na tela de login, toque em "Esqueci minha senha". Enviamos um código de 6 dígitos para o seu e-mail.',
  },
  {
    category: 'conta',
    question: 'Como excluo minha conta?',
    answer: 'Em Perfil › Segurança › Excluir conta. Seus planos são cancelados e os dados apagados.',
  },
];

const C = theme.colors;
const F = theme.fonts;

export default function PrivateHelpSupportScreen({
  onBack,
  onNavigateToHome,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  onNavigateToTerms,
}: PrivateHelpSupportScreenProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryId>('todas');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const visibleFaq = useMemo(() => {
    const query = search.trim().toLowerCase();
    return FAQ.filter((item) => {
      if (category !== 'todas' && item.category !== category) return false;
      if (!query) return true;
      return `${item.question} ${item.answer}`.toLowerCase().includes(query);
    });
  }, [search, category]);

  const toggleQuestion = (question: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenQuestion((current) => (current === question ? null : question));
  };

  const openWhatsApp = async () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('WhatsApp', 'Não foi possível abrir o WhatsApp agora. Tente novamente.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PrivateHeader title="Ajuda e suporte" onBack={onBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Topo: busca e WhatsApp */}
        <View style={styles.hero}>
          <View style={styles.heroCircle} />
          <Text style={styles.heroTitle}>Como podemos ajudar?</Text>
          <Text style={styles.heroSubtitle}>Atendimento todos os dias, 24h.</Text>

          <View style={styles.searchBox}>
            <Feather name="search" size={16} color="#9AA6B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar uma dúvida"
              placeholderTextColor="#9AA6B8"
              value={search}
              onChangeText={(text) => {
                setSearch(text);
                if (text) setCategory('todas');
              }}
            />
            {!!search && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Feather name="x" size={16} color="#9AA6B8" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.whatsButton} onPress={openWhatsApp} activeOpacity={0.85}>
            <MaterialCommunityIcons name="whatsapp" size={18} color={C.navy} />
            <Text style={styles.whatsText}>Falar no WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Assuntos */}
        <Text style={styles.sectionTitle}>Assuntos</Text>
        <View style={styles.grid}>
          {CATEGORIES.map((item) => {
            const active = category === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.categoryCard, active && styles.categoryCardActive]}
                onPress={() => {
                  setCategory(item.id);
                  setOpenQuestion(null);
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.categoryIcon, active && styles.categoryIconActive]}>
                  <Feather name={item.icon} size={15} color={active ? '#FFFFFF' : C.primary} />
                </View>
                <Text style={[styles.categoryText, active && { color: '#FFFFFF' }]} numberOfLines={1}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Perguntas frequentes */}
        <Text style={styles.sectionTitle}>Perguntas frequentes</Text>
        <View style={styles.faqCard}>
          {visibleFaq.length === 0 ? (
            <View style={styles.emptyFaq}>
              <Text style={styles.emptyTitle}>Não achamos essa dúvida</Text>
              <Text style={styles.emptyText}>Fale com a gente pelo WhatsApp que respondemos rapidinho.</Text>
            </View>
          ) : (
            visibleFaq.map((item, index) => {
              const open = openQuestion === item.question;
              return (
                <TouchableOpacity
                  key={item.question}
                  style={[styles.faqItem, index < visibleFaq.length - 1 && styles.divider]}
                  onPress={() => toggleQuestion(item.question)}
                  activeOpacity={0.75}
                >
                  <View style={styles.faqRow}>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <Feather name={open ? 'chevron-up' : 'chevron-down'} size={18} color={C.muted} />
                  </View>
                  {open && <Text style={styles.faqAnswer}>{item.answer}</Text>}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <TouchableOpacity style={styles.termsLink} onPress={onNavigateToTerms} activeOpacity={0.7}>
          <Feather name="file-text" size={15} color={C.primary} />
          <Text style={styles.termsText}>Termos de uso e privacidade</Text>
        </TouchableOpacity>
      </ScrollView>

      <PrivateBottomNav
        currentRoute="PrivateProfile"
        onNavigateToHome={onNavigateToHome}
        onNavigateToPlans={onNavigateToPlans}
        onNavigateToBenefits={onNavigateToBenefits}
        onNavigateToProfile={onNavigateToProfile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scrollContent: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 130 },

  hero: { backgroundColor: C.primary, borderRadius: 22, padding: 16, overflow: 'hidden' },
  heroCircle: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#2148AA',
  },
  heroTitle: { fontSize: 18, fontFamily: F.bold, color: '#FFFFFF' },
  heroSubtitle: { fontSize: 12, fontFamily: F.regular, color: '#C9D6EE', marginTop: 3, marginBottom: 12 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: { flex: 1, fontSize: 13, fontFamily: F.medium, color: C.navy },
  whatsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.brandYellow,
    borderRadius: 12,
    minHeight: 44,
    marginTop: 10,
  },
  whatsText: { fontSize: 14, fontFamily: F.bold, color: C.navy },

  sectionTitle: { fontSize: 16, fontFamily: F.bold, color: C.navy, marginTop: 22, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 8 },
  categoryCard: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 10,
  },
  categoryCardActive: { backgroundColor: C.primary, borderColor: C.primary },
  categoryIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconActive: { backgroundColor: '#2C55BC' },
  categoryText: { flex: 1, fontSize: 12, fontFamily: F.bold, color: C.navy },

  faqCard: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    paddingHorizontal: 14,
  },
  faqItem: { paddingVertical: 13 },
  divider: { borderBottomWidth: 1, borderBottomColor: C.divider },
  faqRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  faqQuestion: { flex: 1, fontSize: 13, fontFamily: F.bold, color: C.navy },
  faqAnswer: { fontSize: 12, fontFamily: F.regular, color: C.textSecondary, lineHeight: 18, marginTop: 7 },
  emptyFaq: { alignItems: 'center', paddingVertical: 22 },
  emptyTitle: { fontSize: 14, fontFamily: F.bold, color: C.navy },
  emptyText: { fontSize: 12, fontFamily: F.regular, color: C.muted, textAlign: 'center', marginTop: 4 },

  termsLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 18 },
  termsText: { fontSize: 13, fontFamily: F.bold, color: C.primary },
});