import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlertCircle, Calendar, Clock, MapPin, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type RolUsuario = 'info' | 'elector' | 'mesa' | 'ambos';

interface UbicacionUsuario {
  departamento: string;
  provincia: string;
  distrito: string;
}

export default function VotingScreen() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<RolUsuario | null>(null);
  const [location, setLocation] = useState<UbicacionUsuario | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [storedRole, storedLocation] = await Promise.all([
        AsyncStorage.getItem('@role'),
        AsyncStorage.getItem('@location'),
      ]);

      if (storedRole) {
        setRole(storedRole as RolUsuario);
      }

      if (storedLocation) {
        setLocation(JSON.parse(storedLocation));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B1538" />
          <Text style={styles.loadingText}>Cargando información...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tu Votación</Text>
          <Text style={styles.headerSubtitle}>
            Información sobre tu local y mesa electoral
          </Text>
        </View>

        {/* Alerta importante */}
        <View style={styles.alertCard}>
          <AlertCircle size={24} color="#8B1538" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Recuerda llevar tu DNI</Text>
            <Text style={styles.alertText}>
              Es obligatorio presentar tu Documento Nacional de Identidad para poder votar.
            </Text>
          </View>
        </View>

        {/* Información del local */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tu Local de Votación</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MapPin size={24} color="#8B1538" />
              <Text style={styles.infoTitle}>Local Electoral</Text>
            </View>
            <View style={styles.infoBody}>
              <Text style={styles.infoLabel}>Nombre del local:</Text>
              <Text style={styles.infoValue}>I.E. José Carlos Mariátegui</Text>

              <Text style={styles.infoLabel}>Dirección:</Text>
              <Text style={styles.infoValue}>
                Av. Los Héroes 245, {location?.distrito || 'Tu distrito'}
              </Text>

              <Text style={styles.infoLabel}>Referencia:</Text>
              <Text style={styles.infoValue}>
                A 2 cuadras del Mercado Central, frente a la Plaza Principal
              </Text>
            </View>
          </View>

          {/* Mesa asignada */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Users size={24} color="#8B1538" />
              <Text style={styles.infoTitle}>Mesa Asignada</Text>
            </View>
            <View style={styles.infoBody}>
              <View style={styles.mesaNumberContainer}>
                <Text style={styles.mesaNumberLabel}>Mesa N°</Text>
                <Text style={styles.mesaNumber}>012345</Text>
              </View>

              <Text style={styles.infoLabel}>Ubicación en el local:</Text>
              <Text style={styles.infoValue}>Segundo piso, Aula 203</Text>

              <Text style={styles.infoLabel}>Total de electores:</Text>
              <Text style={styles.infoValue}>300 ciudadanos registrados</Text>
            </View>
          </View>
        </View>

        {/* Horario de votación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horario Electoral</Text>

          <View style={styles.scheduleCard}>
            <View style={styles.scheduleItem}>
              <Clock size={20} color="#8B1538" />
              <View style={styles.scheduleContent}>
                <Text style={styles.scheduleLabel}>Inicio de votación</Text>
                <Text style={styles.scheduleTime}>8:00 AM</Text>
              </View>
            </View>

            <View style={styles.scheduleDivider} />

            <View style={styles.scheduleItem}>
              <Clock size={20} color="#8B1538" />
              <View style={styles.scheduleContent}>
                <Text style={styles.scheduleLabel}>Cierre de votación</Text>
                <Text style={styles.scheduleTime}>4:00 PM</Text>
              </View>
            </View>
          </View>

          <View style={styles.noteCard}>
            <Text style={styles.noteText}>
              💡 <Text style={styles.noteBold}>Importante:</Text> Puedes votar desde las 8:00 AM hasta las 4:00 PM. 
              Te recomendamos llegar temprano para evitar colas.
            </Text>
          </View>
        </View>

        {/* Fecha electoral */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fecha de las Elecciones</Text>

          <View style={styles.dateCard}>
            <Calendar size={32} color="#8B1538" />
            <View style={styles.dateContent}>
              <Text style={styles.dateDay}>Domingo</Text>
              <Text style={styles.dateNumber}>11 de Abril, 2026</Text>
            </View>
          </View>
        </View>

        {/* Pasos para votar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pasos para Votar</Text>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Preséntate en tu local</Text>
              <Text style={styles.stepDescription}>
                Llega con tu DNI original. No se aceptan copias ni documentos vencidos.
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Ubica tu mesa</Text>
              <Text style={styles.stepDescription}>
                Busca el número de tu mesa en los paneles informativos del local.
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Identifícate</Text>
              <Text style={styles.stepDescription}>
                Entrega tu DNI al miembro de mesa para verificar tu identidad.
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Recibe tu cédula</Text>
              <Text style={styles.stepDescription}>
                Te entregarán la cédula de votación correspondiente a tu circunscripción.
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>5</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Vota en la cámara secreta</Text>
              <Text style={styles.stepDescription}>
                Marca tu preferencia con calma y sin presiones. Tu voto es secreto.
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>6</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Deposita tu voto</Text>
              <Text style={styles.stepDescription}>
                Dobla la cédula y deposítala en el ánfora electoral.
              </Text>
            </View>
          </View>
        </View>

        {/* Espaciado inferior */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    ...Platform.select({
      ios: {
        shadowColor: '#8B1538',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  section: {
    padding: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 12,
  },
  infoBody: {
    padding: 16,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 22,
  },
  mesaNumberContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    marginBottom: 16,
  },
  mesaNumberLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  mesaNumber: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#8B1538',
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleContent: {
    marginLeft: 12,
    flex: 1,
  },
  scheduleLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  scheduleDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  noteCard: {
    backgroundColor: '#FEF9C3',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  noteText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  noteBold: {
    fontWeight: 'bold',
    color: '#111827',
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#8B1538',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dateContent: {
    marginLeft: 16,
  },
  dateDay: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B1538',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
