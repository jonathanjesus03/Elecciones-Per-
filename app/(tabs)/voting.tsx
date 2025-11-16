import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlertCircle, Calendar, Clock, MapPin, Users, ChevronRight, Target, Shield, Fingerprint, FileText, CheckCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { 
  ActivityIndicator, 
  Platform, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  Animated
} from 'react-native';

// Constantes de diseño
const COLORS = {
  primary: '#8B1538',
  primaryDark: '#6A102B',
  primaryLight: '#FEF2F2',
  secondary: '#1E40AF',
  accent: '#DC2626',
  background: {
    light: '#F8FAFC',
    white: '#FFFFFF',
    card: '#FFFFFF',
  },
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    light: '#9CA3AF',
    white: '#FFFFFF'
  },
  status: {
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#3B82F6'
  }
} as const;

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32
} as const;

type RolUsuario = 'info' | 'elector' | 'mesa' | 'ambos';

interface UbicacionUsuario {
  departamento: string;
  provincia: string;
  distrito: string;
}

// Componentes reutilizables
const LoadingScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.loadingContainer}>
      <View style={styles.loadingSpinner}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
      <Text style={styles.loadingText}>Cargando información electoral...</Text>
    </View>
  </SafeAreaView>
);

const AlertCard = () => (
  <View style={styles.alertCard}>
    <View style={styles.alertIcon}>
      <AlertCircle size={24} color={COLORS.primary} />
    </View>
    <View style={styles.alertContent}>
      <Text style={styles.alertTitle}>Documentación Requerida</Text>
      <Text style={styles.alertText}>
        Es obligatorio presentar tu DNI original y vigente. No se aceptan copias, 
        documentos vencidos ni carnet de extranjería para ciudadanos peruanos.
      </Text>
    </View>
  </View>
);

const InfoCard = ({ 
  icon: Icon, 
  title, 
  children,
  actionText,
  onAction 
}: {
  icon: React.ComponentType<any>;
  title: string;
  children: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}) => (
  <View style={styles.infoCard}>
    <View style={styles.infoHeader}>
      <View style={styles.infoIcon}>
        <Icon size={24} color={COLORS.primary} />
      </View>
      <Text style={styles.infoTitle}>{title}</Text>
      {actionText && (
        <TouchableOpacity style={styles.infoAction} onPress={onAction}>
          <Text style={styles.infoActionText}>{actionText}</Text>
          <ChevronRight size={16} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
    <View style={styles.infoBody}>
      {children}
    </View>
  </View>
);

const MesaNumber = ({ numero }: { numero: string }) => (
  <View style={styles.mesaNumberContainer}>
    <View style={styles.mesaNumberBackground}>
      <Text style={styles.mesaNumberLabel}>MESA ELECTORAL N°</Text>
      <Text style={styles.mesaNumber}>{numero}</Text>
    </View>
  </View>
);

const ScheduleCard = () => (
  <View style={styles.scheduleCard}>
    <View style={styles.scheduleHeader}>
      <Clock size={24} color={COLORS.primary} />
      <Text style={styles.scheduleTitle}>Horario Electoral</Text>
    </View>
    
    <View style={styles.scheduleGrid}>
      <View style={styles.scheduleItem}>
        <View style={[styles.scheduleDot, styles.scheduleDotStart]} />
        <View style={styles.scheduleContent}>
          <Text style={styles.scheduleLabel}>Apertura</Text>
          <Text style={styles.scheduleTime}>8:00 AM</Text>
        </View>
      </View>
      
      <View style={styles.scheduleLine} />
      
      <View style={styles.scheduleItem}>
        <View style={[styles.scheduleDot, styles.scheduleDotEnd]} />
        <View style={styles.scheduleContent}>
          <Text style={styles.scheduleLabel}>Cierre</Text>
          <Text style={styles.scheduleTime}>4:00 PM</Text>
        </View>
      </View>
    </View>
    
    <View style={styles.scheduleNote}>
      <Text style={styles.scheduleNoteText}>
        ⏰ <Text style={styles.scheduleNoteBold}>Recomendación:</Text> Vota temprano para evitar aglomeraciones
      </Text>
    </View>
  </View>
);

const DateCard = () => (
  <View style={styles.dateCard}>
    <View style={styles.dateIcon}>
      <Calendar size={32} color={COLORS.primary} />
    </View>
    <View style={styles.dateContent}>
      <Text style={styles.dateDay}>DOMINGO ELECTORAL</Text>
      <Text style={styles.dateNumber}>11 de Abril, 2026</Text>
      <Text style={styles.dateSubtitle}>Elecciones Generales</Text>
    </View>
    <View style={styles.dateBadge}>
      <Text style={styles.dateBadgeText}>DÍA H</Text>
    </View>
  </View>
);

const VotingStep = ({ 
  number, 
  title, 
  description, 
  icon: Icon 
}: {
  number: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}) => (
  <View style={styles.stepCard}>
    <View style={styles.stepHeader}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <View style={styles.stepIcon}>
        <Icon size={20} color={COLORS.primary} />
      </View>
    </View>
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDescription}>{description}</Text>
    </View>
  </View>
);

const QuickActions = () => (
  <View style={styles.quickActions}>
    <Text style={styles.quickActionsTitle}>Acciones Rápidas</Text>
    <View style={styles.quickActionsGrid}>
      <TouchableOpacity style={styles.quickAction}>
        <View style={[styles.quickActionIcon, { backgroundColor: `${COLORS.primary}15` }]}>
          <MapPin size={20} color={COLORS.primary} />
        </View>
        <Text style={styles.quickActionText}>Ver Mapa</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.quickAction}>
        <View style={[styles.quickActionIcon, { backgroundColor: `${COLORS.secondary}15` }]}>
          <FileText size={20} color={COLORS.secondary} />
        </View>
        <Text style={styles.quickActionText}>Mi Cédula</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.quickAction}>
        <View style={[styles.quickActionIcon, { backgroundColor: `${COLORS.status.success}15` }]}>
          <Shield size={20} color={COLORS.status.success} />
        </View>
        <Text style={styles.quickActionText}>Seguridad</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Componente principal
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
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Tu Centro de Votación</Text>
            <Text style={styles.headerSubtitle}>
              Toda la información que necesitas para ejercer tu derecho al voto
            </Text>
          </View>
          <View style={styles.headerBadge}>
            <Target size={16} color={COLORS.text.white} />
            <Text style={styles.headerBadgeText}>Elector Activo</Text>
          </View>
        </View>

        {/* Alerta importante */}
        <View style={styles.section}>
          <AlertCard />
        </View>

        {/* Acciones rápidas */}
        <View style={styles.section}>
          <QuickActions />
        </View>

        {/* Información del local */}
        <View style={styles.section}>
          <InfoCard 
            icon={MapPin} 
            title="Local de Votación"
            actionText="Ver detalles"
            onAction={() => console.log('Ver detalles del local')}
          >
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Institución Educativa</Text>
                <Text style={styles.infoValue}>I.E. José Carlos Mariátegui</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Dirección Completa</Text>
                <Text style={styles.infoValue}>
                  Av. Los Héroes 245, {location?.distrito || 'Tu distrito'}, {location?.provincia || 'Tu provincia'}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Referencia</Text>
                <Text style={styles.infoValue}>
                  A 2 cuadras del Mercado Central, frente al Parque Principal
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Tipo de Local</Text>
                <View style={styles.infoTag}>
                  <Text style={styles.infoTagText}>EDUCATIVO</Text>
                </View>
              </View>
            </View>
          </InfoCard>
        </View>

        {/* Mesa asignada */}
        <View style={styles.section}>
          <InfoCard 
            icon={Users} 
            title="Tu Mesa Electoral"
            actionText="Miembros"
            onAction={() => console.log('Ver miembros de mesa')}
          >
            <MesaNumber numero="012345" />
            
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Ubicación en el Local</Text>
                <Text style={styles.infoValue}>Segundo Piso - Aula 203</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Electores Registrados</Text>
                <Text style={styles.infoValue}>300 ciudadanos</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Estado de la Mesa</Text>
                <View style={[styles.infoTag, styles.infoTagActive]}>
                  <Text style={styles.infoTagText}>ACTIVA</Text>
                </View>
              </View>
            </View>
          </InfoCard>
        </View>

        {/* Horario y fecha */}
        <View style={styles.section}>
          <View style={styles.timeGrid}>
            <View style={styles.timeColumn}>
              <ScheduleCard />
            </View>
            <View style={styles.timeColumn}>
              <DateCard />
            </View>
          </View>
        </View>

        {/* Proceso de votación */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Proceso de Votación</Text>
            <Text style={styles.sectionSubtitle}>
              Sigue estos pasos para ejercer tu voto correctamente
            </Text>
          </View>
          
          <View style={styles.stepsGrid}>
            <VotingStep
              number={1}
              icon={MapPin}
              title="Presentación en el Local"
              description="Llega con tu DNI original al local asignado dentro del horario electoral"
            />
            
            <VotingStep
              number={2}
              icon={Target}
              title="Ubicación de tu Mesa"
              description="Encuentra tu mesa electoral usando los paneles informativos del local"
            />
            
            <VotingStep
              number={3}
              icon={Fingerprint}
              title="Verificación de Identidad"
              description="Entrega tu DNI al miembro de mesa para confirmar tu identidad en el padrón"
            />
            
            <VotingStep
              number={4}
              icon={FileText}
              title="Recepción de Cédula"
              description="Recibe la cédula de votación oficial para tu circunscripción electoral"
            />
            
            <VotingStep
              number={5}
              icon={Shield}
              title="Voto en Cámara Secreta"
              description="Marca tu preferencia con tranquilidad en el espacio reservado para el voto secreto"
            />
            
            <VotingStep
              number={6}
              icon={CheckCircle}
              title="Depósito del Voto"
              description="Dobla tu cédula y deposítala en la urna electoral correspondiente"
            />
          </View>
        </View>

        {/* Información adicional */}
        <View style={styles.section}>
          <View style={styles.finalNote}>
            <Text style={styles.finalNoteTitle}>✅ Tu voto es importante</Text>
            <Text style={styles.finalNoteText}>
              Recuerda que el voto es personal, libre, secreto y obligatorio. 
              Ejerce tu derecho democrático con responsabilidad.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.light,
  },
  loadingSpinner: {
    marginBottom: SPACING.md,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  // Header
  header: {
    backgroundColor: COLORS.background.white,
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    marginLeft: SPACING.sm,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text.white,
    marginLeft: SPACING.xs,
  },
  // Secciones
  section: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
  },
  sectionHeader: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  // Alert Card
  alertCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.lg,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  alertIcon: {
    marginRight: SPACING.md,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  alertText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  // Info Card
  infoCard: {
    backgroundColor: COLORS.background.white,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.background.light,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.light,
  },
  infoIcon: {
    marginRight: SPACING.md,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    flex: 1,
  },
  infoAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  infoBody: {
    padding: SPACING.lg,
  },
  infoGrid: {
    gap: SPACING.md,
  },
  infoItem: {
    gap: SPACING.xs,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.primary,
    lineHeight: 22,
  },
  infoTag: {
    backgroundColor: COLORS.background.light,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  infoTagActive: {
    backgroundColor: COLORS.status.success + '20',
  },
  infoTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  // Mesa Number
  mesaNumberContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  mesaNumberBackground: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    width: '100%',
  },
  mesaNumberLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    letterSpacing: 1,
  },
  mesaNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.primary,
    lineHeight: 52,
  },
  // Schedule Card
  scheduleCard: {
    backgroundColor: COLORS.background.white,
    padding: SPACING.lg,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginLeft: SPACING.sm,
  },
  scheduleGrid: {
    alignItems: 'center',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  scheduleDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  scheduleDotStart: {
    backgroundColor: COLORS.status.success,
  },
  scheduleDotEnd: {
    backgroundColor: COLORS.status.error,
  },
  scheduleContent: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  scheduleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  scheduleTime: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  scheduleLine: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.background.light,
    marginVertical: SPACING.sm,
  },
  scheduleNote: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.background.light,
  },
  scheduleNoteText: {
    fontSize: 13,
    color: COLORS.text.secondary,
    lineHeight: 18,
  },
  scheduleNoteBold: {
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  // Date Card
  dateCard: {
    backgroundColor: COLORS.background.white,
    padding: SPACING.lg,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dateIcon: {
    marginRight: SPACING.md,
  },
  dateContent: {
    flex: 1,
  },
  dateDay: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    letterSpacing: 1,
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  dateSubtitle: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
  dateBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  dateBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.text.white,
    letterSpacing: 1,
  },
  // Time Grid
  timeGrid: {
    gap: SPACING.md,
  },
  timeColumn: {
    flex: 1,
  },
  // Voting Steps
  stepsGrid: {
    gap: SPACING.md,
  },
  stepCard: {
    backgroundColor: COLORS.background.white,
    padding: SPACING.lg,
    borderRadius: 16,
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  stepHeader: {
    marginRight: SPACING.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text.white,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  stepDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  // Quick Actions
  quickActions: {
    marginBottom: SPACING.md,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  quickAction: {
    flex: 1,
    backgroundColor: COLORS.background.white,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  // Final Note
  finalNote: {
    backgroundColor: COLORS.status.success + '10',
    padding: SPACING.lg,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.status.success,
  },
  finalNoteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  finalNoteText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  // Bottom Spacer
  bottomSpacer: {
    height: SPACING.xxl,
  },
});