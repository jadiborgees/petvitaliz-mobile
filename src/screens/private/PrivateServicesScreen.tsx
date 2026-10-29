import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PrivateServicesScreenProps {
  onBack?: () => void;
}

export default function PrivateServicesScreen({ onBack }: PrivateServicesScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#21479B" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Serviços</Text>
      </View>

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Nossos Serviços Veterinários</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#21479B',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 16,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: { position: 'absolute', left: 16, top: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  scrollContent: { padding: 20 },
  title: { fontSize: 16, color: '#2A3342', fontWeight: '600', textAlign: 'center', marginTop: 20 },
});