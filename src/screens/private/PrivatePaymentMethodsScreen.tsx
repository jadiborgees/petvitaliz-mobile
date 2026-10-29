import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Switch,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';

interface PrivatePaymentMethodsScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

export default function PrivatePaymentMethodsScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: PrivatePaymentMethodsScreenProps) {
  // Estados do fluxo: 'list' (ou 'empty' se não houver cartões) | 'add' | 'edit' | 'delete'
  const [viewState, setViewState] = useState<'empty' | 'list' | 'add' | 'edit' | 'delete'>('list');
  
  // Menu popup do cartão salvo
  const [menuVisible, setMenuVisible] = useState(false);

  // Campos do formulário
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveForFuture, setSaveForFuture] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (viewState !== 'list' && viewState !== 'empty') {
              setViewState('list');
            } else if (onBack) {
              onBack();
            }
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {viewState === 'add' && 'Adicionar Cartão'}
          {viewState === 'edit' && 'Editar cartão'}
          {viewState === 'delete' && 'Excluir'}
          {(viewState === 'list' || viewState === 'empty') && 'Formas de Pagamento'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ============================================================ */}
        {/* TELA 1: ESTADO VAZIO (NENHUM CARTÃO CADASTRADO)             */}
        {/* ============================================================ */}
        {viewState === 'empty' && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="card-outline" size={40} color="#21479B" />
            </View>
            <Text style={styles.emptyTitle}>Nenhum cartão cadastrado</Text>
            <Text style={styles.emptySubtitle}>
              Adicione um cartão de crédito para facilitar o pagamento dos seus planos e serviços.
            </Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={() => setViewState('add')}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.primaryBtnText}>Adicionar Cartão</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================ */}
        {/* TELA 2: LISTA DE CARTÕES SALVOS                             */}
        {/* ============================================================ */}
        {viewState === 'list' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cartões salvos</Text>
              <Text style={styles.sectionSubtitle}>Gerencie seus cartões e formas de pagamento</Text>
            </View>

            {/* Cartão Visual Estilizado */}
            <View style={styles.creditCard}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardBrandText}>Cartão de crédito</Text>
                <View style={styles.cardTopRight}>
                  <View style={styles.principalBadge}>
                    <Text style={styles.principalBadgeText}>Principal</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setMenuVisible(!menuVisible)}
                    style={styles.menuDotsBtn}
                  >
                    <Ionicons name="ellipsis-vertical" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Menu Popup de Ações (Editar / Excluir) */}
              {menuVisible && (
                <View style={styles.popupMenu}>
                  <TouchableOpacity
                    style={styles.popupItem}
                    onPress={() => {
                      setMenuVisible(false);
                      setViewState('edit');
                    }}
                  >
                    <Ionicons name="pencil-outline" size={16} color="#0F172A" />
                    <Text style={styles.popupItemText}>Editar cartão</Text>
                  </TouchableOpacity>
                  <View style={styles.popupDivider} />
                  <TouchableOpacity
                    style={styles.popupItem}
                    onPress={() => {
                      setMenuVisible(false);
                      setViewState('delete');
                    }}
                  >
                    <Ionicons name="trash-outline" size={16} color="#DC2626" />
                    <Text style={[styles.popupItemText, { color: '#DC2626' }]}>Excluir cartão</Text>
                  </TouchableOpacity>
                </View>
              )}

              <Text style={styles.cardNumberText}>••••   ••••   ••••   1234</Text>

              <View style={styles.cardBottomRow}>
                <View>
                  <Text style={styles.cardHolderLabel}>Jadi Borges</Text>
                  <Text style={styles.cardExpiryText}>Visa • Vence 08/29</Text>
                </View>
                <Text style={styles.visaLogoText}>VISA</Text>
              </View>
            </View>

            {/* Botão Adicionar Novo Método */}
            <TouchableOpacity
              style={styles.addMethodBtn}
              activeOpacity={0.8}
              onPress={() => setViewState('add')}
            >
              <Ionicons name="add" size={18} color="#21479B" />
              <Text style={styles.addMethodBtnText}>Adicionar novo método</Text>
            </TouchableOpacity>

            {/* Nota de Segurança */}
            <View style={styles.securityBox}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#21479B" style={{ marginRight: 10 }} />
              <Text style={styles.securityText}>
                Seus dados estão seguros. Usamos criptografia de ponta a ponta para proteger suas informações financeiras.
              </Text>
            </View>
          </>
        )}

        {/* ============================================================ */}
        {/* TELA 3: ADICIONAR / EDITAR CARTÃO                           */}
        {/* ============================================================ */}
        {(viewState === 'add' || viewState === 'edit') && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Número do cartão</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor="#94A3B8"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                />
                <Ionicons name="card-outline" size={18} color="#94A3B8" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome no cartão</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Como está escrito no cartão"
                  placeholderTextColor="#94A3B8"
                  value={cardName}
                  onChangeText={setCardName}
                />
                <Ionicons name="person-outline" size={18} color="#94A3B8" />
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Validade</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="MM/AA"
                  placeholderTextColor="#94A3B8"
                  value={cardExpiry}
                  onChangeText={setCardExpiry}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>CVV</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry
                    value={cardCvv}
                    onChangeText={setCardCvv}
                    keyboardType="numeric"
                  />
                  <Ionicons name="eye-off-outline" size={18} color="#94A3B8" />
                </View>
              </View>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Salvar cartão para próximas cobranças</Text>
              <Switch
                value={saveForFuture}
                onValueChange={setSaveForFuture}
                trackColor={{ false: '#CBD5E1', true: '#21479B' }}
              />
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={() => setViewState('list')}
            >
              <Text style={styles.primaryBtnText}>
                {viewState === 'add' ? 'Adicionar cartão' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* ============================================================ */}
        {/* TELA 4: CONFIRMAÇÃO DE EXCLUSÃO                             */}
        {/* ============================================================ */}
        {viewState === 'delete' && (
          <View style={styles.deleteContainer}>
            <View style={styles.deleteIconCircle}>
              <Ionicons name="trash-outline" size={32} color="#DC2626" />
            </View>

            <Text style={styles.deleteTitle}>Tem certeza que deseja excluir este cartão?</Text>
            <Text style={styles.deleteSubtitle}>
              Você vai precisar adicioná-lo futuramente para fazer novas compras.
            </Text>

            {/* Mini Card Preview */}
            <View style={styles.miniCardPreview}>
              <View style={styles.miniCardRow}>
                <Text style={styles.miniCardVisa}>VISA</Text>
                <Text style={styles.miniCardDots}>•••• •••• •••• 1234</Text>
              </View>
              <Text style={styles.miniCardName}>Jadi Borges</Text>
              <Text style={styles.miniCardDate}>12/28</Text>
            </View>

            <TouchableOpacity
              style={styles.deleteBtn}
              activeOpacity={0.85}
              onPress={() => setViewState('empty')}
            >
              <Text style={styles.deleteBtnText}>Excluir cartão</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={0.8}
              onPress={() => setViewState('list')}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Componente Fixo de Navegação */}
      <PrivateBottomNav
        currentRoute="PrivateProfile"
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
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#21479B' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 110 },

  /* Estado Vazio */
  emptyContainer: { alignItems: 'center', marginTop: 40, paddingHorizontal: 20 },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  emptySubtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 18, marginBottom: 24 },

  /* Lista & Cartão */
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  sectionSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  creditCard: {
    backgroundColor: '#21479B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    height: 180,
    justifyContent: 'space-between',
    elevation: 4,
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBrandText: { color: '#93C5FD', fontSize: 12, fontWeight: '700' },
  cardTopRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  principalBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  principalBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  menuDotsBtn: { padding: 4 },
  popupMenu: {
    position: 'absolute',
    top: 45,
    right: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 6,
    width: 140,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    zIndex: 10,
  },
  popupItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  popupItemText: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  popupDivider: { height: 1, backgroundColor: '#F1F5F9' },
  cardNumberText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardHolderLabel: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  cardExpiryText: { color: '#93C5FD', fontSize: 10, marginTop: 2 },
  visaLogoText: { color: '#FFFFFF', fontSize: 18, fontWeight: '900', fontStyle: 'italic' },

  addMethodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#21479B',
    borderStyle: 'dashed',
    borderRadius: 16,
    height: 50,
    gap: 8,
    marginBottom: 20,
  },
  addMethodBtnText: { color: '#21479B', fontWeight: '800', fontSize: 13 },
  securityBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  securityText: { fontSize: 11, color: '#64748B', flex: 1, lineHeight: 16 },

  /* Formulário */
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#64748B', marginBottom: 6 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  input: { flex: 1, fontSize: 13, color: '#0F172A', fontWeight: '500' },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 13,
    color: '#0F172A',
  },
  rowInputs: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12, marginBottom: 24 },
  switchLabel: { fontSize: 12, color: '#64748B', fontWeight: '500' },

  primaryBtn: {
    backgroundColor: '#21479B',
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },

  /* Excluir */
  deleteContainer: { alignItems: 'center', paddingVertical: 20 },
  deleteIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  deleteTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 8 },
  deleteSubtitle: { fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 24, paddingHorizontal: 20 },
  miniCardPreview: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 24,
  },
  miniCardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  miniCardVisa: { fontSize: 14, fontWeight: '900', color: '#21479B' },
  miniCardDots: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  miniCardName: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  miniCardDate: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  deleteBtn: {
    backgroundColor: '#DC2626',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  deleteBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  cancelBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cancelBtnText: { color: '#0F172A', fontWeight: '800', fontSize: 13 },
});