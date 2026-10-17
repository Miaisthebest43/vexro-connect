import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors } from '../theme/colors';

export default function LoadingScreen() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim, fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.Text style={[styles.logo, { transform: [{ scale: pulseAnim }] }]}>
          VEXRO
        </Animated.Text>
        <Text style={styles.tagline}>Your people. Your space. Your rules.</Text>
        
        <View style={styles.loaderContainer}>
          <View style={styles.loaderBar} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 56,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 8,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 14,
    color: colors.textDim,
    letterSpacing: 1,
    marginBottom: 48,
  },
  loaderContainer: {
    width: 200,
    height: 4,
    backgroundColor: colors.card,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderBar: {
    width: '50%',
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
});