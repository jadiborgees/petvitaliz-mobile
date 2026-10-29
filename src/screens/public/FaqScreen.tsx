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
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../../components/BottomNavigation';

interface FaqScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

export default function FaqScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: FaqScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Topo / Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack || onNavigateToProfile}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Barra de Pesquisa */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar dúvidas..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categorias */}
        <Text style={styles.sectionTitle}>Categorias</Text>
        <View style={styles.categoriesContainer}>
          {[
            { title: 'Planos', desc: 'Dúvidas sobre planos e benefícios', icon: 'cube-outline' },
            { title: 'Pagamentos', desc: 'Cobranças, faturas e reembolsos', icon: 'card-outline' },
            { title: 'Consultas e serviços', desc: 'Agendamentos e atendimento', icon: 'help-circle-outline' },
            { title: 'Pets', desc: 'Cadastro e cuidados', icon: 'paw-outline' },
            { title: 'Conta', desc: 'Acesso, dados e segurança', icon: 'person-outline' },
          ].map((cat, index) => (
            <TouchableOpacity key={index} style={styles.categoryCard} activeOpacity={0.7}>
              <View style={styles.categoryIconBadge}>
                <Ionicons name={cat.icon as any} size={20} color="#21479B" />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>{cat.title}</Text>
                <Text style={styles.categoryDesc}>{cat.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Perguntas Frequentes */}
        <Text style={styles.sectionTitle}>Perguntas frequentes</Text>
        <View style={styles.faqList}>
          {[
            'Como funciona o PetVitaliz?',
            'Como faço para contratar um plano?',
            'Quais são as formas de pagamento?',
            'Como cancelar meu plano?',
          ].map((faq, index) => (
            <TouchableOpacity key={index} style={styles.faqItem} activeOpacity={0.7}>
              <Text style={styles.faqText}>{faq}</Text>
              <Ionicons name="chevron-down" size={18} color="#21479B" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Componente Global de Navegação */}
      <BottomNavigation
        currentRoute="Profile"
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
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: '#F8FAFC',
    marginBottom: 20,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#1E293B' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12 },
  categoriesContainer: { gap: 10, marginBottom: 24 },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  categoryIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfo: { flex: 1 },
  categoryTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  categoryDesc: { fontSize: 11, color: '#64748B', marginTop: 2 },
  faqList: { gap: 10 },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  faqText: { fontSize: 13, fontWeight: '700', color: '#1E293B', flex: 1 },
});