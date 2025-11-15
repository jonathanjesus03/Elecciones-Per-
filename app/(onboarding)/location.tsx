import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Check, ChevronDown, Map, MapPin } from 'lucide-react-native';
import type { FC } from 'react';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DEPARTAMENTOS, DISTRITOS_POR_PROVINCIA, PROVINCIAS_POR_DEPARTAMENTO } from './ubigeo-peru';
// Componente Dropdown con Picker
interface DropdownProps {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: string[];
  icon?: React.ReactNode;
  enabled?: boolean;
}

const Dropdown: FC<DropdownProps> = ({ label, value, setValue, options, icon, enabled = true }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrapper, !enabled && styles.inputDisabled]}>
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => setValue(itemValue)}
        enabled={enabled}
        style={[styles.picker, icon ? { paddingLeft: 40 } : null]}
      >
        <Picker.Item label={`Selecciona ${label.toLowerCase()}`} value="" color="#999" />
        {options.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
      <View style={styles.chevronIcon}>
        <ChevronDown size={20} color={enabled ? "#6B7280" : "#D1D5DB"} />
      </View>
    </View>
  </View>
);

export default function OnboardingScreen3() {
  const [departamento, setDepartamento] = useState("");
  const [provincia, setProvincia] = useState("");
  const [distrito, setDistrito] = useState("");

  // Obtener opciones dinámicas según la selección
  const provinciasDisponibles = departamento ? (PROVINCIAS_POR_DEPARTAMENTO[departamento] || []) : [];
// CÓDIGO CORREGIDO
  const distritosDisponibles = (departamento && provincia) 
    ? (DISTRITOS_POR_PROVINCIA[departamento]?.[provincia] || []) 
    : [];

  // Resetear provincia y distrito cuando cambia el departamento
  const handleDepartamentoChange = (value: string) => {
    setDepartamento(value);
    setProvincia("");
    setDistrito("");
  };

  // Resetear distrito cuando cambia la provincia
  const handleProvinciaChange = (value: string) => {
    setProvincia(value);
    setDistrito("");
  };

  const isFormValid = departamento.trim() && provincia.trim() && distrito.trim();

  const handleFinish = async () => {
    if (!isFormValid) return;

    try {
      // 1. Guardar la ubicación
      const location = JSON.stringify({ departamento, provincia, distrito });
      await AsyncStorage.setItem('@location', location);
      console.log("Ubicación guardada:", location);

      // 2. Marcar el onboarding como completado
      await AsyncStorage.setItem('@isOnboarded', 'true');

      // 3. Redirigir a la app principal (reemplazando la navegación)
      router.replace('/(tabs)'); // Te lleva a la primera pestaña
      
    } catch (e) {
      console.error("Error finalizando onboarding", e);
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

        {/* Ícono de mapa del Perú */}
        <View style={styles.iconHeader}>
          <View style={styles.mapIconCircle}>
            <Map size={40} color="#B91C1C" />
          </View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.title}>¿Dónde votarás?</Text>
          <Text style={styles.subtitle}>
            Ingresa tu ubicación para encontrar tu mesa de votación y recibir información local
          </Text>

          <View style={styles.formContainer}>
            <Dropdown 
              label="Departamento" 
              value={departamento} 
              setValue={handleDepartamentoChange} 
              options={DEPARTAMENTOS}
              icon={<MapPin size={20} color="#B91C1C" />}
            />
            <Dropdown 
              label="Provincia" 
              value={provincia} 
              setValue={handleProvinciaChange} 
              options={provinciasDisponibles}
              icon={<MapPin size={20} color="#B91C1C" />}
              enabled={!!departamento}
            />
            <Dropdown 
              label="Distrito" 
              value={distrito} 
              setValue={setDistrito} 
              options={distritosDisponibles}
              icon={<MapPin size={20} color="#B91C1C" />}
              enabled={!!provincia}
            />
          </View>

          {/* Mensaje informativo */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 Podrás cambiar esta información más tarde en tu perfil
            </Text>
          </View>
        </View>

        {/* Botón con gradiente */}
        <TouchableOpacity 
          style={[styles.button, !isFormValid && styles.buttonDisabled]} 
          onPress={handleFinish}
          disabled={!isFormValid}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isFormValid ? ['#B91C1C', '#991B1B'] : ['#9CA3AF', '#6B7280']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Finalizar</Text>
            <Check size={22} color="white" style={{ marginLeft: 8 }} />
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
    marginBottom: 20,
  },
  stripeSection: {
    flex: 1,
  },
  iconHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mapIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF2F2',
    borderWidth: 3,
    borderColor: '#FECACA',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 28,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  formContainer: {
    gap: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2A2A2A',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    position: 'relative',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    opacity: 0.6,
  },
  iconWrapper: {
    position: 'absolute',
    left: 14,
    top: 16,
    zIndex: 10,
  },
  picker: {
    backgroundColor: 'transparent',
    color: '#1A1A1A',
    fontSize: 16,
    height: 54,
    paddingHorizontal: 16,
  },
  chevronIcon: {
    position: 'absolute',
    right: 14,
    top: 17,
    zIndex: 10,
    pointerEvents: 'none',
  },
  infoBox: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5B4',
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#8B6914',
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: 24,
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