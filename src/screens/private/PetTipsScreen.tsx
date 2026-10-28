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

interface PetTipsScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToBenefits?: () => void;
  onNavigateToProfile?: () => void;
}

interface TipItem {
  id: string;
  category: string;
  categoryLabel: string;
  categoryColor: string;
  title: string;
  readTime: string;
  imageUrl: string;
}

export default function PetTipsScreen({
  onBack,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToPlans,
  onNavigateToBenefits,
  onNavigateToProfile,
}: PetTipsScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', 'Alimentação', 'Saúde', 'Comportamento'];

  const tips: TipItem[] = [
    {
      id: '1',
      category: 'Alimentação',
      categoryLabel: 'ALIMENTAÇÃO',
      categoryColor: '#21479B',
      title: 'Como escolher a ração ideal para cada idade',
      readTime: '4 min de leitura',
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300&auto=format&fit=crop',
    },
    {
      id: '2',
      category: 'Saúde',
      categoryLabel: 'SAÚDE',
      categoryColor: '#16A34A',
      title: 'Sinais de que seu pet precisa ir ao veterinário',
      readTime: '6 min de leitura',
      imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=300&auto=format&fit=crop',
    },
    {
      id: '3',
      category: 'Comportamento',
      categoryLabel: 'COMPORTAMENTO',
      categoryColor: '#D97706',
      title: 'Ansiedade de separação: como identificar',
      readTime: '5 min de leitura',
      imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=300&auto=format&fit=crop',
    },
  ];

  const filteredTips =
    selectedCategory === 'Todas'
      ? tips
      : tips.filter((tip) => tip.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack || onNavigateToHome}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#21479B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dicas para o seu Pet</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Categorias / Chips Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipSelected,
                ]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Lista de Cards de Dicas */}
        <View style={styles.tipsList}>
          {filteredTips.map((tip) => (
            <TouchableOpacity key={tip.id} style={styles.tipCard} activeOpacity={0.85}>
              <Image source={{ uri: tip.imageUrl }} style={styles.tipImage} />
              <View style={styles.tipContent}>
                <Text style={[styles.tipCategory, { color: tip.categoryColor }]}>
                  {tip.categoryLabel}
                </Text>
                <Text style={styles.tipTitle} numberOfLines={2}>
                  {tip.title}
                </Text>
                <View style={styles.readTimeRow}>
                  <Ionicons name="time-outline" size={14} color="#94A3B8" />
                  <Text style={styles.readTimeText}>{tip.readTime}</Text>
                </View>
              </View>
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
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#21479B',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
    paddingVertical: 4,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipSelected: {
    backgroundColor: '#1B4298',
    borderColor: '#1B4298',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tipsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  tipImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  tipContent: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  tipCategory: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 18,
    marginBottom: 8,
  },
  readTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },