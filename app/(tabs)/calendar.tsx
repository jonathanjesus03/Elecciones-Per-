import { AlertCircle, Calendar, CheckCircle2, Clock, ChevronRight, Target } from 'lucide-react-native';
import React, { useState } from 'react';
import { 
  Platform, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    completed: '#059669',
    completedLight: '#D1FAE5',
    upcoming: '#D97706',
    upcomingLight: '#FEF3C7',
    important: '#8B1538',
    importantLight: '#FEE2E2',
    pending: '#6B7280',
    pendingLight: '#F3F4F6'
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

// Tipos y datos
interface EventoElectoral {
  id: number;
  fecha: string;
  titulo: string;
  descripcion: string;
  estado: 'completado' | 'proximo' | 'importante' | 'pendiente';
  categoria?: string;
  diasRestantes?: number;
}

const eventos: EventoElectoral[] = [
  {
    id: 1,
    fecha: '15 Enero 2026',
    titulo: 'Inicio del Proceso Electoral',
    descripcion: 'Convocatoria oficial a elecciones generales y publicación de cronograma',
    estado: 'completado',
    categoria: 'Administrativo',
    diasRestantes: -45
  },
  {
    id: 2,
    fecha: '20 Febrero 2026',
    titulo: 'Inscripción de Candidatos',
    descripcion: 'Cierre de inscripción de listas electorales y verificación de requisitos',
    estado: 'completado',
    categoria: 'Candidatos',
    diasRestantes: -20
  },
  {
    id: 3,
    fecha: '10 Marzo 2026',
    titulo: 'Inicio de Campaña Electoral',
    descripcion: 'Arranque oficial de campañas políticas en medios y territorios',
    estado: 'proximo',
    categoria: 'Campaña',
    diasRestantes: 5
  },
  {
    id: 4,
    fecha: '8 Abril 2026',
    titulo: 'Cierre de Campaña Electoral',
    descripcion: 'Fin de propaganda electoral y veda de medios',
    estado: 'pendiente',
    categoria: 'Campaña',
    diasRestantes: 34
  },
  {
    id: 5,
    fecha: '11 Abril 2026',
    titulo: 'Día de Elecciones Generales',
    descripcion: 'Votación para Presidente, Vicepresidentes y Congresistas de la República',
    estado: 'importante',
    categoria: 'Votación',
    diasRestantes: 37
  },
  {
    id: 6,
    fecha: '13 Abril 2026',
    titulo: 'Resultados Oficiales Preliminares',
    descripcion: 'Proclamación de resultados preliminares por la ONPE',
    estado: 'pendiente',
    categoria: 'Resultados',
    diasRestantes: 39
  },
];

// Componentes reutilizables
const CountdownCard = () => (
  <View style={styles.countdownCard}>
    <View style={styles.countdownHeader}>
      <Target size={24} color={COLORS.text.white} />
      <Text style={styles.countdownTitle}>Días para las Elecciones</Text>
    </View>
    <View style={styles.countdownContent}>
      <Text style={styles.countdownNumber}>37</Text>
      <Text style={styles.countdownLabel}>días restantes</Text>
    </View>
    <View style={styles.countdownProgress}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '65%' }]} />
      </View>
      <Text style={styles.progressText}>65% del proceso completado</Text>
    </View>
  </View>
);

const EventIcon = ({ estado }: { estado: EventoElectoral['estado'] }) => {
  const iconProps = {
    size: 20,
    color: COLORS.text.white
  };

  switch (estado) {
    case 'completado':
      return <CheckCircle2 {...iconProps} />;
    case 'proximo':
      return <AlertCircle {...iconProps} />;
    case 'importante':
      return <Calendar {...iconProps} />;
    default:
      return <Clock {...iconProps} />;
  }
};

const EventBadge = ({ estado, categoria }: { estado: EventoElectoral['estado'], categoria?: string }) => {
  const getBadgeStyle = () => {
    switch (estado) {
      case 'completado':
        return styles.badgeCompleted;
      case 'proximo':
        return styles.badgeUpcoming;
      case 'importante':
        return styles.badgeImportant;
      default:
        return styles.badgePending;
    }
  };

  return (
    <View style={[styles.eventBadge, getBadgeStyle()]}>
      <Text style={styles.badgeText}>
        {categoria || estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Text>
    </View>
  );
};

const TimelineEvent = ({ evento, isLast }: { evento: EventoElectoral; isLast: boolean }) => {
  const [expanded, setExpanded] = useState(false);

  const getEventStyle = () => {
    switch (evento.estado) {
      case 'completado':
        return styles.eventCompleted;
      case 'proximo':
        return styles.eventUpcoming;
      case 'importante':
        return styles.eventImportant;
      default:
        return styles.eventPending;
    }
  };

  const getDotStyle = () => {
    switch (evento.estado) {
      case 'completado':
        return styles.dotCompleted;
      case 'proximo':
        return styles.dotUpcoming;
      case 'importante':
        return styles.dotImportant;
      default:
        return styles.dotPending;
    }
  };

  return (
    <View style={styles.timelineItem}>
      {/* Línea del timeline */}
      {!isLast && <View style={styles.timelineLine} />}
      
      {/* Punto del timeline */}
      <View style={[styles.timelineDot, getDotStyle()]}>
        <EventIcon estado={evento.estado} />
      </View>

      {/* Tarjeta del evento */}
      <TouchableOpacity 
        style={[styles.eventCard, getEventStyle()]}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.9}
      >
        <View style={styles.eventHeader}>
          <View style={styles.eventDateContainer}>
            <Calendar size={16} color={COLORS.text.secondary} />
            <Text style={styles.eventDate}>{evento.fecha}</Text>
          </View>
          <EventBadge estado={evento.estado} categoria={evento.categoria} />
        </View>

        <Text style={styles.eventTitle}>{evento.titulo}</Text>
        <Text style={styles.eventDescription} numberOfLines={expanded ? undefined : 2}>
          {evento.descripcion}
        </Text>

        {evento.diasRestantes && (
          <View style={styles.daysContainer}>
            <Text style={[
              styles.daysText,
              evento.diasRestantes < 0 ? styles.daysPast : 
              evento.diasRestantes === 0 ? styles.daysToday : 
              styles.daysFuture
            ]}>
              {evento.diasRestantes < 0 ? 
                `Hace ${Math.abs(evento.diasRestantes)} días` : 
                evento.diasRestantes === 0 ? 
                'Hoy' : 
                `En ${evento.diasRestantes} días`
              }
            </Text>
          </View>
        )}

        <View style={styles.eventFooter}>
          <View style={styles.expandButton}>
            <Text style={styles.expandText}>
              {expanded ? 'Ver menos' : 'Ver más'}
            </Text>
            <ChevronRight 
              size={16} 
              color={COLORS.primary} 
              style={[styles.expandIcon, expanded && styles.expandIconRotated]} 
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const LegendItem = ({ icon: Icon, color, text }: { 
  icon: React.ComponentType<any>; 
  color: string; 
  text: string; 
}) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendIcon, { backgroundColor: color }]}>
      <Icon size={14} color={COLORS.text.white} />
    </View>
    <Text style={styles.legendText}>{text}</Text>
  </View>
);

// Componente principal
export default function CalendarScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.iconHeader}>
              <Calendar size={32} color={COLORS.primary} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Calendario Electoral</Text>
              <Text style={styles.headerSubtitle}>Elecciones Generales 2026</Text>
            </View>
          </View>
        </View>

        {/* Bandera Peruana */}
        <View style={styles.flagStripe}>
          <View style={[styles.stripeSection, { backgroundColor: COLORS.primary }]} />
          <View style={[styles.stripeSection, { backgroundColor: COLORS.background.white }]} />
          <View style={[styles.stripeSection, { backgroundColor: COLORS.primary }]} />
        </View>

        {/* Contador principal */}
        <View style={styles.section}>
          <CountdownCard />
        </View>

        {/* Timeline de eventos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cronograma Electoral</Text>
            <Text style={styles.sectionSubtitle}>Proceso completo de las elecciones 2026</Text>
          </View>

          <View style={styles.timelineContainer}>
            {eventos.map((evento, index) => (
              <TimelineEvent 
                key={evento.id} 
                evento={evento} 
                isLast={index === eventos.length - 1} 
              />
            ))}
          </View>
        </View>

        {/* Leyenda y información */}
        <View style={styles.section}>
          <View style={styles.legendCard}>
            <Text style={styles.legendTitle}>Estados del Proceso</Text>
            <View style={styles.legendGrid}>
              <LegendItem 
                icon={CheckCircle2} 
                color={COLORS.status.completed} 
                text="Completado" 
              />
              <LegendItem 
                icon={AlertCircle} 
                color={COLORS.status.upcoming} 
                text="Próximo" 
              />
              <LegendItem 
                icon={Calendar} 
                color={COLORS.status.important} 
                text="Día Electoral" 
              />
              <LegendItem 
                icon={Clock} 
                color={COLORS.status.pending} 
                text="Pendiente" 
              />
            </View>
          </View>
        </View>

        {/* Información adicional */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <AlertCircle size={20} color={COLORS.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Información Importante</Text>
            <Text style={styles.infoText}>
              Todas las fechas están sujetas a confirmación oficial por el JNE y ONPE. 
              Consulte fuentes oficiales para información actualizada.
            </Text>
          </View>
        </View>
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
  // Header
  header: {
    backgroundColor: COLORS.background.white,
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconHeader: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  // Bandera
  flagStripe: {
    flexDirection: 'row',
    height: 3,
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.md,
    borderRadius: 2,
    overflow: 'hidden',
  },
  stripeSection: {
    flex: 1,
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
  // Countdown Card
  countdownCard: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  countdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  countdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.white,
    marginLeft: SPACING.sm,
  },
  countdownContent: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  countdownNumber: {
    fontSize: 56,
    fontWeight: '800',
    color: COLORS.text.white,
    lineHeight: 60,
  },
  countdownLabel: {
    fontSize: 14,
    color: '#FECACA',
    fontWeight: '500',
    marginTop: SPACING.xs,
  },
  countdownProgress: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.text.white,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#FECACA',
    fontWeight: '500',
  },
  // Timeline
  timelineContainer: {
    position: 'relative',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 27,
    top: 50,
    width: 2,
    height: '110%',
    backgroundColor: '#E5E7EB',
    zIndex: 0,
  },
  timelineDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dotCompleted: {
    backgroundColor: COLORS.status.completed,
  },
  dotUpcoming: {
    backgroundColor: COLORS.status.upcoming,
  },
  dotImportant: {
    backgroundColor: COLORS.status.important,
  },
  dotPending: {
    backgroundColor: COLORS.status.pending,
  },
  // Event Cards
  eventCard: {
    flex: 1,
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 2,
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
  eventCompleted: {
    backgroundColor: COLORS.status.completedLight,
    borderColor: COLORS.status.completed,
  },
  eventUpcoming: {
    backgroundColor: COLORS.status.upcomingLight,
    borderColor: COLORS.status.upcoming,
  },
  eventImportant: {
    backgroundColor: COLORS.status.importantLight,
    borderColor: COLORS.status.important,
  },
  eventPending: {
    backgroundColor: COLORS.background.white,
    borderColor: COLORS.status.pending,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  eventDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventDate: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginLeft: SPACING.xs,
  },
  eventBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    marginLeft: SPACING.sm,
  },
  badgeCompleted: {
    backgroundColor: COLORS.status.completed,
  },
  badgeUpcoming: {
    backgroundColor: COLORS.status.upcoming,
  },
  badgeImportant: {
    backgroundColor: COLORS.status.important,
  },
  badgePending: {
    backgroundColor: COLORS.status.pending,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.text.white,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    lineHeight: 22,
  },
  eventDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  daysContainer: {
    marginBottom: SPACING.md,
  },
  daysText: {
    fontSize: 13,
    fontWeight: '600',
  },
  daysPast: {
    color: COLORS.status.completed,
  },
  daysToday: {
    color: COLORS.status.important,
    fontWeight: '700',
  },
  daysFuture: {
    color: COLORS.status.pending,
  },
  eventFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: SPACING.sm,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  expandText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  expandIcon: {
    transform: [{ rotate: '0deg' }],
  },
  expandIconRotated: {
    transform: [{ rotate: '90deg' }],
  },
  // Leyenda
  legendCard: {
    backgroundColor: COLORS.background.white,
    padding: SPACING.lg,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  legendIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  legendText: {
    fontSize: 13,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  // Info Card
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight,
    margin: SPACING.xl,
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoIcon: {
    marginRight: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.text.secondary,
    lineHeight: 18,
  },
});