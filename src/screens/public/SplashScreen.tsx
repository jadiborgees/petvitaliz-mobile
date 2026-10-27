import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  // Valores animados para o primeiro ícone (icon.png)
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.7)).current;

  // Valores animados para a marca (NomeMarca.png)
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandScale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Entrada suave do ícone
      Animated.parallel([
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      // 2. Exibe o ícone por 1 segundo
      Animated.delay(1000),

      // 3. Saída do ícone
      Animated.parallel([
        Animated.timing(iconOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(iconScale, {
          toValue: 0.8,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),

      // 4. Entrada da imagem NomeMarca.png
      Animated.parallel([
        Animated.timing(brandOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(brandScale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // 5. Exibe a imagem por 1.5 segundos antes de redirecionar
      Animated.delay(1500),
    ]).start(() => {
      if (onFinish) {
        onFinish();
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* 1º Momento: Ícone inicial */}
      <Animated.View
        style={[
          styles.centered,
          {
            opacity: iconOpacity,
            transform: [{ scale: iconScale }],
          },
        ]}
      >
        <Image
          source={require('../../assets/icon.png')}
          style={styles.iconImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* 2º Momento: Imagem do Nome da Marca */}
      <Animated.View
        style={[
          styles.centered,
          {
            opacity: brandOpacity,
            transform: [{ scale: brandScale }],
          },
        ]}
      >
        <Image
          source={require('../../assets/NomeMarca.png')}
          style={styles.brandImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#21479B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 120,
    height: 120,
  },
  brandImage: {
    width: 240,
    height: 80,
  },
});