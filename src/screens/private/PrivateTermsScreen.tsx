import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import PrivateHeader from '../../components/PrivateHeader';
import PrivateBottomNav from '../../components/PrivateBottomNav';
import { theme } from '../../theme/privateTheme';

// Termos de uso e Política de privacidade em uma tela com duas abas.
// ATENÇÃO: o texto abaixo é um modelo baseado nas regras do app.
// Antes de publicar, ele precisa ser revisado por um advogado.

type Tab = 'termos' | 'privacidade';

interface PrivateTermsScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToHelp?: () => void;
  initialTab?: Tab;
  showBottomNav?: boolean;
}

const UPDATED_AT = '16 nov 2026';

const CONTENT: Record<Tab, { title: string; body: string }[]> = {
  termos: [
    {
      title: '1. Aceitação',
      body: 'Ao criar uma conta na PetVitaliz, você concorda com estes Termos de Uso e com a Política de Privacidade. Se não concordar, não use o app.',
    },
    {
      title: '2. Planos e pagamentos',
      body: 'Cada plano é vinculado a um pet. A cobrança é feita no cartão de crédito cadastrado. Com o pagamento aprovado, o plano é ativado na hora. No plano anual, o valor total dos 12 meses é cobrado de uma vez.',
    },
    {
      title: '3. Cotas e serviços',
      body: 'Cada benefício tem uma cota mensal, que renova no dia 1º. Serviços fora do plano do pet não podem ser agendados até que ele mude para um plano que os inclua.',
    },
    {
      title: '4. Agendamentos',
      body: 'Consultas e serviços podem ser reagendados ou cancelados até 24 horas antes do horário. Cancelando dentro desse prazo, a cota não é consumida. O profissional é definido pela clínica.',
    },
    {
      title: '5. Mudança e cancelamento de plano',
      body: 'Mudar para um plano maior vale na hora, cobrando a diferença proporcional. Mudar para um plano menor vale na próxima renovação. Ao cancelar, o acesso continua até o fim do ciclo já pago.',
    },
    {
      title: '6. Pets e conta',
      body: 'Um pet com plano ativo não pode ser excluído antes do cancelamento do plano. Ao excluir a conta, os planos são cancelados e os dados são apagados.',
    },
  ],
  privacidade: [
    {
      title: '1. Quais dados coletamos',
      body: 'Nome, e-mail, telefone, data de nascimento e CPF que você informar; dados dos seus pets; histórico de agendamentos; e os 4 últimos números dos cartões. O número completo do cartão não fica salvo no app.',
    },
    {
      title: '2. Para que usamos',
      body: 'Para ativar e cobrar os planos, agendar serviços, enviar lembretes de consultas e vacinas e falar com você pelo suporte.',
    },
    {
      title: '3. Com quem compartilhamos',
      body: 'Com as clínicas e parceiros da rede credenciada, só o necessário para realizar o atendimento do seu pet, e com o processador de pagamentos.',
    },
    {
      title: '4. Notificações',
      body: 'Você escolhe quais avisos recebe em Perfil › Notificações e pode desligar as ofertas a qualquer momento.',
    },
    {
      title: '5. Seus direitos (LGPD)',
      body: 'Você pode ver, corrigir ou apagar seus dados. Dados pessoais podem ser editados em Perfil › Dados pessoais, e a conta pode ser excluída em Perfil › Segurança.',
    },
  ],
};

const C = theme.colors;
const F = theme.fonts;

export default function PrivateTermsScreen({
  onBack,
  onNavigateToHome,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  onNavigateToHelp,
  initialTab = 'termos',
  showBottomNav = true,
}: PrivateTermsScreenProps) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [open, setOpen] = useState<string | null>(CONTENT[initialTab][0].title);

  const toggle = (title: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((current) => (current === title ? null : title));
  };

  return (
    <SafeAreaView style={styles.container}>
      <PrivateHeader title="Termos e privacidade" onBack={onBack} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.tabs}>
          {(['termos', 'privacidade'] as Tab[]).map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.tab, tab === option && styles.tabActive]}
              onPress={() => {
                setTab(option);
                setOpen(CONTENT[option][0].title);
              }}
            >
              <Text style={[styles.tabText, tab === option && styles.tabTextActive]}>
                {option === 'termos' ? 'Termos de uso' : 'Privacidade'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.updated}>Atualizado em {UPDATED_AT}</Text>

        <View style={styles.card}>
          {CONTENT[tab].map((section, index) => {
            const isOpen = open === section.title;
            return (
              <TouchableOpacity
                key={section.title}
                style={[styles.section, index < CONTENT[tab].length - 1 && styles.divider]}
                onPress={() => toggle(section.title)}
                activeOpacity={0.75}
              >
                <View style={styles.sectionRow}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Feather name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={C.muted} />
                </View>
                {isOpen && <Text style={styles.sectionBody}>{section.body}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {onNavigateToHelp && (
          <TouchableOpacity style={styles.helpRow} onPress={onNavigateToHelp}>
            <Text style={styles.helpText}>
              Dúvidas? <Text style={styles.helpLink}>Fale com a gente</Text>
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {showBottomNav && (
        <PrivateBottomNav
          currentRoute="PrivateProfile"
          onNavigateToHome={onNavigateToHome}
          onNavigateToPlans={onNavigateToPlans}
          onNavigateToBenefits={onNavigateToBenefits}
          onNavigateToProfile={onNavigateToProfile}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scrollContent: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 130 },
  tabs: { flexDirection: 'row', backgroundColor: C.divider, borderRadius: 12, padding: 4 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 9 },
  tabActive: { backgroundColor: C.card },
  tabText: { fontSize: 13, fontFamily: F.semibold, color: C.muted },
  tabTextActive: { fontFamily: F.bold, color: C.navy },
  updated: { fontSize: 11, fontFamily: F.regular, color: C.muted, marginVertical: 12 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, paddingHorizontal: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: C.divider },
  section: { paddingVertical: 13 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionTitle: { flex: 1, fontSize: 14, fontFamily: F.bold, color: C.navy },
  sectionBody: { fontSize: 13, fontFamily: F.regular, color: C.textSecondary, lineHeight: 20, marginTop: 8 },
  helpRow: { alignItems: 'center', paddingVertical: 18 },
  helpText: { fontSize: 13, fontFamily: F.regular, color: C.muted },
  helpLink: { fontFamily: F.bold, color: C.primary },
});