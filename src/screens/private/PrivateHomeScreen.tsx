import React from 'react';
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

interface PrivateHomeScreenProps {
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToSupport?: () => void;
  profileImage?: string | null;
  userName?: string;
}

export default function PrivateHomeScreen({
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
  onNavigateToServices,
  onNavigateToSupport,
  profileImage,
  userName = 'Jadi Borges',
}: PrivateHomeScreenProps) {
  const services = [
    { id: '1', name: 'Banho e Tosa', icon: 'water-outline', bg: '#E0F2FE', color: '#0284C7' },
    { id: '2', name: 'Exames', icon: 'flask-outline', bg: '#FEF9C3', color: '#CA8A04' },
    { id: '3', name: 'Vacinação', icon: 'medical-outline', bg: '#DCFCE7', color: '#16A34A' },
    { id: '4', name: 'Emergência 24h', icon: 'alert-circle-outline', bg: '#FEE2E2', color: '#DC2626' },
    { id: '5', name: 'Leva & Traz Pet', icon: 'car-outline', bg: '#EFF6FF', color: '#2563EB' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.9} onPress={onNavigateToProfile}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImageHeader} />
          ) : (
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {userName ? userName.charAt(0).toUpperCase() : 'J'}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.greetingText}>Olá, {userName}!</Text>
          <Text style={styles.headerTitle}>O que você procura hoje?</Text>
        </View>

        <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={22} color="#0F172A" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Seção: Meu plano */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Meu plano</Text>
          <TouchableOpacity onPress={onNavigateToPlans} activeOpacity={0.7}>
            <Text style={styles.seeMoreLink}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsHorizontalScroll}>
          {/* Card Pet 1: Lua */}
          <TouchableOpacity style={styles.planPetCard} activeOpacity={0.9} onPress={onNavigateToPlans}>
            <View style={styles.petHeaderRow}>
              <Image source={require('../../assets/Explorar2.png')} style={styles.petImage} />
              <View style={styles.petInfoText}>
                <Text style={styles.petName}>Lua</Text>
                <Text style={styles.petDetails}>Golden Retriever · 3 anos</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </View>

            <View style={styles.planStatusBox}>
              <View>
                <Text style={styles.planNameLabel}>Plano Ouro</Text>
                <Text style={styles.planRenewalLabel}>Prox. renovação <Text style={styles.boldText}>24/06/2027</Text></Text>
              </View>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>ATIVO</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card Pet 2: Savannah */}
          <TouchableOpacity style={styles.planPetCard} activeOpacity={0.9} onPress={onNavigateToPlans}>
            <View style={styles.petHeaderRow}>
              <Image source={require('../../assets/Explorar3.png')} style={styles.petImage} />
              <View style={styles.petInfoText}>
                <Text style={styles.petName}>Savannah</Text>
                <Text style={styles.petDetails}>Female</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </View>

            <View style={styles.planStatusBox}>
              <View>
                <Text style={styles.planNameLabel}>Service Type</Text>
                <Text style={styles.boldText}>Grooming</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Seção: Serviços */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Serviços</Text>
          <TouchableOpacity onPress={onNavigateToServices} activeOpacity={0.7}>
            <Text style={styles.seeMoreLink}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.servicesHorizontalScroll}>
          {services.map((item) => (
            <TouchableOpacity key={item.id} style={styles.serviceItem} activeOpacity={0.8} onPress={onNavigateToServices}>
              <View style={[styles.serviceIconCircle, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <Text style={styles.serviceName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Seção: Dicas para o seu Pet */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Dicas para o seu Pet</Text>
          <TouchableOpacity onPress={onNavigateToExplore} activeOpacity={0.7}>
            <Text style={styles.seeMoreLink}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsHorizontalScroll}>
          {/* Dica 1 */}
          <TouchableOpacity style={styles.tipCard} activeOpacity={0.85} onPress={onNavigateToExplore}>
            <Image source={require('../../assets/Explorar3.png')} style={styles.tipCardImage} />
            <Text style={styles.tipCardTitle} numberOfLines={2}>
              Como escovar os dentes do seu pet
            </Text>
          </TouchableOpacity>

          {/* Dica 2 */}
          <TouchableOpacity style={styles.tipCard} activeOpacity={0.85} onPress={onNavigateToExplore}>
            <Image source={require('../../assets/Explorar2.png')} style={styles.tipCardImage} />
            <Text style={styles.tipCardTitle} numberOfLines={2}>
              Sinais de que é hora do banho
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Card Suporte/Atendimento */}
        <TouchableOpacity style={styles.supportCard} activeOpacity={0.85} onPress={onNavigateToSupport}>
          <View style={styles.supportIconBg}>
            <Ionicons name="headset-outline" size={22} color="#21479B" />
          </View>
          <View style={styles.supportTextContent}>
            <Text style={styles.supportTitle}>Falar com nossa equipe</Text>
            <Text style={styles.supportSubtitle}>Atendimento por chat ou WhatsApp</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>

      </ScrollView>

      {/* Barra Inferior Fixa */}
      <PrivateBottomNav
        currentRoute="PrivateHome"
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingBottom: 16,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EAB308',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImageHeader: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#21479B',
    marginTop: 2,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  notificationBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  seeMoreLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#21479B',
  },
  cardsHorizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  planPetCard: {
    width: 270,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  petHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  petImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  petInfoText: {
    flex: 1,
    marginLeft: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  petDetails: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  planStatusBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
  },
  planNameLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  planRenewalLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  boldText: {
    fontWeight: '700',
    color: '#334155',
  },
  activeBadge: {
    backgroundColor: '#84CC16',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  activeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  servicesHorizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  serviceItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 72,
  },
  serviceIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 10,
    fontWeight: '500',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 13,
  },
  tipsHorizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  tipCard: {
    width: 170,
    marginRight: 14,
  },
  tipCardImage: {
    width: 170,
    height: 110,
    borderRadius: 16,
    marginBottom: 8,
  },
  tipCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 16,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  supportIconBg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportTextContent: {
    flex: 1,
    marginLeft: 12,
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  supportSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});