import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ExploreScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToPlans?: () => void;
}

export default function ExploreScreen({
  onBack,
  onNavigateToHome,
  onNavigateToLogin,
  onNavigateToPlans,
}: ExploreScreenProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const categories = [
    { id: 1, name: 'Saúde' },
    { id: 2, name: 'Bem-estar' },
    { id: 3, name: 'Alimentação' },
    { id: 4, name: 'Comportam.' },
  ];

  const articles = [
    {
      id: 1,
      title: 'Vacinas: por que manter em dia é essencial',
      readTime: '5 min de leitura',
      imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=300',
    },
    {
      id: 2,
      title: 'Como adaptar sua casa para o seu pet',
      readTime: '4 min de leitura',
      imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300',
    },
  ];

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Topo / Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack || onNavigateToHome}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explorar</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Conteúdo Principal */}
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
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Card Destaque / Banner */}
        <View style={styles.bannerContainer}>
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
            }}
            style={styles.bannerImage}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerTitle}>A Petvitaliz tem o melhor para o seu Pet</Text>
              <Text style={styles.bannerSubtitle}>
                Saúde e bem-estar para o seu melhor amigo.
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* Seção Categorias */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesRow}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(isSelected ? null : cat.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.categoryCircle,
                    isSelected ? styles.categoryCircleActive : null,
                  ]}
                />
                <Text
                  style={[
                    styles.categoryLabel,
                    isSelected ? styles.categoryLabelActive : null,
                  ]}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Seção Artigos em destaque */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Artigos em destaque</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <TouchableOpacity key={article.id} style={styles.articleCard} activeOpacity={0.85}>
              <Image source={{ uri: article.imageUrl }} style={styles.articleImage} />
              <View style={styles.articleInfo}>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleMeta}>{article.readTime}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum artigo encontrado para "{searchText}".</Text>
        )}
      </ScrollView>

      {/* Menu de Navegação Inferior (Bottom Bar) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={onNavigateToHome}
          activeOpacity={0.7}
        >
          <Ionicons name="home-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} activeOpacity={0.7}>
          <Ionicons name="search" size={22} color="#21479B" />
          <Text style={[styles.bottomTabText, styles.bottomTabActive]}>Explorar</Text>
        </TouchableOpacity>

        {/* Botão Central com a Coroa -> navega para Planos */}
        <TouchableOpacity
          style={styles.bottomTabCenter}
          onPress={onNavigateToPlans}
          activeOpacity={0.85}
        >
          <Image
            source={require('../../assets/coroa.png')}
            style={styles.crownIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} activeOpacity={0.7}>
          <Ionicons name="gift-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Benefícios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomTab}
          onPress={onNavigateToLogin}
          activeOpacity={0.7}
        >
          <Ionicons name="person-outline" size={22} color="#94A3B8" />
          <Text style={styles.bottomTabText}>Perfil</Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#1E293B' },
  bannerContainer: { height: 180, borderRadius: 20, overflow: 'hidden', marginBottom: 20 },
  bannerImage: { flex: 1, justifyContent: 'flex-end' },
  bannerOverlay: { backgroundColor: 'rgba(0, 0, 0, 0.45)', padding: 16, borderRadius: 20 },
  bannerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 4, lineHeight: 22 },
  bannerSubtitle: { fontSize: 12, color: '#E2E8F0', lineHeight: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  seeAllText: { fontSize: 12, fontWeight: '700', color: '#21479B' },
  categoriesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  categoryItem: { alignItems: 'center', width: 72 },
  categoryCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F0F4FF',
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoryCircleActive: { backgroundColor: '#21479B', borderColor: '#1B4298' },
  categoryLabel: { fontSize: 11, fontWeight: '600', color: '#64748B', textAlign: 'center' },
  categoryLabelActive: { color: '#21479B', fontWeight: '800' },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  articleImage: { width: 80, height: 80, borderRadius: 12 },
  articleInfo: { flex: 1 },
  articleTitle: { fontSize: 13, fontWeight: '700', color: '#1E293B', lineHeight: 18, marginBottom: 6 },
  articleMeta: { fontSize: 11, color: '#94A3B8' },
  emptyText: { textAlign: 'center', color: '#94A3B8', fontSize: 13, marginVertical: 20 },
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