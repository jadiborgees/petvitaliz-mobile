import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';
import PrivateHeader from '../../components/PrivateHeader';
import PetAvatar from '../../components/PetAvatar';
import { theme } from '../../theme/privateTheme';
import type { Pet } from './PrivatePetsFlowScreen';
import {
  SERVICES,
  PLAN_COVERAGE,
  PLAN_NAMES,
  getPlanId,
  getMinimumPlan,
  type ServiceId,
} from '../../data/planCoverage';

export type ConsultationAppointment = {
  id: string;
  code: string;
  petId: string;
  petName: string;
  service: string;
  serviceId?: ServiceId; // sem valor = consulta
  professional?: string;
  date: string; // ISO: YYYY-MM-DD
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
};

interface PrivateConsultationsScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onContractPlan?: (petId: string) => void;
  pets: Pet[];
  subscription?: unknown; // mantido por compatibilidade; o plano vem do pet
  appointments: ConsultationAppointment[];
  onAppointmentsChange: React.Dispatch<React.SetStateAction<ConsultationAppointment[]>>;
  // Para abrir já no agendamento (vindo de Serviços ou Meu Plano)
  initialPetId?: string | null;
  initialServiceId?: ServiceId | null;
  openServiceChoice?: boolean; // abre direto na escolha do serviço (ex.: vindo de Benefícios)
}

type Mode = 'list' | 'details' | 'step1' | 'step2' | 'step3' | 'success';
type Tab = 'proximas' | 'historico';

const C = theme.colors;
const F = theme.fonts;

const TIME_OPTIONS = ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00'];
// O sistema atribui o profissional (a pessoa não escolhe).
const PROFESSIONALS = ['Dra. Mariana Lima', 'Dr. Rafael Souza', 'Dra. Camila Rocha', 'Dr. Bruno Alves'];

const SERVICE_ICONS: Record<ServiceId, keyof typeof Feather.glyphMap> = {
  banho_tosa: 'scissors',
  exames: 'activity',
  vacinacao: 'shield',
  emergencia: 'alert-circle',
  leva_busca: 'truck',
  consulta: 'heart',
};

const toIso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const parseIso = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const monthShort = (iso: string) =>
  parseIso(iso).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();

const weekdayShort = (iso: string) =>
  parseIso(iso).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');

const longDate = (iso: string) =>
  parseIso(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

const serviceName = (id?: ServiceId) => SERVICES.find((s) => s.id === (id ?? 'consulta'))?.name ?? 'Consulta';

export default function PrivateConsultationsScreen({
  onBack,
  onNavigateToHome,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  onContractPlan,
  pets,
  appointments,
  onAppointmentsChange,
  initialPetId,
  initialServiceId,
  openServiceChoice,
}: PrivateConsultationsScreenProps) {
  const startPetId =
    initialPetId && pets.some((pet) => pet.id === initialPetId) ? initialPetId : pets[0]?.id ?? null;

  // Abre direto na data e horário quando vem de Serviços ou Meu Plano
  // e o plano do pet cobre o serviço.
  const startPet = pets.find((pet) => pet.id === startPetId);
  const startPlan = startPet?.hasActivePlan ? getPlanId(startPet.plan) : null;
  const canStartBooking =
    !!initialServiceId && !!startPlan && PLAN_COVERAGE[startPlan][initialServiceId] !== undefined;

  const [mode, setMode] = useState<Mode>(
    canStartBooking ? 'step2' : openServiceChoice && startPlan ? 'step1' : 'list',
  );
  const [tab, setTab] = useState<Tab>('proximas');
  const [selectedPetId, setSelectedPetId] = useState<string | null>(startPetId);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [bookingService, setBookingService] = useState<ServiceId>(initialServiceId ?? 'consulta');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [lastSaved, setLastSaved] = useState<ConsultationAppointment | null>(null);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId) ?? pets[0] ?? null;
  const planId = selectedPet?.hasActivePlan ? getPlanId(selectedPet.plan) : null;
  const coverage = planId ? PLAN_COVERAGE[planId] : {};

  const now = new Date();

  // Uma consulta cujo horário já passou entra no histórico como concluída.
  const effectiveStatus = (item: ConsultationAppointment) => {
    if (item.status !== 'scheduled') return item.status;
    const [hour, minute] = item.time.split(':').map(Number);
    const when = parseIso(item.date);
    when.setHours(hour, minute);
    return when.getTime() < Date.now() ? 'completed' : 'scheduled';
  };

  const petAppointments = appointments
    .filter((item) => item.petId === selectedPet?.id)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const upcoming = petAppointments.filter((item) => effectiveStatus(item) === 'scheduled');
  const history = petAppointments.filter((item) => effectiveStatus(item) !== 'scheduled').reverse();

  // Uso do mês por serviço (sem cancelados).
  const usedThisMonth = (serviceId: ServiceId) =>
    appointments.filter((item) => {
      if (item.petId !== selectedPet?.id || item.status === 'cancelled') return false;
      const date = parseIso(item.date);
      return (
        (item.serviceId ?? 'consulta') === serviceId &&
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      );
    }).length;

  const isExhausted = (serviceId: ServiceId) => {
    const quota = coverage[serviceId];
    return typeof quota === 'number' && usedThisMonth(serviceId) >= quota;
  };

  const consultaQuota = coverage.consulta;
  const consultaUsed = usedThisMonth('consulta');
  const consultaExhausted = isExhausted('consulta');

  const selectedAppointment = appointments.find((item) => item.id === selectedAppointmentId) ?? null;

  const dates = useMemo(() => {
    const list: string[] = [];
    const base = new Date();
    for (let i = 1; i <= 14; i += 1) {
      const date = new Date(base);
      date.setDate(base.getDate() + i);
      if (date.getDay() !== 0) list.push(toIso(date)); // sem domingos
    }
    return list;
  }, []);

  // Horários já ocupados no dia escolhido.
  const takenTimes = appointments
    .filter((item) => item.date === selectedDate && item.status === 'scheduled' && item.id !== selectedAppointmentId)
    .map((item) => item.time);

  // Reagendar e cancelar só até 24h antes (N5).
  const canManage = (item: ConsultationAppointment) => {
    const [hour, minute] = item.time.split(':').map(Number);
    const when = parseIso(item.date);
    when.setHours(hour, minute);
    return when.getTime() - Date.now() >= 24 * 60 * 60 * 1000;
  };

  const resetBooking = () => {
    setSelectedDate('');
    setSelectedTime('');
    setIsRescheduling(false);
    setBookingService('consulta');
  };

  const startBooking = (serviceId?: ServiceId) => {
    if (!selectedPet) return;
    if (!planId) {
      Alert.alert('Pet sem plano', `${selectedPet.name} ainda não tem um plano ativo.`, [
        { text: 'Agora não', style: 'cancel' },
        { text: 'Contratar plano', onPress: () => (onContractPlan ? onContractPlan(selectedPet.id) : onNavigateToPlans?.()) },
      ]);
      return;
    }
    resetBooking();
    setSelectedAppointmentId(null);
    if (serviceId) {
      setBookingService(serviceId);
      setMode('step2');
    } else {
      setMode('step1');
    }
  };

  const startReschedule = (item: ConsultationAppointment) => {
    if (!canManage(item)) {
      Alert.alert('Prazo encerrado', 'Só é possível reagendar até 24 horas antes do horário marcado.');
      return;
    }
    setSelectedAppointmentId(item.id);
    setBookingService(item.serviceId ?? 'consulta');
    setSelectedDate('');
    setSelectedTime('');
    setIsRescheduling(true);
    setMode('step2');
  };

  const cancelAppointment = (item: ConsultationAppointment) => {
    if (!canManage(item)) {
      Alert.alert('Prazo encerrado', 'Só é possível cancelar até 24 horas antes do horário marcado.');
      return;
    }
    Alert.alert('Cancelar consulta', 'Cancelamento gratuito até 24h antes. Sua cota não é consumida.', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar consulta',
        style: 'destructive',
        onPress: () => {
          onAppointmentsChange((current) =>
            current.map((entry) => (entry.id === item.id ? { ...entry, status: 'cancelled' } : entry)),
          );
          setMode('list');
          Alert.alert('Consulta cancelada', 'Consulta cancelada. Sua cota não foi consumida.');
        },
      },
    ]);
  };

  const chooseService = (serviceId: ServiceId) => {
    if (coverage[serviceId] === undefined) {
      const minimum = getMinimumPlan(serviceId);
      Alert.alert(
        serviceName(serviceId),
        minimum
          ? `Não está incluso no seu plano. Disponível a partir do ${PLAN_NAMES[minimum]}.`
          : 'Este serviço não está disponível nos planos atuais.',
        [
          { text: 'Agora não', style: 'cancel' },
          ...(minimum ? [{ text: 'Ver planos', onPress: onNavigateToPlans }] : []),
        ],
      );
      return;
    }
    if (isExhausted(serviceId)) {
      Alert.alert('Cota esgotada', `A cota mensal de ${serviceName(serviceId).toLowerCase()} já foi usada. Ela renova no dia 1º.`);
      return;
    }
    setBookingService(serviceId);
    setMode('step2');
  };

  const saveAppointment = () => {
    if (!selectedPet || !selectedDate || !selectedTime) return;

    if (isRescheduling && selectedAppointment) {
      const updated = { ...selectedAppointment, date: selectedDate, time: selectedTime };
      onAppointmentsChange((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setLastSaved(updated);
    } else {
      const stamp = Date.now();
      const created: ConsultationAppointment = {
        id: `consult-${stamp}`,
        code: `PV-${String(stamp).slice(-6)}`,
        petId: selectedPet.id,
        petName: selectedPet.name,
        service: serviceName(bookingService),
        serviceId: bookingService,
        professional: PROFESSIONALS[stamp % PROFESSIONALS.length],
        date: selectedDate,
        time: selectedTime,
        status: 'scheduled',
      };
      onAppointmentsChange((current) => [...current, created]);
      setLastSaved(created);
    }
    setMode('success');
  };

  const handleBack = () => {
    if (mode === 'step3') setMode('step2');
    else if (mode === 'step2') setMode(isRescheduling ? 'details' : initialServiceId && !selectedAppointmentId ? 'list' : 'step1');
    else if (mode === 'step1' || mode === 'details' || mode === 'success') {
      resetBooking();
      setMode('list');
    } else onBack?.();
  };

  const stepNumber = mode === 'step1' ? 1 : mode === 'step2' ? 2 : 3;
  const isBooking = mode === 'step1' || mode === 'step2' || mode === 'step3';

  const headerTitle =
    mode === 'details'
      ? 'Detalhes'
      : isBooking || mode === 'success'
        ? isRescheduling
          ? 'Reagendar'
          : 'Agendar'
        : 'Consultas';

  // ---------- Partes reutilizadas ----------

  const renderAppointmentCard = (item: ConsultationAppointment, inHistory = false) => {
    const status = effectiveStatus(item);
    const manageable = status === 'scheduled' && canManage(item);
    return (
      <View key={item.id} style={styles.appointmentCard}>
        <TouchableOpacity
          style={styles.appointmentTop}
          activeOpacity={0.8}
          onPress={() => {
            setSelectedAppointmentId(item.id);
            setMode('details');
          }}
        >
          <View style={[styles.dateBox, inHistory && styles.dateBoxMuted]}>
            <Text style={[styles.dateBoxMonth, inHistory && { color: C.muted }]}>{monthShort(item.date)}</Text>
            <Text style={[styles.dateBoxDay, inHistory && { color: C.muted }]}>{parseIso(item.date).getDate()}</Text>
            <Text style={[styles.dateBoxWeek, inHistory && { color: C.muted }]}>{weekdayShort(item.date)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.appointmentTitleRow}>
              <Text style={styles.appointmentTitle}>{serviceName(item.serviceId)}</Text>
              <StatusBadge status={status} />
            </View>
            <Text style={styles.appointmentMeta}>
              <Feather name="clock" size={11} color={C.muted} /> {item.time} · {item.petName}
            </Text>
            <Text style={styles.appointmentMeta}>
              <Feather name="hash" size={11} color={C.muted} /> {item.code}
            </Text>
          </View>
        </TouchableOpacity>

        {status === 'scheduled' && (
          <View style={styles.cardActions}>
            <TouchableOpacity style={[styles.cardAction, styles.cardActionDivider]} onPress={() => startReschedule(item)}>
              <Text style={[styles.cardActionText, { color: manageable ? C.primary : '#A7B1C2' }]}>Reagendar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cardAction} onPress={() => cancelAppointment(item)}>
              <Text style={[styles.cardActionText, { color: manageable ? C.danger : '#A7B1C2' }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderStepHeader = () => (
    <View style={styles.stepHeader}>
      <View style={styles.stepLabelRow}>
        <Text style={styles.stepLabel}>
          Etapa {stepNumber} de 3
        </Text>
        <Text style={styles.stepLabel}>
          {stepNumber === 1 ? 'Serviço' : stepNumber === 2 ? 'Data e horário' : 'Resumo'}
        </Text>
      </View>
      <View style={styles.stepBars}>
        {[1, 2, 3].map((n) => (
          <View key={n} style={[styles.stepBar, n <= stepNumber && styles.stepBarActive]} />
        ))}
      </View>
    </View>
  );

  // ---------- Tela ----------

  return (
    <SafeAreaView style={styles.container}>
      <PrivateHeader title={headerTitle} onBack={handleBack} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* LISTA */}
        {mode === 'list' && (
          <>
            {pets.length === 0 ? (
              <View style={[styles.card, styles.emptyCard]}>
                <PetAvatar size={64} />
                <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
                <Text style={styles.emptyText}>Cadastre um pet no seu perfil para marcar consultas.</Text>
              </View>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Seus pets</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.petList}>
                  {pets.map((pet) => {
                    const isSelected = pet.id === selectedPet?.id;
                    const petPlan = pet.hasActivePlan ? getPlanId(pet.plan) : null;
                    return (
                      <TouchableOpacity
                        key={pet.id}
                        style={[styles.petPill, isSelected && styles.petPillActive]}
                        onPress={() => setSelectedPetId(pet.id)}
                        activeOpacity={0.8}
                      >
                        <PetAvatar
                          species={pet.species}
                          avatar={pet.avatar}
                          size={32}
                          background={isSelected ? C.card : C.primarySoft}
                        />
                        <View>
                          <Text style={styles.petPillName} numberOfLines={1}>{pet.name}</Text>
                          <Text style={[styles.petPillPlan, { color: petPlan ? C.success : C.warning }]}>
                            {petPlan ? PLAN_NAMES[petPlan].replace('Plano ', '') : 'Sem plano'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Cota do mês ou aviso de pet sem plano */}
                {planId ? (
                  <View style={[styles.card, styles.quotaCard]}>
                    <View style={styles.quotaTop}>
                      <Feather name="heart" size={17} color={C.primary} />
                      <Text style={styles.quotaTitle}>Consultas do mês</Text>
                      {typeof consultaQuota === 'number' && (
                        <Text style={styles.quotaCount}>
                          {Math.min(consultaUsed, consultaQuota)} de {consultaQuota}
                        </Text>
                      )}
                    </View>
                    {consultaQuota === 'ilimitado' ? (
                      <Text style={styles.quotaNote}>Ilimitadas no {PLAN_NAMES[planId]}</Text>
                    ) : typeof consultaQuota === 'number' ? (
                      <>
                        <View style={styles.barTrack}>
                          <View
                            style={[
                              styles.barFill,
                              {
                                width: `${Math.max(Math.min(consultaUsed / consultaQuota, 1) * 100, 4)}%` as `${number}%`,
                                backgroundColor: consultaExhausted ? C.warning : C.primary,
                              },
                            ]}
                          />
                        </View>
                        {consultaExhausted && <Text style={styles.quotaWarning}>Cota esgotada. Renova dia 1º.</Text>}
                      </>
                    ) : null}
                  </View>
                ) : (
                  <View style={[styles.card, styles.noPlanCard]}>
                    <Text style={styles.noPlanTitle}>{selectedPet?.name} ainda não tem plano</Text>
                    <Text style={styles.noPlanText}>Contrate um plano para marcar consultas e outros serviços.</Text>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => selectedPet && (onContractPlan ? onContractPlan(selectedPet.id) : onNavigateToPlans?.())}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.primaryButtonText}>Contratar plano</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Abas */}
                <View style={styles.tabs}>
                  {(['proximas', 'historico'] as Tab[]).map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[styles.tab, tab === option && styles.tabActive]}
                      onPress={() => setTab(option)}
                    >
                      <Text style={[styles.tabText, tab === option && styles.tabTextActive]}>
                        {option === 'proximas'
                          ? `Próximas${upcoming.length ? ` (${upcoming.length})` : ''}`
                          : 'Histórico'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {tab === 'proximas' ? (
                  upcoming.length > 0 ? (
                    upcoming.map((item) => renderAppointmentCard(item))
                  ) : (
                    <View style={[styles.card, styles.emptyCard]}>
                      <View style={styles.emptyIcon}>
                        <Feather name="calendar" size={26} color={C.primary} />
                      </View>
                      <Text style={styles.emptyTitle}>Nenhuma consulta marcada</Text>
                      <Text style={styles.emptyText}>
                        Marque uma consulta para {selectedPet?.gender === 'Macho' ? 'o' : 'a'} {selectedPet?.name} em poucos toques.
                      </Text>
                    </View>
                  )
                ) : history.length > 0 ? (
                  history.map((item) => renderAppointmentCard(item, true))
                ) : (
                  <View style={[styles.card, styles.emptyCard]}>
                    <View style={styles.emptyIcon}>
                      <Feather name="clock" size={26} color={C.primary} />
                    </View>
                    <Text style={styles.emptyTitle}>Sem histórico ainda</Text>
                    <Text style={styles.emptyText}>As consultas concluídas e canceladas aparecem aqui.</Text>
                  </View>
                )}

                {planId && tab === 'proximas' && (
                  <TouchableOpacity
                    style={[styles.primaryButton, styles.rowButton, consultaExhausted && styles.disabledButton]}
                    onPress={() => startBooking()}
                    disabled={consultaExhausted}
                    activeOpacity={0.85}
                  >
                    <Feather name="calendar" size={17} color="#FFFFFF" />
                    <Text style={styles.primaryButtonText}>
                      {consultaExhausted ? 'Cota de consultas esgotada' : 'Agendar consulta'}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </>
        )}

        {/* DETALHES */}
        {mode === 'details' && selectedAppointment && (
          <>
            <View style={styles.card}>
              <View style={styles.appointmentTitleRow}>
                <Text style={styles.detailsTitle}>{serviceName(selectedAppointment.serviceId)}</Text>
                <StatusBadge status={effectiveStatus(selectedAppointment)} />
              </View>
              <Text style={styles.detailsCode}>{selectedAppointment.code}</Text>
              <View style={styles.summary}>
                <SummaryRow label="Pet" value={selectedAppointment.petName} />
                <SummaryRow label="Data" value={longDate(selectedAppointment.date)} />
                <SummaryRow label="Horário" value={selectedAppointment.time} />
                <SummaryRow label="Profissional" value={selectedAppointment.professional ?? 'Atribuído pela clínica'} />
              </View>
            </View>

            {effectiveStatus(selectedAppointment) === 'scheduled' && (
              <>
                <View style={styles.infoBox}>
                  <Feather name="info" size={15} color={C.navy} />
                  <Text style={styles.infoText}>
                    {canManage(selectedAppointment)
                      ? 'Você pode reagendar ou cancelar sem custo até 24h antes do horário.'
                      : 'Faltam menos de 24h: não é mais possível reagendar ou cancelar.'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.primaryButton, !canManage(selectedAppointment) && styles.disabledButton]}
                  disabled={!canManage(selectedAppointment)}
                  onPress={() => startReschedule(selectedAppointment)}
                >
                  <Text style={styles.primaryButtonText}>Reagendar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.dangerButton, !canManage(selectedAppointment) && { borderColor: '#CBD5E1' }]}
                  disabled={!canManage(selectedAppointment)}
                  onPress={() => cancelAppointment(selectedAppointment)}
                >
                  <Text style={[styles.dangerButtonText, !canManage(selectedAppointment) && { color: '#A7B1C2' }]}>
                    Cancelar consulta
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}

        {/* ETAPA 1: SERVIÇO */}
        {mode === 'step1' && (
          <>
            {renderStepHeader()}
            <Text style={styles.stepTitle}>O que {selectedPet?.name} precisa?</Text>
            <View style={[styles.card, styles.listCard]}>
              {SERVICES.map((service, index) => {
                const quota = coverage[service.id];
                const locked = quota === undefined;
                const exhausted = !locked && isExhausted(service.id);
                return (
                  <TouchableOpacity
                    key={service.id}
                    style={[styles.serviceRow, index < SERVICES.length - 1 && styles.rowDivider]}
                    onPress={() => chooseService(service.id)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.serviceIcon, (locked || exhausted) && { backgroundColor: C.divider }]}>
                      <Feather
                        name={locked ? 'lock' : SERVICE_ICONS[service.id]}
                        size={17}
                        color={locked || exhausted ? C.muted : C.primary}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.serviceName, (locked || exhausted) && { color: C.muted }]}>{service.name}</Text>
                      <Text style={styles.serviceNote}>
                        {locked
                          ? 'Não incluso no seu plano'
                          : exhausted
                            ? 'Cota do mês esgotada'
                            : quota === 'ilimitado'
                              ? 'Ilimitado'
                              : `${(quota as number) - usedThisMonth(service.id)} de ${quota} disponíveis no mês`}
                      </Text>
                    </View>
                    <Feather name="chevron-right" size={18} color="#9AA6B8" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* ETAPA 2: DATA E HORÁRIO */}
        {mode === 'step2' && (
          <>
            {!isRescheduling && renderStepHeader()}
            <Text style={styles.stepTitle}>
              {isRescheduling ? 'Escolha a nova data' : 'Quando fica melhor?'}
            </Text>
            <Text style={styles.stepSubtitle}>
              {serviceName(bookingService)} · {selectedPet?.name}
            </Text>

            <Text style={styles.fieldLabel}>
              {selectedDate
                ? parseIso(selectedDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                : parseIso(dates[0]).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
              {dates.map((iso) => {
                const active = selectedDate === iso;
                return (
                  <TouchableOpacity
                    key={iso}
                    style={[styles.dateOption, active && styles.dateOptionActive]}
                    onPress={() => {
                      setSelectedDate(iso);
                      setSelectedTime('');
                    }}
                  >
                    <Text style={[styles.dateOptionWeek, active && styles.dateOptionTextActive]}>{weekdayShort(iso)}</Text>
                    <Text style={[styles.dateOptionDay, active && styles.dateOptionTextActive]}>{parseIso(iso).getDate()}</Text>
                    <Text style={[styles.dateOptionWeek, active && styles.dateOptionTextActive]}>{monthShort(iso).toLowerCase()}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.fieldLabel}>Horários</Text>
            {!selectedDate ? (
              <Text style={styles.stepSubtitle}>Escolha um dia para ver os horários.</Text>
            ) : (
              <View style={styles.timeGrid}>
                {TIME_OPTIONS.map((time) => {
                  const taken = takenTimes.includes(time);
                  const active = selectedTime === time;
                  return (
                    <TouchableOpacity
                      key={time}
                      style={[styles.timeOption, active && styles.timeOptionActive, taken && styles.timeOptionTaken]}
                      disabled={taken}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text style={[styles.timeText, active && styles.dateOptionTextActive, taken && { color: '#A7B1C2' }]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <TouchableOpacity
              style={[styles.primaryButton, (!selectedDate || !selectedTime) && styles.disabledButton]}
              disabled={!selectedDate || !selectedTime}
              onPress={() => setMode('step3')}
            >
              <Text style={styles.primaryButtonText}>Continuar</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ETAPA 3: RESUMO */}
        {mode === 'step3' && (
          <>
            {!isRescheduling && renderStepHeader()}
            <Text style={styles.stepTitle}>Confira antes de confirmar</Text>
            <View style={[styles.card, { marginTop: 12 }]}>
              <View style={styles.summaryPet}>
                <PetAvatar species={selectedPet?.species} avatar={selectedPet?.avatar} size={44} />
                <View>
                  <Text style={styles.summaryPetName}>{selectedPet?.name}</Text>
                  <Text style={styles.summaryPetPlan}>{planId ? PLAN_NAMES[planId] : ''}</Text>
                </View>
              </View>
              <View style={styles.summary}>
                <SummaryRow label="Serviço" value={serviceName(bookingService)} />
                <SummaryRow label="Data" value={selectedDate ? longDate(selectedDate) : '—'} />
                <SummaryRow label="Horário" value={selectedTime} />
                <SummaryRow label="Profissional" value="Atribuído pela clínica" />
              </View>
            </View>
            <View style={styles.infoBox}>
              <Feather name="mail" size={15} color={C.navy} />
              <Text style={styles.infoText}>Você recebe o comprovante por e-mail. Dá para reagendar ou cancelar sem custo até 24h antes.</Text>
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={saveAppointment} activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>
                {isRescheduling ? 'Confirmar nova data' : 'Confirmar agendamento'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* CONFIRMADO */}
        {mode === 'success' && lastSaved && (
          <View style={styles.successWrap}>
            <View style={styles.successIcon}>
              <Feather name="check" size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>{isRescheduling ? 'Consulta reagendada!' : 'Consulta agendada!'}</Text>
            <Text style={styles.successText}>
              {isRescheduling
                ? 'A nova data já está salva.'
                : `Tudo certo para ${lastSaved.petName}. O comprovante vai para o seu e-mail.`}
            </Text>
            <View style={styles.codeBadge}>
              <Text style={styles.codeBadgeText}>Código {lastSaved.code}</Text>
            </View>
            <View style={[styles.card, { alignSelf: 'stretch', marginTop: 16 }]}>
              <SummaryRow label="Serviço" value={serviceName(lastSaved.serviceId)} />
              <SummaryRow label="Data" value={longDate(lastSaved.date)} />
              <SummaryRow label="Horário" value={lastSaved.time} />
              <SummaryRow label="Profissional" value={lastSaved.professional ?? 'Atribuído pela clínica'} />
            </View>
            <TouchableOpacity
              style={[styles.primaryButton, { alignSelf: 'stretch' }]}
              onPress={() => {
                resetBooking();
                setTab('proximas');
                setMode('list');
              }}
            >
              <Text style={styles.primaryButtonText}>Meus agendamentos</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {(mode === 'list' || mode === 'details') && (
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

function StatusBadge({ status }: { status: ConsultationAppointment['status'] }) {
  const config =
    status === 'scheduled'
      ? { label: 'Agendada', bg: '#E7F6EF', color: C.success }
      : status === 'completed'
        ? { label: 'Concluída', bg: C.primarySoft, color: C.primary }
        : { label: 'Cancelada', bg: '#FDECEC', color: C.danger };
  return (
    <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
      <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scrollContent: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 130 },

  sectionTitle: { fontSize: 16, fontFamily: F.bold, color: C.navy },
  card: {
    backgroundColor: C.card,
    borderRadius: theme.radius.bigCard,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
  },
  listCard: { paddingVertical: 2, paddingHorizontal: 14, borderRadius: theme.radius.card, marginTop: 12 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: C.divider },

  // Pets
  petList: { gap: 8, paddingTop: 10, paddingBottom: 16 },
  petPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 24,
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 14,
  },
  petPillActive: { backgroundColor: C.primarySoft, borderColor: C.primary, borderWidth: 1.5 },
  petPillName: { fontSize: 13, fontFamily: F.bold, color: C.navy, maxWidth: 110 },
  petPillPlan: { fontSize: 11, fontFamily: F.semibold, marginTop: 1 },

  // Cota
  quotaCard: { padding: 14, borderRadius: theme.radius.card },
  quotaTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  quotaTitle: { flex: 1, fontSize: 13, fontFamily: F.bold, color: C.navy },
  quotaCount: { fontSize: 12, fontFamily: F.medium, color: C.muted },
  quotaNote: { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 4, marginLeft: 25 },
  quotaWarning: { fontSize: 11, fontFamily: F.medium, color: C.warning, marginTop: 6 },
  barTrack: { height: 6, borderRadius: 3, backgroundColor: C.divider, marginTop: 10, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3 },

  noPlanCard: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  noPlanTitle: { fontSize: 14, fontFamily: F.bold, color: C.navy },
  noPlanText: { fontSize: 12, fontFamily: F.regular, color: C.textSecondary, marginTop: 4, lineHeight: 18 },

  // Abas
  tabs: { flexDirection: 'row', backgroundColor: C.divider, borderRadius: 12, padding: 4, marginVertical: 16 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 9 },
  tabActive: { backgroundColor: C.card },
  tabText: { fontSize: 12, fontFamily: F.semibold, color: C.muted },
  tabTextActive: { color: C.navy, fontFamily: F.bold },

  // Card de consulta
  appointmentCard: {
    backgroundColor: C.card,
    borderRadius: theme.radius.bigCard,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  appointmentTop: { flexDirection: 'row', gap: 12, padding: 14 },
  dateBox: { width: 54, borderRadius: 12, backgroundColor: C.primarySoft, alignItems: 'center', paddingVertical: 6 },
  dateBoxMuted: { backgroundColor: C.divider },
  dateBoxMonth: { fontSize: 10, fontFamily: F.bold, color: C.primary },
  dateBoxDay: { fontSize: 21, fontFamily: F.bold, color: C.primary, lineHeight: 26 },
  dateBoxWeek: { fontSize: 10, fontFamily: F.medium, color: C.primary },
  appointmentTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  appointmentTitle: { fontSize: 15, fontFamily: F.bold, color: C.navy, flexShrink: 1 },
  appointmentMeta: { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 4 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 10, fontFamily: F.bold },
  cardActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.divider },
  cardAction: { flex: 1, alignItems: 'center', paddingVertical: 11 },
  cardActionDivider: { borderRightWidth: 1, borderRightColor: C.divider },
  cardActionText: { fontSize: 13, fontFamily: F.bold },

  // Vazio
  emptyCard: { alignItems: 'center', paddingVertical: 24 },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 15, fontFamily: F.bold, color: C.navy, marginTop: 12, textAlign: 'center' },
  emptyText: { fontSize: 12, fontFamily: F.regular, color: C.muted, textAlign: 'center', lineHeight: 18, marginTop: 5 },

  // Detalhes
  detailsTitle: { fontSize: 19, fontFamily: F.bold, color: C.navy, flexShrink: 1 },
  detailsCode: { fontSize: 12, fontFamily: F.medium, color: C.muted, marginTop: 4 },
  summary: { borderTopWidth: 1, borderTopColor: C.divider, marginTop: 14, paddingTop: 6 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 7 },
  summaryLabel: { fontSize: 12, fontFamily: F.regular, color: C.muted },
  summaryValue: { flex: 1, textAlign: 'right', fontSize: 12, fontFamily: F.semibold, color: C.navy },
  infoBox: { flexDirection: 'row', gap: 8, backgroundColor: C.primarySoft, borderRadius: 12, padding: 12, marginTop: 12 },
  infoText: { flex: 1, fontSize: 12, fontFamily: F.regular, color: C.navy, lineHeight: 18 },

  // Etapas
  stepHeader: { marginBottom: 16 },
  stepLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
  stepLabel: { fontSize: 11, fontFamily: F.medium, color: C.muted },
  stepBars: { flexDirection: 'row', gap: 6 },
  stepBar: { flex: 1, height: 5, borderRadius: 3, backgroundColor: '#E1E7F0' },
  stepBarActive: { backgroundColor: C.primary },
  stepTitle: { fontSize: 18, fontFamily: F.bold, color: C.navy },
  stepSubtitle: { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 4 },
  fieldLabel: { fontSize: 13, fontFamily: F.bold, color: C.navy, marginTop: 18, marginBottom: 8, textTransform: 'capitalize' },

  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
  serviceIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: { fontSize: 14, fontFamily: F.bold, color: C.navy },
  serviceNote: { fontSize: 11, fontFamily: F.regular, color: C.muted, marginTop: 2 },

  dateList: { gap: 8, paddingBottom: 4 },
  dateOption: {
    width: 58,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  dateOptionActive: { backgroundColor: C.primary, borderColor: C.primary },
  dateOptionWeek: { fontSize: 11, fontFamily: F.medium, color: C.muted },
  dateOptionDay: { fontSize: 19, fontFamily: F.bold, color: C.navy, marginVertical: 1 },
  dateOptionTextActive: { color: '#FFFFFF' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeOption: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  timeOptionActive: { backgroundColor: C.primary, borderColor: C.primary },
  timeOptionTaken: { backgroundColor: C.divider, borderColor: C.divider },
  timeText: { fontSize: 13, fontFamily: F.bold, color: C.navy },

  summaryPet: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  summaryPetName: { fontSize: 15, fontFamily: F.bold, color: C.navy },
  summaryPetPlan: { fontSize: 11, fontFamily: F.medium, color: C.success, marginTop: 2 },

  // Sucesso
  successWrap: { alignItems: 'center', paddingTop: 20 },
  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: C.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: { fontSize: 21, fontFamily: F.bold, color: C.navy, marginTop: 16 },
  successText: { fontSize: 13, fontFamily: F.regular, color: C.muted, textAlign: 'center', marginTop: 6, lineHeight: 19 },
  codeBadge: { backgroundColor: C.primarySoft, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5, marginTop: 12 },
  codeBadgeText: { fontSize: 12, fontFamily: F.bold, color: C.primary },

  // Botões
  primaryButton: {
    minHeight: 48,
    borderRadius: theme.radius.button,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  rowButton: { flexDirection: 'row', gap: 8 },
  disabledButton: { backgroundColor: '#A7B1C2' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontFamily: F.bold },
  dangerButton: {
    minHeight: 46,
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: C.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  dangerButtonText: { color: C.danger, fontSize: 14, fontFamily: F.bold },
});