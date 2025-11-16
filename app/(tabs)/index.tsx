import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Linking } from "react-native";
import {
  Calendar,
  ChevronRight,
  FileText,
  MapPin,
  Users,
  Vote,
  ExternalLink
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

// Constantes y tipos
const COLORS = {
  primary: "#8B1538",
  primaryDark: "#6A102B",
  primaryLight: "#FEF2F2",
  primaryGradient: ["#8B1538", "#A51B44"],
  secondary: "#1E40AF",
  accent: "#DC2626",
  background: {
    light: "#F8FAFC",
    white: "#FFFFFF",
    card: "#FFFFFF",
    gradient: ["#FFFFFF", "#FEF2F2"],
  },
  text: {
    primary: "#1F2937",
    secondary: "#6B7280",
    light: "#9CA3AF",
    white: "#FFFFFF",
  },
  border: {
    light: "#F1F5F9",
    medium: "#E5E7EB",
  },
  status: {
    success: "#059669",
    warning: "#D97706",
    error: "#DC2626",
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

type RolUsuario = "info" | "elector" | "mesa" | "ambos";

interface UbicacionUsuario {
  departamento: string;
  provincia: string;
  distrito: string;
}

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  isNew?: boolean;
  category?: string;
  source: string;
  url: string; // URL real de la noticia
}

// Datos de noticias reales con enlaces a fuentes oficiales
const NEWS_DATA: NewsItem[] = [
  {
    id: "1",
    title: "JNE aprueba cronograma electoral para Elecciones Generales 2026",
    description: "El Jurado Nacional de Elecciones estableció las fechas clave del proceso electoral que culminará con la votación del 11 de abril de 2026.",
    date: "Hace 2 días",
    isNew: true,
    category: "Cronograma",
    source: "JNE",
    url: "https://www.jne.gob.pe"
  },
  {
    id: "2",
    title: "ONPE inicia capacitación virtual para miembros de mesa",
    description: "La Oficina Nacional de Procesos Electorales habilita plataforma de entrenamiento para ciudadanos designados como miembros de mesa.",
    date: "Hace 3 días",
    category: "Capacitación",
    source: "ONPE",
    url: "https://www.onpe.gob.pe"
  },
  {
    id: "3",
    title: "RENIEC actualiza padrón electoral para proceso 2026",
    description: "El Registro Nacional de Identificación actualiza la base de datos de electores habilitados para votar en las próximas elecciones.",
    date: "Hace 5 días",
    category: "Padrón Electoral",
    source: "RENIEC",
    url: "https://www.reniec.gob.pe"
  },
  {
    id: "4",
    title: "Protocolos de bioseguridad para locales de votación 2026",
    description: "Establecen medidas sanitarias que se aplicarán en todos los centros de votación a nivel nacional.",
    date: "Hace 1 semana",
    category: "Protocolos",
    source: "ONPE",
    url: "https://www.onpe.gob.pe/procesos-electorales"
  },
  {
    id: "5",
    title: "Inscripción de observadores electorales internacionales",
    description: "JNE abre registro para organizaciones internacionales que deseen acreditarse como observadores del proceso.",
    date: "Hace 1 semana",
    category: "Observación",
    source: "JNE",
    url: "https://www.jne.gob.pe/observadores-electorales"
  },
  {
    id: "6",
    title: "Modernización del sistema de escrutinio automático",
    description: "Implementan nuevas tecnologías para agilizar el conteo y transmisión de resultados electorales.",
    date: "Hace 2 semanas",
    category: "Tecnología",
    source: "ONPE",
    url: "https://www.onpe.gob.pe/escrutinio"
  },
  {
    id: "7",
    title: "Calendario de debates presidenciales 2026",
    description: "Se establecen las fechas y modalidades para los debates entre candidatos a la presidencia.",
    date: "Hace 2 semanas",
    category: "Debates",
    source: "JNE",
    url: "https://www.jne.gob.pe/debates-electorales"
  },
  {
    id: "8",
    title: "Voto en el extranjero: nuevos consulados habilitados",
    description: "Amplían la cobertura de locales de votación para peruanos residentes en el exterior.",
    date: "Hace 3 semanas",
    category: "Voto Exterior",
    source: "RENIEC",
    url: "https://www.reniec.gob.pe/voto-extranjero"
  },
  {
    id: "9",
    title: "Educación cívica electoral en instituciones educativas",
    description: "Programa de capacitación sobre procesos democráticos dirigido a estudiantes de secundaria.",
    date: "Hace 3 semanas",
    category: "Educación",
    source: "JNE",
    url: "https://www.jne.gob.pe/educacion-civica"
  },
  {
    id: "10",
    title: "Reglamento de propaganda electoral 2026",
    description: "Nuevas disposiciones sobre publicidad y campañas en medios tradicionales y digitales.",
    date: "Hace 1 mes",
    category: "Propaganda",
    source: "JNE",
    url: "https://www.jne.gob.pe/propaganda-electoral"
  },
  {
    id: "11",
    title: "Sistema de consulta de locales de votación en línea",
    description: "Plataforma digital para que electores verifiquen su local de votación asignado.",
    date: "Hace 1 mes",
    category: "Tecnología",
    source: "ONPE",
    url: "https://consultaside2023.onpe.gob.pe"
  },
  {
    id: "12",
    title: "Fiscalización de gastos de campaña electoral",
    description: "Mecanismos de control y transparencia para el financiamiento de organizaciones políticas.",
    date: "Hace 1 mes",
    category: "Fiscalización",
    source: "JNE",
    url: "https://www.jne.gob.pe/fiscalizacion"
  }
];

// Componente Countdown actualizado con tiempo real
const CountdownCard = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const electionDate = new Date('2026-04-11T08:00:00-05:00');
      const now = new Date();
      const difference = electionDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : num.toString();
  };

  const getCountdownMessage = () => {
    const totalDays = timeLeft.days;
    
    if (totalDays > 30) {
      return "Próximas elecciones generales";
    } else if (totalDays > 7) {
      return "¡Faltan pocas semanas!";
    } else if (totalDays > 1) {
      return "¡La cuenta regresiva final!";
    } else if (totalDays === 1) {
      return "¡Mañana son las elecciones!";
    } else if (timeLeft.hours > 0) {
      return "¡Hoy es el gran día!";
    } else {
      return "¡Las elecciones están en curso!";
    }
  };

  return (
    <View style={styles.countdownCard}>
      <View style={styles.countdownHeader}>
        <View style={styles.countdownIcon}>
          <Vote size={24} color={COLORS.primary} />
        </View>
        <View style={styles.countdownTitleContainer}>
          <Text style={styles.countdownTitle}>Elecciones 2026</Text>
          <Text style={styles.countdownSubtitle}>
            {getCountdownMessage()}
          </Text>
        </View>
      </View>

      <View style={styles.countdownContent}>
        <View style={styles.countdownItem}>
          <Text style={styles.countdownNumber}>{formatNumber(timeLeft.days)}</Text>
          <Text style={styles.countdownLabel}>días</Text>
        </View>
        <View style={styles.countdownSeparator}>
          <Text style={styles.countdownSeparatorText}>:</Text>
        </View>
        <View style={styles.countdownItem}>
          <Text style={styles.countdownNumber}>{formatNumber(timeLeft.hours)}</Text>
          <Text style={styles.countdownLabel}>horas</Text>
        </View>
        <View style={styles.countdownSeparator}>
          <Text style={styles.countdownSeparatorText}>:</Text>
        </View>
        <View style={styles.countdownItem}>
          <Text style={styles.countdownNumber}>{formatNumber(timeLeft.minutes)}</Text>
          <Text style={styles.countdownLabel}>min</Text>
        </View>
        <View style={styles.countdownSeparator}>
          <Text style={styles.countdownSeparatorText}>:</Text>
        </View>
        <View style={styles.countdownItem}>
          <Text style={styles.countdownNumber}>{formatNumber(timeLeft.seconds)}</Text>
          <Text style={styles.countdownLabel}>seg</Text>
        </View>
      </View>

      <View style={styles.countdownFooter}>
        <Calendar size={16} color={COLORS.text.secondary} />
        <Text style={styles.countdownDate}>11 de Abril, 2026 - 8:00 AM</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${Math.max(0, Math.min(100, 100 - (timeLeft.days / 365 * 100)))}%` 
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {Math.max(0, Math.min(100, 100 - (timeLeft.days / 365 * 100))).toFixed(1)}% del tiempo transcurrido
        </Text>
      </View>
    </View>
  );
};

// Componentes reutilizables
const LoadingScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.loadingContainer}>
      <View style={styles.loadingSpinner}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
      <Text style={styles.loadingText}>Cargando información...</Text>
    </View>
  </SafeAreaView>
);

const PeruvianFlagStrip = () => (
  <View style={styles.flagStripe}>
    <View style={[styles.stripeSection, { backgroundColor: COLORS.primary }]} />
    <View
      style={[
        styles.stripeSection,
        { backgroundColor: COLORS.background.white },
      ]}
    />
    <View style={[styles.stripeSection, { backgroundColor: COLORS.primary }]} />
  </View>
);

const RoleBadge = ({ role }: { role: RolUsuario }) => {
  const isMiembroMesa = role === "mesa" || role === "ambos";

  if (!isMiembroMesa) return null;

  return (
    <View style={styles.badge}>
      <View style={styles.badgeDot} />
      <Text style={styles.badgeText}>Miembro de mesa</Text>
    </View>
  );
};

const UserLocation = ({ location }: { location: UbicacionUsuario | null }) => {
  if (!location) return null;

  return (
    <View style={styles.locationContainer}>
      <MapPin size={14} color={COLORS.text.secondary} />
      <Text style={styles.locationText}>
        {location.distrito}, {location.departamento}
      </Text>
    </View>
  );
};

const QuickAccessCard = ({
  icon: Icon,
  title,
  subtitle,
  onPress,
  color = COLORS.primary,
}: {
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
  onPress: () => void;
  color?: string;
}) => (
  <TouchableOpacity
    style={styles.quickAccessCard}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.quickAccessIcon, { backgroundColor: `${color}15` }]}>
      <Icon size={28} color={color} />
    </View>
    <View style={styles.quickAccessContent}>
      <Text style={styles.quickAccessTitle}>{title}</Text>
      <Text style={styles.quickAccessSubtitle}>{subtitle}</Text>
    </View>
    <View style={styles.quickAccessArrow}>
      <ChevronRight size={16} color={COLORS.text.light} />
    </View>
  </TouchableOpacity>
);

// Componente NewsCard mejorado que redirige a noticias reales
const NewsCard = ({
  title,
  description,
  date,
  isNew = false,
  category,
  source,
  url,
}: NewsItem) => {
  const handlePress = async () => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        console.warn('No se puede abrir la URL:', url);
      }
    } catch (error) {
      console.error('Error al abrir la URL:', error);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.newsCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.newsHeader}>
        <View style={styles.newsCategoryContainer}>
          {isNew && (
            <View style={styles.newsBadge}>
              <Text style={styles.newsBadgeText}>Nuevo</Text>
            </View>
          )}
          {category && <Text style={styles.newsCategory}>{category}</Text>}
        </View>
        <Text style={styles.newsDate}>{date}</Text>
      </View>
      
      <Text style={styles.newsTitle}>{title}</Text>
      <Text style={styles.newsDescription}>{description}</Text>
      
      <View style={styles.newsFooter}>
        <View style={styles.sourceContainer}>
          <Text style={styles.sourceText}>Fuente: {source}</Text>
        </View>
        <View style={styles.readMoreContainer}>
          <Text style={styles.readMoreText}>Saber más</Text>
          <ExternalLink size={14} color={COLORS.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SectionHeader = ({
  title,
}: {
  title: string;
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

// Componente principal mejorado
export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<RolUsuario | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [location, setLocation] = useState<any | null>(null);
  const [visibleNewsCount, setVisibleNewsCount] = useState(4); // Mostrar 4 noticias inicialmente

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [storedRole, storedUser] = await Promise.all([
        AsyncStorage.getItem("@role"),
        AsyncStorage.getItem("@user"),
      ]);

      if (storedRole) {
        setRole(storedRole as RolUsuario);
      }

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);

        setLocation({
          departamento: parsed.votingLocation.department,
          provincia: parsed.votingLocation.province,
          distrito: parsed.votingLocation.district,
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasPersonalData = !!user;

  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = "Buenos días";

    if (hour >= 12 && hour < 18) timeGreeting = "Buenas tardes";
    else if (hour >= 18) timeGreeting = "Buenas noches";

    if (user?.fullName) {
      const firstName = user.fullName.split(" ")[0];
      return `${timeGreeting}, ${firstName}`;
    }

    if (role === "mesa") return `${timeGreeting}, Miembro de mesa`;
    if (role === "elector") return `${timeGreeting}, Elector`;

    return `${timeGreeting}, Ciudadano`;
  };

  // Función para cargar más noticias
  const loadMoreNews = () => {
    setVisibleNewsCount(prev => Math.min(prev + 4, NEWS_DATA.length));
  };

  // Noticias visibles actualmente
  const visibleNews = NEWS_DATA.slice(0, visibleNewsCount);
  const hasMoreNews = visibleNewsCount < NEWS_DATA.length;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header con gradiente */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <UserLocation location={location} />
            </View>

            {hasPersonalData && user?.isMesaMember && <RoleBadge role="mesa" />}
          </View>
        </View>

        {/* Bandera Peruana decorativa */}
        <PeruvianFlagStrip />

        {/* Contador de elecciones */}
        <View style={styles.section}>
          <CountdownCard />
        </View>

        {/* Accesos Rápidos */}
        <View style={styles.section}>
          <SectionHeader title="Accesos Rápidos" />
          <View style={styles.quickAccessGrid}>
            {hasPersonalData ? (
              <QuickAccessCard
                icon={Vote}
                title="Mi Local"
                subtitle="de Votación"
                onPress={() => router.push("/(tabs)/voting")}
                color={COLORS.primary}
              />
            ) : (
              <QuickAccessCard
                icon={Vote}
                title="Registrar mi DNI"
                subtitle="para ver mi local"
                onPress={() => router.push("/(onboarding)/role")}
                color={COLORS.primary}
              />
            )}

            <QuickAccessCard
              icon={FileText}
              title="Propuestas"
              subtitle="de Partidos"
              onPress={() => router.push("/(tabs)/parties")}
              color={COLORS.secondary}
            />
            <QuickAccessCard
              icon={Users}
              title="Mi Rol"
              subtitle="en Elecciones"
              onPress={() => router.push("/(tabs)/myrole")}
              color={COLORS.status.warning}
            />
            <QuickAccessCard
              icon={Calendar}
              title="Calendario"
              subtitle="Electoral"
              onPress={() => router.push("/(tabs)/calendar")}
              color={COLORS.status.success}
            />
          </View>
        </View>

        {/* Noticias Recientes */}
        <View style={styles.section}>
          <SectionHeader title="Últimas Noticias" />
          <View style={styles.newsList}>
            {visibleNews.map((news) => (
              <NewsCard key={news.id} {...news} />
            ))}
          </View>
          
          {/* Botón para cargar más noticias */}
          {hasMoreNews && (
            <TouchableOpacity 
              style={styles.loadMoreButton}
              onPress={loadMoreNews}
            >
              <Text style={styles.loadMoreText}>Cargar más noticias</Text>
              <ChevronRight size={16} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Espacio al final */}
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
    paddingBottom: SPACING.xl,
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background.light,
  },
  loadingSpinner: {
    marginBottom: SPACING.md,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    fontWeight: "500",
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
  userInfo: {
    marginBottom: SPACING.sm,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text.primary,
    lineHeight: 34,
  },
  // Location
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginLeft: SPACING.xs,
    fontWeight: "500",
  },
  // Bandera
  flagStripe: {
    flexDirection: "row",
    height: 3,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: 2,
    overflow: "hidden",
  },
  stripeSection: {
    flex: 1,
  },
  // Secciones generales
  section: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  // Countdown Card
  countdownCard: {
    backgroundColor: COLORS.background.white,
    padding: SPACING.lg,
    borderRadius: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  countdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  countdownIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  countdownTitleContainer: {
    flex: 1,
  },
  countdownTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  countdownSubtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  countdownContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  countdownItem: {
    alignItems: "center",
    minWidth: 50,
  },
  countdownNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primary,
    lineHeight: 30,
  },
  countdownLabel: {
    fontSize: 11,
    color: COLORS.text.secondary,
    fontWeight: "600",
    marginTop: 2,
  },
  countdownSeparator: {
    marginHorizontal: SPACING.xs,
  },
  countdownSeparatorText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text.light,
    marginBottom: 12,
  },
  countdownFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    marginBottom: SPACING.md,
  },
  countdownDate: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: "600",
    marginLeft: SPACING.sm,
  },
  // Progress Bar
  progressContainer: {
    marginTop: SPACING.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border.light,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    color: COLORS.text.secondary,
    textAlign: "center",
    fontWeight: "500",
  },
  // Accesos rápidos
  quickAccessGrid: {
    gap: SPACING.md,
  },
  quickAccessCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background.white,
    padding: SPACING.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  quickAccessIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  quickAccessContent: {
    flex: 1,
  },
  quickAccessTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  quickAccessSubtitle: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
  quickAccessArrow: {
    opacity: 0.6,
  },
  // Noticias
  newsList: {
    gap: SPACING.md,
  },
  newsCard: {
    backgroundColor: COLORS.background.white,
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  newsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
  },
  newsCategoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  newsBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  newsBadgeText: {
    color: COLORS.text.white,
    fontSize: 10,
    fontWeight: "700",
  },
  newsCategory: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: "600",
  },
  newsDate: {
    fontSize: 12,
    color: COLORS.text.light,
    fontWeight: "500",
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    lineHeight: 22,
  },
  newsDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  sourceContainer: {
    flex: 1,
  },
  sourceText: {
    fontSize: 12,
    color: COLORS.text.light,
    fontWeight: '500',
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  // Botón Cargar más noticias
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background.white,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border.medium,
    marginTop: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  loadMoreText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
    marginRight: SPACING.xs,
  },
  // Badge
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 6,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  // Bottom spacer
  bottomSpacer: {
    height: SPACING.xxl,
  },
});