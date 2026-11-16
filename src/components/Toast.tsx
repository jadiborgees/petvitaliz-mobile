import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/privateTheme';

// Aviso curto que aparece embaixo e some sozinho (regra N15:
// edições simples terminam em toast).
interface ToastProps {
  message: string;
  onHide: () => void;
  tone?: 'success' | 'info';
  duration?: number;
}

export default function Toast({ message, onHide, tone = 'success', duration = 2400 }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) return;
    opacity.setValue(0);
    Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => onHide());
    }, duration);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <Animated.View style={[styles.wrap, { opacity }]} pointerEvents="none">
      <View style={styles.toast}>
        <Feather
          name={tone === 'success' ? 'check-circle' : 'info'}
          size={17}
          color={tone === 'success' ? '#5EE0A6' : theme.colors.brandYellow}
        />
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 18, right: 18, bottom: 110, alignItems: 'center' },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: theme.colors.navy,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignSelf: 'stretch',
  },
  text: { flex: 1, fontSize: 13, fontFamily: theme.fonts.semibold, color: '#FFFFFF' },
});