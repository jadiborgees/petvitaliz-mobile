import React, { useState } from 'react';
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

interface TermsScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

export default function TermsScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: TermsScreenProps) {
  const [showAll, setShowAll] = useState(false);

  const indexItems = [
    '1. Aceitação dos Termos',
    '2. Sobre o PetVitaliz',
    '3. Uso do Aplicativo',
    '4. Planos e Serviços',
    '5. Pagamentos',
    '6. Responsabilidades do Usuário',
    '7. Cancelamento e Reembolso',
    '8. Alterações nos Termos',
    '9. Lei Aplicável',
    '10. Contato',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Termos de Uso</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Índice */}
        <View style={styles.indexBox}>
          <Text style={styles.indexTitle}>Índice</Text>
          {indexItems.map((item, idx) => (
            <Text key={idx} style={styles.indexItem}>{item}</Text>
          ))}
        </View>

        {/* Conteúdo */}
        <View style={styles.sectionText}>
          <Text style={styles.termTitle}>1. Aceitação dos Termos</Text>
          <Text style={styles.termBody}>
            Ao acessar e utilizar o aplicativo PetVitaliz, você concorda com os presentes Termos de Uso e com todas as condições aqui estabelecidas.
          </Text>

          <Text style={styles.termTitle}>2. Sobre o PetVitaliz</Text>
          <Text style={styles.termBody}>
            O PetVitaliz é uma plataforma que conecta você a serviços de saúde e bem-estar para o seu pet, oferecendo planos e benefícios exclusivos.
          </Text>

          {showAll && (
            <>
              <Text style={styles.termTitle}>3. Uso do Aplicativo</Text>
              <Text style={styles.termBody}>
                O usuário compromete-se a utilizar a plataforma de forma lícita, fornecendo dados verdadeiros durante o cadastro.
              </Text>

              <Text style={styles.termTitle}>4. Planos e Serviços</Text>
              <Text style={styles.termBody}>
                Os serviços inclusos variam conforme o plano contratado e a rede credenciada parceira.
              </Text>
            </>
          )}

          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setShowAll(!showAll)}
            activeOpacity={0.7}
          >
            <Text style={styles.expandButtonText}>
              {showAll ? 'Ver menos termos' : 'Ver todos os termos'}
            </Text>
            <Ionicons name={showAll ? 'chevron-up' : 'chevron-down'} size={16} color="#21479B" />
          </TouchableOpacity>
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
  indexBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    gap: 6,
  },
  indexTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  indexItem: { fontSize: 12, fontWeight: '600', color: '#21479B' },
  sectionText: { gap: 12 },
  termTitle: { fontSize: 13, fontWeight: '800', color: '#1E293B' },
  termBody: { fontSize: 11, color: '#64748B', lineHeight: 16 },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    gap: 6,
    marginTop: 8,
  },
  expandButtonText: { fontSize: 12, fontWeight: '700', color: '#21479B' },
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