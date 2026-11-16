import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';
import PrivateHeader from '../../components/PrivateHeader';
import { theme } from '../../theme/privateTheme';
import type { Pet } from './PrivatePetsFlowScreen';
import type { ConsultationAppointment } from './PrivateConsultationsScreen';
import { SERVICES } from '../../data/planCoverage';

export type NotificationPrefs = { consultas: boolean; vacinas: boolean; ofertas: boolean };

type NotificationSubscription = {
  petId: string;
  petName: string;
  planName: string;
  status: 'paid' | 'pending';
  startedAt?: string;
  scheduledChange?: { planName: string; effectiveDate: string } | null;
};

interface PrivateNotificationsScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onOpenConsultations?: () => void;
  onOpenMyPlan?: () => void;
  pets?: Pet[];
  appointments?: ConsultationAppointment[];
  subscription?: NotificationSubscription | null;
  prefs: NotificationPrefs;
  onPrefsChange: (prefs: NotificationPrefs) => void;
}

type Item = {
  id: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  tone: 'blue' | 'green' | 'yellow';
  title: string;
  text: string;
  date: Date;
  target: 'consultas' | 'plano';
};

const C = theme.colors;
const F = theme.fonts;

const TONES = {
  blue: { bg: C.primarySoft, color: C.primary },
  green: { bg: '#E7F6EF', color: C.success },
  yellow: { bg: '#FFF5D6', color: '#C58F00' },
};

const parseIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const dayLabel = (date: Date) => {
  const today = startOfDay(new Date()).getTime();
  const diff = Math.round((startOfDay(date).getTime() - today) / 86400000);
  if (diff === 0) return 'hoje';
  if (diff === 1) return 'amanhã';
  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
};

export default function PrivateNotificationsScreen({
  onBack,
  onNavigateToHome,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  onOpenConsultations,
  onOpenMyPlan,
  appointments = [],
  subscription,
  prefs,
  onPrefsChange,
}: PrivateNotificationsScreenProps) {
  const [readIds, setReadIds] = useState<string[]>([]);

  // Avisos montados a partir das consultas e do plano.
  const items = useMemo(() => {
    const list: Item[] = [];
    const now = new Date();
    const inAWeek = new Date(now.getTime() + 7 * 86400000);

    if (prefs.consultas) {
      appointments
        .filter((a) => a.status === 'scheduled')
        .forEach((a) => {
          const when = parseIso(a.date);
          if (when < startOfDay(now) || when > inAWeek) return;
          const service = SERVICES.find((s) => s.id === (a.serviceId ?? 'consulta'))?.name ?? 'Consulta';
          list.push({
            id: `appt-${a.id}`,
            icon: 'calendar',
            tone: 'blue',
            title: `${service} ${dayLabel(when)}`,
            text: `${a.petName} · ${a.time} · código ${a.code}`,
            // aparece no dia em que foi marcado (ou hoje, se for perto)
            date: startOfDay(when).getTime() - startOfDay(now).getTime() <= 86400000 ? now : startOfDay(now),
            target: 'consultas',
          });
        });
    }

    if (subscription?.startedAt) {
      const paidAt = new Date(subscription.startedAt);
      list.push({
        id: `pay-${subscription.startedAt}`,
        icon: subscription.status === 'paid' ? 'check-circle' : 'clock',
        tone: subscription.status === 'paid' ? 'green' : 'yellow',
        title: subscription.status === 'paid' ? 'Pagamento aprovado' : 'Pagamento em análise',
        text: `${subscription.planName} ${subscription.status === 'paid' ? 'ativo' : 'aguardando'} para ${subscription.petName}`,
        date: paidAt,
        target: 'plano',
      });
    }

    if (subscription?.scheduledChange) {
      list.push({
        id: `change-${subscription.scheduledChange.effectiveDate}`,
        icon: 'repeat',
        tone: 'blue',
        title: 'Mudança de plano agendada',
        text: `${subscription.petName} passa para o ${subscription.scheduledChange.planName} em ${new Date(
          subscription.scheduledChange.effectiveDate,
        ).toLocaleDateString('pt-BR')}`,
        date: now,
        target: 'plano',
      });
    }

    return list.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [appointments, subscription, prefs.consultas]);

  const today = startOfDay(new Date()).getTime();
  const todayItems = items.filter((item) => startOfDay(item.date).getTime() === today);
  const weekItems = items.filter((item) => startOfDay(item.date).getTime() !== today);

  const openItem = (item: Item) => {
    setReadIds((current) => (current.includes(item.id) ? current : [...current, item.id]));
    if (item.target === 'consultas') onOpenConsultations?.();
    else onOpenMyPlan?.();
  };

  const renderGroup = (title: string, group: Item[]) =>
    group.length > 0 && (
      <>
        <Text style={styles.groupTitle}>{title}</Text>
        <View style={styles.listCard}>
          {group.map((item, index) => {
            const unread = !readIds.includes(item.id);
            const tone = TONES[item.tone];
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.item, index < group.length - 1 && styles.divider]}
                onPress={() => openItem(item)}
                activeOpacity={0.75}
              >
                <View style={[styles.itemIcon, { backgroundColor: tone.bg }]}>
                  <Feather name={item.icon} size={16} color={tone.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemTitle, !unread && { fontFamily: F.semibold }]}>{item.title}</Text>
                  <Text style={styles.itemText}>{item.text}</Text>
                </View>
                {unread && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </>
    );

  const toggles: { key: keyof NotificationPrefs; title: string; text: string }[] = [
    { key: 'consultas', title: 'Consultas', text: 'Lembretes e mudanças de horário' },
    { key: 'vacinas', title: 'Vacinas', text: 'Doses que estão chegando' },
    { key: 'ofertas', title: 'Ofertas', text: 'Descontos em planos e serviços' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <PrivateHeader title="Notificações" onBack={onBack} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {items.length === 0 ? (
          <View style={[styles.listCard, styles.emptyCard]}>
            <View style={styles.emptyIcon}>
              <Feather name="bell" size={24} color={C.primary} />
            </View>
            <Text style={styles.emptyTitle}>Tudo em dia por aqui</Text>
            <Text style={styles.emptyText}>Avisos de consultas, vacinas e pagamentos aparecem aqui.</Text>
          </View>
        ) : (
          <>
            {renderGroup('Hoje', todayItems)}
            {renderGroup('Esta semana', weekItems)}
          </>
        )}

        <Text style={styles.groupTitle}>Avisos que você recebe</Text>
        <View style={styles.listCard}>
          {toggles.map((toggle, index) => (
            <View key={toggle.key} style={[styles.toggleRow, index < toggles.length - 1 && styles.divider]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>{toggle.title}</Text>
                <Text style={styles.itemText}>{toggle.text}</Text>
              </View>
              <Switch
                value={prefs[toggle.key]}
                onValueChange={(value) => onPrefsChange({ ...prefs, [toggle.key]: value })}
                trackColor={{ false: '#CBD5E1', true: C.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
        </View>
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
  scrollContent: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 130 },
  groupTitle: { fontSize: 15, fontFamily: F.bold, color: C.navy, marginTop: 16, marginBottom: 9 },
  listCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, paddingHorizontal: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: C.divider },

  item: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 12 },
  itemIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontSize: 13, fontFamily: F.bold, color: C.navy },
  itemText: { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 2 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary },

  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
  toggleTitle: { fontSize: 14, fontFamily: F.bold, color: C.navy },

  emptyCard: { alignItems: 'center', paddingVertical: 26, marginTop: 10 },
  emptyIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 15, fontFamily: F.bold, color: C.navy, marginTop: 10 },
  emptyText: { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 4, textAlign: 'center' },
});