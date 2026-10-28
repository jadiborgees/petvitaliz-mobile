import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PrivateHomeScreenProps {
  onNavigateToPetDetails?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToSupport?: () => void;
}

export default function PrivateHomeScreen({
  onNavigateToPetDetails,
  onNavigateToServices,
  onNavigateToPlans,
  onNavigateToExplore,
  onNavigateToBenefits,
  onNavigateToProfile,
  onNavigateToSupport,
}: PrivateHomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Topo / Header do Utilizador Logado */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.userAvatarCircle} activeOpacity={0.8}>
            <Text style={styles.userAvatarInitial}>J</Text>
          </TouchableOpacity>

          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Olá, Jadi Borges!</Text>
            <Text style={styles.mainTitle}>O que você procura hoje?</Text>
          </View>

          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={20} color="#1E293B" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* 1. Seção Meu Plano / Meus Pets */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Meu plano</Text>
          <TouchableOpacity onPress={onNavigateToPlans} activeOpacity={0.7}>
            <Text style={styles.seeMoreText}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {/* Card Pet 1 - Lua */}
          <TouchableOpacity
            style={styles.petCard}
            onPress={onNavigateToPetDetails}
            activeOpacity={0.9}
          >
            <View style={styles.petHeaderRow}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200',
                }}
                style={styles.petAvatar}
              />
              <View style={styles.petInfo}>
                <Text style={styles.petName}>Lua</Text>
                <Text style={styles.petBreed}>Golden Retriever · 3 anos</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </View>

            <View style={styles.planStatusBox}>
              <View style={styles.planDetailsCol}>
                <Text style={styles.planTitle}>Plano Ouro</Text>
                <Text style={styles.renovationLabel}>
                  Prox. renovação <Text style={styles.renovationDate}>24/06/2027</Text>
                </Text>
              </View>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>ATIVO</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card Pet 2 - Savannah */}
          <TouchableOpacity style={styles.petCard} activeOpacity={0.9}>
            <View style={styles.petHeaderRow}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200',
                }}
                style={styles.petAvatar}
              />
              <View style={styles.petInfo}>
                <Text style={styles.petName}>Savannah</Text>
                <Text style={styles.petBreed}>Female</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </View>

            <View style={styles.planStatusBox}>
              <View style={styles.planDetailsCol}>
                <Text style={styles.serviceTypeLabel}>Service Type</Text>
                <Text style={styles.serviceTypeValue}>Grooming</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* 2. Seção Serviços */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Serviços</Text>
          <TouchableOpacity onPress={onNavigateToServices} activeOpacity={0.7}>
            <Text style={styles.seeMoreText}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          <TouchableOpacity style={styles.serviceItem} onPress={onNavigateToServices} activeOpacity={0.7}>
            <View style={[styles.serviceCircle, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="water-outline" size={22} color="#0284C7" />
            </View>
            <Text style={styles.serviceLabel}>Banho e Tosa</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceItem} onPress={onNavigateToServices} activeOpacity={0.7}>
            <View style={[styles.serviceCircle, { backgroundColor: '#FEF08A' }]}>
              <Ionicons name="flask-outline" size={22} color="#CA8A04" />
            </View>
            <Text style={styles.serviceLabel}>Exames</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceItem} onPress={onNavigateToServices} activeOpacity={0.7}>
            <View style={[styles.serviceCircle, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="color-fill-outline" size={22} color="#16A34A" />
            </View>
            <Text style={styles.serviceLabel}>Vacinação</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceItem} onPress={onNavigateToServices} activeOpacity={0.7}>
            <View style={[styles.serviceCircle, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="warning-outline" size={22} color="#DC2626" />
            </View>
            <Text style={styles.serviceLabel}>Emergência 24h</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceItem} onPress={onNavigateToServices} activeOpacity={0.7}>
            <View style={[styles.serviceCircle, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="car-outline" size={22} color="#2563EB" />
            </View>
            <Text style={styles.serviceLabel}>Leva & Traz Pet</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* 3. Seção Dicas para o seu Pet */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dicas para o seu Pet</Text>
          <TouchableOpacity onPress={onNavigateToExplore} activeOpacity={0.7}>
            <Text style={styles.seeMoreText}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          <View style={styles.tipCardContainer}>
            <View style={[styles.tipBanner, { backgroundColor: '#D4CFC9' }]} />
            <Text style={styles.tipTitle}>Como escovar os dentes do seu pet</Text>
          </View>

          <View style={styles.tipCardContainer}>
            <View style={[styles.tipBanner, { backgroundColor: '#CBDDCB' }]} />
            <Text style={styles.tipTitle}>Sinais de que é hora do banho</Text>
          </View>
        </ScrollView>

        {/* 4. Seção Suporte / Ajuda */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ficou com Dúvida?</Text>
          <TouchableOpacity onPress={onNavigateToSupport} activeOpacity={0.7}>
            <Text style={styles.seeMoreText}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.supportCard}
          onPress={onNavigateToSupport}
          activeOpacity={0.8}
        >
          <View style={styles.supportIconBadge}>
            <Ionicons name="headset-outline" size={20} color="#21479B" />
          </View>
          <View style={styles.supportInfo}>
            <Text style={styles.supportTitle}>Falar com nossa equipe</Text>
            <Text style={styles.supportSubtitle}>Atendimento por chat ou WhatsApp</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </ScrollView>

      {/* Menu de Navegação Inferior (Bottom Bar) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomTab} activeOpacity={0.7}>
          <Ionicons name="home" size={22} color="#21479B" />
          <Text style={[styles.bottomTabText, styles.bottomTabActive]}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToExplore} activeOpacity={0.7}>
          <Ionicons name="search-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Explorar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTabCenter} onPress={onNavigateToPlans} activeOpacity={0.85}>
          <Image
            source={require('../../assets/coroa.png')}
            style={styles.crownIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToBenefits} activeOpacity={0.7}>
          <Ionicons name="gift-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Benefícios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToProfile} activeOpacity={0.7}>
          <Ionicons name="person-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAB308',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarInitial: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  greetingContainer: {
    flex: 1,
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  mainTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#21479B',
    marginTop: 2,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  seeMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#21479B',
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  petCard: {
    width: 270,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  petHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  petAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  petBreed: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  planStatusBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planDetailsCol: {
    flex: 1,
  },
  planTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  renovationLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  renovationDate: {
    color: '#64748B',
    fontWeight: '600',
  },
  activeBadge: {
    backgroundColor: '#84CC16',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  serviceTypeLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  serviceTypeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  serviceItem: {
    alignItems: 'center',
    width: 72,
  },
  serviceCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  serviceLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  tipCardContainer: {
    width: 170,
  },
  tipBanner: {
    height: 95,
    borderRadius: 16,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    lineHeight: 15,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  supportIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0F5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportInfo: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  supportSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  bottomBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  bottomTab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTabText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  bottomTabActive: {
    color: '#21479B',
    fontWeight: '800',
  },
  bottomTabCenter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1B4298',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    elevation: 4,
    shadowColor: '#1B4298',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  crownIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
});