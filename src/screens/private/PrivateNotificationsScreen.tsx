import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';

interface PrivateNotificationsScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

export default function PrivateNotificationsScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: PrivateNotificationsScreenProps) {
  // Estados dos interruptores com base no design
  const [vaccineReminders, setVaccineReminders] = useState(true);
  const [scheduledConsultations, setScheduledConsultations] = useState(true);
  const [offersAndPromos, setOffersAndPromos] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack || onNavigateToProfile} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Título e Descrição da Seção */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionMainTitle}>Suas Notificações</Text>
          <Text style={styles.sectionSubtitle}>
            Gerencie como e quando você deseja ser notificado sobre atualizações importantes.[cite: 18]
          </Text>
        </View>

        {/* Grupo de Opções com Switch */}
        <View style={styles.cardGroup}>
          
          {/* Item 1: Lembretes de Vacina */}
          <View style={styles.notificationRow}>
            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Lembretes de Vacina</Text>
              <Text style={styles.optionDesc}>Avisos sobre doses pendentes</Text>
            </View>
            <Switch
              value={vaccineReminders}
              onValueChange={setVaccineReminders}
              trackColor={{ false: '#CBD5E1', true: '#21479B' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          {/* Item 2: Consultas Agendadas */}
          <View style={styles.notificationRow}>
            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Consultas Agendadas</Text>
              <Text style={styles.optionDesc}>Confirmações e alterações de horários</Text>
            </View>
            <Switch
              value={scheduledConsultations}
              onValueChange={setScheduledConsultations}
              trackColor={{ false: '#CBD5E1', true: '#21479B' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          {/* Item 3: Ofertas e Promoções */}
          <View style={styles.notificationRow}>
            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Ofertas e Promoções</Text>
              <Text style={styles.optionDesc}>Descontos em planos e serviços</Text>
            </View>
            <Switch
              value={offersAndPromos}
              onValueChange={setOffersAndPromos}
              trackColor={{ false: '#CBD5E1', true: '#21479B' }}
              thumbColor="#FFFFFF"
            />
          </View>

        </View>

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

  sectionHeader: { marginBottom: 20 },
  sectionMainTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  sectionSubtitle: { fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 18 },

  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  textContainer: { flex: 1, marginRight: 12 },
  optionTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  optionDesc: { fontSize: 11, color: '#64748B', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 16 },
});