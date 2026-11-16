import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image, Easing, Dimensions, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SplashScreenProps {
  onFinish?: () => void;
}

const { width, height } = Dimensions.get('window');

const PRIMARY = '#183C98';

// Pegadas em zigue-zague (esquerda/direita), como um pet andando até o centro
const PAWS = [
  { x: 0.40, y: 0.94, r: '-12deg' },
  { x: 0.52, y: 0.87, r: '12deg' },
  { x: 0.38, y: 0.80, r: '-12deg' },
  { x: 0.50, y: 0.73, r: '12deg' },
  { x: 0.36, y: 0.66, r: '-12deg' },
  { x: 0.48, y: 0.59, r: '12deg' },
];
const PAW_SIZE = 48;

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const paws = useRef(PAWS.map(() => new Animated.Value(0))).current; // pisada
  const fades = useRef(PAWS.map(() => new Animated.Value(1))).current; // rastro some
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandY = useRef(new Animated.Value(16)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // cada passo: a pata "pisa" (cai grande e assenta) e a pegada de 3 passos atrás vai apagando
    const steps = paws.map((v: Animated.Value, i: number) =>
      Animated.parallel([
        Animated.timing(v, { toValue: 1, duration: 260, easing: Easing.out(Easing.back(2)), useNativeDriver: true }),
        ...(i >= 3
          ? [Animated.timing(fades[i - 3], { toValue: 0.35, duration: 400, useNativeDriver: true })]
          : []),
      ])
    );

    const anim = Animated.sequence([
      // 1. pet andando: um passo de cada vez
      Animated.stagger(380, steps),
      Animated.delay(350),
      // 2. pegadas somem
      Animated.parallel(
        fades.map((v: Animated.Value) => Animated.timing(v, { toValue: 0, duration: 400, useNativeDriver: true }))
      ),
      // 3. logo aparece
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      ]),
      // 4. nome aparece
      Animated.parallel([
        Animated.timing(brandOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(brandY, { toValue: 0, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      // 5. frase aparece
      Animated.timing(tagOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.delay(700),
      Animated.timing(screenOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]);

    anim.start(({ finished }: { finished: boolean }) => {
      if (finished) onFinish?.();
    });
    return () => anim.stop();
  }, []);


  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <StatusBar barStyle="light-content" />


      {/* Patinhas */}
      {PAWS.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.paw,
            {
              left: width * p.x,
              top: height * p.y,
              opacity: Animated.multiply(
                paws[i].interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 1] }),
                fades[i]
              ),
              transform: [
                { rotate: p.r },
                { scale: paws[i].interpolate({ inputRange: [0, 1], outputRange: [1.6, 1] }) },
              ],
            },
          ]}
        >
          <MaterialCommunityIcons name="paw" size={PAW_SIZE} color="#FFFFFF" />
        </Animated.View>
      ))}

      {/* Logo */}
      <View style={styles.center}>
        <Animated.View style={[styles.logoCircle, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <Image source={require('../../assets/logo-icon.png')} style={[styles.logoIcon, { tintColor: '#FFFFFF' }]} resizeMode="contain" />
        </Animated.View>

        <Animated.Image
          source={require('../../assets/logo-wordmark-white.png')}
          style={[styles.wordmark, { opacity: brandOpacity, transform: [{ translateY: brandY }] }]}
          resizeMode="contain"
        />


        <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
          Cuidado completo para o seu pet
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PRIMARY, overflow: 'hidden' },
  paw: { position: 'absolute' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoCircle: { alignItems: 'center', justifyContent: 'center' },
  logoIcon: { width: 110, height: 100 },
  wordmark: { width: 200, height: 42, marginTop: 22 },
  tagline: {
    marginTop: 12,
    color: '#FFFFFF',
    opacity: 0.85,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
});