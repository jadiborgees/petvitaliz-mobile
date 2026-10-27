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

interface PrivacyScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

export default function PrivacyScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: PrivacyScreenProps) {
  const topics = [
    { title: 'Dados coletados', subtitle: 'Quais dados coletamos e como coletamos', icon: 'cloud-upload-outline' },
    { title: 'Como usamos seus dados', subtitle: 'Finalidades e bases legais', icon: 'link-outline' },
    { title: 'Compartilhamento de dados', subtitle: 'Com quem e quando compartilhamos', icon: 'share-social-outline' },
    { title: 'Segurança da informação', subtitle: 'Como protegemos seus dados', icon: 'shield-checkmark-outline' },
    { title: 'Contato', subtitle: 'Como falar com nosso time', icon: 'headset-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Política e Privacidade</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.updateDate}>Última atualização: 24 de maio de 2024</Text>
        <Text style={styles.introText}>
          A sua privacidade é muito importante para nós. Esta Política explica como coletamos, usamos, compartilhamos e protegemos seus dados.
        </Text>

        <Text style={styles.sectionTitle}>Tópicos desta política</Text>

        <View style={styles.topicsList}>
          {topics.map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.topicCard} activeOpacity={0.7}>
              <View style={styles.topicIconCircle}>
                <Ionicons name={item.icon as any} size={18} color="#21479B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.topicTitle}>{item.title}</Text>
                <Text style={styles.topicSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.fullPolicyBtn} activeOpacity={0.85}>
          <Text style={styles.fullPolicyBtnText}>Ler política completa</Text>
        </TouchableOpacity>
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
  updateDate: { fontSize: 10, color: '#94A3B8', marginBottom: 6 },
  introText: { fontSize: 12, color: '#64748B', lineHeight: 18, marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#1E293B', marginBottom: 12 },
  topicsList: { gap: 10, marginBottom: 24 },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  topicIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0F5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicTitle: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  topicSubtitle: { fontSize: 10, color: '#94A3B8', marginTop: 1 },
  fullPolicyBtn: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullPolicyBtnText: { fontSize: 12, fontWeight: '800', color: '#1E293B' },
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