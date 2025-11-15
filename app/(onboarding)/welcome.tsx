import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowRight, Calendar, MapPin, Users, Vote } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OnboardingScreen1() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con logo y bandera */}
        <View style={styles.headerSection}>
          {/* TODO: Reemplaza 'logo-peru-elecciones.png' con tu imagen */}
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🇵🇪</Text>
            <Text style={styles.logoSubtext}>LOGO AQUÍ</Text>
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.appName}>VotoPeru</Text>
            <Text style={styles.subtitle}>Elecciones 2026</Text>
          </View>

          {/* Franja decorativa con colores patrios */}
          <View style={styles.banderaStripe}>
            <View style={[styles.stripeSection, { backgroundColor: '#B91C1C' }]} />
            <View style={[styles.stripeSection, { backgroundColor: '#FFFFFF' }]} />
            <View style={[styles.stripeSection, { backgroundColor: '#B91C1C' }]} />
          </View>
        </View>

        {/* Contenido principal */}
        <View style={styles.contentSection}>
          <Text style={styles.welcomeTitle}>
            Bienvenido a tu guía electoral
          </Text>
          
          <Text style={styles.description}>
            Centralizamos toda la información que necesitas para las elecciones 2026: 
            calendario electoral, propuestas de partidos, tu local de votación y tus 
            responsabilidades como miembro de mesa.
          </Text>

          {/* Features con iconos */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={styles.iconCircle}>
                <Calendar size={24} color="#B91C1C" />
              </View>
              <Text style={styles.featureText}>Calendario electoral completo</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.iconCircle}>
                <Vote size={24} color="#B91C1C" />
              </View>
              <Text style={styles.featureText}>Propuestas de candidatos</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.iconCircle}>
                <MapPin size={24} color="#B91C1C" />
              </View>
              <Text style={styles.featureText}>Tu local de votación</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.iconCircle}>
                <Users size={24} color="#B91C1C" />
              </View>
              <Text style={styles.featureText}>Guía de miembro de mesa</Text>
            </View>
          </View>

          {/* Mensaje motivacional */}
          <View style={styles.motivationalBox}>
            <Text style={styles.motivationalText}>
              "Tu voto construye el Perú del mañana"
            </Text>
          </View>
        </View>

        {/* Botón de continuar */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/(onboarding)/role')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#B91C1C', '#991B1B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Comenzar</Text>
            <ArrowRight size={22} color="white" style={{ marginLeft: 8 }} />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#F5F5F5',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#B91C1C',
  },
  logoText: {
    fontSize: 48,
  },
  logoSubtext: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    fontWeight: '600',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#B91C1C',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginTop: 4,
  },
  banderaStripe: {
    flexDirection: 'row',
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 12,
  },
  stripeSection: {
    flex: 1,
  },
  contentSection: {
    flex: 1,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: '#4A4A4A',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#B91C1C',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureText: {
    fontSize: 15,
    color: '#2A2A2A',
    fontWeight: '600',
    flex: 1,
  },
  motivationalBox: {
    backgroundColor: '#FEF2F2',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
  },
  motivationalText: {
    fontSize: 17,
    color: '#991B1B',
    fontWeight: '700',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#B91C1C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});