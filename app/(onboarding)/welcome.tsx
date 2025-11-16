import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowRight, Calendar, MapPin, Users, Vote, CheckCircle } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function OnboardingScreen1() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FEF2F2', '#FFFFFF', '#FFFFFF']}
        style={styles.gradientBackground}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
            
            <Text style={styles.appName}>VotoPeru</Text>
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
              La plataforma completa para ejercer tu derecho al voto de manera 
              informada y responsable
            </Text>
          </View>

          {/* Features Grid más visual */}
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View style={[styles.featureIconContainer, { backgroundColor: '#FEE2E2' }]}>
                <Calendar size={28} color="#DC2626" strokeWidth={2.5} />
              </View>
              <Text style={styles.featureTitle}>Calendario</Text>
              <Text style={styles.featureDesc}>Todas las fechas importantes</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={[styles.featureIconContainer, { backgroundColor: '#DBEAFE' }]}>
                <Vote size={28} color="#2563EB" strokeWidth={2.5} />
              </View>
              <Text style={styles.featureTitle}>Propuestas</Text>
              <Text style={styles.featureDesc}>Conoce a los candidatos</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={[styles.featureIconContainer, { backgroundColor: '#D1FAE5' }]}>
                <MapPin size={28} color="#059669" strokeWidth={2.5} />
              </View>
              <Text style={styles.featureTitle}>Tu Local</Text>
              <Text style={styles.featureDesc}>Ubicación de votación</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={[styles.featureIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Users size={28} color="#D97706" strokeWidth={2.5} />
              </View>
              <Text style={styles.featureTitle}>Guía Mesa</Text>
              <Text style={styles.featureDesc}>Capacitación completa</Text>
            </View>
          </View>

          {/* Call to action section */}
          <View style={styles.ctaSection}>
            <View style={styles.checkmarkList}>
              <View style={styles.checkmarkItem}>
                <CheckCircle size={20} color="#059669" fill="#D1FAE5" />
                <Text style={styles.checkmarkText}>Información verificada y actualizada</Text>
              </View>
              <View style={styles.checkmarkItem}>
                <CheckCircle size={20} color="#059669" fill="#D1FAE5" />
                <Text style={styles.checkmarkText}>Fácil de usar y completamente gratis</Text>
              </View>
              <View style={styles.checkmarkItem}>
                <CheckCircle size={20} color="#059669" fill="#D1FAE5" />
                <Text style={styles.checkmarkText}>Preparado para las elecciones 2026</Text>
              </View>
            </View>
          </View>

          {/* Botón principal mejorado */}
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

          {/* Footer quote */}
          <View style={styles.quoteContainer}>
            <View style={styles.quoteMark}>
              <Text style={styles.quoteMarkText}>"</Text>
            </View>
            <Text style={styles.quoteText}>
              La democracia es el gobierno del pueblo, por el pueblo, para el pueblo
            </Text>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  
  // Header
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 50,
    marginBottom: 16,
    letterSpacing: -1,
  },
  heroTitleHighlight: {
    color: '#DC2626',
  },
  heroDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },

  // Features Grid
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  featureCard: {
    width: (width - 64) / 2,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },

  // CTA Section
  ctaSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  checkmarkList: {
    gap: 16,
  },
  checkmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkmarkText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
    flex: 1,
  },

  // Main Button
  mainButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  buttonIconContainer: {
    marginLeft: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Quote
  quoteContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  quoteMark: {
    marginBottom: 8,
  },
  quoteMarkText: {
    fontSize: 48,
    color: '#E5E7EB',
    fontWeight: '700',
    lineHeight: 40,
  },
  quoteText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    maxWidth: 280,
  },
});