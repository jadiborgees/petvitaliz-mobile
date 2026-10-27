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

interface SupportScreenProps {
  onBack?: () => void;
  onNavigateToFaq?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

export default function SupportScreen({
  onBack,
  onNavigateToFaq,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: SupportScreenProps) {
  const topics = [
    { title: 'Falar com nossa equipe', icon: 'headset-outline' },
    { title: 'Dúvidas sobre pagamentos', icon: 'card-outline' },
    { title: 'Problemas com meu plano', icon: 'document-text-outline' },
    { title: 'Cadastro e acesso', icon: 'person-outline' },
    { title: 'Meu Pet', icon: 'paw-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajuda e Suporte</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner Destaque */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerIconCircle}>
            <Ionicons name="headset-outline" size={24} color="#21479B" />
          </View>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Como podemos ajudar você?</Text>
            <Text style={styles.bannerSubtitle}>
              Estamos aqui para te ajudar sempre que precisar.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>ASSUNTOS MAIS ACESSADOS</Text>

        <View style={styles.topicsList}>
          {topics.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.topicCard}
              onPress={item.title === 'Falar com nossa equipe' ? undefined : onNavigateToFaq}
              activeOpacity={0.7}
            >
              <View style={styles.topicIconCircle}>
                <Ionicons name={item.icon as any} size={18} color="#21479B" />
              </View>
              <Text style={styles.topicTitle}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToHome} activeOpacity={0.7}>
          <Ionicons name="home-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToExplore} activeOpacity={0.7}>
          <Ionicons name="search-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Explorar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTabCenter} onPress={onNavigateToPlans} activeOpacity={0.85}>
          <Image source={require('../../assets/coroa.png')} style={styles.crownIcon} resizeMode="contain" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToBenefits} activeOpacity={0.7}>
          <Ionicons name="gift-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Benefícios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} onPress={onNavigateToProfile || onBack} activeOpacity={0.7}>
          <Ionicons name="person" size={22} color="#21479B" />
          <Text style={[styles.bottomTabText, styles.bottomTabActive]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#21479B' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    marginBottom: 20,
  },
  bannerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextContainer: { flex: 1 },
  bannerTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  bannerSubtitle: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  sectionLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 12 },
  topicsList: { gap: 10 },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  topicIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F0F5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicTitle: { flex: 1, fontSize: 13, fontWeight: '700', color: '#1E293B' },
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
  bottomTab: { alignItems: 'center', justifyContent: 'center' },
  bottomTabText: { fontSize: 10, color: '#94A3B8', marginTop: 2, fontWeight: '500' },
  bottomTabActive: { color: '#21479B', fontWeight: '800' },
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
  crownIcon: { width: 24, height: 24, tintColor: '#FFFFFF' },
});