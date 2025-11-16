import { apiClient } from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Target,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ================== COLORES Y ESPACIADO ==================
const COLORS = {
  primary: "#8B1538",
  primaryDark: "#6A102B",
  primaryLight: "#FEF2F2",
  secondary: "#1E40AF",
  accent: "#DC2626",
  background: {
    light: "#F8FAFC",
    white: "#FFFFFF",
    card: "#FFFFFF",
  },
  text: {
    primary: "#1F2937",
    secondary: "#6B7280",
    light: "#9CA3AF",
    white: "#FFFFFF",
  },
  status: {
    completed: "#059669",
    completedLight: "#D1FAE5",
    upcoming: "#D97706",
    upcomingLight: "#FEF3C7",
    important: "#8B1538",
    importantLight: "#FEE2E2",
    pending: "#6B7280",
    pendingLight: "#F3F4F6",
  },
} as const;

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

// ================== TIPOS ==================
type RoleType = "ALL" | "ELECTOR" | "MESA";
type EventType = "ELECTION" | "TRAINING" | "DEADLINE" | "OTHER";

type RolUsuario = "info" | "elector" | "mesa" | "ambos";

interface BackendEvent {
  id: number;
  title: string;
  description: string;
  date: string; // ISO
  type: EventType;
  targetRole: RoleType;
}

type EstadoEvento = "completado" | "proximo" | "importante" | "pendiente";

interface EventoElectoral {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;     // formateada
  isoDate: string;   // original
  estado: EstadoEvento;
  categoria: string;
  diasRestantes: number;
  type: EventType;
  targetRole: RoleType;
}

// ================== COUNTDOWN ==================
const CountdownCard = ({ electionDate }: { electionDate?: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = electionDate
        ? new Date(electionDate)
        : new Date("2026-04-11T08:00:00-05:00");

      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (diff % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });

        const totalDays = 365;
        const daysPassed = totalDays - days;
        const percentage = Math.max(
          0,
          Math.min(100, (daysPassed / totalDays) * 100)
        );
        setProgressPercentage(percentage);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setProgressPercentage(100);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [electionDate]);

  const formatNumber = (n: number) => (n < 10 ? `0${n}` : n.toString());

  const getCountdownMessage = () => {
    const d = timeLeft.days;
    if (d > 60) return "Próximas elecciones generales";
    if (d > 30) return "¡Faltan pocos meses!";
    if (d > 14) return "¡Faltan pocas semanas!";
    if (d > 7) return "¡La cuenta regresiva final!";
    if (d > 1) return "¡Últimos días!";
    if (d === 1) return "¡Mañana son las elecciones!";
    if (timeLeft.hours > 0) return "¡Hoy es el gran día!";
    return "¡Las elecciones están en curso!";
  };

  return (
    <View style={styles.countdownCard}>
      <View style={styles.countdownHeader}>
        <Target size={24} color={COLORS.text.white} />
        <Text style={styles.countdownTitle}>{getCountdownMessage()}</Text>
      </View>
      <View style={styles.countdownContent}>
        <Text style={styles.countdownNumber}>{timeLeft.days}</Text>
        <Text style={styles.countdownLabel}>días restantes</Text>
      </View>
      <View style={styles.countdownDetails}>
        <View style={styles.timeDetails}>
          <View style={styles.timeItem}>
            <Text style={styles.timeNumber}>
              {formatNumber(timeLeft.hours)}
            </Text>
            <Text style={styles.timeLabel}>horas</Text>
          </View>
          <Text style={styles.timeSeparator}>:</Text>
          <View style={styles.timeItem}>
            <Text style={styles.timeNumber}>
              {formatNumber(timeLeft.minutes)}
            </Text>
            <Text style={styles.timeLabel}>min</Text>
          </View>
          <Text style={styles.timeSeparator}>:</Text>
          <View style={styles.timeItem}>
            <Text style={styles.timeNumber}>
              {formatNumber(timeLeft.seconds)}
            </Text>
            <Text style={styles.timeLabel}>seg</Text>
          </View>
        </View>
      </View>
      <View style={styles.countdownProgress}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progressPercentage}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {progressPercentage.toFixed(1)}% del tiempo transcurrido
        </Text>
      </View>
    </View>
  );
};

// ================== HELPERS EVENTOS ==================
const calcularDiasRestantes = (isoDate: string) => {
  const now = new Date();
  const date = new Date(isoDate);
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const mapCategoria = (type: EventType, targetRole: RoleType): string => {
  switch (type) {
    case "ELECTION":
      return "Jornada electoral";
    case "TRAINING":
      return targetRole === "MESA"
        ? "Capacitación miembros de mesa"
        : "Capacitación";
    case "DEADLINE":
      return "Fecha límite";
    default:
      return targetRole === "MESA"
        ? "Miembros de mesa"
        : "Proceso electoral";
  }
};

// 👉 Ajusto umbrales para que ya existan “Próximo” / “Importante”
const mapEstado = (
  type: EventType,
  diasRestantes: number
): EstadoEvento => {
  if (diasRestantes < 0) return "completado";

  if (type === "ELECTION") {
    if (diasRestantes <= 7) return "importante";
    if (diasRestantes <= 60) return "proximo";
    return "pendiente";
  }

  if (type === "DEADLINE") {
    if (diasRestantes <= 7) return "importante";
    if (diasRestantes <= 21) return "proximo";
    return "pendiente";
  }

  if (type === "TRAINING") {
    if (diasRestantes <= 14) return "proximo";
    return "pendiente";
  }

  // OTHER
  if (diasRestantes <= 30) return "proximo";
  return "pendiente";
};

const formatFecha = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("es-PE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const filterEventsByRole = (
  events: EventoElectoral[],
  userRole: RolUsuario | null
) => {
  // info => solo ALL
  if (!userRole || userRole === "info") {
    return events.filter((ev) => ev.targetRole === "ALL");
  }

  const allowed: RoleType[] = ["ALL"];

  if (userRole === "mesa" || userRole === "ambos") {
    allowed.push("MESA");
  }
  if (userRole === "elector" || userRole === "ambos") {
    allowed.push("ELECTOR");
  }

  return events.filter((ev) => allowed.includes(ev.targetRole));
};

// ================== COMPONENTES REUTILIZABLES ==================
const EventIcon = ({ estado }: { estado: EstadoEvento }) => {
  const iconProps = { size: 20, color: COLORS.text.white };

  switch (estado) {
    case "completado":
      return <CheckCircle2 {...iconProps} />;
    case "proximo":
      return <AlertCircle {...iconProps} />;
    case "importante":
      return <Calendar {...iconProps} />;
    default:
      return <Clock {...iconProps} />;
  }
};

const EventBadge = ({
  estado,
  categoria,
}: {
  estado: EstadoEvento;
  categoria?: string;
}) => {
  const getBadgeStyle = () => {
    switch (estado) {
      case "completado":
        return styles.badgeCompleted;
      case "proximo":
        return styles.badgeUpcoming;
      case "importante":
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

const TimelineEvent = ({
  evento,
  isLast,
}: {
  evento: EventoElectoral;
  isLast: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);

  const getEventStyle = () => {
    switch (evento.estado) {
      case "completado":
        return styles.eventCompleted;
      case "proximo":
        return styles.eventUpcoming;
      case "importante":
        return styles.eventImportant;
      default:
        return styles.eventPending;
    }
  };

  const getDotStyle = () => {
    switch (evento.estado) {
      case "completado":
        return styles.dotCompleted;
      case "proximo":
        return styles.dotUpcoming;
      case "importante":
        return styles.dotImportant;
      default:
        return styles.dotPending;
    }
  };

  return (
    <View style={styles.timelineItem}>
      {!isLast && <View style={styles.timelineLine} />}

      <View style={[styles.timelineDot, getDotStyle()]}>
        <EventIcon estado={evento.estado} />
      </View>

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
          <EventBadge
            estado={evento.estado}
            categoria={evento.categoria}
          />
        </View>

        <Text style={styles.eventTitle}>{evento.titulo}</Text>
        <Text
          style={styles.eventDescription}
          numberOfLines={expanded ? undefined : 2}
        >
          {evento.descripcion}
        </Text>

        <View style={styles.daysContainer}>
          <Text
            style={[
              styles.daysText,
              evento.diasRestantes < 0
                ? styles.daysPast
                : evento.diasRestantes === 0
                ? styles.daysToday
                : styles.daysFuture,
            ]}
          >
            {evento.diasRestantes < 0
              ? `Hace ${Math.abs(evento.diasRestantes)} días`
              : evento.diasRestantes === 0
              ? "Hoy"
              : `En ${evento.diasRestantes} días`}
          </Text>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.expandButton}>
            <Text style={styles.expandText}>
              {expanded ? "Ver menos" : "Ver más"}
            </Text>
            <ChevronRight
              size={16}
              color={COLORS.primary}
              style={[
                styles.expandIcon,
                expanded && styles.expandIconRotated,
              ]}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const LegendItem = ({
  icon: Icon,
  color,
  text,
}: {
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

// ================== COMPONENTE PRINCIPAL ==================
export default function CalendarScreen() {
  const [eventos, setEventos] = useState<EventoElectoral[]>([]);
  const [nextEvent, setNextEvent] = useState<EventoElectoral | null>(null);
  const [userRole, setUserRole] = useState<RolUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const electionDateIso = eventos.find(
    (e) => e.type === "ELECTION"
  )?.isoDate;

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedRole = (await AsyncStorage.getItem("@role")) as
          | RolUsuario
          | null;
        setUserRole(storedRole || "info");

        const [allRes, nextRes] = await Promise.all([
          apiClient.get<BackendEvent[]>("/events"),
          apiClient.get<BackendEvent>("/events/next").catch(() => null),
        ]);

        const mapBackendEvent = (ev: BackendEvent): EventoElectoral => {
          const diasRestantes = calcularDiasRestantes(ev.date);
          const categoria = mapCategoria(ev.type, ev.targetRole);
          const estado = mapEstado(ev.type, diasRestantes);

          return {
            id: ev.id,
            titulo: ev.title,
            descripcion: ev.description,
            fecha: formatFecha(ev.date),
            isoDate: ev.date,
            estado,
            categoria,
            diasRestantes,
            type: ev.type,
            targetRole: ev.targetRole,
          };
        };

        const mappedAll = allRes.data
          .sort(
            (a, b) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .map(mapBackendEvent);

        const filtered = filterEventsByRole(mappedAll, storedRole || "info");
        setEventos(filtered);

        if (nextRes && nextRes.data) {
          setNextEvent(mapBackendEvent(nextRes.data));
        }
      } catch (e) {
        console.error("Error cargando eventos", e);
        setError(
          "No se pudo cargar el calendario electoral. Intenta nuevamente más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            style={{
              marginTop: 12,
              color: COLORS.text.secondary,
              fontSize: 14,
            }}
          >
            Cargando calendario electoral...
          </Text>
        </View>
      </SafeAreaView>
    );
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
            <View style={styles.iconHeader}>
              <Calendar size={32} color={COLORS.primary} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Calendario Electoral</Text>
              <Text style={styles.headerSubtitle}>
                Elecciones Generales 2026
              </Text>
            </View>
          </View>
        </View>

        {/* Bandera Perú */}
        <View style={styles.flagStripe}>
          <View
            style={[
              styles.stripeSection,
              { backgroundColor: COLORS.primary },
            ]}
          />
          <View
            style={[
              styles.stripeSection,
              { backgroundColor: COLORS.background.white },
            ]}
          />
          <View
            style={[
              styles.stripeSection,
              { backgroundColor: COLORS.primary },
            ]}
          />
        </View>

        {/* Contador principal */}
        <View style={styles.section}>
          <CountdownCard electionDate={electionDateIso} />
        </View>

        {/* Próximo hito (usando /events/next) */}
        {nextEvent && (
          <View style={styles.section}>
            <View style={styles.legendCard}>
              <Text style={styles.legendTitle}>Próximo hito del cronograma</Text>
              <Text style={styles.eventTitle}>{nextEvent.titulo}</Text>
              <Text style={styles.eventDate}>{nextEvent.fecha}</Text>
              <Text
                style={styles.eventDescription}
                numberOfLines={3}
              >
                {nextEvent.descripcion}
              </Text>
            </View>
          </View>
        )}

        {/* Timeline */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cronograma Electoral</Text>
            <Text style={styles.sectionSubtitle}>
              Fechas clave del proceso electoral 2026
            </Text>
          </View>

          {error ? (
            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <AlertCircle size={20} color={COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>No se pudo cargar</Text>
                <Text style={styles.infoText}>{error}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.timelineContainer}>
              {eventos.map((evento, index) => (
                <TimelineEvent
                  key={evento.id}
                  evento={evento}
                  isLast={index === eventos.length - 1}
                />
              ))}
            </View>
          )}
        </View>

        {/* Leyenda */}
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
                text="Día clave / Elección"
              />
              <LegendItem
                icon={Clock}
                color={COLORS.status.pending}
                text="Pendiente"
              />
            </View>
          </View>
        </View>

        {/* Nota informativa */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <AlertCircle size={20} color={COLORS.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Información Importante</Text>
            <Text style={styles.infoText}>
              Las fechas mostradas se basan en el cronograma electoral
              oficial. Ante cualquier cambio, prevalece lo publicado por
              el JNE y la ONPE en sus canales institucionales.
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
    marginBottom: SPACING.md,
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
  countdownDetails: {
    marginBottom: SPACING.lg,
  },
  timeDetails: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeItem: {
    alignItems: 'center',
    minWidth: 50,
  },
  timeNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.white,
  },
  timeLabel: {
    fontSize: 11,
    color: '#FECACA',
    fontWeight: '500',
    marginTop: 2,
  },
  timeSeparator: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FECACA',
    marginHorizontal: SPACING.xs,
    marginBottom: 8,
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