import React, { useMemo, useState } from 'react';
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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';
import type { Pet } from './PrivatePetsFlowScreen';

export type ConsultationAppointment = {
  id: string;
  code: string;
  petId: string;
  petName: string;
  service: string;
  date: string; // ISO: YYYY-MM-DD
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
};

type Subscription = {
  petId: string;
  planId: string;
  planName: string;
  status: 'paid' | 'pending';
};

interface PrivateConsultationsScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  pets: Pet[];
  subscription: Subscription | null;
  appointments: ConsultationAppointment[];
  onAppointmentsChange: React.Dispatch<React.SetStateAction<ConsultationAppointment[]>>;
}

type Mode = 'list' | 'details' | 'step1' | 'step2' | 'step3' | 'success';
type Tab = 'consultas' | 'historico';

const SERVICE_NAME = 'Consulta veterinária';
const TIME_OPTIONS = ['09:00', '10:30', '11:00', '14:00', '15:30', '16:00'];

const formatDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });
};

const formatLongDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const getPlanLabel = (planId?: string | null) => {
  if (!planId) return 'SEM PLANO';
  const normalized = planId.toLowerCase();
  if (normalized.includes('bronze')) return 'PLANO BRONZE';
  if (normalized.includes('prata')) return 'PLANO PRATA';
  if (normalized.includes('ouro')) return 'PLANO OURO';
  if (normalized.includes('diamante')) return 'PLANO DIAMANTE';
  return `PLANO ${planId.toUpperCase()}`;
};

export default function PrivateConsultationsScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  pets,
  subscription,
  appointments,
  onAppointmentsChange,
}: PrivateConsultationsScreenProps) {
  const [mode, setMode] = useState<Mode>('list');
  const [activeTab, setActiveTab] = useState<Tab>('consultas');
  const [selectedPetId, setSelectedPetId] = useState<string | null>(pets[0]?.id ?? null);
  const [petPickerOpen, setPetPickerOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(TIME_OPTIONS[0]);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [lastSavedAppointment, setLastSavedAppointment] = useState<ConsultationAppointment | null>(null);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId) ?? pets[0] ?? null;

  const selectedSubscription = useMemo(() => {
    if (!selectedPet) return null;
    if (subscription?.petId === selectedPet.id && subscription.status === 'paid') {
      return subscription;
    }
    if (selectedPet.hasActivePlan && selectedPet.plan) {
      const plan = selectedPet.plan.toLowerCase();
      const planId = plan.includes('bronze') ? 'bronze'
        : plan.includes('prata') ? 'prata'
        : plan.includes('ouro') ? 'ouro'
        : plan.includes('diamante') ? 'diamante'
        : plan;
      return { petId: selectedPet.id, planId, planName: selectedPet.plan, status: 'paid' as const };
    }
    return null;
  }, [selectedPet, subscription]);

  const planId = selectedSubscription?.planId.toLowerCase() ?? '';
  const hasPlan = !!selectedSubscription;
  const hasConsultationAccess = hasPlan && ['bronze', 'prata', 'ouro', 'diamante'].includes(planId);

  const monthlyBronzeUsage = appointments.filter((item) => {
    if (item.petId !== selectedPet?.id || item.status === 'cancelled') return false;
    const now = new Date();
    const [year, month] = item.date.split('-').map(Number);
    return year === now.getFullYear() && month === now.getMonth() + 1;
  }).length;

  const isBronzeQuotaExhausted = planId === 'bronze' && monthlyBronzeUsage >= 1;

  const petAppointments = appointments.filter((item) => item.petId === selectedPet?.id);
  const upcomingAppointments = petAppointments.filter((item) => item.status === 'scheduled');
  const historyAppointments = petAppointments.filter((item) => item.status === 'completed');

  const selectedAppointment = appointments.find((item) => item.id === selectedAppointmentId) ?? null;

  const dates = useMemo(() => {
    const result: { iso: string; label: string; day: string }[] = [];
    const today = new Date();
    for (let i = 1; i <= 10; i += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      result.push({
        iso,
        label: date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
        day: String(date.getDate()),
      });
    }
    return result;
  }, []);

  const canManageAppointment = (appointment: ConsultationAppointment) => {
    const [year, month, day] = appointment.date.split('-').map(Number);
    const [hour, minute] = appointment.time.split(':').map(Number);
    const appointmentDate = new Date(year, month - 1, day, hour, minute);
    return appointmentDate.getTime() - Date.now() >= 24 * 60 * 60 * 1000;
  };

  const resetBooking = () => {
    setSelectedDate('');
    setSelectedTime(TIME_OPTIONS[0]);
    setIsRescheduling(false);
    setSelectedAppointmentId(null);
  };

  const beginBooking = (reschedule = false) => {
    if (!selectedPet) {
      Alert.alert('Cadastre um pet', 'Cadastre um pet antes de agendar uma consulta.');
      return;
    }
    if (!hasPlan) {
      Alert.alert('Pet sem plano', 'Este pet ainda não possui um plano ativo.', [
        { text: 'Agora não', style: 'cancel' },
        { text: 'Ver planos', onPress: onNavigateToPlans },
      ]);
      return;
    }
    if (!hasConsultationAccess) {
      Alert.alert('Serviço não incluso', 'Este serviço não está disponível no plano deste pet.', [
        { text: 'Entendi', style: 'cancel' },
        { text: 'Ver planos', onPress: onNavigateToPlans },
      ]);
      return;
    }
    if (isBronzeQuotaExhausted && !reschedule) {
      Alert.alert('Cota esgotada', 'A cota mensal de 1 atendimento veterinário básico deste plano já foi utilizada.');
      return;
    }
    setIsRescheduling(reschedule);
    setMode('step1');
  };

  const saveAppointment = () => {
    if (!selectedPet || !selectedDate || !selectedTime) return;

    if (isRescheduling && selectedAppointment) {
      const updated = { ...selectedAppointment, date: selectedDate, time: selectedTime };
      onAppointmentsChange((current) => current.map((item) => item.id === updated.id ? updated : item));
      setLastSavedAppointment(updated);
    } else {
      const id = `consult-${Date.now()}`;
      const created: ConsultationAppointment = {
        id,
        code: `PV-${String(Date.now()).slice(-6)}`,
        petId: selectedPet.id,
        petName: selectedPet.name,
        service: SERVICE_NAME,
        date: selectedDate,
        time: selectedTime,
        status: 'scheduled',
      };
      onAppointmentsChange((current) => [...current, created]);
      setLastSavedAppointment(created);
    }
    setMode('success');
  };

  const cancelAppointment = (appointment: ConsultationAppointment) => {
    if (!canManageAppointment(appointment)) {
      Alert.alert('Prazo encerrado', 'O cancelamento só pode ser feito até 24 horas antes do horário marcado.');
      return;
    }
    Alert.alert(
      'Cancelar consulta',
      'Deseja realmente cancelar esta consulta? A cota não será consumida.',
      [
        { text: 'Manter consulta', style: 'cancel' },
        {
          text: 'Cancelar consulta',
          style: 'destructive',
          onPress: () => {
            onAppointmentsChange((current) => current.map((item) =>
              item.id === appointment.id ? { ...item, status: 'cancelled' } : item
            ));
            setMode('list');
            Alert.alert('Consulta cancelada', 'Consulta cancelada. Sua cota não foi consumida.');
          },
        },
      ],
    );
  };

  const openDetails = (appointment: ConsultationAppointment) => {
    setSelectedAppointmentId(appointment.id);
    setMode('details');
  };

  const renderPetCard = (pet: Pet, selected = false, compact = false) => (
    <TouchableOpacity
      key={pet.id}
      style={[styles.petOption, selected && styles.petOptionSelected, compact && styles.petOptionCompact]}
      activeOpacity={0.85}
      onPress={() => {
        setSelectedPetId(pet.id);
        setPetPickerOpen(false);
      }}
    >
      {pet.avatar ? (
        <Image source={{ uri: pet.avatar }} style={styles.petAvatar} />
      ) : (
        <View style={styles.petAvatarPlaceholder}><Ionicons name="paw" size={22} color="#21479B" /></View>
      )}
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petDescription}>{pet.species} · {pet.breed}</Text>
        <Text style={styles.petDescription}>{getPlanLabel(
          subscription?.petId === pet.id && subscription.status === 'paid'
            ? subscription.planName
            : pet.hasActivePlan ? pet.plan : null
        )}</Text>
      </View>
      <Ionicons name={selected ? 'checkmark-circle' : 'chevron-forward'} size={20} color={selected ? '#21479B' : '#94A3B8'} />
    </TouchableOpacity>
  );

  const renderAppointmentCard = (appointment: ConsultationAppointment) => (
    <TouchableOpacity key={appointment.id} style={styles.appointmentCard} onPress={() => openDetails(appointment)} activeOpacity={0.85}>
      <View style={styles.cardTop}>
        <View style={styles.scheduledBadge}><Text style={styles.scheduledBadgeText}>AGENDADA</Text></View>
        <Text style={styles.codeText}>Código: {appointment.code}</Text>
      </View>
      <Text style={styles.appointmentService}>{appointment.service}</Text>
      <View style={styles.appointmentMeta}>
        <View style={styles.metaItem}><Ionicons name="calendar-outline" size={15} color="#64748B" /><Text style={styles.metaText}>{formatDate(appointment.date)}</Text></View>
        <View style={styles.metaItem}><Ionicons name="time-outline" size={15} color="#64748B" /><Text style={styles.metaText}>{appointment.time}</Text></View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.detailsLink}>Ver detalhes</Text>
        <Ionicons name="chevron-forward" size={16} color="#21479B" />
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = (title: string, description: string) => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}><Ionicons name="calendar-outline" size={32} color="#21479B" /></View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
    </View>
  );

  const showBottomNav = mode === 'list' || mode === 'details';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => {
          if (mode === 'step2') setMode('step1');
          else if (mode === 'step3') setMode('step2');
          else if (mode === 'step1' || mode === 'details' || mode === 'success') setMode('list');
          else onBack?.();
        }}>
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{mode.startsWith('step') || mode === 'success' ? 'Agendamento' : 'Consultas'}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {mode === 'list' && (
          <>
            <Text style={styles.heading}>Gerencie as consultas</Text>
            <Text style={styles.subtitle}>Acompanhe os agendamentos e o histórico de cada pet.</Text>

            {pets.length === 0 ? (
              <View style={styles.noPetCard}>
                <Ionicons name="paw-outline" size={30} color="#21479B" />
                <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
                <Text style={styles.emptyDescription}>Cadastre um pet no seu perfil para acessar as consultas.</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity style={styles.selectedPet} onPress={() => setPetPickerOpen((value) => !value)} activeOpacity={0.85}>
                  {selectedPet?.avatar ? (
                    <Image source={{ uri: selectedPet.avatar }} style={styles.petAvatar} />
                  ) : (
                    <View style={styles.petAvatarPlaceholder}><Ionicons name="paw" size={22} color="#21479B" /></View>
                  )}
                  <View style={styles.petInfo}>
                    <Text style={styles.petName}>{selectedPet?.name}</Text>
                    <Text style={styles.petDescription}>{selectedPet?.species} · {selectedPet?.breed}</Text>
                    <Text style={styles.planBadgeText}>{getPlanLabel(selectedSubscription?.planName ?? (selectedPet?.hasActivePlan ? selectedPet.plan : null))}</Text>
                  </View>
                  <Ionicons name={petPickerOpen ? 'chevron-up' : 'chevron-down'} size={21} color="#21479B" />
                </TouchableOpacity>

                {petPickerOpen && (
                  <View style={styles.petPicker}>
                    {pets.map((pet) => renderPetCard(pet, pet.id === selectedPet?.id, true))}
                  </View>
                )}

                {!hasPlan && (
                  <View style={styles.noticeBox}>
                    <Ionicons name="lock-closed-outline" size={18} color="#B45309" />
                    <Text style={styles.noticeText}>Este pet está sem plano ativo. Contrate um plano para acessar os serviços cobertos.</Text>
                    <TouchableOpacity onPress={onNavigateToPlans}><Text style={styles.noticeAction}>Ver planos</Text></TouchableOpacity>
                  </View>
                )}

                <View style={styles.tabs}>
                  <TouchableOpacity style={[styles.tab, activeTab === 'consultas' && styles.activeTab]} onPress={() => setActiveTab('consultas')}>
                    <Text style={[styles.tabText, activeTab === 'consultas' && styles.activeTabText]}>Consultas</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.tab, activeTab === 'historico' && styles.activeTab]} onPress={() => setActiveTab('historico')}>
                    <Text style={[styles.tabText, activeTab === 'historico' && styles.activeTabText]}>Histórico</Text>
                  </TouchableOpacity>
                </View>

                {activeTab === 'consultas' ? (
                  upcomingAppointments.length ? upcomingAppointments.map(renderAppointmentCard) : renderEmpty('Nenhuma consulta agendada', 'Quando houver um agendamento para este pet, ele aparecerá aqui.')
                ) : (
                  historyAppointments.length ? historyAppointments.map(renderAppointmentCard) : renderEmpty('Nenhum histórico disponível', 'As consultas concluídas deste pet aparecerão aqui.')
                )}

                {activeTab === 'consultas' && (
                  <>
                    {isBronzeQuotaExhausted && (
                      <View style={styles.noticeBox}>
                        <Ionicons name="information-circle-outline" size={18} color="#B45309" />
                        <Text style={styles.noticeText}>Cota mensal utilizada: 1 de 1 atendimento veterinário básico.</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={[styles.primaryButton, (!hasConsultationAccess || isBronzeQuotaExhausted) && styles.disabledButton]}
                      onPress={() => beginBooking()}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.primaryButtonText}>Agendar consulta</Text>
                    </TouchableOpacity>
                    {planId === 'prata' && <Text style={styles.disclaimer}>O plano Prata prevê consultas presenciais limitadas. A quantidade disponível depende das condições da contratação.</Text>}
                  </>
                )}
              </>
            )}
          </>
        )}

        {mode === 'details' && selectedAppointment && (
          <>
            <Text style={styles.heading}>Detalhes da consulta</Text>
            <Text style={styles.subtitle}>Confira as informações do agendamento.</Text>
            <View style={styles.detailCard}>
              <View style={styles.scheduledBadge}><Text style={styles.scheduledBadgeText}>{selectedAppointment.status === 'cancelled' ? 'CANCELADA' : selectedAppointment.status === 'completed' ? 'CONCLUÍDA' : 'AGENDADA'}</Text></View>
              <Text style={styles.appointmentService}>{selectedAppointment.service}</Text>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Pet</Text><Text style={styles.detailValue}>{selectedAppointment.petName}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Data</Text><Text style={styles.detailValue}>{formatLongDate(selectedAppointment.date)}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Horário</Text><Text style={styles.detailValue}>{selectedAppointment.time}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Código</Text><Text style={styles.detailValue}>{selectedAppointment.code}</Text></View>
            </View>
            {selectedAppointment.status === 'scheduled' && (
              <>
                <View style={styles.noticeBox}>
                  <Ionicons name="information-circle-outline" size={19} color="#21479B" />
                  <Text style={styles.noticeText}>Reagendamentos e cancelamentos podem ser feitos até 24 horas antes do horário marcado.</Text>
                </View>
                {!canManageAppointment(selectedAppointment) && <Text style={styles.deadlineText}>O prazo de 24 horas foi encerrado. As ações estão indisponíveis.</Text>}
                <TouchableOpacity style={[styles.primaryButton, !canManageAppointment(selectedAppointment) && styles.disabledButton]} disabled={!canManageAppointment(selectedAppointment)} onPress={() => {
                  setSelectedAppointmentId(selectedAppointment.id);
                  setIsRescheduling(true);
                  setSelectedDate(selectedAppointment.date);
                  setSelectedTime(selectedAppointment.time);
                  setMode('step1');
                }}>
                  <Text style={styles.primaryButtonText}>Reagendar consulta</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cancelButton, !canManageAppointment(selectedAppointment) && styles.disabledCancelButton]} disabled={!canManageAppointment(selectedAppointment)} onPress={() => cancelAppointment(selectedAppointment)}>
                  <Text style={styles.cancelButtonText}>Cancelar consulta</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}

        {mode === 'step1' && (
          <>
            <View style={styles.progress}><View style={styles.progressActive} /><View style={styles.progressInactive} /><View style={styles.progressInactive} /></View>
            <Text style={styles.heading}>{isRescheduling ? 'Reagendar consulta' : 'Escolha o serviço'}</Text>
            <Text style={styles.subtitle}>Serviço disponível para {selectedPet?.name} conforme o plano contratado.</Text>
            <View style={styles.serviceCard}>
              <Ionicons name="medical-outline" size={24} color="#21479B" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.serviceTitle}>{planId === 'bronze' ? 'Atendimento veterinário básico' : SERVICE_NAME}</Text>
                <Text style={styles.serviceDescription}>{planId === 'bronze' ? '1 atendimento por mês' : planId === 'ouro' || planId === 'diamante' ? 'Consultas presenciais ilimitadas' : 'Consultas presenciais com limite contratual'}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={22} color="#10B981" />
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setMode('step2')}><Text style={styles.primaryButtonText}>Continuar</Text></TouchableOpacity>
          </>
        )}

        {mode === 'step2' && (
          <>
            <View style={styles.progress}><View style={styles.progressActive} /><View style={styles.progressActive} /><View style={styles.progressInactive} /></View>
            <Text style={styles.heading}>Data e horário</Text>
            <Text style={styles.subtitle}>Selecione uma data e um horário para o atendimento.</Text>
            <View style={styles.dateGrid}>
              {dates.map((date) => (
                <TouchableOpacity key={date.iso} style={[styles.dateOption, selectedDate === date.iso && styles.optionSelected]} onPress={() => setSelectedDate(date.iso)}>
                  <Text style={[styles.dateWeekday, selectedDate === date.iso && styles.optionTextSelected]}>{date.label}</Text>
                  <Text style={[styles.dateDay, selectedDate === date.iso && styles.optionTextSelected]}>{date.day}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sectionLabel}>HORÁRIOS</Text>
            <View style={styles.timeGrid}>
              {TIME_OPTIONS.map((time) => (
                <TouchableOpacity key={time} style={[styles.timeOption, selectedTime === time && styles.optionSelected]} onPress={() => setSelectedTime(time)}>
                  <Text style={[styles.timeText, selectedTime === time && styles.optionTextSelected]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.disclaimer}>Os horários desta versão são demonstrativos. A confirmação de disponibilidade depende da integração com a agenda da clínica.</Text>
            <TouchableOpacity style={[styles.primaryButton, !selectedDate && styles.disabledButton]} disabled={!selectedDate} onPress={() => setMode('step3')}><Text style={styles.primaryButtonText}>Continuar</Text></TouchableOpacity>
          </>
        )}

        {mode === 'step3' && (
          <>
            <View style={styles.progress}><View style={styles.progressActive} /><View style={styles.progressActive} /><View style={styles.progressActive} /></View>
            <Text style={styles.heading}>Resumo do agendamento</Text>
            <Text style={styles.subtitle}>Confira os dados antes de confirmar.</Text>
            <View style={styles.detailCard}>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Pet</Text><Text style={styles.detailValue}>{selectedPet?.name}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Plano</Text><Text style={styles.detailValue}>{selectedSubscription?.planName ?? selectedPet?.plan}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Serviço</Text><Text style={styles.detailValue}>{planId === 'bronze' ? 'Atendimento veterinário básico' : SERVICE_NAME}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Data</Text><Text style={styles.detailValue}>{selectedDate ? formatLongDate(selectedDate) : '—'}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Horário</Text><Text style={styles.detailValue}>{selectedTime}</Text></View>
            </View>
            <View style={styles.noticeBox}><Ionicons name="mail-outline" size={18} color="#21479B" /><Text style={styles.noticeText}>Após a integração com o sistema de agendamento, a confirmação será enviada por e-mail.</Text></View>
            <TouchableOpacity style={[styles.primaryButton, !selectedDate && styles.disabledButton]} disabled={!selectedDate} onPress={saveAppointment}><Text style={styles.primaryButtonText}>{isRescheduling ? 'Confirmar reagendamento' : 'Confirmar agendamento'}</Text></TouchableOpacity>
          </>
        )}

        {mode === 'success' && lastSavedAppointment && (
          <View style={styles.successContainer}>
            <View style={styles.successIcon}><Ionicons name="checkmark" size={38} color="#FFFFFF" /></View>
            <Text style={styles.successTitle}>{isRescheduling ? 'Consulta reagendada!' : 'Solicitação registrada!'}</Text>
            <Text style={styles.successSubtitle}>{isRescheduling ? 'Os dados do agendamento foram atualizados nesta versão.' : `O agendamento de ${lastSavedAppointment.petName} foi registrado nesta versão demonstrativa.`}</Text>
            <Text style={styles.codeBadge}>Código: {lastSavedAppointment.code}</Text>
            <View style={styles.detailCard}>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Pet</Text><Text style={styles.detailValue}>{lastSavedAppointment.petName}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Data</Text><Text style={styles.detailValue}>{formatLongDate(lastSavedAppointment.date)}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Horário</Text><Text style={styles.detailValue}>{lastSavedAppointment.time}</Text></View>
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={() => { resetBooking(); setMode('list'); setActiveTab('consultas'); }}><Text style={styles.primaryButtonText}>Minhas consultas</Text></TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {showBottomNav && (
        <PrivateBottomNav
          currentRoute="Profile"
          onNavigateToHome={onNavigateToHome}
          onNavigateToExplore={onNavigateToExplore}
          onNavigateToPlans={onNavigateToPlans}
          onNavigateToBenefits={onNavigateToBenefits}
          onNavigateToProfile={onNavigateToProfile}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12, paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { padding: 4, width: 30 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#21479B' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 110 },
  heading: { fontSize: 19, fontWeight: '800', color: '#0F172A', marginBottom: 5 },
  subtitle: { fontSize: 12, color: '#64748B', lineHeight: 18, marginBottom: 18 },
  selectedPet: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 13, borderWidth: 1, borderColor: '#DCE4EF', marginBottom: 12 },
  petOption: { flexDirection: 'row', alignItems: 'center', padding: 11, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 13, marginBottom: 8 },
  petOptionSelected: { borderColor: '#21479B', backgroundColor: '#F5F8FF' },
  petOptionCompact: { marginBottom: 8 },
  petAvatar: { width: 48, height: 48, borderRadius: 13 },
  petAvatarPlaceholder: { width: 48, height: 48, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEF3FC' },
  petInfo: { flex: 1, marginLeft: 12 },
  petName: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  petDescription: { fontSize: 11, color: '#64748B', marginTop: 3 },
  planBadgeText: { fontSize: 9, fontWeight: '800', color: '#21479B', marginTop: 4 },
  petPicker: { padding: 10, borderRadius: 14, backgroundColor: '#F8FAFC', marginBottom: 14 },
  noticeBox: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', padding: 12, borderRadius: 12, marginBottom: 14 },
  noticeText: { flex: 1, fontSize: 11, color: '#475569', lineHeight: 16 },
  noticeAction: { color: '#21479B', fontSize: 11, fontWeight: '800' },
  tabs: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4, marginTop: 8, marginBottom: 16 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 9 },
  activeTab: { backgroundColor: '#FFFFFF', elevation: 1 },
  tabText: { fontSize: 12, color: '#64748B', fontWeight: '700' },
  activeTabText: { color: '#21479B', fontWeight: '800' },
  appointmentCard: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 15, marginBottom: 12, backgroundColor: '#FFFFFF' },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  scheduledBadge: { alignSelf: 'flex-start', backgroundColor: '#EFF6FF', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  scheduledBadgeText: { color: '#21479B', fontSize: 9, fontWeight: '800' },
  codeText: { fontSize: 10, color: '#64748B' },
  appointmentService: { fontSize: 15, color: '#0F172A', fontWeight: '800', marginBottom: 12 },
  appointmentMeta: { flexDirection: 'row', gap: 18, marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 11, color: '#475569' },
  cardFooter: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailsLink: { color: '#21479B', fontSize: 12, fontWeight: '800' },
  emptyState: { alignItems: 'center', paddingVertical: 35, paddingHorizontal: 20 },
  emptyIcon: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 6, textAlign: 'center' },
  emptyDescription: { fontSize: 11, color: '#64748B', textAlign: 'center', lineHeight: 17 },
  noPetCard: { alignItems: 'center', padding: 24, borderWidth: 1, borderStyle: 'dashed', borderColor: '#CBD5E1', borderRadius: 16 },
  primaryButton: { backgroundColor: '#21479B', minHeight: 48, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginTop: 10, paddingHorizontal: 14 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  disabledButton: { backgroundColor: '#94A3B8' },
  detailCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, marginBottom: 14 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 12 },
  detailLabel: { fontSize: 11, color: '#64748B', flex: 1 },
  detailValue: { fontSize: 11, color: '#1E293B', fontWeight: '700', flex: 1.4, textAlign: 'right' },
  cancelButton: { minHeight: 46, borderWidth: 1, borderColor: '#DC2626', borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  cancelButtonText: { color: '#DC2626', fontSize: 13, fontWeight: '800' },
  disabledCancelButton: { borderColor: '#CBD5E1' },
  deadlineText: { fontSize: 11, color: '#B91C1C', marginBottom: 6 },
  progress: { flexDirection: 'row', gap: 7, marginBottom: 22 },
  progressActive: { flex: 1, height: 5, borderRadius: 4, backgroundColor: '#21479B' },
  progressInactive: { flex: 1, height: 5, borderRadius: 4, backgroundColor: '#E2E8F0' },
  serviceCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#21479B', backgroundColor: '#F8FAFF', borderRadius: 15, padding: 16, marginBottom: 14 },
  serviceTitle: { fontSize: 14, color: '#1E293B', fontWeight: '800' },
  serviceDescription: { fontSize: 11, color: '#64748B', marginTop: 4 },
  dateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  dateOption: { width: '18%', minHeight: 63, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  dateWeekday: { fontSize: 9, color: '#64748B', textTransform: 'capitalize' },
  dateDay: { fontSize: 17, fontWeight: '800', color: '#1E293B', marginTop: 4 },
  optionSelected: { backgroundColor: '#21479B', borderColor: '#21479B' },
  optionTextSelected: { color: '#FFFFFF' },
  sectionLabel: { fontSize: 10, fontWeight: '800', color: '#64748B', marginBottom: 10 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: 12 },
  timeOption: { width: '30%', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 11, paddingVertical: 12, alignItems: 'center' },
  timeText: { fontSize: 12, color: '#1E293B', fontWeight: '700' },
  disclaimer: { color: '#94A3B8', fontSize: 10, lineHeight: 15, marginTop: 4, marginBottom: 8 },
  successContainer: { alignItems: 'center', paddingTop: 25 },
  successIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  successTitle: { fontSize: 19, color: '#0F172A', fontWeight: '900', textAlign: 'center' },
  successSubtitle: { fontSize: 12, color: '#64748B', textAlign: 'center', lineHeight: 18, marginTop: 7, marginBottom: 15 },
  codeBadge: { fontSize: 12, color: '#21479B', fontWeight: '800', marginBottom: 14 },
});
