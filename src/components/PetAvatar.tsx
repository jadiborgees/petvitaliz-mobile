import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme/privateTheme';

// Foto do pet. Sem foto, mostra o ícone da espécie:
// Cachorro → cachorro, Gato → gato, Ave → pássaro, Outro → patinha.
interface PetAvatarProps {
  species?: string | null;
  avatar?: string | null;
  size?: number;
  background?: string;
}

export function getSpeciesIcon(species?: string | null): 'dog' | 'cat' | 'bird' | 'paw' {
  const normalized = (species ?? '').trim().toLowerCase();
  if (normalized.startsWith('cachorro') || normalized.startsWith('cão') || normalized.startsWith('cao')) return 'dog';
  if (normalized.startsWith('gato')) return 'cat';
  if (normalized.startsWith('ave') || normalized.startsWith('pássaro') || normalized.startsWith('passaro')) return 'bird';
  return 'paw';
}

export default function PetAvatar({
  species,
  avatar,
  size = 48,
  background = theme.colors.primarySoft,
}: PetAvatarProps) {
  const shape = { width: size, height: size, borderRadius: size / 2 };

  if (avatar) {
    return <Image source={{ uri: avatar }} style={shape} />;
  }

  return (
    <View style={[styles.fallback, shape, { backgroundColor: background }]}>
      <MaterialCommunityIcons
        name={getSpeciesIcon(species)}
        size={Math.round(size * 0.55)}
        color={theme.colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});