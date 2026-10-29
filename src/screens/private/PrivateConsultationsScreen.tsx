import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';

interface PrivateConsultationsScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

type ScreenMode = 
  | 'list' 
  | 'selectPetModal' 
  | 'details' 
  | 'history' 
  | 'step1' 
  | 'step2' 
  | 'step3' 
  | 'step4' 
  | 'step5' 
  | 'success';

export default function PrivateConsultationsScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: PrivateConsultationsScreenProps) {
  const [mode, setMode] = useState<ScreenMode>('list');
  const [activeTab, setActiveTab] = useState<'consultas' | 'historico'>('consultas');

  // Estados do agendamento
  const [selectedService, setSelectedService] = useState('Consulta Veterinária');
  const [selectedDate, setSelectedDate] = useState('Qui, 11/09');
  const [selectedTime, setSelectedTime] = useState('15:30');
  const [selectedDoctor, setSelectedDoctor] = useState('Dra. Mariana Lima');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (mode === 'details' || mode === 'step1' || mode === 'success') {
              setMode('list');
            } else if (mode === 'step2') {
              setMode('step1');
            } else if (mode === 'step3') {
              setMode('step2');
            } else if (mode === 'step4') {
              setMode('step3');
            } else if (mode === 'step5') {
              setMode('step4');
            } else if (onBack) {
              onBack();
            }
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode.startsWith('step') || mode === 'success' ? 'Agendamento' : 'Consultas'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ============================================================ */}
        {/* 1. LISTA PRINCIPAL DE CONSULTAS                              */}
        {/* ============================================================ */}
        {mode === 'list' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionMainTitle}>Gerencie suas consultas</Text>
              <Text style={styles.sectionSubtitle}>Consulte seus agendamentos e o histórico de atendimentos.</Text>
            </View>

            {/* Pet Selecionado Card */}
            <TouchableOpacity
              style={styles.selectedPetCard}
              activeOpacity={0.8}
              onPress={() => setMode('selectPetModal')}
            >
              <Image source={require('../../assets/Explorar2.png')} style={styles.petAvatar} />
              <View style={styles.petInfoText}>
                <View style={styles.petNameRow}>
                  <Text style={styles.petCardName}>Lua</Text>
                  <View style={styles.goldBadge}>
                    <Ionicons name="ribbon-outline" size={10} color="#B45309" />
                    <Text style={styles.goldBadgeText}>PLANO OURO</Text>
                  </View>
                </View>
                <Text style={styles.petCardDetails}>Cachorro · Golden Retriever</Text>
                <Text style={styles.petCardSubDetails}>4 anos · Fêmea</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Abas Consultas / Histórico */}
            <View style={styles.tabsRow}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'consultas' && styles.activeTabButton]}
                onPress={() => setActiveTab('consultas')}
              >
                <Text style={[styles.tabText, activeTab === 'consultas' && styles.activeTabText]}>Consultas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'historico' && styles.activeTabButton]}
                onPress={() => setActiveTab('historico')}
              >
                <Text style={[styles.tabText, activeTab === 'historico' && styles.activeTabText]}>Histórico</Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'consultas' ? (
              <>
                {/* Card de Consulta Agendada */}
                <View style={styles.consultCard}>
                  <View style={styles.consultCardTop}>
                    <View style={styles.badgeScheduled}>
                      <Text style={styles.badgeScheduledText}>AGENDADA</Text>
                    </View>
                    <Text style={styles.consultCode}>Código: #PV24892</Text>
                  </View>

                  <View style={styles.doctorRow}>
                    <Image source={require('../../assets/Explorar2.png')} style={styles.doctorAvatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.doctorName}>Dra. Mariana Lima</Text>
                      <Text style={styles.clinicName}>Clínica Veterinária PetVitaliz</Text>
                    </View>
                  </View>

                  <View style={styles.consultInfoRow}>
                    <View style={styles.infoItem}>
                      <Ionicons name="calendar-outline" size={14} color="#64748B" />
                      <Text style={styles.infoItemText}>27 Nov 2026</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Ionicons name="time-outline" size={14} color="#64748B" />
                      <Text style={styles.infoItemText}>14:00</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Ionicons name="medical-outline" size={14} color="#64748B" />
                      <Text style={styles.infoItemText}>Consulta Veterinária</Text>
                    </View>
                  </View>

                  <View style={styles.cardDivider} />

                  <TouchableOpacity
                    style={styles.detailsLinkRow}
                    onPress={() => setMode('details')}
                  >
                    <Text style={styles.detailsLinkText}>Ver detalhes</Text>
                    <Ionicons name="chevron-forward" size={14} color="#21479B" />
                  </TouchableOpacity>
                </View>

                {/* Botão Agendar Consulta */}
                <TouchableOpacity
                  style={styles.primaryBtn}
                  activeOpacity={0.85}
                  onPress={() => setMode('step1')}
                >
                  <Text style={styles.primaryBtnText}>Agendar consulta</Text>
                </TouchableOpacity>
              </>
            ) : (
              /* Histórico Vazio ou Preenchido */
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="document-text-outline" size={36} color="#21479B" />
                </View>
                <Text style={styles.emptyTitle}>Nenhum histórico disponível</Text>
                <Text style={styles.emptySubtitle}>Aqui aparecerão as consultas já realizadas com o seu Pet.</Text>
              </View>
            )}
          </>
        )}

        {/* ============================================================ */}
        {/* 2. MODAL: SELECIONAR PET                                     */}
        {/* ============================================================ */}
        {mode === 'selectPetModal' && (
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Selecione o seu pet</Text>
            <Text style={styles.modalSub}>Escolha o pet para ver as informações.</Text>

            <TouchableOpacity style={styles.petOptionSelected} activeOpacity={0.9}>
              <Image source={require('../../assets/Explorar2.png')} style={styles.petAvatar} />
              <View style={styles.petInfoText}>
                <View style={styles.petNameRow}>
                  <Text style={styles.petCardName}>Lua</Text>
                  <View style={styles.goldBadge}>
                    <Ionicons name="ribbon-outline" size={10} color="#B45309" />
                    <Text style={styles.goldBadgeText}>PLANO OURO</Text>
                  </View>
                </View>
                <Text style={styles.petCardDetails}>Cachorro · Golden Retriever</Text>
                <Text style={styles.petCardSubDetails}>4 anos · Fêmea</Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color="#21479B" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setMode('list')}
            >
              <Text style={styles.primaryBtnText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================ */}
        {/* 3. DETALHES DA CONSULTA                                      */}
        {/* ============================================================ */}
        {mode === 'details' && (
          <>
            <Text style={styles.sectionMainTitle}>Detalhes da consulta</Text>
            <Text style={styles.sectionSubtitle}>Confira todas as informações do seu agendamento.</Text>

            <View style={styles.consultCard}>
              <View style={styles.consultCardTop}>
                <View style={styles.badgeScheduled}><Text style={styles.badgeScheduledText}>AGENDADA</Text></View>
                <Text style={styles.consultCode}>Código: #PV24892</Text>
              </View>
              <View style={styles.petCardItemMini}>
                <Image source={require('../../assets/Explorar2.png')} style={styles.petAvatar} />
                <View style={styles.petInfoText}>
                  <View style={styles.petNameRow}>
                    <Text style={styles.petCardName}>Lua</Text>
                    <View style={styles.goldBadge}><Text style={styles.goldBadgeText}>PLANO OURO</Text></View>
                  </View>
                  <Text style={styles.petCardDetails}>Cachorro · Golden Retriever</Text>
                  <Text style={styles.petCardSubDetails}>4 anos · Fêmea</Text>
                </View>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Serviço</Text><Text style={styles.detailVal}>Consulta Veterinária</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Data</Text><Text style={styles.detailVal}>Sex, 27/11</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Horário</Text><Text style={styles.detailVal}>15:30</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Profissional</Text><Text style={styles.detailVal}>Dra. Mariana Lima</Text></View>
            </View>

            <View style={styles.tipBox}>
              <Ionicons name="information-circle-outline" size={18} color="#21479B" />
              <Text style={styles.tipText}>Se precisar, você pode reagendar ou cancelar sua consulta até 24 horas antes do horário marcado.</Text>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => setMode('step1')}>
              <Text style={styles.primaryBtnText}>Reagendar consulta</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ============================================================ */}
        {/* 4. FLUXO DE AGENDAMENTO (ETAPAS 1 A 5)                       */}
        {/* ============================================================ */}
        {mode === 'step1' && (
          <>
            <View style={styles.progressBarRow}>
              {[1, 2, 3, 4, 5].map((st) => (
                <View key={st} style={[styles.progressDot, st === 1 && styles.activeProgressDot]}>
                  <Text style={[styles.progressDotText, st === 1 && styles.activeProgressDotText]}>{st}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionMainTitle}>Escolha o serviço</Text>
            <Text style={styles.sectionSubtitle}>Selecione o atendimento que seu pet precisa.</Text>

            <TouchableOpacity 
              style={[styles.serviceCard, selectedService === 'Consulta Veterinária' && styles.selectedServiceCard]} 
              onPress={() => setSelectedService('Consulta Veterinária')}
            >
              <Ionicons name="medical-outline" size={20} color="#21479B" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.serviceTitle}>Consulta Veterinária</Text>
                <Text style={styles.serviceDesc}>Rotina e acompanhamento clínico</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => setMode('step2')}>
              <Text style={styles.primaryBtnText}>Continuar</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Etapa 2: Escolha a data */}
        {mode === 'step2' && (
          <>
            <View style={styles.progressBarRow}>
              {[1, 2, 3, 4, 5].map((st) => (
                <View key={st} style={[styles.progressDot, st <= 2 && styles.activeProgressDot]}>
                  <Text style={[styles.progressDotText, st <= 2 && styles.activeProgressDotText]}>{st}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionMainTitle}>Escolha uma data</Text>
            <Text style={styles.sectionSubtitle}>Selecione o dia que melhor se encaixa na sua rotina.</Text>

            <View style={styles.calendarBox}>
              <Text style={styles.calendarMonthText}>Setembro 2026</Text>
              <View style={styles.calendarGrid}>
                {[11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.calendarDay, d === 11 && styles.selectedCalendarDay]}
                    onPress={() => setSelectedDate(`Qui, ${d}/09`)}
                  >
                    <Text style={[styles.calendarDayText, d === 11 && styles.selectedCalendarDayText]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => setMode('step3')}>
              <Text style={styles.primaryBtnText}>Continuar</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Etapa 3: Qual horário você prefere? */}
        {mode === 'step3' && (
          <>
            <View style={styles.progressBarRow}>
              {[1, 2, 3, 4, 5].map((st) => (
                <View key={st} style={[styles.progressDot, st <= 3 && styles.activeProgressDot]}>
                  <Text style={[styles.progressDotText, st <= 3 && styles.activeProgressDotText]}>{st}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionMainTitle}>Qual horário você prefere?</Text>
            <Text style={styles.sectionSubtitle}>Confira os horários disponíveis para o dia selecionado.</Text>

            <View style={styles.timeGrid}>
              {['09:00', '10:30', '11:00', '14:00', '15:30', '16:00', '17:30'].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeSlot, selectedTime === t && styles.selectedTimeSlot]}
                  onPress={() => setSelectedTime(t)}
                >
                  <Text style={[styles.timeSlotText, selectedTime === t && styles.selectedTimeSlotText]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => setMode('step4')}>
              <Text style={styles.primaryBtnText}>Continuar</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Etapa 4: Escolha o profissional */}
        {mode === 'step4' && (
          <>
            <View style={styles.progressBarRow}>
              {[1, 2, 3, 4, 5].map((st) => (
                <View key={st} style={[styles.progressDot, st <= 4 && styles.activeProgressDot]}>
                  <Text style={[styles.progressDotText, st <= 4 && styles.activeProgressDotText]}>{st}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionMainTitle}>Escolha o profissional</Text>
            <Text style={styles.sectionSubtitle}>Selecione o veterinário que irá atender seu pet.</Text>

            <TouchableOpacity
              style={[styles.doctorOptionCard, selectedDoctor === 'Dra. Mariana Lima' && styles.selectedDoctorCard]}
              onPress={() => setSelectedDoctor('Dra. Mariana Lima')}
            >
              <View style={styles.radioIndicator}>
                {selectedDoctor === 'Dra. Mariana Lima' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.doctorOptionName}>Dra. Mariana Lima</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.doctorOptionCard, selectedDoctor === 'Dr. Carlos Mendes' && styles.selectedDoctorCard]}
              onPress={() => setSelectedDoctor('Dr. Carlos Mendes')}
            >
              <View style={styles.radioIndicator}>
                {selectedDoctor === 'Dr. Carlos Mendes' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.doctorOptionName}>Dr. Carlos Mendes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => setMode('step5')}>
              <Text style={styles.primaryBtnText}>Continuar</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Etapa 5: Resumo do agendamento */}
        {mode === 'step5' && (
          <>
            <View style={styles.progressBarRow}>
              {[1, 2, 3, 4, 5].map((st) => (
                <View key={st} style={[styles.progressDot, styles.activeProgressDot]}>
                  <Text style={[styles.progressDotText, styles.activeProgressDotText]}>{st}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionMainTitle}>Resumo do agendamento</Text>
            <Text style={styles.sectionSubtitle}>Confira as informações antes de confirmar.</Text>

            <View style={styles.consultCard}>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Serviço</Text><Text style={styles.detailVal}>{selectedService}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Data</Text><Text style={styles.detailVal}>{selectedDate}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Horário</Text><Text style={styles.detailVal}>{selectedTime}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Profissional</Text><Text style={styles.detailVal}>{selectedDoctor}</Text></View>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => setMode('success')}>
              <Text style={styles.primaryBtnText}>Confirmar Agendamento</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ============================================================ */}
        {/* 5. TELA DE SUCESSO                                           */}
        {/* ============================================================ */}
        {mode === 'success' && (
          <View style={styles.successContainer}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Agendamento confirmado!</Text>
            <Text style={styles.successSubtitle}>Tudo pronto para o atendimento da Lua.</Text>
            <Text style={styles.codeBadgeText}>Código: #PV-84920</Text>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => setMode('list')}>
              <Text style={styles.primaryBtnText}>Meus Agendamentos</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Navegação Inferior Privada */}
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

  sectionHeader: { marginBottom: 16 },
  sectionMainTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  sectionSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },

  selectedPetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  petAvatar: { width: 50, height: 50, borderRadius: 12 },
  petInfoText: { flex: 1, marginLeft: 12 },
  petNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  petCardName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  goldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  goldBadgeText: { fontSize: 8, fontWeight: '800', color: '#B45309' },
  petCardDetails: { fontSize: 11, color: '#64748B', marginTop: 2 },
  petCardSubDetails: { fontSize: 10, color: '#94A3B8', marginTop: 1 },

  tabsRow: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4, marginBottom: 20 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTabButton: { backgroundColor: '#FFFFFF', elevation: 1 },
  tabText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  activeTabText: { color: '#21479B', fontWeight: '800' },

  consultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    elevation: 2,
  },
  consultCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badgeScheduled: { backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeScheduledText: { fontSize: 9, fontWeight: '800', color: '#21479B' },
  consultCode: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  doctorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  doctorAvatar: { width: 40, height: 40, borderRadius: 20 },
  doctorName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  clinicName: { fontSize: 11, color: '#64748B' },
  consultInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoItemText: { fontSize: 11, color: '#475569', fontWeight: '600' },
  cardDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },
  detailsLinkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailsLinkText: { fontSize: 12, fontWeight: '700', color: '#21479B' },

  primaryBtn: {
    backgroundColor: '#21479B',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '100%',
    elevation: 2,
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },

  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  emptySubtitle: { fontSize: 12, color: '#64748B', textAlign: 'center', paddingHorizontal: 20 },

  modalContainer: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  modalSub: { fontSize: 12, color: '#64748B', marginBottom: 20 },
  petOptionSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#21479B',
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
  },

  petCardItemMini: { flexDirection: 'row', alignItems: 'center' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  detailLabel: { fontSize: 12, color: '#64748B' },
  detailVal: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  tipText: { fontSize: 11, color: '#64748B', flex: 1, lineHeight: 16 },

  progressBarRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 },
  progressDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  activeProgressDot: { backgroundColor: '#21479B' },
  progressDotText: { fontSize: 11, fontWeight: '700', color: '#64748B' },
  activeProgressDotText: { color: '#FFFFFF' },

  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  selectedServiceCard: { borderColor: '#21479B', borderWidth: 2, backgroundColor: '#F8FAFC' },
  serviceTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  serviceDesc: { fontSize: 11, color: '#64748B', marginTop: 2 },

  calendarBox: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  calendarMonthText: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 12, textAlign: 'center' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  calendarDay: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  selectedCalendarDay: { backgroundColor: '#21479B' },
  calendarDayText: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  selectedCalendarDayText: { color: '#FFFFFF' },

  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  timeSlot: { flexBasis: '30%', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  selectedTimeSlot: { backgroundColor: '#21479B', borderColor: '#21479B' },
  timeSlotText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  selectedTimeSlotText: { color: '#FFFFFF' },

  doctorOptionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12, gap: 12 },
  selectedDoctorCard: { borderColor: '#21479B', borderWidth: 2, backgroundColor: '#F8FAFC' },
  radioIndicator: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#21479B', alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#21479B' },
  doctorOptionName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },

  successContainer: { alignItems: 'center', paddingVertical: 30 },
  successIconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#21479B', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  successSubtitle: { fontSize: 12, color: '#64748B', marginBottom: 16 },
  codeBadgeText: { fontSize: 12, fontWeight: '700', color: '#21479B', marginBottom: 30 },
});