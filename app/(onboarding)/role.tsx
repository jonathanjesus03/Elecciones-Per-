import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowRight, Check, Info, User, Users } from 'lucide-react-native';
import type { FC } from 'react';
import React, { useState } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Tipos de roles de usuario
type RolUsuario = 'info' | 'elector' | 'mesa' | 'ambos';

// Componente de Card (reusado)
type IconComponent = FC<{ size?: number; color?: string }> | React.ComponentType<any>;

interface CardProps {
  title: string;
  text: string;
  icon: IconComponent;
  onPress?: (event?: GestureResponderEvent) => void;
  isSelected?: boolean;
}

const Card: FC<CardProps> = ({ title, text, icon: Icon, onPress, isSelected }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.card, isSelected && styles.cardSelected]}
    activeOpacity={0.7}
  >
    <View style={styles.cardIconContainer}>
      <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
        <Icon size={24} color={isSelected ? "#FFFFFF" : "#B91C1C"} />
      </View>
    </View>
    <View style={styles.cardContent}>
      <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>{title}</Text>
      <Text style={[styles.cardText, isSelected && styles.cardTextSelected]}>{text}</Text>
    </View>
    {isSelected && (
      <View style={styles.checkmarkContainer}>
        <Check size={20} color="#FFFFFF" strokeWidth={3} />
      </View>
    )}
  </TouchableOpacity>
);

export default function OnboardingScreen2() {
  const [role, setRole] = useState<RolUsuario | null>(null);
  const [ambos, setAmbos] = useState(false);

  const handleNext = async () => {
    // Determinar el rol final
    let finalRole: RolUsuario = role ?? 'info';
    if (ambos) finalRole = 'ambos';

    try {
      // Guardar en AsyncStorage (local)
      await AsyncStorage.setItem('@role', finalRole);
      console.log("Rol guardado:", finalRole);
      
      // TODO: Cuando tengas backend, enviar aquí:
      // await enviarRolAlBackend(finalRole);
      
      // Lógica de navegación mejorada
      if (finalRole === 'info') {
        // Si solo quiere informarse, va directamente a la app principal
        router.replace('/(tabs)');
      } else {
        // Si es elector o miembro de mesa, necesita ubicación
        router.push('/(onboarding)/location');
      }
    } catch (e) {
      console.error("Error guardando rol", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con bandera peruana */}
        <View style={styles.headerStripe}>
          <View style={[styles.stripeSection, { backgroundColor: '#B91C1C' }]} />
          <View style={[styles.stripeSection, { backgroundColor: '#FFFFFF' }]} />
          <View style={[styles.stripeSection, { backgroundColor: '#B91C1C' }]} />
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.title}>¿Cómo participarás en las elecciones?</Text>
          <Text style={styles.subtitle}>
            Selecciona tu rol para personalizar la información que recibirás
          </Text>

          <View style={styles.cardsContainer}>
            <Card 
              title="Solo quiero informarme" 
              text="Ver propuestas, calendario y noticias generales. Acceso inmediato." 
              icon={Info} 
              onPress={() => {
                setRole('info');
                setAmbos(false);
              }}
              isSelected={role === 'info'}
            />
            <Card 
              title="Soy elector" 
              text="Quiero saber dónde votar y cómo será mi voto. Requiere ubicación." 
              icon={User} 
              onPress={() => setRole('elector')}
              isSelected={role === 'elector'}
            />
            <Card 
              title="Soy miembro de mesa" 
              text="Necesito conocer mis deberes y el paso a paso. Requiere ubicación." 
              icon={Users} 
              onPress={() => setRole('mesa')}
              isSelected={role === 'mesa'}
            />
          </View>

          {/* Checkbox mejorado */}
          {(role === 'elector' || role === 'mesa') && (
            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={() => setAmbos(!ambos)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, ambos && styles.checkboxSelected]}>
                {ambos && <Check size={18} color="white" strokeWidth={3} />}
              </View>
              <Text style={styles.checkboxText}>
                Soy elector y miembro de mesa a la vez
              </Text>
            </TouchableOpacity>
          )}

          {/* Información adicional sobre el flujo */}
          {role && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                {role === 'info' 
                  ? '✅ Accederás directamente a toda la información electoral' 
                  : '📍 A continuación necesitaremos tu ubicación para mostrarte información específica de tu local de votación'
                }
              </Text>
            </View>
          )}
        </View>

        {/* Botón con gradiente */}
        <TouchableOpacity 
          style={[styles.button, !role && styles.buttonDisabled]} 
          onPress={handleNext}
          disabled={!role}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={role ? ['#B91C1C', '#991B1B'] : ['#9CA3AF', '#6B7280']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {role === 'info' ? 'Comenzar' : 'Siguiente'}
            </Text>
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
    paddingTop: 20,
  },
  headerStripe: {
    flexDirection: 'row',
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 24,
  },
  stripeSection: {
    flex: 1,
  },
  contentSection: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  cardSelected: {
    borderColor: '#B91C1C',
    backgroundColor: '#FEF2F2',
    shadowColor: '#B91C1C',
    shadowOpacity: 0.12,
    elevation: 3,
  },
  cardIconContainer: {
    marginRight: 16,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#FECACA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleSelected: {
    backgroundColor: '#B91C1C',
    borderColor: '#B91C1C',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardTitleSelected: {
    color: '#991B1B',
  },
  cardText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  cardTextSelected: {
    color: '#444',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#B91C1C',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: '#B91C1C',
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxSelected: {
    backgroundColor: '#B91C1C',
    borderColor: '#B91C1C',
  },
  checkboxText: {
    fontSize: 14,
    color: '#2A2A2A',
    fontWeight: '600',
    flex: 1,
  },
  infoBox: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#B91C1C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    shadowOpacity: 0.08,
    elevation: 2,
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