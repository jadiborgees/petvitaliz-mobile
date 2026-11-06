
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';

type Invoice = {
  id: string;
  description: string;
  dueDate: string;
  amount: number;
  status: 'Paga' | 'Pendente';
};

interface Props {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToExplore: () => void;
  onNavigateToPlans: () => void;
  onNavigateToBenefits: () => void;
  onNavigateToProfile: () => void;
  onPayInvoice?: (invoice: Invoice) => void;
  invoices?: Invoice[];
}

const BLUE = '#315BA8';
const NAVY = '#183B72';
const MUTED = '#71809A';
const GREEN = '#16865B';

const money = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export default function PrivateInvoicesScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  onPayInvoice,
  invoices = [],
}: Props) {
  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status === 'Pendente'
  );

  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === 'Paga'
  );

  const renderInvoice = (invoice: Invoice) => {
    const isPaid = invoice.status === 'Paga';

    return (
      <View key={invoice.id} style={styles.invoiceCard}>
        <View style={styles.invoiceTop}>
          <View style={styles.invoiceIcon}>
            <Feather
              name="file-text"
              size={20}
              color={BLUE}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.invoiceDescription}>
              {invoice.description}
            </Text>

            <Text style={styles.invoiceDate}>
              {isPaid ? 'Data de pagamento: ' : 'Vencimento: '}
              {invoice.dueDate}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              isPaid ? styles.paidBadge : styles.pendingBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: isPaid ? GREEN : '#9A6200' },
              ]}
            >
              {invoice.status}
            </Text>
          </View>
        </View>

        <View style={styles.invoiceDivider} />

        <View style={styles.invoiceBottom}>
          <View>
            <Text style={styles.amountLabel}>Valor da fatura</Text>
            <Text style={styles.amount}>{money(invoice.amount)}</Text>
          </View>

          {!isPaid && (
            <TouchableOpacity
              style={styles.payButton}
              activeOpacity={0.8}
              onPress={() => {
                if (onPayInvoice) {
                  onPayInvoice(invoice);
                }
              }}
            >
              <Text style={styles.payButtonText}>PAGAR</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color={NAVY} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Faturas</Text>

          <View style={{ width: 40 }} />
        </View>

        <View style={styles.intro}>
          <Text style={styles.title}>Suas faturas</Text>
          <Text style={styles.subtitle}>
            Consulte os pagamentos do seu plano PetVitaliz.
          </Text>
        </View>

        {invoices.length > 0 ? (
          <>
            {pendingInvoices.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeading}>
                  <Text style={styles.sectionTitle}>Em aberto</Text>
                  <View style={styles.pendingCount}>
                    <Text style={styles.pendingCountText}>
                      {pendingInvoices.length}
                    </Text>
                  </View>
                </View>

                {pendingInvoices.map(renderInvoice)}
              </View>
            )}

            {paidInvoices.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Histórico de pagamentos</Text>

                {paidInvoices.map(renderInvoice)}
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Feather name="file-text" size={35} color={BLUE} />
            </View>

            <Text style={styles.emptyTitle}>
              Nenhuma fatura disponível
            </Text>

            <Text style={styles.emptyDescription}>
              Quando houver cobranças do seu plano, as faturas aparecerão
              nesta página.
            </Text>
          </View>
        )}
      </ScrollView>

      <PrivateBottomNav
        currentRoute="PrivateMyPlan"
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
    backgroundColor: '#F6F8FC',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    height: 62,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F6',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    color: NAVY,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  intro: {
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 22,
  },
  title: {
    fontSize: 21,
    color: NAVY,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  subtitle: {
    fontSize: 12,
    color: MUTED,
    marginTop: 6,
    lineHeight: 18,
  },
  section: {
    marginHorizontal: 18,
    marginBottom: 25,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 13,
  },
  sectionTitle: {
    fontSize: 15,
    color: NAVY,
    marginBottom: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  pendingCount: {
    backgroundColor: '#FFF0D5',
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingCountText: {
    fontSize: 10,
    color: '#9A6200',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  invoiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDF0F5',
  },
  invoiceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  invoiceIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceDescription: {
    fontSize: 12,
    color: '#263B5E',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  invoiceDate: {
    fontSize: 10,
    color: MUTED,
    marginTop: 5,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 15,
  },
  paidBadge: {
    backgroundColor: '#E8F7EF',
  },
  pendingBadge: {
    backgroundColor: '#FFF4DB',
  },
  statusText: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  invoiceDivider: {
    height: 1,
    backgroundColor: '#EEF1F6',
    marginVertical: 15,
  },
  invoiceBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountLabel: {
    fontSize: 10,
    color: MUTED,
  },
  amount: {
    fontSize: 17,
    color: NAVY,
    marginTop: 4,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  payButton: {
    backgroundColor: BLUE,
    minWidth: 95,
    height: 39,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    padding: 27,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDF0F5',
  },
  emptyIcon: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },
  emptyTitle: {
    fontSize: 17,
    color: NAVY,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  emptyDescription: {
    fontSize: 11,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 9,
  },
});
