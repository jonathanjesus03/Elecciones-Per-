import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Bell, Calendar, FileText, Globe, GraduationCap, Users, Vote } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type RolUsuario = 'info' | 'elector' | 'mesa' | 'ambos';

interface UbicacionUsuario {
  departamento: string;
  provincia: string;
  distrito: string;
}

export default function HomeScreen() {
  const router = useRouter();
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

  const isMiembroMesa = role === 'mesa' || role === 'ambos';

  const getGreeting = () => {
    if (role === 'elector' && location) {
      return `Hola, Elector de ${location.departamento}, ${location.distrito}`;
    } else if (role === 'info' && location) {
      return `Hola, ciudadano informado de ${location.distrito}`;
    }
    return 'Hola, ciudadano';
  };

  const getRoleMessage = () => {
    if (role === 'info') {
      return 'Conoce cómo funciona el proceso electoral.';
    } else if (role === 'elector' || role === 'mesa' || role === 'ambos') {
      return 'Revisa tus pasos clave.';
    }
    return 'Conoce tu rol en estas elecciones.';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B91C1C" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 1. Encabezado Personal */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.subtitle}>Bienvenido a VotoPeru</Text>
            {isMiembroMesa && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Miembro de mesa</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Franja peruana */}
        <View style={styles.banderaStripe}>
          <View style={[styles.stripeSection, { backgroundColor: '#B91C1C' }]} />
          <View style={[styles.stripeSection, { backgroundColor: '#FFFFFF' }]} />
          <View style={[styles.stripeSection, { backgroundColor: '#B91C1C' }]} />
        </View>

        {/* Información destacada */}
        <View style={styles.highlightCard}>
          <View style={styles.highlightHeader}>
            <Vote size={28} color="#B91C1C" />
            <Text style={styles.highlightTitle}>Elecciones 2026</Text>
          </View>
          <Text style={styles.highlightText}>
            Faltan <Text style={styles.highlightBold}>X días</Text> para las elecciones generales
          </Text>
          <View style={styles.highlightFooter}>
            <Text style={styles.highlightDate}>Fecha: 11 de Abril, 2026</Text>
          </View>
        </View>

        {/* Sección de accesos rápidos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
          
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity style={styles.quickAccessCard}>
              <View style={styles.quickAccessIcon}>
                <Vote size={24} color="#B91C1C" />
              </View>
              <Text style={styles.quickAccessTitle}>Mi Local</Text>
              <Text style={styles.quickAccessSubtitle}>de Votación</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAccessCard}>
              <View style={styles.quickAccessIcon}>
                <FileText size={24} color="#B91C1C" />
              </View>
              <Text style={styles.quickAccessTitle}>Propuestas</Text>
              <Text style={styles.quickAccessSubtitle}>de Partidos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAccessCard}>
              <View style={styles.quickAccessIcon}>
                <Users size={24} color="#B91C1C" />
              </View>
              <Text style={styles.quickAccessTitle}>Miembro</Text>
              <Text style={styles.quickAccessSubtitle}>de Mesa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAccessCard}>
              <View style={styles.quickAccessIcon}>
                <Calendar size={24} color="#B91C1C" />
              </View>
              <Text style={styles.quickAccessTitle}>Calendario</Text>
              <Text style={styles.quickAccessSubtitle}>Electoral</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Atajos Secundarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Más opciones</Text>
          
          <View style={styles.shortcutsRow}>
            <TouchableOpacity 
              style={styles.shortcutButton}
              onPress={() => {
                // TODO: Abrir tab "Partidos" cuando se cree
                console.log('Abrir tab Partidos');
              }}
            >
              <FileText size={20} color="#B91C1C" />
              <Text style={styles.shortcutText}>Partidos y propuestas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.shortcutButton}
              onPress={() => {
                // TODO: Abrir modal o sección "Fuentes oficiales"
                console.log('Abrir Fuentes oficiales');
              }}
            >
              <Globe size={20} color="#B91C1C" />
              <Text style={styles.shortcutText}>Fuentes oficiales</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.shortcutButton}
              onPress={() => {
                // TODO: Abrir carrusel/slides de tutorial
                console.log('Abrir Tutorial');
              }}
            >
              <GraduationCap size={20} color="#B91C1C" />
              <Text style={styles.shortcutText}>Tutorial de la app</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Noticias recientes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimas Noticias</Text>
          
          <View style={styles.newsCard}>
            <View style={styles.newsBadge}>
              <Text style={styles.newsBadgeText}>Nuevo</Text>
            </View>
            <Text style={styles.newsTitle}>Cronograma Electoral 2026</Text>
            <Text style={styles.newsDescription}>
              Conoce las fechas importantes y plazos para el proceso electoral.
            </Text>
            <Text style={styles.newsDate}>Hace 2 horas</Text>
          </View>

          <View style={styles.newsCard}>
            <Text style={styles.newsTitle}>Capacitación Virtual para Miembros de Mesa</Text>
            <Text style={styles.newsDescription}>
              ONPE anuncia fechas de capacitación obligatoria.
            </Text>
            <Text style={styles.newsDate}>Hace 5 horas</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  banderaStripe: {
    flexDirection: 'row',
    height: 4,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 2,
    overflow: 'hidden',
  },
  stripeSection: {
    flex: 1,
  },
  highlightCard: {
    backgroundColor: '#FEF2F2',
    margin: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#991B1B',
    marginLeft: 12,
  },
  highlightText: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 12,
  },
  highlightBold: {
    fontWeight: 'bold',
    color: '#991B1B',
  },
  highlightFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#FECACA',
  },
  highlightDate: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  section: {
    padding: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAccessCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickAccessIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickAccessTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  quickAccessSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  newsBadge: {
    backgroundColor: '#B91C1C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  newsBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  newsDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  // Estilos para carga
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
  // Estilos para badge
  badge: {
    backgroundColor: '#B91C1C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  // Estilos para cards grandes
  largeCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  largeCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 12,
    flex: 1,
  },
  largeCardContent: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  cardButton: {
    backgroundColor: '#B91C1C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  // Estilos para atajos secundarios
  shortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  shortcutButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  shortcutText: {
    fontSize: 12,
    color: '#111827',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
    fontWeight: '500',
  },
});