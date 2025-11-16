import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowRight, Calendar, MapPin, Users, Vote } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function OnboardingScreen1() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FEF2F2', '#FFFFFF', '#FFFFFF']}
        style={styles.gradientBackground}
      >
        {/* Contenedor principal sin ScrollView */}
        <View style={styles.contentWrapper}>
          
          {/* Zona superior (todo lo que puede crecer) */}
          <View style={styles.topSection}>
            {/* Header minimalista */}
            <View style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={['#DC2626', '#B91C1C']}
                  style={styles.logoGradient}
                >
                  <Text style={styles.logoEmoji}>🇵🇪</Text>
                </LinearGradient>
              </View>
              
              <Text style={styles.appName}>InfoVoto</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>ELECCIONES 2026</Text>
              </View>
            </View>

            {/* Hero Section */}
            <View style={styles.heroSection}>
              <Text style={styles.heroTitle}>
                Tu Voz,{'\n'}Tu Voto,{'\n'}
                <Text style={styles.heroTitleHighlight}>Tu Futuro</Text>
              </Text>
              
              <Text style={styles.heroDescription}>
                La plataforma para ejercer tu derecho al voto de manera 
                informada y responsable.
              </Text>
            </View>

            {/* Features (dejamos todo pero más compacto) */}
            <View style={styles.featuresGrid}>
              <View style={styles.featureCard}>
                <View style={[styles.featureIconContainer, { backgroundColor: '#FEE2E2' }]}>
                  <Calendar size={24} color="#DC2626" strokeWidth={2.3} />
                </View>
                <Text style={styles.featureTitle}>Calendario</Text>
                <Text style={styles.featureDesc}>Fechas clave</Text>
              </View>

              <View style={styles.featureCard}>
                <View style={[styles.featureIconContainer, { backgroundColor: '#DBEAFE' }]}>
                  <Vote size={24} color="#2563EB" strokeWidth={2.3} />
                </View>
                <Text style={styles.featureTitle}>Propuestas</Text>
                <Text style={styles.featureDesc}>Candidatos</Text>
              </View>

              <View style={styles.featureCard}>
                <View style={[styles.featureIconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <MapPin size={24} color="#059669" strokeWidth={2.3} />
                </View>
                <Text style={styles.featureTitle}>Tu Local</Text>
                <Text style={styles.featureDesc}>Dónde votas</Text>
              </View>

              <View style={styles.featureCard}>
                <View style={[styles.featureIconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <Users size={24} color="#D97706" strokeWidth={2.3} />
                </View>
                <Text style={styles.featureTitle}>Guía Mesa</Text>
                <Text style={styles.featureDesc}>Capacitación</Text>
              </View>
            </View>

          </View>

          {/* Zona inferior fija: botón */}
          <View style={styles.bottomSection}>
            <TouchableOpacity 
              style={styles.mainButton} 
              onPress={() => router.push('/(onboarding)/role')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#DC2626', '#B91C1C', '#991B1B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Comenzar Ahora</Text>
                <View style={styles.buttonIconContainer}>
                  <ArrowRight size={20} color="white" strokeWidth={3} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradientBackground: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },

  // Top section
  topSection: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  // Bottom section (botón fijo)
  bottomSection: {
    paddingTop: 8,
  },

  // Header
  headerSection: {
    alignItems: 'center',
    marginBottom: 24, // antes 40
  },
  logoContainer: {
    marginBottom: 12,
  },
  logoGradient: {
    width: 64,    // antes 80
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  logoEmoji: {
    fontSize: 32,
  },
  appName: {
    fontSize: 26, // antes 32
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  badge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: 24, // antes 40
    paddingHorizontal: 8,
  },
  heroTitle: {
    fontSize: 34, // antes 42
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
    letterSpacing: -0.8,
  },
  heroTitleHighlight: {
    color: '#DC2626',
  },
  heroDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },

  // Features Grid
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20, // antes 32
  },
  featureCard: {
    width: (width - 64) / 2,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14, // más compactos
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 14,
  },

  // CTA Section
  ctaSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16, // antes 24
    marginBottom: 8, // antes 24
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  checkmarkList: {
    gap: 10,
  },
  checkmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkmarkText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },

  // Main Button
  mainButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  buttonIconContainer: {
    marginLeft: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});