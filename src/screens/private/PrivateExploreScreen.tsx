import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrivateBottomNav from '../../components/PrivateBottomNav';

interface PrivateExploreScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

export default function PrivateExploreScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: PrivateExploreScreenProps) {
  const categories = [
    { id: '1', name: 'Saúde', icon: 'medical-outline' },
    { id: '2', name: 'Bem-estar', icon: 'heart-outline' },
    { id: '3', name: 'Alimentação', icon: 'nutrition-outline' },
    { id: '4', name: 'Exames', icon: 'document-text-outline' },
    { id: '5', name: 'Consultas', icon: 'calendar-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color="#21479B" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Explorar</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Campo de Pesquisa */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            placeholder="Buscar dúvidas..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
        </View>

        {/* Banner Principal em Destaque (Foto limpa) */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('../../assets/Explorar1.png')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Seção Categorias */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAllLink}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard} activeOpacity={0.8}>
              <View style={styles.categoryIconCircle}>
                <Ionicons name={cat.icon as any} size={22} color="#21479B" />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Seção Artigos em Destaque */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Artigos em destaque</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAllLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {/* Artigo 1 */}
        <TouchableOpacity style={styles.articleCard} activeOpacity={0.85}>
          <Image
            source={require('../../assets/Explorar2.png')}
            style={styles.articleImage}
          />
          <View style={styles.articleContent}>
            <Text style={styles.articleTitle} numberOfLines={2}>
              Vacinas: por que manter em dia é essencial
            </Text>
            <Text style={styles.articleReadTime}>5 min de leitura</Text>
          </View>
        </TouchableOpacity>

        {/* Artigo 2 */}
        <TouchableOpacity style={styles.articleCard} activeOpacity={0.85}>
          <Image
            source={require('../../assets/Explorar3.png')}
            style={styles.articleImage}
          />
          <View style={styles.articleContent}>
            <Text style={styles.articleTitle} numberOfLines={2}>
              Como adaptar sua casa para o seu pet
            </Text>
            <Text style={styles.articleReadTime}>4 min de leitura</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Barra Inferior Ficha */}
      <PrivateBottomNav
        currentRoute="PrivateExplore"
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
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#21479B',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
  },
  bannerContainer: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  seeAllLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#21479B',
  },
  categoriesScroll: {
    marginBottom: 20,
    marginHorizontal: -4,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 65,
  },
  categoryIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F0F4FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  articleImage: {
    width: 76,
    height: 76,
    borderRadius: 12,
  },
  articleContent: {
    flex: 1,
    marginLeft: 14,
  },
  articleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
    marginBottom: 6,
  },
  articleReadTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
});