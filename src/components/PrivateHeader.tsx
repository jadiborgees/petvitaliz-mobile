import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/privateTheme';

// Cabeçalho padrão das telas privadas (modelo: tela Meu Plano).
// Fundo branco, seta à esquerda, título azul-marinho centralizado
// e uma linha fina embaixo. Fica fixo no topo e respeita a barra do celular.
interface PrivateHeaderProps {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

export default function PrivateHeader({ title, onBack, right }: PrivateHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.side}>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
              <Feather name="arrow-left" size={22} color={theme.colors.navy} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={[styles.side, styles.sideRight]}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: STATUS_BAR_HEIGHT,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  header: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  side: { width: 40 },
  sideRight: { alignItems: 'flex-end' },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 19,
    fontFamily: theme.fonts.bold,
    color: theme.colors.navy,
  },
});